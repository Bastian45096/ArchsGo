package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	apiEntities "api-gateway/internal/domain/api/entities"
	apiRepo "api-gateway/internal/infrastructure/repositories"
)

type bodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w *bodyWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func ApiLogger(apiRepository *apiRepo.ApiRepositoryImpl) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// ═══ LEER Y GUARDAR EL BODY ═══
		var bodyBytes []byte
		if c.Request.Body != nil {
			bodyBytes, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}

		// ═══ WRAPPER PARA CAPTURAR RESPONSE ═══
		bw := &bodyWriter{
			body:           bytes.NewBufferString(""),
			ResponseWriter: c.Writer,
		}
		c.Writer = bw

		// ═══ EJECUTAR EL HANDLER ═══
		c.Next()

		// ═══ CALCULAR DURACION ═══
		duration := time.Since(start)
		durationMs := int(duration.Milliseconds())

		// ═══ DATOS DEL REQUEST ═══
		statusCode := c.Writer.Status()
		method := c.Request.Method
		endpoint := c.Request.URL.Path
		ip := c.ClientIP()
		userAgent := c.Request.UserAgent()

		// ═══ SKIP OPTIONS (CORS preflight) ═══
		if method == "OPTIONS" {
			return
		}

		// ═══ EXTRAER USUARIO ID DEL BODY ═══
		var usuarioID *uint
		var mensajeError string
		var bodyStr string

		if len(bodyBytes) > 0 {
			bodyStr = string(bodyBytes)

			var bodyMap map[string]interface{}
			if err := json.Unmarshal(bodyBytes, &bodyMap); err == nil {
				if uid, ok := bodyMap["usuarioId"]; ok {
					if idFloat, ok := uid.(float64); ok {
						idUint := uint(idFloat)
						usuarioID = &idUint
					}
				}
			}
		}

		// ═══ EXTRAER USUARIO DEL HEADER (Angular interceptor) ═══
		if usuarioID == nil {
			userIdHeader := c.GetHeader("X-User-Id")
			if userIdHeader != "" {
				var idFloat float64
				if _, err := fmt.Sscanf(userIdHeader, "%f", &idFloat); err == nil && idFloat > 0 {
					idUint := uint(idFloat)
					usuarioID = &idUint
				}
			}
		}

		// ═══ EXTRAER USUARIO DEL CONTEXT ═══
		if uid, exists := c.Get("userId"); exists && usuarioID == nil {
			if id, ok := uid.(uint); ok && id > 0 {
				usuarioID = &id
			}
		}

		// ═══ CAPTURAR ERRORES DE GIN ═══
		if len(c.Errors) > 0 {
			mensajeError = c.Errors.String()
		}

		// ═══ DETERMINAR NIVEL DE RIESGO ═══
		nivelRiesgo := determinarRiesgo(statusCode, endpoint)

		// ═══ DETERMINAR AUTENTICADO ═══
		estaAutenticado := usuarioID != nil

		// ═══ DETERMINAR MENSAJE ═══
		mensaje := determinarMensaje(statusCode, method, endpoint)

		// ═══ LOG DE CONSOLA ═══
		if statusCode >= 400 {
			log.Printf("[ApiLog] ERROR | %s %s | status=%d | duracion=%dms | ip=%s | usuario=%v",
				method, endpoint, statusCode, durationMs, ip, usuarioID)
		} else {
			log.Printf("[ApiLog] OK | %s %s | status=%d | duracion=%dms | usuario=%v",
				method, endpoint, statusCode, durationMs, usuarioID)
		}

		// ═══ GUARDAR EN BASE DE DATOS ═══
		apiLog := &apiEntities.ApiLog{
			UsuarioID:        usuarioID,
			MetodoHTTP:       method,
			Endpoint:         endpoint,
			EstadoHTTP:       statusCode,
			Mensaje:          mensaje,
			DireccionIP:      ip,
			AgenteUsuario:    userAgent,
			EstaAutenticado:  estaAutenticado,
			Rol:              "",
			NivelRiesgo:      nivelRiesgo,
			IntentosFallidos: 0,
			DuracionMs:       durationMs,
			MensajeError:     mensajeError,
			CuerpoPeticion:   truncar(bodyStr, 4000),
		}

		go func() {
			if err := apiRepository.Create(nil, apiLog); err != nil {
				log.Printf("[ApiLog] ERROR al guardar log: %v", err)
			}
		}()
	}
}

func determinarRiesgo(status int, endpoint string) string {
	if strings.Contains(endpoint, "/auth/") {
		if status == 401 || status == 403 {
			return "alto"
		}
		if status >= 400 {
			return "medio"
		}
		return "bajo"
	}

	switch {
	case status >= 500:
		return "alto"
	case status >= 400:
		return "medio"
	default:
		return "bajo"
	}
}

func determinarMensaje(status int, method, endpoint string) string {
	switch {
	case status >= 500:
		return "Error interno del servidor: " + method + " " + endpoint
	case status == 401:
		return "No autorizado: " + method + " " + endpoint
	case status == 403:
		return "Prohibido: " + method + " " + endpoint
	case status == 404:
		return "No encontrado: " + method + " " + endpoint
	case status >= 400:
		return "Peticion invalida: " + method + " " + endpoint
	case status >= 200 && status < 300:
		return "Peticion exitosa: " + method + " " + endpoint
	default:
		return method + " " + endpoint
	}
}

func truncar(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max]
}
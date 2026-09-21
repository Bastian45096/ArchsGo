package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"api-gateway/internal/application/auth/commands"
	apiEntities "api-gateway/internal/domain/api/entities"
	apiRepo "api-gateway/internal/domain/api/repositories"
)

type AuthHandler struct {
	registerHandler *commands.RegisterHandler
	loginHandler    *commands.LoginHandler
	apiRepo         apiRepo.ApiRepository
}

func NewAuthHandler(
	registerHandler *commands.RegisterHandler,
	loginHandler *commands.LoginHandler,
	apiRepo apiRepo.ApiRepository,
) *AuthHandler {
	return &AuthHandler{
		registerHandler: registerHandler,
		loginHandler:    loginHandler,
		apiRepo:         apiRepo,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	start := time.Now()
	log.Printf("[Register] Request recibido | IP: %s", c.ClientIP())

	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Register] ERROR JSON invalido: %v", err)

		// Log de auditoria: request malo
		h.guardarLog(c, nil, "POST", "/api/auth/register",
			400, "JSON invalido", "bajo", err.Error(), time.Since(start))

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Register] Body: username=%s email=%s", req.Username, req.Email)

	cmd := commands.RegisterCommand{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password,
	}

	user, err := h.registerHandler.Handle(c.Request.Context(), cmd)
	if err != nil {
		log.Printf("[Register] ERROR: %v", err)

		// Log de auditoria: usuario ya existe
		h.guardarLog(c, nil, "POST", "/api/auth/register",
			409, err.Error(), "bajo", err.Error(), time.Since(start))

		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	// Log de auditoria: registro exitoso
	h.guardarLog(c, &user.ID, "POST", "/api/auth/register",
		201, "Usuario registrado exitosamente", "bajo", "", time.Since(start))

	log.Printf("[Register] OK | ID: %d | %v", user.ID, time.Since(start))
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Usuario registrado exitosamente",
		"userId":   user.ID,
		"username": user.Username,
		"email":    user.Email,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	start := time.Now()
	log.Printf("[Login] Request recibido | IP: %s", c.ClientIP())

	var req struct {
		UsernameOrEmail string `json:"usernameOrEmail" binding:"required"`
		Password        string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Login] ERROR JSON invalido: %v", err)

		h.guardarLog(c, nil, "POST", "/api/auth/login",
			400, "JSON invalido", "bajo", err.Error(), time.Since(start))

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Login] Body: input=%s", req.UsernameOrEmail)

	cmd := commands.LoginCommand{
		UsernameOrEmail: req.UsernameOrEmail,
		Password:        req.Password,
	}

	user, err := h.loginHandler.Handle(c.Request.Context(), cmd)
	if err != nil {
		log.Printf("[Login] ERROR: %v", err)

		// Riesgo medio porque es intento fallido de login
		h.guardarLog(c, nil, "POST", "/api/auth/login",
			401, err.Error(), "medio", err.Error(), time.Since(start))

		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Log de auditoria: login exitoso
	h.guardarLog(c, &user.ID, "POST", "/api/auth/login",
		200, "Inicio de sesion exitoso", "bajo", "", time.Since(start))

	log.Printf("[Login] OK | ID: %d | %v", user.ID, time.Since(start))
	c.JSON(http.StatusOK, gin.H{
		"message":      "Inicio de sesion exitoso",
		"userId":       user.ID,
		"username":     user.Username,
		"email":        user.Email,
		"role":         user.Role,
		"profileImage": user.ProfileImage,
	})
}

func (h *AuthHandler) guardarLog(c *gin.Context, usuarioID *uint, metodo, endpoint string, estado int, mensaje, riesgo, errMsg string, duracion time.Duration) {
	cuerpo, _ := json.Marshal(map[string]string{
		"path":   c.Request.URL.Path,
		"method": c.Request.Method,
	})

	apiLog := &apiEntities.ApiLog{
		UsuarioID:        usuarioID,
		MetodoHTTP:       metodo,
		Endpoint:         endpoint,
		EstadoHTTP:       estado,
		Mensaje:          mensaje,
		DireccionIP:      c.ClientIP(),
		AgenteUsuario:    c.Request.UserAgent(),
		EstaAutenticado:  usuarioID != nil,
		NivelRiesgo:      riesgo,
		IntentosFallidos: 0,
		DuracionMs:       int(duracion.Milliseconds()),
		MensajeError:     errMsg,
		CuerpoPeticion:   string(cuerpo),
	}

	if err := h.apiRepo.Create(c.Request.Context(), apiLog); err != nil {
		log.Printf("[ApiLog] WARNING no se pudo guardar: %v", err)
	}
}

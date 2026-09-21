package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	apiEntities "api-gateway/internal/domain/api/entities"
	apiRepo "api-gateway/internal/domain/api/repositories"
	appRepo "api-gateway/internal/domain/aplicacion/repositories"
	termEntities "api-gateway/internal/domain/terminal/entities"
	termRepo "api-gateway/internal/domain/terminal/repositories"
)

type TerminalHandler struct {
	termRepo termRepo.TerminalRepository
	appRepo  appRepo.AplicacionRepository
	apiRepo  apiRepo.ApiRepository
}

func NewTerminalHandler(
	termRepo termRepo.TerminalRepository,
	appRepo appRepo.AplicacionRepository,
	apiRepo apiRepo.ApiRepository,
) *TerminalHandler {
	return &TerminalHandler{
		termRepo: termRepo,
		appRepo:  appRepo,
		apiRepo:  apiRepo,
	}
}

type ExecuteRequest struct {
	Comando   string `json:"comando" binding:"required"`
	UsuarioID uint   `json:"usuarioId" binding:"required"`
}

type ExecuteResponse struct {
	Salida       string `json:"salida"`
	CodigoSalida int    `json:"codigoSalida"`
	Estado       string `json:"estado"`
	Comando      string `json:"comando"`
}

func (h *TerminalHandler) Execute(c *gin.Context) {
	start := time.Now()
	log.Printf("[Terminal] Request recibido | IP: %s", c.ClientIP())

	var req ExecuteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Terminal] ERROR JSON invalido: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Terminal] Comando: '%s' | UsuarioID: %d", req.Comando, req.UsuarioID)

	salida, codigoSalida, aplicacionID := h.procesarComando(c, req.Comando, req.UsuarioID)

	estado := "exitoso"
	if codigoSalida != 0 {
		estado = "fallido"
	}

	termCmd := termEntities.NewTerminalCommand(req.UsuarioID, aplicacionID, req.Comando)
	if codigoSalida == 0 {
		termCmd.MarcarExitoso(salida)
	} else {
		termCmd.MarcarFallido(salida, codigoSalida)
	}

	if err := h.termRepo.Create(c.Request.Context(), termCmd); err != nil {
		log.Printf("[Terminal] WARNING no se pudo guardar comando: %v", err)
	}

	riesgo := "bajo"
	if codigoSalida != 0 {
		riesgo = "medio"
	}

	h.guardarLog(c, &req.UsuarioID, "POST", "/api/terminal/execute",
		200, "Comando ejecutado: "+req.Comando, riesgo, "", time.Since(start))

	log.Printf("[Terminal] OK | comando='%s' | estado=%s | %v", req.Comando, estado, time.Since(start))

	c.JSON(http.StatusOK, ExecuteResponse{
		Salida:       salida,
		CodigoSalida: codigoSalida,
		Estado:       estado,
		Comando:      req.Comando,
	})
}

func (h *TerminalHandler) GetHistorial(c *gin.Context) {
	userIDStr := c.Query("usuarioId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuarioId es requerido"})
		return
	}

	var userID uint
	var id int
	json.Unmarshal([]byte(userIDStr), &id)
	userID = uint(id)

	commands, err := h.termRepo.GetByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener historial"})
		return
	}

	c.JSON(http.StatusOK, commands)
}

func (h *TerminalHandler) procesarComando(c *gin.Context, comando string, usuarioID uint) (string, int, *uint) {
	partes := strings.Fields(strings.TrimSpace(comando))
	if len(partes) == 0 {
		return "Comando vacio", 1, nil
	}

	switch partes[0] {
	case "help":
		return h.cmdHelp(), 0, nil

	case "neofetch":
		return h.cmdNeofetch(usuarioID), 0, nil

	case "clear":
		return "[CLEAR]", 0, nil

	case "apt":
		return h.cmdApt(c, partes, usuarioID)

	case "goarch":
		return h.cmdGoarch(c, partes, usuarioID)

	case "ls":
		return h.cmdListApps(c)

	case "whoami":
		return h.cmdWhoami(usuarioID), 0, nil

	case "repos":
		return h.cmdRepos(c) // FIX: ya devuelve 3 valores

	default:
		return "Comando no reconocido: '" + partes[0] + "'. Escribe 'help' para ver los comandos disponibles.", 1, nil
	}
}

func (h *TerminalHandler) cmdHelp() string {
	return `ArchsGo Terminal v2.0.0
Comandos disponibles:

  help                              Muestra esta ayuda
  neofetch                          Informacion del sistema
  ls                                Lista aplicaciones instaladas
  whoami                            Informacion del usuario
  clear                             Limpiar terminal

  goarch install <repo> <app>       Instalar aplicacion
  goarch remove <repo> <app>        Desinstalar aplicacion
  goarch search <app>               Buscar aplicacion
  goarch info <app>                 Detalles de una app
  goarch repos                      Ver repositorios disponibles

  apt install <app>                 Instalar (legacy)
  apt remove <app>                  Desinstalar (legacy)`
}

func (h *TerminalHandler) cmdNeofetch(usuarioID uint) string {
	return `   A r c h s G o

  OS:        ArchsGo OS v2.0.0
  Host:      ArchsGo Cloud Platform
  Kernel:    Go 1.22 + Gin + GORM
  Shell:     archsgo-terminal v1.0.0
  Pkg Mgr:   goarch v1.0.0
  Database:  SQL Server 2022
  Frontend:  Angular 19
  UsuarioID: ` + fmt.Sprintf("%d", usuarioID) + `
  Uptime:    Desde el primer deploy`
}

// ===================================================
//  GOARCH - Gestor de paquetes de ArchsGo
// ===================================================

func (h *TerminalHandler) cmdGoarch(c *gin.Context, partes []string, usuarioID uint) (string, int, *uint) {
	if len(partes) < 2 {
		return h.goarchHelp(), 0, nil
	}

	subcomando := partes[1]

	switch subcomando {
	case "install":
		return h.goarchInstall(c, partes)
	case "remove":
		return h.goarchRemove(c, partes)
	case "search":
		return h.goarchSearch(c, partes)
	case "info":
		return h.goarchInfo(c, partes)
	case "repos":
		return h.cmdRepos(c) // FIX: ya devuelve 3 valores
	case "list":
		return h.cmdListApps(c)
	case "help":
		return h.goarchHelp(), 0, nil
	default:
		return "goarch: subcomando no reconocido '" + subcomando + "'. Escribe 'goarch help' para ayuda.", 1, nil
	}
}

func (h *TerminalHandler) goarchHelp() string {
	return `goarch v1.0.0 - Gestor de paquetes de ArchsGo OS

Uso: goarch <subcomando> [argumentos]

Subcomandos:
  install <repositorio> <app>    Instalar una aplicacion
  remove <repositorio> <app>     Desinstalar una aplicacion
  search <nombre>                Buscar aplicacion
  info <nombre>                  Detalles de una aplicacion
  list                           Listar apps instaladas
  repos                          Ver repositorios configurados
  help                           Mostrar esta ayuda

Repositorios:
  archcore          Nucleo del sistema
  archruntime       Lenguajes y entornos de ejecucion
  archdev           Herramientas de desarrollo
  archsec           Ciberseguridad
  archdata          Bases de datos y almacenamiento
  archserver        Servidores e infraestructura
  archtails         Apps oficiales de ArchsGo
  archgommunity     Comunidad y contribuciones

Ejemplo:
  goarch install archtails gonet`
}

func (h *TerminalHandler) goarchInstall(c *gin.Context, partes []string) (string, int, *uint) {
	if len(partes) < 4 {
		return "Uso: goarch install <repositorio> <app>\nEjemplo: goarch install archtails gonet", 1, nil
	}

	repo := partes[2]
	nombreApp := partes[3]

	if !esRepoValido(repo) {
		return "Repositorio no valido: '" + repo + "'.\nUsa 'goarch repos' para ver los disponibles.", 1, nil
	}

	app, err := h.appRepo.FindByNombre(c.Request.Context(), nombreApp)
	if err != nil {
		return "Error al buscar la aplicacion", 1, nil
	}
	if app == nil {
		return "Paquete no encontrado: '" + nombreApp + "'\nUsa 'goarch search " + nombreApp + "' para buscar.", 1, nil
	}

	if !strings.EqualFold(app.Fuente, repo) {
		return fmt.Sprintf(
			"El paquete '%s' no pertenece al repositorio '%s'.\nRepositorio correcto: %s",
			nombreApp, repo, app.Fuente,
		), 1, &app.ID
	}

	if app.EstaInstalada {
		return fmt.Sprintf(
			"[goarch] %s ya esta instalada (v%s)\nNo se requiere accion.",
			app.Nombre, app.Version,
		), 0, &app.ID
	}

	app.MarcarInstalada()
	if err := h.appRepo.Update(c.Request.Context(), app); err != nil {
		return "Error al instalar: " + err.Error(), 1, &app.ID
	}

	salida := "[goarch] Repositorio: " + repo + "\n"
	salida += "[goarch] Paquete: " + app.Nombre + " v" + app.Version + "\n"
	salida += fmt.Sprintf("[goarch] Tamano: %.1f MB\n", app.TamanoMB)
	salida += "[goarch] Descargando... OK\n"
	salida += "[goarch] Verificando integridad... SHA256 OK\n"
	salida += "[goarch] Instalando... listo\n"
	salida += "[goarch] " + app.Nombre + " v" + app.Version + " instalada correctamente."

	return salida, 0, &app.ID
}

func (h *TerminalHandler) goarchRemove(c *gin.Context, partes []string) (string, int, *uint) {
	if len(partes) < 4 {
		return "Uso: goarch remove <repositorio> <app>\nEjemplo: goarch remove archtails gonet", 1, nil
	}

	repo := partes[2]
	nombreApp := partes[3]

	if !esRepoValido(repo) {
		return "Repositorio no valido: '" + repo + "'.\nUsa 'goarch repos' para ver los disponibles.", 1, nil
	}

	app, err := h.appRepo.FindByNombre(c.Request.Context(), nombreApp)
	if err != nil {
		return "Error al buscar la aplicacion", 1, nil
	}
	if app == nil {
		return "Paquete no encontrado: '" + nombreApp + "'", 1, nil
	}

	if !strings.EqualFold(app.Fuente, repo) {
		return fmt.Sprintf("El paquete '%s' no pertenece al repositorio '%s'.\nRepositorio correcto: %s",
			nombreApp, repo, app.Fuente), 1, &app.ID
	}

	if !app.EstaInstalada {
		return "[goarch] " + app.Nombre + " no esta instalada. No se requiere accion.", 0, &app.ID
	}

	app.MarcarDesinstalada()
	if err := h.appRepo.Update(c.Request.Context(), app); err != nil {
		return "Error al desinstalar: " + err.Error(), 1, &app.ID
	}

	salida := "[goarch] Desinstalando " + app.Nombre + " v" + app.Version + "...\n"
	salida += "[goarch] Eliminando archivos... listo\n"
	salida += "[goarch] Limpiando configuracion... listo\n"
	salida += "[goarch] " + app.Nombre + " desinstalada correctamente."

	return salida, 0, &app.ID
}

func (h *TerminalHandler) goarchSearch(c *gin.Context, partes []string) (string, int, *uint) {
	if len(partes) < 3 {
		return "Uso: goarch search <nombre>", 1, nil
	}

	query := strings.ToLower(partes[2])

	apps, err := h.appRepo.GetAll(c.Request.Context())
	if err != nil {
		return "Error al buscar aplicaciones", 1, nil
	}

	var resultados []string
	for _, app := range apps {
		if strings.Contains(strings.ToLower(app.Nombre), query) {
			estado := "[  ]"
			if app.EstaInstalada {
				estado = "[OK]"
			}
			line := fmt.Sprintf("  %s  %-20s v%-10s %-15s (%s)",
				estado, app.Nombre, app.Version, app.Fuente, app.Categoria)
			resultados = append(resultados, line)
		}
	}

	if len(resultados) == 0 {
		return "Sin resultados para '" + partes[2] + "'", 0, nil
	}

	output := fmt.Sprintf("[goarch] Resultados para \"%s\":\n\n", partes[2])
	for _, r := range resultados {
		output += r + "\n"
	}
	output += fmt.Sprintf("\n%d paquete(s) encontrado(s)", len(resultados))

	return output, 0, nil
}

func (h *TerminalHandler) goarchInfo(c *gin.Context, partes []string) (string, int, *uint) {
	if len(partes) < 3 {
		return "Uso: goarch info <nombre>", 1, nil
	}

	app, err := h.appRepo.FindByNombre(c.Request.Context(), partes[2])
	if err != nil {
		return "Error al buscar la aplicacion", 1, nil
	}
	if app == nil {
		return "Paquete no encontrado: '" + partes[2] + "'", 1, nil
	}

	estado := "disponible"
	if app.EstaInstalada {
		estado = "instalada"
	}

	salida := "Nombre:       " + app.Nombre + " v" + app.Version + "\n"
	salida += "Repositorio:  " + app.Fuente + "\n"
	salida += "Categoria:    " + app.Categoria + "\n"
	salida += fmt.Sprintf("Tamano:       %.1f MB\n", app.TamanoMB)
	salida += "Estado:       " + estado + "\n"
	salida += "Descripcion:  " + app.Descripcion + "\n"
	salida += "Instalar:     " + app.ComandoInstalar + "\n"
	salida += "Desinstalar:  " + app.ComandoDesinstalar

	return salida, 0, &app.ID
}

func (h *TerminalHandler) cmdRepos(c *gin.Context) (string, int, *uint) {
	apps, err := h.appRepo.GetAll(c.Request.Context())
	if err != nil {
		return "Error al obtener repositorios", 1, nil
	}

	repos := map[string]int{}
	for _, app := range apps {
		repos[app.Fuente]++
	}

	descripciones := map[string]string{
		"archcore":      "Nucleo del sistema",
		"archruntime":   "Lenguajes y entornos de ejecucion",
		"archdev":       "Herramientas de desarrollo",
		"archsec":       "Ciberseguridad",
		"archdata":      "Bases de datos y almacenamiento",
		"archserver":    "Servidores e infraestructura",
		"archtails":     "Apps oficiales de ArchsGo",
		"archgommunity": "Comunidad y contribuciones",
	}

	orden := []string{
		"archcore", "archruntime", "archdev", "archsec",
		"archdata", "archserver", "archtails", "archgommunity",
	}

	output := "[goarch] Repositorios configurados:\n\n"
	for _, key := range orden {
		cnt := repos[key]
		desc := descripciones[key]
		if desc == "" {
			desc = key
		}
		output += fmt.Sprintf("  %-20s -> %-35s (%d paquetes)\n", key, desc, cnt)
	}

	total := 0
	for _, cnt := range repos {
		total += cnt
	}
	output += fmt.Sprintf("\nTotal: %d paquetes en %d repositorios", total, len(repos))

	return output, 0, nil
}

var reposValidos = map[string]bool{
	"archcore":      true,
	"archruntime":   true,
	"archdev":       true,
	"archsec":       true,
	"archdata":      true,
	"archserver":    true,
	"archtails":     true,
	"archgommunity": true,
}

func esRepoValido(repo string) bool {
	return reposValidos[repo]
}

// ===================================================
//  APT (legacy)
// ===================================================

func (h *TerminalHandler) cmdApt(c *gin.Context, partes []string, _ uint) (string, int, *uint) {
	if len(partes) < 3 {
		return "Uso: apt install <app> o apt remove <app>\nRecomendado: goarch install <repo> <app>", 1, nil
	}

	accion := partes[1]
	nombreApp := partes[2]

	switch accion {
	case "install":
		return h.instalarApp(c, nombreApp)
	case "remove":
		return h.desinstalarApp(c, nombreApp)
	default:
		return "Accion no reconocida: '" + accion + "'. Usa: install o remove", 1, nil
	}
}

func (h *TerminalHandler) instalarApp(c *gin.Context, nombre string) (string, int, *uint) {
	app, err := h.appRepo.FindByNombre(c.Request.Context(), nombre)
	if err != nil {
		return "Error al buscar la aplicacion", 1, nil
	}
	if app == nil {
		return "Aplicacion no encontrada: '" + nombre + "'. Usa 'ls' para ver las disponibles.", 1, nil
	}

	if app.EstaInstalada {
		return "'" + app.Nombre + "' ya esta instalada (v" + app.Version + ")", 0, &app.ID
	}

	app.MarcarInstalada()
	if err := h.appRepo.Update(c.Request.Context(), app); err != nil {
		return "Error al instalar: " + err.Error(), 1, &app.ID
	}

	salida := "Instalando " + app.Nombre + " v" + app.Version + "...\n"
	salida += app.ComandoInstalar + "\n"
	salida += "Desempaquetando... listo\n"
	salida += "Configurando... listo\n"
	salida += app.Nombre + " instalada correctamente.\n"
	salida += fmt.Sprintf("Tamano: %.1f MB\n", app.TamanoMB)
	salida += "Categoria: " + app.Categoria

	return salida, 0, &app.ID
}

func (h *TerminalHandler) desinstalarApp(c *gin.Context, nombre string) (string, int, *uint) {
	app, err := h.appRepo.FindByNombre(c.Request.Context(), nombre)
	if err != nil {
		return "Error al buscar la aplicacion", 1, nil
	}
	if app == nil {
		return "Aplicacion no encontrada: '" + nombre + "'", 1, nil
	}

	if !app.EstaInstalada {
		return "'" + app.Nombre + "' no esta instalada", 0, &app.ID
	}

	app.MarcarDesinstalada()
	if err := h.appRepo.Update(c.Request.Context(), app); err != nil {
		return "Error al desinstalar: " + err.Error(), 1, &app.ID
	}

	salida := "Desinstalando " + app.Nombre + "...\n"
	salida += app.ComandoDesinstalar + "\n"
	salida += "Eliminando archivos... listo\n"
	salida += app.Nombre + " desinstalada correctamente."

	return salida, 0, &app.ID
}

func (h *TerminalHandler) cmdListApps(c *gin.Context) (string, int, *uint) {
	apps, err := h.appRepo.GetAll(c.Request.Context())
	if err != nil {
		return "Error al obtener aplicaciones", 1, nil
	}

	if len(apps) == 0 {
		return "No hay aplicaciones registradas", 0, nil
	}

	result := "Aplicaciones instaladas:\n\n"
	installadas := 0
	for _, app := range apps {
		if app.EstaInstalada {
			installadas++
			result += fmt.Sprintf("  [OK] %-20s v%-10s %-15s %5.1f MB\n", app.Nombre, app.Version, app.Fuente, app.TamanoMB)
		}
	}

	if installadas == 0 {
		result = "No hay aplicaciones instaladas.\nUsa 'goarch install <repo> <app>' para instalar."
	} else {
		result += fmt.Sprintf("\n%d aplicacion(es) instalada(s)", installadas)
	}

	return result, 0, nil
}

func (h *TerminalHandler) cmdWhoami(usuarioID uint) string {
	return fmt.Sprintf("UsuarioID: %d\nRol: User\nSesion: activa", usuarioID)
}

func (h *TerminalHandler) guardarLog(c *gin.Context, usuarioID *uint, metodo, endpoint string, estado int, mensaje, riesgo, errMsg string, duracion time.Duration) {
	cuerpo, _ := json.Marshal(map[string]string{
		"path":   c.Request.URL.Path,
		"method": c.Request.Method,
	})

	apiLog := &apiEntities.ApiLog{
		UsuarioID:       usuarioID,
		MetodoHTTP:      metodo,
		Endpoint:        endpoint,
		EstadoHTTP:      estado,
		Mensaje:         mensaje,
		DireccionIP:     c.ClientIP(),
		AgenteUsuario:   c.Request.UserAgent(),
		EstaAutenticado: usuarioID != nil,
		NivelRiesgo:     riesgo,
		DuracionMs:      int(duracion.Milliseconds()),
		MensajeError:    errMsg,
		CuerpoPeticion:  string(cuerpo),
	}

	if err := h.apiRepo.Create(c.Request.Context(), apiLog); err != nil {
		log.Printf("[ApiLog] WARNING no se pudo guardar: %v", err)
	}
}

func (h *TerminalHandler) GetAplicaciones(c *gin.Context) {
	apps, err := h.appRepo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aplicaciones"})
		return
	}
	c.JSON(http.StatusOK, apps)
}
package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"api-gateway/internal/application/auth/commands"
	apiEntities "api-gateway/internal/domain/api/entities"
	appEntities "api-gateway/internal/domain/aplicacion/entities"
	termEntities "api-gateway/internal/domain/terminal/entities"
	userEntities "api-gateway/internal/domain/user/entities"
	"api-gateway/internal/infrastructure/database/sqlserver"
	"api-gateway/internal/infrastructure/repositories"
	"api-gateway/internal/interfaces/http/handlers"
	"api-gateway/internal/interfaces/http/middleware"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	log.SetOutput(os.Stdout)

	log.Println("ArchsGo API Gateway - Iniciando...")

	sqlserver.InitDB()

	log.Println("[DB] Ejecutando AutoMigrate...")
	sqlserver.DB.AutoMigrate(
		&userEntities.UsersGo{},
		&apiEntities.ApiLog{},
		&appEntities.Aplicacion{},
		&termEntities.TerminalCommand{},
	)
	log.Println("[DB] Tablas migradas correctamente")

	// Repositorios
	userRepo := repositories.NewUserRepository()
	apiRepo := repositories.NewApiRepository()
	appRepo := repositories.NewAplicacionRepository()
	termRepo := repositories.NewTerminalRepository()

	// Handlers
	registerHandler := commands.NewRegisterHandler(userRepo)
	loginHandler := commands.NewLoginHandler(userRepo)
	authHandler := handlers.NewAuthHandler(registerHandler, loginHandler, apiRepo)
	terminalHandler := handlers.NewTerminalHandler(termRepo, appRepo, apiRepo)

	r := gin.Default()

	// ═══ REQUEST ID ═══
	r.Use(func(c *gin.Context) {
		reqId := time.Now().Format("20060102150405.000")
		c.Set("RequestId", reqId)
		c.Next()
	})

	// ═══ CORS ═══
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id, X-Username")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// ═══ API LOGGER MIDDLEWARE ═══
	r.Use(middleware.ApiLogger(apiRepo))

	// Auth
	r.POST("/api/auth/register", authHandler.Register)
	r.POST("/api/auth/login", authHandler.Login)

	// Terminal
	r.POST("/api/terminal/execute", terminalHandler.Execute)
	r.GET("/api/terminal/historial", terminalHandler.GetHistorial)

	// Aplicaciones (goarch)
	r.GET("/api/aplicaciones", terminalHandler.GetAplicaciones)

	log.Println("API Gateway corriendo en http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}
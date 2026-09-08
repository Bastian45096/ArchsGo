package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"

	"api-gateway/internal/application/auth/commands"
	"api-gateway/internal/infrastructure/database/sqlserver"
	"api-gateway/internal/infrastructure/repositories"
	"api-gateway/internal/interfaces/http/handlers"
)

func main() {
	sqlserver.InitDB()

	userRepo := repositories.NewUserRepository()
	registerHandler := commands.NewRegisterHandler(userRepo)
	authHandler := handlers.NewAuthHandler(registerHandler)

	r := gin.Default()

	// Request ID Middleware for traceability
	r.Use(func(c *gin.Context) {
		b := make([]byte, 4)
		rand.Read(b)
		requestId := fmt.Sprintf("%x", b)

		// Store in Gin context
		c.Set("RequestId", requestId)

		// Store in Request context so it's available in the Application/Domain layers
		ctx := context.WithValue(c.Request.Context(), "RequestId", requestId)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	})

	// CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/api/auth/register", authHandler.Register)

	log.Println("🚀 API Gateway corriendo en http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}

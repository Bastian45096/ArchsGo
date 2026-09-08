package handlers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"api-gateway/internal/application/auth/commands"
)

type AuthHandler struct {
	registerHandler *commands.RegisterHandler
}

func NewAuthHandler(registerHandler *commands.RegisterHandler) *AuthHandler {
	return &AuthHandler{registerHandler: registerHandler}
}

func (h *AuthHandler) Register(c *gin.Context) {
	start := time.Now()

	// Extraer RequestId del contexto para trazabilidad
	requestId, _ := c.Get("RequestId")
	reqIdStr := fmt.Sprintf("%v", requestId)

	log.Printf("[%s] [Phase: API_ENTRY] [Status: INFO] Request recibido | IP: %s | Path: %s", reqIdStr, c.ClientIP(), c.Request.URL.Path)

	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[%s] [Phase: JSON_BINDING] [Status: ERROR] JSON invalido | Error: %v", reqIdStr, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Printf("[%s] [Phase: JSON_BINDING] [Status: OK] Body parseado correctamente | Username: %s, Email: %s", reqIdStr, req.Username, req.Email)

	cmd := commands.RegisterCommand{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password,
	}

	log.Printf("[%s] [Phase: CMD_DISPATCH] [Status: INFO] Despachando comando RegisterHandler", reqIdStr)
	user, err := h.registerHandler.Handle(c.Request.Context(), cmd)
	if err != nil {
		log.Printf("[%s] [Phase: CMD_EXECUTION] [Status: ERROR] Error procesando registro | Error: %v", reqIdStr, err)
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[%s] [Phase: FLOW_COMPLETE] [Status: OK] Usuario registrado exitosamente | ID: %d | Tiempo: %v", reqIdStr, user.ID, time.Since(start))
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Usuario registrado exitosamente",
		"userId":   user.ID,
		"username": user.Username,
		"email":    user.Email,
	})
}

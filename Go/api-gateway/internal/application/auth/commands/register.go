package commands

import (
	"context"
	"errors"
	"log"
	"strings"

	"api-gateway/internal/domain/user/entities"
	"api-gateway/internal/domain/user/repositories"
)

type RegisterCommand struct {
	Username string
	Email    string
	Password string
}

type RegisterHandler struct {
	userRepo repositories.UserRepository
}

func NewRegisterHandler(userRepo repositories.UserRepository) *RegisterHandler {
	return &RegisterHandler{userRepo: userRepo}
}

func (h *RegisterHandler) Handle(ctx context.Context, cmd RegisterCommand) (*entities.UsersGo, error) {
	// Extraer RequestId del contexto para trazabilidad
	reqId, ok := ctx.Value("RequestId").(string)
	if !ok {
		reqId = "unknown"
	}

	log.Printf("[%s] [Phase: CMD_START] [Status: INFO] Iniciando proceso de registro | Username: %s, Email: %s", reqId, cmd.Username, cmd.Email)

	// --- Fase de Validación ---
	log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: INFO] Validando campos obligatorios", reqId)
	if strings.TrimSpace(cmd.Username) == "" {
		log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: ERROR] Username vacio", reqId)
		return nil, errors.New("el nombre de usuario es requerido")
	}
	if strings.TrimSpace(cmd.Email) == "" {
		log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: ERROR] Email vacio", reqId)
		return nil, errors.New("el email es requerido")
	}
	if len(cmd.Password) < 6 {
		log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: ERROR] Password muy corta (< 6 chars)", reqId)
		return nil, errors.New("la contraseña debe tener al menos 6 caracteres")
	}
	log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: OK] Validaciones basicas superadas", reqId)

	// --- Fase de Verificación de Existencia ---
	log.Printf("[%s] [Phase: USER_CHECK] [Status: INFO] Verificando si el usuario o email ya existen en la DB", reqId)
	existingUser, _ := h.userRepo.FindByUsernameOrEmail(ctx, cmd.Username, cmd.Email)
	if existingUser != nil {
		log.Printf("[%s] [Phase: USER_CHECK] [Status: ERROR] Usuario ya registrado | ID: %d", reqId, existingUser.ID)
		return nil, errors.New("el usuario o email ya está registrado")
	}
	log.Printf("[%s] [Phase: USER_CHECK] [Status: OK] Usuario disponible para registro", reqId)

	// --- Fase de Creación de Entidad ---
	log.Printf("[%s] [Phase: ENTITY_CREATION] [Status: INFO] Creando entidad de usuario y hasheando contraseña", reqId)
	user, err := entities.NewUser(cmd.Username, cmd.Email, cmd.Password)
	if err != nil {
		log.Printf("[%s] [Phase: ENTITY_CREATION] [Status: ERROR] Error creando entidad: %v", reqId, err)
		return nil, err
	}

	// --- Fase de Persistencia ---
	log.Printf("[%s] [Phase: DB_PERSISTENCE] [Status: INFO] Guardando usuario en la base de datos", reqId)
	err = h.userRepo.Create(ctx, user)
	if err != nil {
		log.Printf("[%s] [Phase: DB_PERSISTENCE] [Status: ERROR] Error al persistir usuario: %v", reqId, err)
		return nil, errors.New("error al guardar el usuario en la base de datos")
	}

	log.Printf("[%s] [Phase: CMD_COMPLETE] [Status: OK] Proceso de registro completado exitosamente | UserID: %d", reqId, user.ID)
	return user, nil
}

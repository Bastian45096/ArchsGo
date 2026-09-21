package commands

import (
	"context"
	"errors"
	"log"

	"api-gateway/internal/domain/user/entities"
	"api-gateway/internal/domain/user/repositories"
)

type LoginCommand struct {
	UsernameOrEmail string
	Password        string
}

type LoginHandler struct {
	userRepo repositories.UserRepository
}

func NewLoginHandler(userRepo repositories.UserRepository) *LoginHandler {
	return &LoginHandler{userRepo: userRepo}
}

func (h *LoginHandler) Handle(ctx context.Context, cmd LoginCommand) (*entities.UsersGo, error) {
	// Extraer RequestId del contexto para trazabilidad
	reqId, ok := ctx.Value("RequestId").(string)
	if !ok {
		reqId = "unknown"
	}

	log.Printf("[%s] [Phase: CMD_START] [Status: INFO] Iniciando proceso de login | Input: %s", reqId, cmd.UsernameOrEmail)

	// --- Fase de Validación ---
	log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: INFO] Validando campos obligatorios", reqId)
	if cmd.UsernameOrEmail == "" {
		log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: ERROR] Campo UsernameOrEmail vacio", reqId)
		return nil, errors.New("el usuario o email es requerido")
	}
	if cmd.Password == "" {
		log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: ERROR] Campo Password vacio", reqId)
		return nil, errors.New("la contraseña es requerida")
	}
	log.Printf("[%s] [Phase: CMD_VALIDATION] [Status: OK] Validaciones basicas superadas", reqId)

	// --- Fase de Búsqueda de Usuario ---
	log.Printf("[%s] [Phase: USER_LOOKUP] [Status: INFO] Buscando usuario en la DB por input: %s", reqId, cmd.UsernameOrEmail)
	user, err := h.userRepo.FindByUsernameOrEmail(ctx, cmd.UsernameOrEmail, cmd.UsernameOrEmail)
	if err != nil {
		log.Printf("[%s] [Phase: USER_LOOKUP] [Status: ERROR] Error en busqueda de usuario: %v", reqId, err)
		return nil, errors.New("error al buscar el usuario")
	}
	if user == nil {
		log.Printf("[%s] [Phase: USER_LOOKUP] [Status: ERROR] Usuario no encontrado para input: %s", reqId, cmd.UsernameOrEmail)
		return nil, errors.New("usuario o contraseña incorrectos")
	}
	log.Printf("[%s] [Phase: USER_LOOKUP] [Status: OK] Usuario encontrado | ID: %d", reqId, user.ID)

	// --- Fase de Verificación de Contraseña ---
	log.Printf("[%s] [Phase: PASSWORD_VERIFICATION] [Status: INFO] Verificando password para ID=%d", reqId, user.ID)
	if !user.VerifyPassword(cmd.Password) {
		log.Printf("[%s] [Phase: PASSWORD_VERIFICATION] [Status: ERROR] Password incorrecta para ID=%d", reqId, user.ID)
		return nil, errors.New("usuario o contraseña incorrectos")
	}
	log.Printf("[%s] [Phase: PASSWORD_VERIFICATION] [Status: OK] Password verificada exitosamente", reqId)

	// --- Fase de Actualización de Perfil ---
	log.Printf("[%s] [Phase: PROFILE_UPDATE] [Status: INFO] Actualizando last_login para ID=%d", reqId, user.ID)
	user.UpdateLastLogin()
	if err := h.userRepo.Update(ctx, user); err != nil {
		log.Printf("[%s] [Phase: PROFILE_UPDATE] [Status: WARNING] No se pudo actualizar last_login: %v", reqId, err)
		// No es critico, seguimos
	} else {
		log.Printf("[%s] [Phase: PROFILE_UPDATE] [Status: OK] last_login actualizado", reqId)
	}

	log.Printf("[%s] [Phase: CMD_COMPLETE] [Status: OK] Proceso de login completado exitosamente | UserID: %d", reqId, user.ID)
	return user, nil
}

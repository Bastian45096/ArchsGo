package repositories

import (
	"context"

	"api-gateway/internal/domain/terminal/entities"
)

type TerminalRepository interface {
	Create(ctx context.Context, cmd *entities.TerminalCommand) error
	GetByUserID(ctx context.Context, userID uint) ([]entities.TerminalCommand, error)
}

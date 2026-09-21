package repositories

import (
	"context"
	"log"

	"api-gateway/internal/domain/terminal/entities"
	"api-gateway/internal/infrastructure/database/sqlserver"
)

type TerminalRepositoryImpl struct{}

func NewTerminalRepository() *TerminalRepositoryImpl {
	return &TerminalRepositoryImpl{}
}

func (r *TerminalRepositoryImpl) Create(ctx context.Context, cmd *entities.TerminalCommand) error {
	result := sqlserver.DB.Create(cmd)
	if result.Error != nil {
		log.Printf("[Terminal] ERROR al guardar comando: %v", result.Error)
		return result.Error
	}
	log.Printf("[Terminal] OK | comando='%s' | estado=%s | usuarioID=%d",
		cmd.Comando, cmd.Estado, cmd.UsuarioID)
	return nil
}

func (r *TerminalRepositoryImpl) GetByUserID(ctx context.Context, userID uint) ([]entities.TerminalCommand, error) {
	var commands []entities.TerminalCommand
	result := sqlserver.DB.Where("usuario_id = ?", userID).
		Order("fecha_creacion DESC").
		Limit(50).
		Find(&commands)
	if result.Error != nil {
		return nil, result.Error
	}
	return commands, nil
}

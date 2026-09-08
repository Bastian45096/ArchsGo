package repositories

import (
	"context"
	"api-gateway/internal/domain/user/entities"
)

type UserRepository interface {
	Create(ctx context.Context, user *entities.UsersGo) error                    // ✅ CAMBIADO
	FindByID(ctx context.Context, id uint) (*entities.UsersGo, error)           // ✅ CAMBIADO
	FindByUsername(ctx context.Context, username string) (*entities.UsersGo, error) // ✅ CAMBIADO
	FindByEmail(ctx context.Context, email string) (*entities.UsersGo, error)   // ✅ CAMBIADO
	FindByUsernameOrEmail(ctx context.Context, username, email string) (*entities.UsersGo, error) // ✅ CAMBIADO
	Update(ctx context.Context, user *entities.UsersGo) error                    // ✅ CAMBIADO
	Delete(ctx context.Context, id uint) error
}
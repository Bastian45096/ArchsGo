package repositories

import (
	"context"

	"api-gateway/internal/domain/aplicacion/entities"
)

type AplicacionRepository interface {
	FindByNombre(ctx context.Context, nombre string) (*entities.Aplicacion, error)
	Update(ctx context.Context, app *entities.Aplicacion) error
	GetAll(ctx context.Context) ([]entities.Aplicacion, error)
}

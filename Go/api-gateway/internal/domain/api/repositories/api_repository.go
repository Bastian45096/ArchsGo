package repositories

import (
	"context"

	"api-gateway/internal/domain/api/entities"
)

type ApiRepository interface {
	Create(ctx context.Context, log *entities.ApiLog) error
}

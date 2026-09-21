package repositories

import (
	"context"
	"log"

	"api-gateway/internal/domain/api/entities"
	"api-gateway/internal/infrastructure/database/sqlserver"
)

type ApiRepositoryImpl struct{}

func NewApiRepository() *ApiRepositoryImpl {
	return &ApiRepositoryImpl{}
}

func (r *ApiRepositoryImpl) Create(ctx context.Context, apiLog *entities.ApiLog) error {
	result := sqlserver.DB.Create(apiLog)
	if result.Error != nil {
		log.Printf("[ApiLog] ERROR al guardar: %v", result.Error)
		return result.Error
	}
	log.Printf("[ApiLog] OK | %s %s | status=%d | riesgo=%s",
		apiLog.MetodoHTTP, apiLog.Endpoint, apiLog.EstadoHTTP, apiLog.NivelRiesgo)
	return nil
}

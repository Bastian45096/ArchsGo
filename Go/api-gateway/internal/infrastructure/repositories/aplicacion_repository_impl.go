package repositories

import (
	"context"
	"errors"
	"log"

	"gorm.io/gorm"

	apiEntities "api-gateway/internal/domain/aplicacion/entities"
	"api-gateway/internal/infrastructure/database/sqlserver"
)

type AplicacionRepositoryImpl struct{}

func NewAplicacionRepository() *AplicacionRepositoryImpl {
	return &AplicacionRepositoryImpl{}
}

func (r *AplicacionRepositoryImpl) FindByNombre(ctx context.Context, nombre string) (*apiEntities.Aplicacion, error) {
	var app apiEntities.Aplicacion
	result := sqlserver.DB.Where("nombre = ?", nombre).First(&app)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return &app, nil
}

func (r *AplicacionRepositoryImpl) Update(ctx context.Context, app *apiEntities.Aplicacion) error {
	result := sqlserver.DB.Save(app)
	if result.Error != nil {
		log.Printf("[Aplicacion] ERROR al actualizar: %v", result.Error)
		return result.Error
	}
	log.Printf("[Aplicacion] OK | %s actualizada", app.Nombre)
	return nil
}

func (r *AplicacionRepositoryImpl) GetAll(ctx context.Context) ([]apiEntities.Aplicacion, error) {
	var apps []apiEntities.Aplicacion
	result := sqlserver.DB.Find(&apps)
	if result.Error != nil {
		return nil, result.Error
	}
	return apps, nil
}

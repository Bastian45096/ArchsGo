package repositories

import (
	"context"
	"errors"
	"gorm.io/gorm"
	"api-gateway/internal/domain/user/entities"
	"api-gateway/internal/domain/user/repositories"
	"api-gateway/internal/infrastructure/database/sqlserver"
)

type UserRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepository() repositories.UserRepository {
	return &UserRepositoryImpl{
		db: sqlserver.DB,
	}
}

// ✅ CAMBIADO: user *entities.UsersGo
func (r *UserRepositoryImpl) Create(ctx context.Context, user *entities.UsersGo) error {
	result := r.db.WithContext(ctx).Create(user)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no se pudo crear el usuario")
	}
	return nil
}

// ✅ CAMBIADO: *entities.UsersGo
func (r *UserRepositoryImpl) FindByUsername(ctx context.Context, username string) (*entities.UsersGo, error) {
	var user entities.UsersGo
	err := r.db.WithContext(ctx).Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// ✅ CAMBIADO: *entities.UsersGo
func (r *UserRepositoryImpl) FindByEmail(ctx context.Context, email string) (*entities.UsersGo, error) {
	var user entities.UsersGo
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// ✅ CAMBIADO: *entities.UsersGo
func (r *UserRepositoryImpl) FindByUsernameOrEmail(ctx context.Context, username, email string) (*entities.UsersGo, error) {
	var user entities.UsersGo
	err := r.db.WithContext(ctx).Where("username = ? OR email = ?", username, email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// ✅ CAMBIADO: user *entities.UsersGo
func (r *UserRepositoryImpl) Update(ctx context.Context, user *entities.UsersGo) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *UserRepositoryImpl) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entities.UsersGo{}, id).Error // ✅ CAMBIADO
}

// ✅ CAMBIADO: *entities.UsersGo
func (r *UserRepositoryImpl) FindByID(ctx context.Context, id uint) (*entities.UsersGo, error) {
	var user entities.UsersGo
	err := r.db.WithContext(ctx).First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
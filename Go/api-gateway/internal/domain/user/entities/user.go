package entities

import (
	"errors"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func (UsersGo) TableName() string {
	return "users_go"
}

// User es el Aggregate Root del dominio de usuarios.
// Contiene la identidad y el comportamiento crítico del usuario.
type UsersGo struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Username     string     `json:"username" gorm:"uniqueIndex;size:50;not null"`
	Email        string     `json:"email" gorm:"uniqueIndex;size:100;not null"`
	PasswordHash string     `json:"-" gorm:"size:255;not null"`
	Role         string     `json:"role" gorm:"default:'User';size:20"`
	IsActive     bool       `json:"isActive" gorm:"default:true"`
	ProfileImage string     `json:"profileImage" gorm:"size:255"`
	Bio          string     `json:"bio" gorm:"size:500"`
	LastLogin    *time.Time `json:"lastLogin"`
	CreatedAt    time.Time  `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updatedAt" gorm:"autoUpdateTime"`
}

// NewUser es el constructor (Factory) que garantiza las reglas de negocio al crear un usuario.
func NewUser(username, email, password string) (*UsersGo, error) {
	if username == "" || email == "" || password == "" {
		return nil, errors.New("campos requeridos no pueden estar vacíos")
	}

	// Validación simple de email dentro del constructor
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return nil, errors.New("formato de email inválido")
	}

	user := &UsersGo{
		Username:     strings.TrimSpace(username),
		Email:        strings.ToLower(strings.TrimSpace(email)),
		Role:         "User",
		IsActive:     true,
		ProfileImage: "/assets/images/default-avatar.png",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := user.SetPassword(password); err != nil {
		return nil, err
	}

	return user, nil
}

// VerifyPassword compara la contraseña en texto plano con el hash almacenado.
func (u *UsersGo) VerifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

// SetPassword encripta la contraseña usando bcrypt y actualiza la fecha de modificación.
func (u *UsersGo) SetPassword(password string) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hashed)
	u.UpdatedAt = time.Now()
	return nil
}

// Activate cambia el estado del usuario a activo.
func (u *UsersGo) Activate() {
	u.IsActive = true
	u.UpdatedAt = time.Now()
}

// Deactivate cambia el estado del usuario a inactivo (soft delete lógico).
func (u *UsersGo) Deactivate() {
	u.IsActive = false
	u.UpdatedAt = time.Now()
}

// UpdateLastLogin registra el momento exacto del último inicio de sesión.
func (u *UsersGo) UpdateLastLogin() {
	now := time.Now()
	u.LastLogin = &now
	u.UpdatedAt = now
}

// UpdateProfile actualiza la imagen y biografía solo si se proporcionan nuevos valores.
func (u *UsersGo) UpdateProfile(image, bio string) {
	if image != "" {
		u.ProfileImage = image
	}
	if bio != "" {
		u.Bio = bio
	}
	u.UpdatedAt = time.Now()
}

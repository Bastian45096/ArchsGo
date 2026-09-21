package entities

import (
	aplicaciondomain "api-gateway/internal/domain/aplicacion/entities"
	userdomain "api-gateway/internal/domain/user/entities"
	"time"
)

type TerminalCommand struct {
	ID            uint       `json:"id" gorm:"primaryKey"`
	UsuarioID     uint       `json:"usuarioId" gorm:"column:usuario_id;index;not null"`
	AplicacionID  *uint      `json:"aplicacionId" gorm:"column:aplicacion_id;index"`
	Comando       string     `json:"comando" gorm:"size:500;not null"`
	Resultado     string     `json:"resultado" gorm:"type:nvarchar(max)"`
	CodigoSalida  int        `json:"codigoSalida" gorm:"column:codigo_salida;default:0"`
	Estado        string     `json:"estado" gorm:"size:20;default:'pendiente'"`
	FechaInicio   time.Time  `json:"fechaInicio" gorm:"column:fecha_inicio"`
	FechaFin      *time.Time `json:"fechaFin" gorm:"column:fecha_fin"`
	FechaCreacion time.Time  `json:"fechaCreacion" gorm:"column:fecha_creacion;autoCreateTime"`

	// Relaciones
	Usuario    userdomain.UsersGo           `json:"usuario,omitempty" gorm:"foreignKey:UsuarioID"`
	Aplicacion *aplicaciondomain.Aplicacion `json:"aplicacion,omitempty" gorm:"foreignKey:AplicacionID"`
}

func NewTerminalCommand(usuarioID uint, aplicacionID *uint, comando string) *TerminalCommand {
	return &TerminalCommand{
		UsuarioID:     usuarioID,
		AplicacionID:  aplicacionID,
		Comando:       comando,
		Estado:        "pendiente",
		FechaInicio:   time.Now(),
		FechaCreacion: time.Now(),
	}
}

func (t *TerminalCommand) MarcarExitoso(resultado string) {
	t.Resultado = resultado
	t.CodigoSalida = 0
	t.Estado = "exitoso"
	now := time.Now()
	t.FechaFin = &now
}

func (t *TerminalCommand) MarcarFallido(resultado string, codigo int) {
	t.Resultado = resultado
	t.CodigoSalida = codigo
	t.Estado = "fallido"
	now := time.Now()
	t.FechaFin = &now
}

func (TerminalCommand) TableName() string {
	return "terminal_go"
}

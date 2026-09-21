package entities

import "time"

type ApiLog struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	UsuarioID        *uint     `json:"usuarioId" gorm:"index"`
	MetodoHTTP       string    `json:"metodoHttp" gorm:"column:metodo_http;size:10;not null"`
	Endpoint         string    `json:"endpoint" gorm:"size:255;not null"`
	EstadoHTTP       int       `json:"estadoHttp" gorm:"column:estado_http;not null"`
	Mensaje          string    `json:"mensaje" gorm:"size:500"`
	DireccionIP      string    `json:"direccionIp" gorm:"column:direccion_ip;size:45"`
	AgenteUsuario    string    `json:"agenteUsuario" gorm:"column:agente_usuario;size:500"`
	EstaAutenticado  bool      `json:"estaAutenticado" gorm:"column:esta_autenticado;default:false"`
	Rol              string    `json:"rol" gorm:"size:20"`
	NivelRiesgo      string    `json:"nivelRiesgo" gorm:"column:nivel_riesgo;size:10;default:'bajo'"`
	IntentosFallidos int       `json:"intentosFallidos" gorm:"column:intentos_fallidos;default:0"`
	DuracionMs       int       `json:"duracionMs" gorm:"column:duracion_ms"`
	MensajeError     string    `json:"mensajeError" gorm:"column:mensaje_error;type:nvarchar(max)"`
	CuerpoPeticion   string    `json:"cuerpoPeticion" gorm:"column:cuerpo_peticion;type:nvarchar(max)"`
	FechaCreacion    time.Time `json:"fechaCreacion" gorm:"column:fecha_creacion;autoCreateTime"`
}

func (ApiLog) TableName() string {
	return "api_go"
}

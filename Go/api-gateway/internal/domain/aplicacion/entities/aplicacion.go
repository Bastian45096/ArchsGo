package entities

import "time"

type Aplicacion struct {
	ID                 uint      `json:"id" gorm:"primaryKey"`
	Nombre             string    `json:"nombre" gorm:"uniqueIndex;size:100;not null"`
	Descripcion        string    `json:"descripcion" gorm:"size:500"`
	Version            string    `json:"version" gorm:"size:20"`
	Icono              string    `json:"icono" gorm:"size:255"`
	Categoria          string    `json:"categoria" gorm:"size:50"`
	EstaInstalada      bool      `json:"estaInstalada" gorm:"column:esta_instalada;default:false"`
	ComandoInstalar    string    `json:"comandoInstalar" gorm:"column:comando_instalar;size:500"`
	ComandoDesinstalar string    `json:"comandoDesinstalar" gorm:"column:comando_desinstalar;size:500"`
	TamanoMB           float64   `json:"tamanoMb" gorm:"column:tamano_mb"`
	Fuente             string    `json:"fuente" gorm:"size:255"`
	FechaCreacion      time.Time `json:"fechaCreacion" gorm:"column:fecha_creacion;autoCreateTime"`
	FechaActualizacion time.Time `json:"fechaActualizacion" gorm:"column:fecha_actualizacion;autoUpdateTime"`
}

func (Aplicacion) TableName() string {
	return "aplicacion_go"
}

func NewAplicacion(nombre, descripcion, version, categoria, cmdInstalar, cmdDesinstalar string) *Aplicacion {
	return &Aplicacion{
		Nombre:             nombre,
		Descripcion:        descripcion,
		Version:            version,
		Categoria:          categoria,
		EstaInstalada:      false,
		ComandoInstalar:    cmdInstalar,
		ComandoDesinstalar: cmdDesinstalar,
		FechaCreacion:      time.Now(),
		FechaActualizacion: time.Now(),
	}
}

func (a *Aplicacion) MarcarInstalada() {
	a.EstaInstalada = true
	a.FechaActualizacion = time.Now()
}

func (a *Aplicacion) MarcarDesinstalada() {
	a.EstaInstalada = false
	a.FechaActualizacion = time.Now()
}

func (a *Aplicacion) ActualizarVersion(version string) {
	a.Version = version
	a.FechaActualizacion = time.Now()
}

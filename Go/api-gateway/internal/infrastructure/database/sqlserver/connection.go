package sqlserver

import (
	"log"
	"os"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"api-gateway/internal/domain/user/entities"
)

var DB *gorm.DB

func InitDB() {
	// Cargar variables de entorno desde el archivo .env
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ No se encontró archivo .env, usando variables del sistema")
	}

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("❌ Error: La variable de entorno DB_DSN no está definida")
	}

	var gerr error
	DB, gerr = gorm.Open(sqlserver.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if gerr != nil {
		log.Fatal("❌ Error al conectar a SQL Server:", gerr)
	}

	log.Println("✅ Conexión a SQL Server establecida con Trusted_Connection")

	// ✅ CAMBIADO: &entities.UsersGo{}
	err = DB.AutoMigrate(&entities.UsersGo{})
	if err != nil {
		log.Fatal("❌ Error al migrar la tabla UsersGo:", err)
	}

	log.Println("✅ Tabla UsersGo migrada correctamente")
}
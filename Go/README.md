# Documentación Arquitectónica del Backend en Go - ArchsGo

## 1. Visión General del Proyecto

El directorio `Go/` contiene el **backend distribuido** de ArchsGo, implementado en **Go (Golang)** con arquitectura de **microservicios** gestionados mediante un workspace (`go.work`). El core y la lógica de negocio residen en los servicios de Go, mientras que el frontend Angular solo simula visualmente el sistema operativo.

**Principio de Diseño:** Database per Service, Clean Architecture (adaptada a Go), Microservicios independientes con comunicación vía API Gateway.

---

## 2. Estructura del Workspace (`go.work`)

```go
// go.work
use (
    ./api-gateway
    ./service-chat
    ./service-so
)
```

**Propósito:** El workspace de Go permite gestionar múltiples módulos como un solo proyecto, facilitando referencias cruzadas entre servicios sin publicación de paquetes internos.

**Archivos Clave del Workspace:**
- `go.work`: Declaración de módulos incluidos
- `go.work.sum`: Checksums de dependencias del workspace
- `go.sum`: Dependencias de todos los módulos combinados

---

## 3. Componentes del Sistema

### 3.1 API Gateway (`api-gateway/`)

**Responsabilidad:** Punto de entrada único (`Single Entry Point`) para todo el frontend. Gestiona autenticación (`JWT`), enrutamiento (`routing`) y coordinación básica entre los servicios internos.

**Archivos Críticos:**
- `.env` / `.env.example`: Variables de entorno (`PORT`, `JWT_SECRET`, `DB_DSN`, `SERVICE_CHAT_URL`, `SERVICE_SO_URL`)
- `cmd/`: Punto de arranque (`main.go`)
- `internal/`: Lógica interna del gateway (handlers, middleware, auth)
- `pkg/`: Paquetes reutilizables (clientes HTTP internos, validadores)
- `go.mod`: Módulo independiente con dependencias del gateway (`gin-gonic/gin`, `jwt-go`, etc.)

**Patrón de Diseño:** API Gateway Pattern con autenticación centralizada.

---

### 3.2 Service SO (`service-so/`)

**Responsabilidad:** Microservicio encargado de la **lógica central** del sistema operativo simulado (`System Operating`). Es el core del backend.

**Estructura Interna:**
- `cmd/`: Entry point (`main.go`)
- `internal/`: Dominio del servicio (entidades, repositorios, casos de uso)
- `go.mod`: Dependencias del servicio core
- `pkg/`: Utilidades compartidas con otros servicios

**Responsabilidades Clave:**
- Gestión de procesos simulados
- Estado del sistema operativo virtual
- Coordinación con `service-chat` para notificaciones
- Persistencia en `database/` (SQL Server)

---

### 3.3 Service Chat (`service-chat/`)

**Responsabilidad:** Microservicio independiente para la gestión de comunicaciones y mensajería (`real-time messaging`). Funciona como aplicación autónoma que se comunica con el core (`service-so`).

**Estructura Interna:**
- `cmd/`: Arranque del servicio
- `internal/`: Lógica de chat (mensajes, canales, usuarios conectados)
- `go.mod`: Dependencias del servicio de chat

**Integración:** Se conecta con `service-so` para validar usuarios y con `database/` para persistencia independiente (patrón Database per Service).

---

### 3.4 Database (`database/`)

**Responsabilidad:** Capa de persistencia basada en **SQL Server**. Contiene scripts SQL de inicialización, migraciones y esquemas.

**Contenido:**
- Scripts `.sql`: Creación de tablas (`Users`, `Messages`, `Processes`, etc.)
- Scripts de seed: Datos iniciales para el entorno
- Documentación de esquema: Referencia para desarrolladores

**Nota:** Cada microservicio (`service-so`, `service-chat`, `api-gateway`) puede acceder a su propia instancia o esquema independiente siguiendo el patrón **Database per Service**.

---

## 4. Patrones de Diseño Aplicados

| Patrón | Implementación en Go | Propósito |
|--------|----------------------|-----------|
| **Microservicios** | `service-so/`, `service-chat/` separados | Escalabilidad independiente |
| **API Gateway** | `api-gateway/` | Unificación de entrada, auth central |
| **Database per Service** | `database/` + conexiones separadas por servicio | Aislamiento de datos |
| **Clean Architecture** | `internal/` + `cmd/` + `pkg/` | Separación de responsabilidades |
| **Workspace Module** | `go.work` | Gestión de módulos múltiples |

---

## 5. Flujo de Datos (Arquitectura Distribuida)

```
Frontend (Angular) → HTTP → API Gateway (Go)
                                    │
                    ├───────────────┼───────────────┐
                    ▼               ▼               ▼
              Auth & Routing   Service SO    Service Chat
                    │               │               │
                    ▼               ▼               ▼
              Database         Database         Database
            (SQL Server)     (SQL Server)    (SQL Server)
```

1. El **Frontend Angular** hace peticiones al `API Gateway` (`localhost:8080` o configurado en `.env`).
2. El **Gateway** valida autenticación (`JWT`) y enruta a `service-so` o `service-chat`.
3. Cada **Servicio** procesa la lógica de negocio y persiste en su base de datos (`database/`).
4. La **Respuesta** fluye de regreso a través del Gateway al Frontend.

---

## 6. Configuración de Entorno

### Variables Críticas (`.env` en `api-gateway/`)
```
PORT=8080
JWT_SECRET=clave_secreta_para_firma_de_tokens
DB_DSN=sqlserver://user:pass@localhost:1433?database=archsgo
SERVICE_SO_URL=http://localhost:8081
SERVICE_CHAT_URL=http://localhost:8082
```

### Dependencias Principales (`go.mod` de cada servicio)
- `gin-gonic/gin`: Framework web rápido
- `jwt-go`: Implementación de JWT
- `go-sql-driver/mssql`: Driver para SQL Server
- `github.com/joho/godotenv`: Carga de `.env`

---

## 7. Ejecución Local (Según Documentación Principal)

```bash
# Entrar al workspace
cd Go

# Iniciar API Gateway (terminal independiente)
cd api-gateway && go run ./cmd/main.go

# Iniciar Service SO (terminal independiente)
cd service-so && go run ./cmd/main.go

# Iniciar Service Chat (terminal independiente)
cd service-chat && go run ./cmd/main.go
```

**Nota:** Cada servicio es independiente y debe ejecutarse en su propio proceso/puerto. No hay un orquestador automático (como Kubernetes o Docker Compose) definido en el repositorio base.

---

## 8. Estado Actual y Notas de Ingeniería

- **Estado:** Producción lista (según arquitectura documentada)
- **Lenguaje:** Go (última versión estable recomendada para `go.work`)
- **Base de Datos:** SQL Server con scripts en `database/`
- **Documentación Adicional:** `Documentacion/` (carpeta existente para referencia interna)
- **Patrón de Interacción:** REST (HTTP JSON) entre servicios internos, comunicados a través del Gateway
- **Seguridad:** Autenticación JWT gestionada en `api-gateway/`, propagación opcional a servicios internos (ver `internal/` del gateway)

---

*Documentación creada: Enero 2025*
*Nivel: Software Engineer / Arquitecto de Software*
*Estado: Completo — Arquitectura Distribuida Documentada*

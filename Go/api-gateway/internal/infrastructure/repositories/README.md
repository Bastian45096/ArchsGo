# Documentación de Repositorios - API Gateway

**Ubicación:** `Go/api-gateway/internal/infrastructure/repositories/`  
**Patrón:** Repository Pattern (Clean Architecture)  
**ORM:** GORM con SQL Server  
**Capa:** Infrastructure → Repositories (implementan interfaces del Domain)

---

## 1. Visión General

Esta carpeta contiene las **implementaciones concretas** de los repositorios definidos en la capa de dominio (`internal/domain/*/repositories`). Cada repositorio encapsula el acceso a datos para una entidad específica, desacoplando la lógica de negocio de la base de datos.

> **Principio:** *Dependency Inversion* — Los casos de uso (Application) dependen de interfaces (Domain), no de implementaciones (Infrastructure).

---

## 2. Repositorios Disponibles

| Archivo | Entidad | Tabla SQL | Interfaz Dominio |
|---------|---------|-----------|------------------|
| `user_repository_impl.go` | `UsersGo` | `UsersGo` | `domain/user/repositories.UserRepository` |
| `aplicacion_repository_impl.go` | `Aplicacion` | `Aplicaciones` | `domain/aplicacion/repositories.AplicacionRepository` |
| `terminal_repository_impl.go` | `TerminalCommand` | `TerminalCommands` | `domain/terminal/repositories.TerminalRepository` |
| `api_repository_impl.go` | `ApiLog` | `ApiLogs` | `domain/api/repositories.ApiRepository` |

---

## 3. Documentación por Repositorio

---

### 3.1 UserRepositoryImpl (`user_repository_impl.go`)

**Rol:** Gestión completa del ciclo de vida de usuarios del sistema (registro, autenticación, consulta, actualización).

**Entidad:** `entities.UsersGo`  
**Tabla:** `UsersGo`  
**Interfaz:** `domain/user/repositories.UserRepository`

#### Métodos

| Método | Parámetros | Retorno | Descripción | Caso de Uso |
|--------|------------|---------|-------------|-------------|
| `Create` | `ctx context.Context`, `user *entities.UsersGo` | `error` | Inserta nuevo usuario con hash de contraseña | **Registro de usuario** (`RegisterUseCase`) |
| `FindByUsername` | `ctx context.Context`, `username string` | `(*entities.UsersGo, error)` | Busca usuario por username exacto | **Login** (`LoginUseCase`), **Validación unicidad** |
| `FindByEmail` | `ctx context.Context`, `email string` | `(*entities.UsersGo, error)` | Busca usuario por email exacto | **Login por email**, **Validación unicidad** |
| `FindByUsernameOrEmail` | `ctx context.Context`, `username, email string` | `(*entities.UsersGo, error)` | Busca por username **OR** email (para login flexible) | **Login unificado** (`LoginUseCase`) |
| `Update` | `ctx context.Context`, `user *entities.UsersGo` | `error` | Actualiza campos del usuario (perfil, password, etc.) | **Actualizar perfil**, **Cambio de contraseña** |
| `Delete` | `ctx context.Context`, `id uint` | `error` | Elimina usuario por ID (soft/hard delete según configuración) | **Baja de usuario** (`DeleteUserUseCase`) |
| `FindByID` | `ctx context.Context`, `id uint` | `(*entities.UsersGo, error)` | Recupera usuario por PK | **Obtener perfil** (`GetProfileUseCase`), **Validación JWT** |

#### Casos de Uso que Participan
- `RegisterUseCase` → `Create`
- `LoginUseCase` → `FindByUsernameOrEmail`
- `GetProfileUseCase` → `FindByID`
- `UpdateProfileUseCase` → `Update`
- `DeleteUserUseCase` → `Delete`
- `ValidateTokenUseCase` (middleware) → `FindByID`

#### Parámetros Clave
- `username`: unique, indexed
- `email`: unique, indexed
- `password_hash`: bcrypt/argon2 (nunca texto plano)
- `ctx`: propagación de timeout/cancelación

---

### 3.2 AplicacionRepositoryImpl (`aplicacion_repository_impl.go`)

**Rol:** Gestión de aplicaciones registradas en el gateway (microservicios, apps frontend, servicios internos).

**Entidad:** `apiEntities.Aplicacion`  
**Tabla:** `Aplicaciones`  
**Interfaz:** `domain/aplicacion/repositories.AplicacionRepository`

#### Métodos

| Método | Parámetros | Retorno | Descripción | Caso de Uso |
|--------|------------|---------|-------------|-------------|
| `FindByNombre` | `ctx context.Context`, `nombre string` | `(*apiEntities.Aplicacion, error)` | Busca aplicación por nombre único | **Validación de app registrada**, **Routing dinámico** |
| `Update` | `ctx context.Context`, `app *apiEntities.Aplicacion` | `error` | Actualiza configuración de la app (URL, estado, metadata) | **Configurar microservicio**, **Habilitar/Deshabilitar app** |
| `GetAll` | `ctx context.Context` | `([]apiEntities.Aplicacion, error)` | Lista todas las aplicaciones registradas | **Dashboard admin**, **Health check global**, **Service discovery** |

#### Casos de Uso que Participan
- `RegisterApplicationUseCase` → `FindByNombre` (validar duplicados), luego `Create` (si existiera)
- `UpdateApplicationConfigUseCase` → `FindByNombre` + `Update`
- `ListApplicationsUseCase` → `GetAll`
- `HealthCheckUseCase` → `GetAll` + ping a cada URL

#### Parámetros Clave
- `nombre`: unique, clave de routing interno
- `url_base`: endpoint base del microservicio
- `activo`: boolean para habilitar/deshabilitar sin borrar
- `metadata`: JSON con configuración extra (timeouts, rate limits, etc.)

---

### 3.3 TerminalRepositoryImpl (`terminal_repository_impl.go`)

**Rol:** Auditoría y persistencia de comandos ejecutados en la terminal simulada del frontend.

**Entidad:** `entities.TerminalCommand`  
**Tabla:** `TerminalCommands`  
**Interfaz:** `domain/terminal/repositories.TerminalRepository`

#### Métodos

| Método | Parámetros | Retorno | Descripción | Caso de Uso |
|--------|------------|---------|-------------|-------------|
| `Create` | `ctx context.Context`, `cmd *entities.TerminalCommand` | `error` | Guarda comando ejecutado con metadata (usuario, estado, timestamp) | **Ejecutar comando terminal** (`ExecuteTerminalCommandUseCase`) |
| `GetByUserID` | `ctx context.Context`, `userID uint` | `([]entities.TerminalCommand, error)` | Últimos 50 comandos del usuario (orden DESC por fecha) | **Historial de terminal** (`GetTerminalHistoryUseCase`) |

#### Casos de Uso que Participan
- `ExecuteTerminalCommandUseCase` → `Create` (auditoría post-ejecución)
- `GetTerminalHistoryUseCase` → `GetByUserID` (mostrar historial en UI)

#### Parámetros Clave
- `comando`: string del comando ejecutado
- `estado`: `success` | `error` | `timeout`
- `usuario_id`: FK a `UsersGo`
- `fecha_creacion`: timestamp automático (auditoría)
- `salida`: opcional, output del comando (truncado si largo)

---

### 3.4 ApiRepositoryImpl (`api_repository_impl.go`)

**Rol:** Logging estructurado de **todas las peticiones HTTP** que pasan por el API Gateway (auditoría, seguridad, métricas).

**Entidad:** `entities.ApiLog`  
**Tabla:** `ApiLogs`  
**Interfaz:** `domain/api/repositories.ApiRepository`

#### Métodos

| Método | Parámetros | Retorno | Descripción | Caso de Uso |
|--------|------------|---------|-------------|-------------|
| `Create` | `ctx context.Context`, `apiLog *entities.ApiLog` | `error` | Persiste log de petición HTTP con análisis de riesgo | **Middleware de auditoría** (`ApiLoggingMiddleware`) |

#### Casos de Uso que Participan
- `ApiLoggingMiddleware` (middleware global) → `Create` en cada request HTTP
- `GetApiMetricsUseCase` (futuro) → consultas agregadas sobre `ApiLogs`
- `SecurityAuditUseCase` (futuro) → filtrar por `NivelRiesgo = 'alto'`

#### Parámetros Clave (campos de `ApiLog`)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `MetodoHTTP` | string | `GET`, `POST`, `PUT`, `DELETE`, etc. |
| `Endpoint` | string | Ruta completa (`/api/auth/login`) |
| `EstadoHTTP` | int | Código de respuesta (`200`, `401`, `500`) |
| `IPCliente` | string | IP origen (`192.168.1.1`) |
| `UserAgent` | string | Header `User-Agent` |
| `UsuarioID` | uint | ID usuario autenticado (0 si anónimo) |
| `NivelRiesgo` | string | `bajo` | `medio` | `alto` | `critico` (calculado por heurística) |
| `FechaCreacion` | time.Time | Timestamp automático |
| `DuracionMs` | int64 | Latencia de la petición |

#### Heurística de `NivelRiesgo` (implementada en middleware)
- `critico`: Status >= 500 O duration > 10s O IP en lista negra
- `alto`: Status 4xx repetido O endpoint sensible (`/auth/*`, `/admin/*`) con fallo
- `medio`: Status 4xx esporádico O duration > 3s
- `bajo`: Status 2xx, duration < 1s, endpoint público

---

## 4. Convenciones y Patrones Comunes

### 4.1 Constructor Factory
```go
func NewXxxRepository() *XxxRepositoryImpl {
    return &XxxRepositoryImpl{}
}
```
- Sin dependencias externas en el constructor (usa `sqlserver.DB` global)
- Facilita testing con mocks

### 4.2 Context Propagation
Todos los métodos reciben `ctx context.Context` para:
- Timeouts de query (`context.WithTimeout`)
- Cancelación en cascada
- Trazabilidad (request ID)

### 4.3 Manejo de Errores
- `gorm.ErrRecordNotFound` → retorna `(nil, nil)` en métodos `Find*`
- Errores de BD → log + retorno del error original
- Logging estructurado con prefijo `[Entidad]`

### 4.4 Transacciones
Actualmente no hay transacciones multi-repositorio. Si se requieren, usar `sqlserver.DB.Transaction()` en el caso de uso (Application layer).

---

## 5. Testing

### Mocks Recomendados
```go
// test/mocks/user_repository_mock.go
type UserRepositoryMock struct {
    mock.Mock
}

func (m *UserRepositoryMock) FindByUsername(ctx context.Context, username string) (*entities.UsersGo, error) {
    args := m.Called(ctx, username)
    return args.Get(0).(*entities.UsersGo), args.Error(1)
}
```

### Casos de Prueba Clave
| Repositorio | Test Crítico |
|-------------|--------------|
| `UserRepository` | `FindByUsernameOrEmail` retorna correcto con email/username |
| `AplicacionRepository` | `GetAll` retorna solo apps activas si filtro |
| `TerminalRepository` | `GetByUserID` respeta límite 50 y orden DESC |
| `ApiRepository` | `Create` no falla si BD inalcanzable (log y retorno error) |

---

## 6. Relación con Otras Capas

```
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Casos de Uso)                           │
│  ├── RegisterUseCase     → UserRepository.Create            │
│  ├── LoginUseCase        → UserRepository.FindByUsernameOrEmail
│  ├── ExecuteTerminalCmd  → TerminalRepository.Create
│  └── ApiLoggingMiddleware→ ApiRepository.Create
└──────────────────────────┬──────────────────────────────────┘
                           │ Interface (Domain)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Interfaces)                                  │
│  ├── repositories.UserRepository                            │
│  ├── repositories.AplicacionRepository                      │
│  ├── repositories.TerminalRepository                        │
│  └── repositories.ApiRepository                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ Implementación
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Esta carpeta)                        │
│  ├── user_repository_impl.go                                │
│  ├── aplicacion_repository_impl.go                          │
│  ├── terminal_repository_impl.go                            │
│  └── api_repository_impl.go                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Extensibilidad

### Agregar Nuevo Repositorio
1. Definir interfaz en `domain/<entidad>/repositories/`
2. Crear entidad en `domain/<entidad>/entities/`
3. Implementar en esta carpeta siguiendo el patrón `*_repository_impl.go`
4. Registrar en DI container (`main.go` o `wire`)

### Migración a Interfaces Genéricas (Futuro)
```go
type Repository[T any] interface {
    Create(ctx context.Context, entity *T) error
    FindByID(ctx context.Context, id uint) (*T, error)
    Update(ctx context.Context, entity *T) error
    Delete(ctx context.Context, id uint) error
}
```

---

*Documentación generada para gobernanza de la capa de persistencia del API Gateway*  
*Nivel:* Software Engineer / Clean Architecture  
*Estado:* v1.0 — Completa
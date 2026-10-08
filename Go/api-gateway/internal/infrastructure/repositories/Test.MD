# Propuesta de Pruebas — Repositorios API Gateway

**Carpeta:** `Go/api-gateway/internal/infrastructure/repositories/`  
**Nivel:** Software Engineer / Clean Architecture  
**Estado:** Propuesta para aprobación de nuevos repositorios

---

## 1. Requisitos de Aprobación para un Nuevo Repositorio (`*_repository_impl.go`)

Antes de que un repositorio sea aprobado para producción, debe cumplir con estos requisitos mínimos:

### 1.1 Requisitos Estructurales
- [ ] Implementa la interfaz definida en `internal/domain/<entidad>/repositories/`
- [ ] Usa `sqlserver.DB` (no crea nuevas conexiones; respeta el pool global)
- [ ] Recibe `ctx context.Context` en todos los métodos públicos (context propagation)
- [ ] Usa factory constructor `NewXxxRepository()` (sin dependencias ocultas)
- [ ] Maneja `gorm.ErrRecordNotFound` correctamente (`nil, nil` en `Find*`)
- [ ] Registra errores con `log.Printf` con prefijo `[Entidad]`
- [ ] No expone detalles internos de GORM en la capa de aplicación

### 1.2 Requisitos Funcionales
- [ ] Cada método tiene al menos un caso de uso documentado en `README.md` de la carpeta
- [ ] Las tablas SQL referenciadas existen en `database/*.sql`
- [ ] El repositorio no realiza validación de reglas de negocio (eso va en `Application` / `Domain`)
- [ ] No hay hardcoding de IDs ni valores mágicos; usa constantes o enums del dominio

### 1.3 Requisitos de Calidad (Testing)
- [ ] Cobertura de código (`go test -cover`) >= 80% para el archivo `.go`
- [ ] Pruebas unitarias con mocks (no requiere BD real; mock de `sqlserver.DB` o mock de repositorio)
- [ ] Pruebas de integración opcionales con `sqlmock` o `testcontainers`
- [ ] Todos los casos de error de GORM cubiertos (`ErrRecordNotFound`, errores de DB)

---

## 2. Matriz de Pruebas Propuestas por Repositorio Existente

### 2.1 UserRepositoryImpl (`user_repository_impl.go`)

| ID Prueba | Caso de Uso / Método | Datos / Parámetros | Resultado Esperado | Tipo |
|-----------|---------------------|-------------------|--------------------|------|
| T-U01 | `Create` — registro exitoso | `username="juan"`, `email="juan@test.com"`, `password_hash="hash123"` | `error == nil`, `RowsAffected == 1` | Unitario |
| T-U02 | `Create` — duplicado username | `username="juan"` (ya existe) | `error` con mensaje de duplicado (o `RowsAffected == 0`) | Unitario |
| T-U03 | `FindByUsername` — existe | `username="juan"` | `user.Username == "juan"`, `email` completo, `user != nil` | Unitario |
| T-U04 | `FindByUsername` — no existe | `username="ghost"` | `user == nil`, `error == nil` (`ErrRecordNotFound`) | Unitario |
| T-U05 | `FindByUsernameOrEmail` — por username | `username="juan"`, `email="otro@test.com"` | `user.Username == "juan"` | Unitario |
| T-U06 | `FindByUsernameOrEmail` — por email | `username="otro"`, `email="juan@test.com"` | `user.Email == "juan@test.com"` | Unitario |
| T-U07 | `FindByUsernameOrEmail` — no existe | `username="no"`, `email="no@test.com"` | `user == nil`, `error == nil` | Unitario |
| T-U08 | `FindByEmail` — existe | `email="juan@test.com"` | `user != nil`, `user.Email == email` | Unitario |
| T-U09 | `FindByEmail` — no existe | `email="no@test.com"` | `user == nil`, `error == nil` | Unitario |
| T-U10 | `Update` — actualizar perfil | `user.Username = "juan_new"` | `error == nil`, DB actualizada | Unitario |
| T-U11 | `FindByID` — existe | `id = 1` | `user.UserID == 1` | Unitario |
| T-U12 | `FindByID` — no existe | `id = 9999` | `user == nil`, `error == nil` | Unitario |
| T-U13 | `Delete` — borrar usuario | `id = 1` | `error == nil` | Unitario |
| T-U14 | `Delete` — ID inexistente | `id = 0` | No lanza panic; `error` manejado por GORM | Unitario |
| T-I01 | `FindByUsername` — timeout | `ctx` con timeout de 50ms; DB lenta simulada | `error` indica timeout (`context deadline exceeded`) | Integración |
| T-I02 | `Create` + `FindByUsername` flujo completo | Registro → consulta inmediata | Usuario recuperado igual al creado | Integración |

### 2.2 AplicacionRepositoryImpl (`aplicacion_repository_impl.go`)

| ID Prueba | Caso de Uso / Método | Datos / Parámetros | Resultado Esperado | Tipo |
|-----------|---------------------|-------------------|--------------------|------|
| T-A01 | `FindByNombre` — existe | `nombre="terminal"` | `app.Nombre == "terminal"`, no nil | Unitario |
| T-A02 | `FindByNombre` — no existe | `nombre="fake_app"` | `app == nil`, `error == nil` | Unitario |
| T-A03 | `Update` — cambiar URL | `app.URLBase = "http://new"` | `error == nil` | Unitario |
| T-A04 | `Update` — desactivar (`activo = false`) | `app.Activo = false` | DB reflejada; `GetAll` no retorna esta app si hay filtro futuro | Unitario |
| T-A05 | `GetAll` — existen apps | Varias apps insertadas en setup | Array con `len > 0`, sin duplicados | Unitario |
| T-A06 | `GetAll` — vacío | DB limpia | Array vacío (`[]`), `len == 0` | Unitario |

### 2.3 TerminalRepositoryImpl (`terminal_repository_impl.go`)

| ID Prueba | Caso de Uso / Método | Datos / Parámetros | Resultado Esperado | Tipo |
|-----------|---------------------|-------------------|--------------------|------|
| T-T01 | `Create` — comando exitoso | `cmd = {Comando: "ls"}`, `Estado: "success"` | `error == nil`, log con `[Terminal] OK` | Unitario |
| T-T02 | `Create` — error en DB simulada | DB desconectada (mock error) | `error != nil`, log con `[Terminal] ERROR` | Unitario |
| T-T03 | `GetByUserID` — usuario con historial | `userID = 5` (con 3 comandos previos) | `len(commands) == 3`, orden DESC por `fecha_creacion` | Unitario |
| T-T04 | `GetByUserID` — usuario sin comandos | `userID = 999` | Array vacío (`len == 0`), sin error | Unitario |
| T-T05 | `GetByUserID` — límite 50 respetado | Insertar 60 comandos para `userID = 1` | Solo 50 retornados (`len <= 50`) | Unitario |
| T-T06 | `GetByUserID` — contexto cancelado | `ctx` cancelado antes del query | `error` indica cancelación; sin panic | Unitario |

### 2.4 ApiRepositoryImpl (`api_repository_impl.go`)

| ID Prueba | Caso de Uso / Método | Datos / Parámetros | Resultado Esperado | Tipo |
|-----------|---------------------|-------------------|--------------------|------|
| T-AP01 | `Create` — log exitoso | `apiLog = {MetodoHTTP: "GET", Endpoint: "/api/auth/login", EstadoHTTP: 200}` | `error == nil`, log con `[ApiLog] OK` | Unitario |
| T-AP02 | `Create` — log con alto riesgo | `NivelRiesgo = "critico"`, `EstadoHTTP = 500` | DB insertada correctamente; no lanza error por riesgo | Unitario |
| T-AP03 | `Create` — contexto cancelado | `ctx` con cancel | `error` indica cancelación | Unitario |
| T-AP04 | `Create` — DB inaccesible (simulada) | Mock DB que retorna error en `Create()` | `error != nil`, log con `[ApiLog] ERROR` | Unitario |

---

## 3. Estructura de Prueba Propuesta (Ejemplo Unitario)

```go
// internal/infrastructure/repositories/user_repository_test.go
package repositories

import (
    "context"
    "testing"
    "time"

    "api-gateway/internal/domain/user/entities"
)

func TestUserRepositoryImpl_FindByUsername(t *testing.T) {
    repo := NewUserRepository()
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()

    // Caso: usuario existente
    user, err := repo.FindByUsername(ctx, "testuser")
    if err != nil {
        t.Errorf("No se esperaba error: %v", err)
    }
    if user == nil {
        t.Error("Se esperaba usuario, se obtuvo nil")
    }

    // Caso: usuario inexistente
    userNil, errNil := repo.FindByUsername(ctx, "nonexistent")
    if errNil != nil {
        t.Errorf("No se esperaba error en no existente: %v", errNil)
    }
    if userNil != nil {
        t.Errorf("Se esperaba nil, se obtuvo: %+v", userNil)
    }
}
```

---

## 4. Requisitos para Aprobación de un Nuevo Repositorio

### 4.1 Antes de la Implementación
- [ ] Interfaz de dominio (`repositories.UserRepository`) definida con los métodos necesarios
- [ ] Entidad (`entities.User`) creada con los campos requeridos
- [ ] Tabla SQL (`database/*.sql`) creada con índices apropiados (`username`, `email`)

### 4.2 Durante la Implementación
- [ ] Archivo nombrado siguiendo convención: `<entidad>_repository_impl.go`
- [ ] Constructor: `func NewXxxRepository() *XxxRepositoryImpl`
- [ ] Todos los métodos reciben `context.Context`
- [ ] Usa `sqlserver.DB` (no crea `gorm.Open()` nuevo)
- [ ] Maneja errores con `errors.Is(err, gorm.ErrRecordNotFound)`
- [ ] Log estructurado con prefijo `[Entidad]`

### 4.3 Pruebas (Antes del Merge)
- [ ] Archivo de test creado: `<archivo>_test.go`
- [ ] Al menos 3 casos por método: éxito, no encontrado, error de DB
- [ ] Cobertura >= 80% (`go test -coverprofile=cover.out -cover`)
- [ ] Mock de repositorio creado para casos de uso (`mocks/`)
- [ ] CI pasa (`go test ./...` sin fallas)

### 4.4 Documentación (Después del Merge)
- [ ] `README.md` actualizado con métodos, parámetros y casos de uso
- [ ] `API.md` actualizado con endpoints relacionados al repositorio
- [ ] `Architecture.md` actualizado si hay nuevos patrones

---

## 5. Checklist Final (Para Aprobación de PR)

```markdown
- [ ] Código compilado (`go build ./...` sin errores)
- [ ] Pruebas pasan (`go test ./...` sin fallas)
- [ ] Cobertura >= 80% (archivo específico del repositorio)
- [ ] Documentación completa (`README.md` + `API.md` + `Architecture.md` si aplica)
- [ ] Seguido patrón Clean Architecture (Domain → Infrastructure, no acoplamiento inverso)
- [ ] No hay dependencias ocultas (constructor factory, sin `new()` manual en casos de uso)
- [ ] Manejo de contexto (`ctx`) en todos los métodos
- [ ] Logging estructurado (`[Entidad] ...`)
```

---

*Documento creado para gobernanza de calidad de repositorios del API Gateway*  
*Nivel:* Software Engineer / Clean Architecture  
*Estado:* Propuesta v1.0 — Para revisión y aprobación antes de nuevos repositorios

# Documentación de Casos de Uso - Handlers HTTP

## Resumen

Este documento documenta los casos de uso de los manejadores HTTP `auth_handler.go` y `terminal_handler.go` desde una perspectiva de ingeniería de software. Describe los escenarios del mundo real, flujos de interacción, contratos de API, e consideraciones de diseño para el sistema de autenticación y terminal de la API Gateway.

## Arquitectura de Referencia del Sistema

```
Cliente HTTP -> [Gin Router] -> Handlers -> [Comandos de Aplicación] -> [Repositorios] -> [Base de Datos]
                     |              |                   |                   |
                Middlewares    Logging/Auditoría    Lógica de Negocio     Persistencia
```

## 1. Casos de Uso de Autenticación

### 1.1 Registro de Nuevo Usuario

#### Descripción del Caso de Uso
**Actor**: Usuario no autenticado
**Objetivo**: Crear una nueva cuenta de usuario en el sistema

#### Secuencia Principal de Eventos

1. **Cliente** envía solicitud POST `/api/auth/register` con JSON:
   ```json
   {
     "username": "johndoe",
     "email": "john@example.com", 
     "password": "securePassword123"
   }
   ```

2. **Gin Router** routing a `AuthHandler.Register(c *gin.Context)`

3. **AuthHandler**:
   - Parsea JSON con `c.ShouldBindJSON(&req)`
   - Validación: username requerido, formato email válido, password mínimo 6 chars
   - Crea `commands.RegisterCommand` con datos validados
   - Delega a `registerHandler.Handle(ctx, cmd)`

4. **RegisterHandler** (desde `auth/commands/register.go`):
   - Verifica unicidad de username/email
   - Crea entidad de usuario con password hasheado
   - Persiste en base de datos
   - Retorna `UsersGo` con ID asignado

5. **AuthHandler**:
   - Log de auditoría con nivel de riesgo "bajo"
   - Retorna respuesta JSON 201:
   ```json
   {
     "message": "Usuario registrado exitosamente",
     "userId": 123,
     "username": "johndoe", 
     "email": "john@example.com"
   }
   ```

#### Casos Alternativos

- **Campos Faltantes**: Retorna 400 con error de validación Gin
- **Email Duplicado**: Retorna 409 con mensaje "el usuario o email ya está registrado"
- **Password Muy Corta**: Retorna 400 con mensaje sobre mínimo 6 caracteres
- **Error de Base de Datos**: Retorna 500 con error genérico

#### Requisitos de Calidad

- **Seguridad**: Passwords nunca logs, mensajes de error genéricos
- **Performance**: <100ms para casos felices
- **Consistencia**: Validación idempotente
- **Auditoría**: Log completo de auditoría con IP, user-agent, duración

#### Punto de Integración
```go
// API Gateway Router (ejemplo)
router.POST("/api/auth/register", authHandler.Register)
```

---

### 1.2 Inicio de Sesión de Usuario

#### Descripción del Caso de Uso
**Actor**: Usuario no autenticado
**Objetivo**: Obtener una sesión autenticada para acceder a recursos protegidos

#### Secuencia Principal de Eventos

1. **Cliente** envía solicitud POST `/api/auth/login`:
   ```json
   {
     "usernameOrEmail": "johndoe",
     "password": "securePassword123"
   }
   ```

2. **Gin Router** routing a `AuthHandler.Login(c *gin.Context)`

3. **AuthHandler**:
   - Parsea JSON con validación requerida
   - Crea `commands.LoginCommand`
   - Llama a `loginHandler.Handle(ctx, cmd)`

4. **LoginHandler** (desde `auth/commands/login_command.go`):
   - Busca usuario por username/email
   - Verifica hash de password
   - Actualiza `last_login` timestamp
   - Persiste cambios
   - Retorna entidad de usuario autenticada

5. **AuthHandler**:
   - Log de auditoría con nivel de riesgo "bajo" (éxito) o "medio" (fallo)
   - Retorna respuesta JSON 200 con información de usuario completa

#### Casos Especiales de Seguridad

- **Password Incorrecta**: Error 401 genérico "usuario o contraseña incorrectos"
- **Usuario Inactivo**: Podría retornar 403 con mensaje específico
- **Múltiples Intentos Fallidos**: Rate limiting en capas superiores
- **Account Takeover**: Detección de anomalías para IPs/dispositivos nuevos

#### Requisitos de Compliance

- **GDPR**: Conservación de logs de auditoría
- **ISO 27001**: Seguridad de contraseñas, logging seguro
- **SOC 2**: Auditoría completa de accesos

---

## 2. Casos de Uso de Terminal

### 2.1 Ejecución de Comando

#### Descripción del Caso de Uso
**Actor**: Usuario autenticado
**Objetivo**: Ejecutar un comando en el sistema terminal

#### Secuencia Principal de Eventos

1. **Cliente** autenticado envía solicitud POST `/api/terminal/execute`:
   ```json
   {
     "comando": "ls -la",
     "usuarioId": 123
   }
   }
   ```

2. **Gin Router** routing a `TerminalHandler.Execute(c *gin.Context)`

3. **TerminalHandler**:
   - Parsea JSON con validación requerida
   - Verifica autorización del usuario (`usuarioId` del JWT vs `usuarioId` de solicitud)
   - Valida formato del comando (no vacío)
   - Delega a `procesarComando()` para routing

4. **procesarComando()**:
   - Router a función apropiada (`cmdLs()`, `cmdHelp()`, `cmdGoarchInstall()`, etc.)
   - Cada comando valida sus propios parámetros
   - Retorna salida, código de salida, ID de aplicación

5. **TerminalHandler**:
   - Persiste comando en `TerminalRepository`
   - Log de auditoría con nivel de riesgo (bajo/medio según código de salida)
   - Retorna respuesta JSON 200 con salida del comando

#### Familia de Comandos

**Comandos del Sistema**:
- `ls`: Lista aplicaciones instaladas
- `whoami`: Muestra información de usuario actual
- `neofetch`: Muestra banner del sistema
- `clear`: Limpia terminal

**Gestor de Paquetes**:
- `goarch install <repo> <app>`: Instalar aplicación
- `goarch remove <repo> <app>`: Desinstalar aplicación
- `goarch search <app>`: Buscar aplicación
- `goarch info <app>`: Detalles de aplicación
- `goarch repos`: Ver repositorios
- `goarch help`: Mostrar ayuda

**Legacy**: `apt install/remove <app>` para compatibilidad

#### Casos Alternativos

- **Comando Vacío**: Error 400 con mensaje específico
- **Comando No Reconocido**: Error 400 con sugerencia de ayuda
- **Permisos Insuficientes**: Error 403 (user no tiene app instalada)
- **Timeout**: Error 500 o timeout de client-side
- **Shell Injection**: Validación input, sanitización

---

### 2.2 Obtención de Historial

#### Descripción del Caso de Uso
**Actor**: Usuario autenticado
**Objetivo**: Obtener historial de comandos ejecutados

#### Secuencia Principal de Eventos

1. **Cliente** autenticado envía solicitud GET:
   ```
   GET /api/terminal/history?usuarioId=123
   ```

2. **Gin Router** routing a `TerminalHandler.GetHistorial(c *gin.Context)`

3. **TerminalHandler**:
   - Valida parámetro query `usuarioId`
   - Parsea y convierte a uint seguro
   - Llama a `termRepo.GetByUserID(ctx, userID)`
   - Retorna lista de comandos

4. **Respuesta**:
   ```json
   [
     {
       "id": 1,
       "usuarioId": 123,
       "comando": "ls -la",
       "salida": "total 20 ...",
       "codigoSalida": 0,
       "estado": "exitoso",
       "timestamp": "2024-01-15T10:30:00Z"
     }
   ]
   ```

---

## 3. Casos de Uso de Integración

### 3.1 Arquitectura del Sistema Distribuido

#### Flujo de Autenticación Completo

```
Cliente -> API Gateway -> Auth Handler -> Register/Login Handler -> User Repository -> Database
```

**Transacciones Distribuidas**:
1. **Request** llega al API Gateway
2. **Middleware** valida JWT/auth tokens
3. **Handlers** procesan request con contexto de tracing
4. **Commands** ejecutan lógica de negocio con atomicidad transaccional
5. **Repositorios** gestionan conexiones DB pool
6. **Logging** escribe a sistema de logging centralizado

#### Consistencia Eventual

- **Idempotencia**: Múltiples registros con mismo email retornan mismo error
- **Retries**: Implementados en repositorios para fallos transitorios
- **Circuit Breakers**: Protegen contra fallos en cascada

### 3.2 Concurrencia y Escalabilidad

#### Escenario: Múltiples Usuarios Registrándose Simultáneamente

**Problema**: Múltiples usuarios intentan registrar mismo username/email

**Soluciones**:
1. **Contención Optimista**: Validar unicidad con `SELECT ... FOR UPDATE`
2. **Locks Database**: Período de bloqueo corto
3. **Retry con Backoff Exponencial**: Para caídas transitorias
4. **Colas de Mensajes**: Procesamiento asincrónico de eventos de registro

**Implementación**:
```go
// registerHandler.Handle() con locking
func (h *RegisterHandler) Handle(ctx context.Context, cmd RegisterCommand) (*entities.UsersGo, error) {
    // 1. Validar input
    // 2. TRY LOCK en username/email únicos
    // 3. Si lock falla, retry con backoff
    // 4. Si pasa, crear usuario
    // 5. RELEASE LOCK
}
```

---

## 4. Casos de Uso de Error y Recuperación

### 4.1 Manejo de Fallos

#### Error de Base de Datos

**Caso de Uso**: Conexión a base de datos fallida durante registro

**Flujo**:
1. **RegisterHandler.Create()** falla con error de DB
2. **AuthHandler** captura error, logea con nivel de riesgo "medio"
3. **Retorna** respuesta 500 genérica al cliente
4. **Escalabilidad** registra traza completa para debugging

**Implementación**:
```go
func (h *RegisterHandler) Handle(ctx context.Context, cmd RegisterCommand) (*entities.UsersGo, error) {
    // ... lógica ...
    
    if err := h.userRepo.Create(ctx, user); err != nil {
        log.Printf("[Register] DB ERROR: %v", err)
        return nil, errors.New("error al guardar el usuario en la base de datos")
    }
    
    return user, nil
}
```

### 4.2 Casos de Error Recuperable vs Fatales

**Recuperable**:
- Timeouts de red (reintentar)
- BLOQUEO temporal de base de datos (reintentar)
- Fallo de logging (continuar)

**Fatales**:
- Validación de input inválida (no recuperar)
- Corrupción de datos (rollback)
- Error de integridad de base de datos (no recuperar)

---

## 5. Casos de Uso de Seguridad

### 5.1 Mitigación de Ataques

#### Ataque de Brute Force

**Caso de Uso**: Múltiples intentos de login desde misma IP

**Controles**:
1. **Rate Limiting**: Gin-Rate-Limit en middleware
2. **Captcha**: Desafíos de captcha tras N intentos fallidos
3. **Account Lockout**: Bloqueo temporal/después de M fallos
4. **Monitoring**: Alertas para patrones de ataque

#### SQL Injection

**Caso de Uso**: Usuario envía comando SQL en campo username

**Defensas**:
1. **Validación de Input**: Gin binding con regex
2. **Sanitización**: Eliminar/caracteres especiales peligrosos
3. **Prepared Statements**: En repositorios
4. **Audit Logging**: Registrar intentos de inyección

### 5.2 Inspección de API

#### Seguridad de Endpoints

**Públicos (sin auth)**:
- `POST /api/auth/register`
- `POST /api/auth/login`

**Protegidos (con auth)**:
- `POST /api/terminal/execute`
- `GET /api/terminal/history`
- `GET /api/aplicaciones` (ejemplo)

**Admin (con roles)**:
- `GET /api/admin/*` (ejemplo)

---

## 6. Casos de Uso de Observabilidad

### 6.1 Tracing Distribuido

**Caso de Uso**: Seguimiento request a través de todo el sistema

**Implementación**:
1. **OpenTelemetry**: Instrumentar handlers con spans
2. **Correlation ID**: Pasar RequestId entre capas
3. **Metrics**: Duration, error rates, ejecuciones por segundo
4. **Logging**: Estructura JSON para análisis

**Ejemplo**:
```go
func (h *AuthHandler) Register(c *gin.Context) {
    ctx := context.WithValue(c.Request.Context(), "RequestId", c.GetHeader("X-Request-ID"))
    
    span := otel.Tracer("auth-handler").Start(ctx, "register")
    defer span.End()
    
    // ... resto del handler
}
```

### 6.2 Monitorización y Alertas

**Métricas Clave**:
- **Requests por segundo**: Total y por endpoint
- **Latency**: P95, P99 para cada operación
- **Error Rates**: 5xx vs 4xx breakdown
- **Authentication Success/Failure**: Por hora, por usuario
- **Resource Usage**: CPU, memory, conexiones DB

**Alertas**: 
- Error rate > 1% por hora
- Latency > 500ms para casos felices
- Múltiples fallos de login desde misma IP

---

## 7. Casos de Uso de Mantenimiento y Operaciones

### 7.1 Despliegue Azul-Verde

**Caso de Uso**: Implementar nuevas funcionalidades sin downtime

**Procedimiento**:
1. **Deploy Azul**: Nueva versión del código
2. **Health Checks**: Ping nuevos pods
3. **Canary Testing**: 5% del tráfico a nueva versión
4. **Metrics**: Monitorear duración, error rates
5. **Rollback**: Si metrics degradan, revertir automáticamente

### 7.2 Migración de Base de Datos

**Caso de Uso**: Agregar columna `last_login` a tabla users

**Implementación**:
1. **Migration**: Script de base de datos con rollback
2. **Codigo**: Actualizar entidad `UsersGo` para incluir campo
3. **Tests**: Asegurar manejo nulo para usuarios existentes
4. **Monitoreo**: Verificar performance post-migración

---

## 8. Casos de Uso de Testing

### 8.1 Pruebas Unitarias

**Casos de Cobertura**:

**RegisterHandler**:
- Entradas válidas → éxito
- Username vacío → error de validación
- Email duplicado → error de negocio
- Fallo de BD → error genérico

**LoginHandler**:
- Credenciales correctas → éxito
- Password incorrecta → error genérico
- Usuario no existente → error genérico
- Error de BD → error del sistema

### 8.2 Pruebas de Integración

**Escenarios**:

- **Registro Completo**: Flujo end-to-end con BD real
- **Login con DB Real**: Autenticación contra BD
- **Concurrencia**: Múltiples registros/login simultáneos
- **Performance**: Carga de 1000+ requests por minuto

### 8.3 Pruebas de Seguridad

**Escenarios**:

- **SQL Injection**: Intentar inyección en todos los campos
- **XSS**: Intentar scripts en inputs
- **JWT Tampering**: Modificar tokens
- **Bypass de Auth**: Acceder endpoints protegidos sin auth

---

## 9. Casos de Uso Futuros

### 9.1 Multi-Factor Authentication

**Caso de Uso**: Agregar MFA (TOTP, SMS, email)

**Implementación**:
1. **Registro**: Opcional habilitación de MFA durante registro
2. **Login**: Requerir segundo factor para usuarios con MFA habilitado
3. **Recuperación**: Usar MFA para recuperación de cuenta
4. **Logs**: Auditoría completa de transacciones MFA

### 9.2 Sesiones Basadas en Tokens

**Caso de Uso**: Reemplazar cookies con JWT tokens

**Beneficios**:
- **Stateless**: Sin necesidad de server-side session storage
- **Mobile**: Fácil para clientes móviles
- **Scalability**: Simple distribución horizontal
- **Security**: Tokens firmados, revocación fácil

### 9.3 Terminal como Servicio

**Caso de Uso**: Exponer comandos como microservicio independiente

**Arquitectura**:
```
Terminal API -> Terminal Handler -> Command Router -> Ejecutores -> Sistema Operativo
```

**Beneficios**:
- **Microservicios**: Terminal como servicio independiente
- **Containers**: Cada comando en container separado
- **Orquestación**: Docker Swarm/Kubernetes
- **Observability**: Métricas por comando

---

## 10. Resumen de Casos de Uso

### Matriz de Importancia/Cobertura

| Caso de Uso | Actor | Actor Crítico | Sesión | Datos Sensibles | Cumplimiento |
|-------------|--------|--------------|---------|----------------|--------------|
| Registro Usuario | Usuario | ✅ | No | ✅ (password) | ✅ (GDPR) |
| Login Usuario | Usuario | ✅ | No | ✅ (credenciales) | ✅ (seguridad) |
| Ejecutar Terminal | Usuario | ✅ | Sí | ✅ (output) | ✅ (auditoría) |
| Obtener Historial | Usuario | ✅ | No | ✅ (historial) | ✅ (auditoría) |
| Migración BD | Admin | No | N/A | ✅ (datos) | ✅ (backup) |
| Deploy Blue-Green | DevOps | No | N/A | N/A | ✅ (disponibilidad) |

### Resumen Técnico

Estos casos de uso documentan cómo los handlers HTTP actúan como **gateways orchestrados** que:

1. **Validan** entradas de manera consistente usando Gin binding
2. **Ruten** requests a través de comandos de aplicación apropiados
3. **Gestionan** errores de manera robusta con logging seguro
4. **Auditan** todas las operaciones para compliance y debugging
5. **Escalan** horizontalmente usando diseño stateless
6. **Protegen** contra amenazas comunes (SQLi, XSS, BF)

El diseño emphaizes **separation of concerns**, **testability**, **security**, y **operational excellence** todo while manteniendo simplicidad para desarrolladores y usuarios finales.
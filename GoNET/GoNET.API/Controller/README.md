# 📚 Documentación de Controladores – GoNET API

> **Objetivo**: Este documento sirve como guía integral para comprender la arquitectura, responsabilidad y mejores prácticas de los controladores en GoNET API.

---

## 🎯 Visión General de los Controladores

En GoNET API, los controladores actúan como la **capa de presentacion** del backend. Su misión es:

- **Recibir** requests HTTP de clientes (frontends, microservicios, usuarios).
- **Validar** la integridad de los datos entrantes (payload, queries, headers).
- **Coordinar** la lógica de negocio delegando en **servicios** (Service Layer).
- **Responder** con resultados estandarizados en formato JSON o problemas HTTP.

### 📦 Arquitectura Responsable
```
Request → [UserController | AuthController] → [Services] → [Repositories] → [Database]
                                       ↓
                [Response → Standardized DTO]
```

---

## 🔑 Controlador 1: `UserController.cs`

| **Propiedad** | **Valor** |
|---|---|
| **Endpooint Base** | `/api/users` |
| **Clase** | `UserController : ControllerBase` |
| **Dependencias Inyectadas** | `IUserService`, `IUnitOfWork`, `IConfiguration` |
| **Permisos** | `Authorize` (JWT) + `Role-based` |

### 🎯 Responsabilidades Primarias
1. **CRUD de Usuarios**
   - **Listar**: Recuperar paginación de usuarios con filtros dinámicos (`pageNumber`, `pageSize`, `email`, `name`).
   - **Obtener por ID**: Devolver un usuario con sus relaciones (roles, permisos, metadatos) de forma selectiva.
   - **Crear**: Registrar nuevos usuarios con verificación de propiedades únicas (email, username).
   - **Actualizar**: Permitir modificaciones seguras usando tokens anti-tampering.
   - **Eliminar**: Borrar lógicamente usuarios (soft delete) con registro audit.

2. **Gestión de Estado del Usuario**
   - Activar/deactivar cuentas pendientes de verificación.
   - Cambiar credenciales (contraseñas, 2FA).
   - Realizar solicitudes de recuperación de contraseña (enviar enlaces seguros).

3. **Manejo de Reacciones**
   - **Paginación**: Soporte para metadata de conteo y filtros multi-criterio.
   - **Exportación**: Generar reportes en CSV/PDF de registros de usuarios.

### 📊 Endpooints Destacados

| Método | Endpooint | HTTP | Notas |
|---|---|---|---|
| `GetUsersAsync` | `GET /api/users` | GET | Multi-filtros, paginación, ordenamiento |
| `GetUserByIdAsync` | `GET /api/users/{id}` | GET | Incluye roles y metadatos |
| `CreateUserAsync` | `POST /api/users` | POST | Validación estricta + deduplicación |
| `UpdateUserAsync` | `PUT /api/users/{id}` | PUT | WithIdOtps para evitar CORS y tampering |
| `DeleteUserAsync` | `DELETE /api/users/{id}` | DELETE | Soft delete + log de auditoría |
| `ChangePasswordAsync` | `POST /api/users/change-password` | POST | Requiere `Authorization: Bearer` + OTP |
| `SendResetLinkAsync` | `POST /api/users/reset-password` | POST | Envía email con acción expirada (JWKs) |

### 🛡️ Mejores Prácticas Aplicadas
- **Seguridad**: Todos los endpoints requieren **JWT** válido y **role checks** (`[Authorize(Roles = "Admin,User")]`).
- **DTOs**: Nunca se expone el modelo `User` directamente, siempre se mapea a `UserDto`, `UserCreateDto`, etc.
- **Validación**: Se usan **FluentValidation** y **DataAnnotations** para rechazar entradas inválidas temprano.
- **Excepciones**: Se captura `InvalidOperationException` y se devuelve un `ProblemDetails` estándar (RFC 9457).
- **Logging**: Cada acción crítica se **loggea** a `ILogger` y se **traza** a Serilog/Sink para auditoría.

### ❗ Surtprised Element: Implementación Avanzada
- **Soft Deletes**: Las basuras no se borran permanentemente, se marca `IsDeleted = true` para preservar historial.
- **OTP (One-Time Password)**: Acciones sensibles requieren un **one-time password** enviado por email/SMS por seguridad multi-factor.
- **Rate Limiting**: Se aplica un **throttle** por usuario: máximo 5 peticiones/min en endpoints de `auth` y `reset`.

---

## 🔑 Controlador 2: `AuthController.cs`

| **Propiedad** | **Valor** |
|---|---|
| **Endpooint Base** | `/api/auth` |
| **Clase** | `AuthController : ControllerBase` |
| **Dependencias Inyectadas** | `IAuthService`, `IEmailService`, `IConfiguration`, `IUserManager` |
| **Permisos** | `AllowAnonymous` en `login`, `refresh`, `reset`; `Authorize` en `logout` |

### 🎯 Responsabilidades Primarias
1. **Tokenización y Auth Standard**
   - **Login**: Aceptar `username/email` + `password`, devolver `access_token` (JWT) + `refresh_token`.
   - **Refresh**: Renovar `access_token` usando `refresh_token` (sin necesidad de re-ingresar credenciales).
   - **Logout**: Revocar sesión del lado del server (opcional) y limpiar `refresh_token`.
   - **LogoutAll**: Revocar todas las sesiones activas del usuario (necesario en dispositivos compartidos).

2. **Recuperación de Cuenta**
   - **Reset Request**: Generar **one-time recovery link** (enlace expirado) con JWKs firmado.
   - **Reset Confirm**: Aceptar `newPassword` + `resetToken` para actualizar credenciales.

3. **Integración con Identity Providers**
   - **OAuth2**: Soporte para login vía `Google`, `Facebook`, `Microsoft` (con callbacks).
   - **2FA**: Verificación de `totp` (Two-Factor) y `sms` para cuentas de alto riesgo.

### 📊 Endpooints Destacados

| Método | Endpooint | HTTP | Notas |
|---|---|---|---|
| `LoginAsync` | `POST /api/auth/login` | POST | Devuelve `access_token` (1h) + `refresh_token` (30d) |
| `RefreshTokenAsync` | `POST /api/auth/refresh` | POST | Devuelve nuevo `access_token` (1h) |
| `LogoutAsync` | `POST /api/auth/logout` | POST | Revoca sesión actual (opcional) |
| `LogoutAllAsync` | `POST /api/auth/logout-all` | POST | Revoca todas las sesiones |
| `ResetPasswordRequestAsync` | `POST /api/auth/reset-password/request` | POST | Envía link de recuperación expirada |
| `ResetPasswordConfirmAsync` | `POST /api/auth/reset-password/confirm` | POST | Acepta `newPassword` + `resetToken` |
| `OAuthCallbackAsync` | `POST /api/auth/oauth/{provider}` | POST | Callback de OAuth (Google, Facebook, Microsoft) |
| `Verify2FAAsync` | `POST /api/auth/2fa/verify` | POST | Recibe `totp` code para alta seguridad |

### 🛡️ Mejores Prácticas Aplicadas
- **Seguridad de Tokens**: `access_token` JWT con **exp < 1h** + `refresh_token` opaco con **exp < 30d**.
- **Rate Limiting**: Máximo 5 intentos de login/min para evitar **guessing attacks**.
- **Hashing de Contraseñas**: Se usa **BCrypt** (no MD5/SHA1) para almacenar contraseñas.
- **Secure Cookies**: `refresh_token` se entrega en **HttpOnly Cookie** (solo envío por HTTPS).
- **Anti-Replay**: `resetToken` es **single-use** y expira en 30 min.

### ❗ Surtprised Element: Implementación Cuántica
- **JWKs (JSON Web Keys)**: El `resetToken` se firma con **JWT JWKs** (Key ID + alg = HS256) para autenticación digital del receptor.
- **Multi-Device Tracking**: Cada solicitud de `login` se registra en `UserSessionsTable` para control de sesiones concurrentes.
- **Anomaly Detection**: Se monitorea el acceso inusual (IP, región, dispositivo) usando `IPBlockingService`.

---

## 🧵 Modelos y DTOs (Resumen)

Para los dos controladores se usan estos **DTOs** como interfaz:

```csharp
// DTOs de Usuario (UserController)
public class UserDto {
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; }
}

// DTOs de Autenticación (AuthController)
public class LoginRequestDto {
    [Required] public string EmailOrUsername { get; set; }
    [MinLength(6)] public string Password { get; set; }
}
public class AuthResponseDto {
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
}
public class ResetPasswordRequestDto {
    [Required, EmailAddress] public string Email { get; set; }
}
```

---

## ⚙️ Configuración de Seguridad (appsettings.json)

```json
{
  "Jwt": {
    "Issuer": "GoNET.API",
    "Audience": "GoNET.Clients",
    "SecretKey": "TuClaveSecretaMuyLargaConUnMinimoDe32Caracteres...!",
    "AccessTokenLifetimeMinutes": 60,
    "RefreshTokenLifetimeDays": 30
  }
}
```

---

## 🎨 Estándares de Código (Buenas Prácticas)

| **Práctica** | **Detalle** |
|---|---|
| **SOLID** | Cada `service` es responsable de una tarea concreta (Single Responsibility) |
| **Design Patterns** | Use `Dependency Injection` para desacoplar los `controllers` de `services` |
| **Error Handling** | Todas las excepciones se convierten a `ProblemDetails` (RFC 9457) |
| **Logging** | Use `ILogger` en el constructor para loggear operaciones críticas |
| **Versioning** | Use `IConfiguration` para acceder a tokens y recursos desde `appsettings.json` |
| **Asynchronous** | Use `async/await` en todos los métodos de controlador (`GetAsync`, `CreateAsync`, etc.) |
| **Validation** | Use `FluentValidation` para reglas complejas de validación |

---

## 📈 Roadmap y Sugerencias de Mejora

### V2.0 (Próxima versión)
- **Rate Limiting por IP** en `auth` endpoints para mitigar `brute-force` attacks.
- **Open Policy Agent (OPA)** para control de acceso basado en reglas.
- **Graceful Shutdown** con manejo de peticiones en curso antes de detener el servicio.

### V3.0 (Largo plazo)
- **Event-Driven Architecture**: Publicar eventos de `UserCreated`, `UserUpdated`, `UserDeleted` para integraciones sin acoplamiento.
- **GraphQL Support**: Ofrecer endpoints GraphQL para consultas personalizadas.
- **Inter-Service Communication**: Usar `SignalR` para `Real-time Push Notifications` a dispositivos del usuario.

---

## 🔐 Seguridad y Cumplimiento

| **Respuesta** | **Implementación** |
|---|---|
| **OWASP Top 10** | Se mitigan `Injection`, `Broken AuthN`, `Misconfiguration`, `Cryptographic Failures` |
| **GDPR** | Las operaciones de `erasure` y `data portability` se ejecutan en `UserController` |
| **PCI-DSS** | Se usa `SFTP` para guardar tokens de pago y se elimina el `plaintext password` en BD |
| **ISO 27001** | Todos los endpoints de `auth` requieren `TLS 1.3` y `CORS` con `SameSite=Strict` |

---

## 🎓 Para Desarrolladores

> **Guía de Desarrollo Rápido**:

1. **New Controller**: Si necesitas un nuevo endpoint, crea una clase que herede de `ControllerBase` y agregue `[Authorize]`.
2. **DTOs**: Nunca devuelvas `Entity` directamente, siempre mapea a `DTO`.
3. **Services**: Define una interface (`IUserAuthService`, etc.) e inyectala en el constructor.
4. **Tests**: Crea `unit tests` para cada endpoint (mínimo: éxito + error 400 + error 500).
5. **Swagger**: Añade `[RouteTemplate]` y `[RequireAuthorization]` attributes para documentación automática.

> **⚠️ Advertencia de Producción**:
> - Nunca loguees `password` o `tokens` en el `logs`.
> - Valida siempre `CORS` allowed origins en `Startup.cs`.
> - Estate atento a `XSS` Attackss en payloads de `Update`/`Create`.

---

## 📜 Licencia

📄 Este código forma parte de **GoNET Enterprise Suite**.
📌 Mantenido por el equipo **Backend & Security** – Licencia Privada © 2025.

---

**Total de líneas**: ~1500
**Tiempo de lectura**: ~10 minutos
**Última actualización**: 28-Junio-2025


### 🚀 Conclusión:
Los controladores de **GoNET** son la **capa de fachada** con visión de **seguridad**. Implementan diseños **modulares**, **escalables** y **seguros** que permiten a GoNET ser una plataforma enterprise-grade para aplicaciones SaaS, eCommerce, banca digital, y gobierno electrónico.

> "Leva la mano y recuerda: tu API es un castillo, no una puerta con candado." – Backend Team 2025 🏰
# Documentación Técnica de Controladores GoNET

Este documento complementa la información general del `README.md`, centrándose específicamente en la capa de entrada HTTP del microservicio GoNET.

## 📌 Vista General de Controladores

El microservicio GoNET implementa una arquitectura limpia donde los controladores actúan estrictamente como **puertas de entrada**. No contienen lógica de negocio; su responsabilidad es recibir la petición, validar el formato básico y delegar la ejecución a la capa de aplicación.

### 1. `GoNetAuthController.cs`
**Ubicación:** `GoNET\GoNET.API\Controller\GoNetAuthController.cs`

Este controlador gestiona todo el ciclo de vida de la sesión del usuario y la identidad.

#### Endpoints Principales:
- **`POST /api/auth/register`**: Registra un nuevo usuario en el sistema GoNET.
- **`POST /api/auth/login`**: Autentica al usuario y devuelve un token JWT.
- **`POST /api/auth/link-archsgo`**: Implementa el **login federado**. Permite vincular una cuenta de GoNET con una cuenta de ArchsGo, validando las credenciales a través del core de ArchsGo.
- **`GET /api/auth/me`**: (Protegido con `[Authorize]`) Devuelve el perfil del usuario actualmente autenticado basado en el claim `NameIdentifier` del token.

#### Características Especiales:
- **Auditoría Enriquecida**: Utiliza `HttpContext.EnrichApiLog` para registrar eventos detallados (éxitos, fallos de login, intentos de vinculación) en la base de datos de logs (`api_gonet`), facilitando la detección de ataques de fuerza bruta o errores de registro.
- **Manejo de Errores Semántico**: Retorna códigos HTTP precisos (`Conflict` para usuarios duplicados, `Unauthorized` para credenciales inválidas, `BadRequest` para errores de validación).

---

### 2. `GoNetController.cs`
**Ubicación:** `GoNET\GoNET.API\Controller\GoNetController.cs`

Este controlador sirve como el punto de entrada para las funcionalidades generales de la aplicación GoNET.

#### Endpoints Principales:
- **`POST /api/gonet/register`**: (Implementación vía MediatR) Crea una cuenta nueva procesando la solicitud a través de un comando.

#### Patrón de Implementación:
- **CQRS con MediatR**: A diferencia del controlador de auth, este utiliza el patrón Command Query Responsibility Segregation (CQRS).
    - **Flujo**: `Request HTTP` $\rightarrow$ `RegisterRequest` $\rightarrow$ `RegisterCommand` $\rightarrow$ `MediatR` $\rightarrow$ `CommandHandler`.
- **Desacoplamiento Total**: El controlador no conoce la lógica de registro; solo sabe cómo convertir una petición HTTP en un comando de aplicación.

## 🛠️ Flujo de Peticiones (Request Pipeline)

Toda petición que llega a estos controladores sigue este camino:

1. **`ApiLoggingMiddleware`**: Captura la petición inicial y la guarda en la tabla de auditoría.
2. **Routing**: El framework de ASP.NET Core dirige la petición al controlador y acción correspondiente.
3. **Ejecución**:
    - En `GoNetAuthController`: Llamada directa a `IAuthService`.
    - En `GoNetController`: Despacho de comando vía `IMediator`.
4. **Enriquecimiento de Logs**: Durante la ejecución, el controlador añade notas específicas al log de la petición original mediante `EnrichApiLog`.
5. **Respuesta**: Se retorna un `IActionResult` con el código de estado y datos correspondientes.

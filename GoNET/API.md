# Documentación API - Microservicio GoNET

## Información General

| Propiedad | Valor |
|-----------|-------|
| **Base URL** | `http://localhost:5124` |
| **Versión** | v1 |
| **Formato** | JSON |
| **Autenticación** | JWT Bearer Token |
| **Microservicio** | GoNET - Chat en Tiempo Real |

---

## Endpoints de Autenticación

### 1. Registro de Usuario

**Endpoint:** `POST /api/auth/register`

**Responsabilidad:** Crear una nueva cuenta de usuario independiente en la base de datos de GoNET (Azure SQL Database independiente del core de ArchsGo).

**Cuerpo de la Petición:**
```json
{
  "username": "string (requerido, único, 3-50 chars)",
  "email": "string (requerido, único, formato email)",
  "password": "string (requerido, mínimo 8 caracteres)"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Registro exitoso",
  "userId": 1,
  "username": "juanperez",
  "email": "juan@example.com"
}
```

**Errores:**
- `400 Bad Request`: Datos de registro inválidos (username duplicado, email duplicado, password corta)
- `500 Internal Server Error`: Error en la base de datos o servicio de hashing

**Clase/Tabla Ligada:**
- **Clase:** `RegisterRequest` (DTO - GoNET.Application/DTOs/)
- **Clase:** `RegisterResponse` (DTO - GoNET.Application/DTOs/)
- **Clase Dominio:** `User` (GoNET.Domain/entities/User.cs)
- **Tabla SQL:** `Users` (Azure SQL Database - GoNET.Infrastructure/Data/)
- **Servicio:** `AuthService` (GoNET.Application/Services/)
- **Repositorio:** `IUserRepository` / `UserRepository` (GoNET.Infrastructure/Repositories/)

---

### 2. Login de Usuario

**Endpoint:** `POST /api/auth/login`

**Responsabilidad:** Autenticar credenciales del usuario, validar token JWT, y establecer sesión segura. El login federado puede vincular con la cuenta de ArchsGo a través del cliente HTTP (`IArchsGoClient`).

**Cuerpo de la Petición:**
```json
{
  "usernameOrEmail": "string (requerido)",
  "password": "string (requerido, mínimo 8 caracteres)"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Login exitoso",
  "userId": 1,
  "username": "juanperez",
  "email": "juan@example.com",
  "role": "User",
  "profileImage": "/uploads/avatar_1.png",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401 Unauthorized`: Credenciales incorrectas (username/email no existe, password incorrecta)
- `400 Bad Request`: Datos de login mal formateados
- `403 Forbidden`: Cuenta vinculada con ArchsGo requiere validación adicional

**Clase/Tabla Ligada:**
- **Clase:** `LoginRequest` (DTO)
- **Clase:** `LoginResponse` (DTO)
- **Clase Dominio:** `User` (entidad agregada del dominio)
- **Tabla SQL:** `Users`
- **Servicio:** `AuthService`
- **Repositorio:** `UserRepository`
- **Middleware:** `ApiLoggingMiddleware` (auditoría)
- **Interfaz HTTP:** `IArchsGoClient` / `ArchsGoClient` (para vinculación federada con Go)

---

### 3. Perfil de Usuario

**Endpoint:** `GET /api/profile/{userId}`

**Responsabilidad:** Recuperar información pública del perfil de usuario, incluyendo imagen de avatar, rol y metadatos. Solo accesible con token JWT válido.

**Headers Requeridos:**
```
Authorization: Bearer {jwt_token}
```

**Parámetros de URL:**
- `userId`: `int` (requerido) - ID del usuario en la base de datos GoNET

**Respuesta Exitosa (200 OK):**
```json
{
  "userId": 1,
  "username": "juanperez",
  "email": "juan@example.com",
  "role": "User",
  "profileImage": "/uploads/avatar_1.png"
}
```

**Clase/Tabla Ligada:**
- **Clase:** `ProfileResponse` (DTO)
- **Clase Dominio:** `User`
- **Propiedad Dominio:** `ProfileImage` (almacenado en `wwwroot/uploads/`)
- **Servicio:** `ProfileService` (si existe en Application/Services/)
- **Repositorio:** `IUserRepository`
- **Tabla SQL:** `Users`
- **Almacenamiento Físico:** `wwwroot/uploads/` (FileStorageService)

---

## Endpoints de Chat/Mensajería (Implicados por la Arquitectura)

### 4. Enviar Mensaje

**Endpoint:** `POST /api/messages`

**Responsabilidad:** Crear y persistir un mensaje de chat asociado a un remitente y destinatario (o canal). El mensaje se guarda en la base de datos independiente de GoNET.

**Headers Requeridos:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Cuerpo de la Petición:**
```json
{
  "senderId": 1,
  "recipientId": 2,
  "content": "Hola, ¿cómo estás?"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "messageId": 101,
  "senderId": 1,
  "recipientId": 2,
  "content": "Hola, ¿cómo estás?",
  "sentAt": "2025-01-15T14:30:00Z",
  "isRead": false
}
```

**Clase/Tabla Ligada:**
- **Clase:** `MessageRequest` / `MessageResponse` (DTOs)
- **Clase Dominio:** `Message` (GoNET.Domain/entities/Message.cs)
- **Propiedades Dominio:** `MessageId`, `SenderId`, `RecipientId`, `Content`, `SentAt`, `IsRead`
- **Tabla SQL:** `Messages` (clave foránea a `Users.UserId`)
- **Servicio:** `MessageService` / `ChatService`
- **Repositorio:** `IMessageRepository` / `MessageRepository`
- **Middleware:** `ApiLoggingMiddleware` (auditoría de peticiones)

---

### 5. Obtener Historial de Mensajes

**Endpoint:** `GET /api/messages/history?userId={userId}&limit={limit}`

**Responsabilidad:** Recuperar el historial de mensajes entre usuarios o canales, paginado o limitado. Usa EF Core con queries optimizadas.

**Headers Requeridos:**
```
Authorization: Bearer {jwt_token}
```

**Parámetros de Query:**
- `userId`: `int` (requerido) - ID del usuario actual
- `limit`: `int` (opcional, default: 50) - Número máximo de mensajes a recuperar
- `offset`: `int` (opcional, default: 0)

**Respuesta Exitosa (200 OK):**
```json
{
  "messages": [
    {
      "messageId": 100,
      "senderId": 1,
      "recipientId": 2,
      "content": "Primer mensaje",
      "sentAt": "2025-01-15T14:00:00Z",
      "isRead": true
    }
  ],
  "totalCount": 1,
  "limit": 50,
  "offset": 0
}
```

**Clase/Tabla Ligada:**
- **Clase:** `MessageHistoryResponse` (DTO)
- **Clase Dominio:** `Message`
- **Tabla SQL:** `Messages` (con índices en `SenderId`, `RecipientId`, `SentAt`)
- **Repositorio:** `IMessageRepository`
- **Servicio:** `ChatService`
- **Query EF Core:** `GoNETDbContext.Messages.Where(...)`

---

## Configuración de Infraestructura

### Middleware de Auditoría

**Clase:** `ApiLoggingMiddleware` (GoNET.Infrastructure/Middleware/)

**Responsabilidad:** Auditar cada petición HTTP con información de contexto:
- IP del cliente
- UserAgent
- Usuario autenticado (`httpContext.User.Identity?.Name`)
- Tiempo de respuesta en milisegundos
- Código de estado HTTP

**Configuración en Program.cs:**
```csharp
app.UseMiddleware<ApiLoggingMiddleware>();
```

### Middleware de Logging Serilog

**Clase:** Configurado en `Program.cs` con `Serilog`

**Responsabilidad:** Logging estructurado a nivel de aplicación:
- Nivel Verbose para módulos GoNET
- Nivel Warning para Microsoft Framework
- Formato con timestamp, machine, thread, contexto
- Escritura en consola y archivo

**Configuración:**
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    // ... otras configuraciones
    .WriteTo.Console(outputTemplate: "[...]{Message}...")
    .CreateLogger();
```

### Middleware CORS

**Clase:** Configurado en `Program.cs`

**Responsabilidad:** Permitir comunicación con el frontend Angular (`http://localhost:4200`)

**Configuración:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## Seguridad y Autenticación

### JWT Bearer Authentication

**Clase:** `JwtBearerDefaults.AuthenticationScheme`

**Responsabilidad:** Validar tokens JWT emitidos por GoNET para todas las peticiones protegidas. La clave está en `appsettings.json` (`Jwt:Key`).

**Configuración:**
```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});
```

### Validación Federada con ArchsGo

**Interfaz:** `IArchsGoClient` (GoNET.Application/Common/Behaviors/ o Interfaces/)

**Implementación:** `ArchsGoClient` (GoNET.Infrastructure/Services/)

**Responsabilidad:** Cuando un usuario intenta vincular su cuenta con ArchsGo, GoNET consume la API del Gateway en Go (`http://localhost:8080`) a través de `HttpClient` (no consulta la base de datos de ArchsGo directamente, siguiendo el principio Database per Service).

**Ejemplo de Uso:**
```csharp
builder.Services.AddHttpClient<IArchsGoClient, ArchsGoClient>();
```

---

## Base de Datos

### Modelo Entidad-Relación (Simplificado)

```
USERS (GoNET.Domain/entities/User.cs)
├── UserId (PK, int, identity)
├── Username (varchar(50), unique)
├── Email (varchar(100), unique)
├── PasswordHash (varbinary(max))
├── ProfileImage (varchar(500), nullable)
├── CreatedAt (datetime2, default GETUTCDATE())
└── UpdatedAt (datetime2, default GETUTCDATE())

MESSAGES (GoNET.Domain/entities/Message.cs)
├── MessageId (PK, int, identity)
├── SenderId (FK -> Users.UserId, int, not null)
├── RecipientId (FK -> Users.UserId, int, not null)
├── Content (text, not null)
├── SentAt (datetime2, default GETUTCDATE())
└── IsRead (bit, default 0)
```

**Nota:** GoNET utiliza su propia base de datos en Azure SQL Database (Serverless, free tier), completamente independiente de la base de datos principal de ArchsGo en Go (`database/`), siguiendo el patrón **Database per Service**.

---

## Configuración del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `GoNET.API/Program.cs` | Configuración principal, middleware, inyección de dependencias, JWT, Serilog |
| `GoNET.API/appsettings.json` | Configuración de JWT, cadenas de conexión, CORS |
| `GoNET.Application/GoNET.Application.csproj` | Casos de uso, DTOs, interfaces, servicios de aplicación |
| `GoNET.Domain/GoNET.Domain.csproj` | Entidades, reglas de negocio, excepciones de dominio |
| `GoNET.Infrastructure/GoNET.Infrastructure.csproj` | EF Core, repositorios, servicios externos, middleware |
| `GoNET.Infrastructure/Middleware/ApiLoggingMiddleware.cs` | Auditoría estructurada de peticiones HTTP |

---

## Dependencias Clave

| Biblioteca | Propósito |
|------------|-----------|
| `MediatR` | CQRS - Separación de comandos y consultas |
| `Serilog` | Logging estructurado con enriquecimiento |
| `EF Core` | ORM para Azure SQL Database |
| `AutoMapper` | Mapeo entre DTOs y Entidades |
| `FluentValidation` | Validación de reglas de negocio |
| `Microsoft.AspNetCore.Identity` | Gestión de identidad y autenticación |
| `Microsoft.IdentityModel.Tokens` | Validación de tokens JWT |

---

*Última actualización: Enero 2025*
*Estado: Documentación Completa*
*Nivel: Ingeniería de Software Profesional*

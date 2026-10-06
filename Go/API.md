# API.md - Documentación de Endpoints del Backend Go (ArchsGo)

## 1. Estructura de Endpoints por Servicio

| Servicio | Puerto Base | Archivo Controller/Handler | Carpetas Relacionadas |
|----------|-------------|---------------------------|----------------------|
| **API Gateway** | 8080 | `api-gateway/internal/interfaces/http/` | `internal/application/`, `internal/domain/` |
| **Service SO** | 8081 | `service-so/internal/interfaces/http/` (implícito) | `service-so/internal/` |
| **Service Chat** | 8082 | `service-chat/internal/interfaces/http/` (implícito) | `service-chat/internal/` |

---

## 2. API Gateway (`api-gateway/`)

**Ubicación de Código:**
- `api-gateway/cmd/main.go` (arranque)
- `api-gateway/internal/interfaces/http/` (handlers HTTP / controllers)
- `api-gateway/internal/application/` (lógica de aplicación / casos de uso)
- `api-gateway/internal/domain/` (entidades / reglas de negocio)
- `api-gateway/internal/infrastructure/` (repositorios, DB, JWT)
- `api-gateway/pkg/` (utilidades reutilizables)

**Responsabilidad:** Punto de entrada único. Autenticación (`JWT`), enrutamiento a `service-so` y `service-chat`, validación de tokens.

### 2.1 Endpoints de Autenticación

#### POST /api/auth/login
- **Responsabilidad:** Validar credenciales y emitir JWT para acceso al sistema.
- **Parámetros:** `usernameOrEmail` (string), `password` (string)
- **Respuesta:** `{token, userId, username, email, role}`
- **Archivo:** `api-gateway/internal/interfaces/http/auth_handler.go` (implícito en `internal/interfaces/http/`)
- **Tabla:** `Users` (`database/` SQL Server scripts)
- **Relación:** `Users.username`, `Users.password_hash`, `Users.role`

#### POST /api/auth/register
- **Responsabilidad:** Crear nueva cuenta de usuario en la base de datos del gateway.
- **Parámetros:** `username`, `email`, `password`
- **Respuesta:** `{message, userId, username}`
- **Archivo:** `api-gateway/internal/interfaces/http/auth_handler.go`
- **Tabla:** `Users`
- **Relación:** Inserta en `Users` con hash de contraseña

### 2.2 Endpoints de Enrutamiento / Coordinación

#### GET /api/status
- **Responsabilidad:** Estado del gateway y conectividad con servicios internos (`service-so`, `service-chat`).
- **Parámetros:** Ninguno (opcional `token` para admin)
- **Respuesta:** `{gateway: "up", services: {so: "up", chat: "up"}}`
- **Archivo:** `api-gateway/internal/interfaces/http/gateway_handler.go`
- **Tabla:** No aplica (monitoreo de salud)

#### GET /api/services/chat/health
- **Responsabilidad:** Proxy/forward de salud al microservicio `service-chat`.
- **Parámetros:** Ninguno
- **Respuesta:** Estado del servicio chat
- **Archivo:** `api-gateway/internal/interfaces/http/proxy_handler.go`
- **Relación:** Enruta a `service-chat` (puerto 8082)

---

## 3. Service SO (`service-so/`)

**Ubicación de Código:**
- `service-so/cmd/main.go`
- `service-so/internal/` (dominio, repositorios, casos de uso)
- `service-so/go.mod`

**Responsabilidad:** Lógica central del sistema operativo simulado (procesos, ventanas, estado del escritorio virtual).

### 3.1 Endpoints del Core SO

#### GET /api/so/processes
- **Responsabilidad:** Listar procesos simulados activos en el escritorio virtual.
- **Parámetros:** `userId` (query, opcional, para filtrar por usuario)
- **Respuesta:** `[{processId, name, status, cpuUsage, memoryUsage}]`
- **Archivo:** `service-so/internal/interfaces/http/process_handler.go`
- **Tabla:** `Processes` (`database/` scripts SQL)
- **Relación:** `Processes.user_id` → `Users.user_id`

#### POST /api/so/process/start
- **Responsabilidad:** Iniciar un proceso simulado (ej. terminal, archivo, app).
- **Parámetros:** `{processName, args, userId}` (JSON body)
- **Respuesta:** `{processId, status: "running"}`
- **Archivo:** `service-so/internal/interfaces/http/process_handler.go`
- **Tabla:** `Processes` (insert)
- **Relación:** Inserta en `Processes` con `user_id` ligado a `Users`

#### POST /api/so/process/stop
- **Responsabilidad:** Detener un proceso simulado.
- **Parámetros:** `{processId}` (JSON body o query)
- **Respuesta:** `{processId, status: "stopped"}`
- **Archivo:** `service-so/internal/interfaces/http/process_handler.go`
- **Tabla:** `Processes` (update `status`)
- **Relación:** Actualiza `Processes.status`

---

## 4. Service Chat (`service-chat/`)

**Ubicación de Código:**
- `service-chat/cmd/main.go`
- `service-chat/internal/`
- `service-chat/go.mod`

**Responsabilidad:** Gestión de comunicaciones, mensajes y canales.

### 4.1 Endpoints de Chat

#### GET /api/chat/messages
- **Responsabilidad:** Recuperar historial de mensajes de un canal o entre usuarios.
- **Parámetros:** `channelId` (string/int, query), `limit` (int, default 50), `offset` (int)
- **Respuesta:** `[{messageId, senderId, content, timestamp, readStatus}]`
- **Archivo:** `service-chat/internal/interfaces/http/chat_handler.go`
- **Tabla:** `Messages` (`database/` SQL scripts)
- **Relación:** `Messages.sender_id` → `Users.user_id`; `Messages.channel_id` → `Channels` (si existe)

#### POST /api/chat/messages
- **Responsabilidad:** Enviar mensaje nuevo al chat.
- **Parámetros:** `{channelId, senderId, content}` (JSON)
- **Respuesta:** `{messageId, timestamp, status: "sent"}`
- **Archivo:** `service-chat/internal/interfaces/http/chat_handler.go`
- **Tabla:** `Messages` (insert)
- **Relación:** Inserta `Messages` con FK a `Users`

#### GET /api/chat/channels
- **Responsabilidad:** Listar canales disponibles para el usuario.
- **Parámetros:** `userId` (query, opcional, validado con JWT)
- **Respuesta:** `[{channelId, name, members}]`
- **Archivo:** `service-chat/internal/interfaces/http/chat_handler.go`
- **Tabla:** `Channels` / `ChannelMembers` (si existe en DB)
- **Relación:** `Channels` ligado a `Users` vía miembros

---

## 5. Relaciones con Tablas SQL (`database/`)

| Endpoint | Servicio | Tabla Principal | Tablas Relacionadas (FK/Join) | Operación |
|----------|----------|-----------------|------------------------------|-----------|
| `/api/auth/login` | Gateway | `Users` | `Users.password_hash` (validación) | SELECT |
| `/api/auth/register` | Gateway | `Users` | — | INSERT |
| `/api/so/processes` | Service SO | `Processes` | `Users` (user_id FK) | SELECT |
| `/api/so/process/start` | Service SO | `Processes` | `Users` (user_id) | INSERT |
| `/api/chat/messages` | Service Chat | `Messages` | `Users` (sender_id), `Channels` | SELECT/INSERT |
| `/api/chat/channels` | Service Chat | `Channels` | `Users` (members) | SELECT |

---

## 6. Resumen de Archivos Importantes por Endpoint

| Endpoint | Archivo Principal (Go) | Archivo DB | Clase Dominio | Middleware |
|----------|------------------------|------------|---------------|------------|
| `/api/auth/*` | `api-gateway/internal/interfaces/http/auth_handler.go` | `database/*.sql` (Users) | `internal/domain/user.go` | JWT (`internal/infrastructure/jwt/`) |
| `/api/so/processes` | `service-so/internal/interfaces/http/process_handler.go` | `database/*.sql` (Processes) | `internal/domain/process.go` | Auth (vía Gateway) |
| `/api/chat/messages` | `service-chat/internal/interfaces/http/chat_handler.go` | `database/*.sql` (Messages) | `internal/domain/message.go` | Auth (vía Gateway) |

---

## 7. Notas de Ingeniería

- **Autenticación:** El Gateway (`api-gateway`) valida JWT; los servicios internos (`service-so`, `service-chat`) pueden confiar en el Gateway o validar tokens independientes según la configuración de `internal/`.
- **Base de Datos:** Todos los servicios usan `database/` como referencia de esquema. En producción pueden usar instancias separadas de SQL Server.
- **Workspace:** `go.work` permite que `api-gateway` importe paquetes internos de `service-so` si es necesario (por ejemplo, modelos de dominio compartidos en `pkg/`).
- **Documentación Adicional:** Carpeta `Go/Documentacion/` contiene referencias internas adicionales.

---

*Estado: Completo — Endpoints documentados con archivos, tablas y relaciones*

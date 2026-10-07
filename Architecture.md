# ArchsGo — Documentación de Arquitectura Distribuida

**Nivel:** Arquitecto de Software / Software Engineer Senior
**Estado:** v1.0 — Arquitectura distribuida documentada

---

## 1. Visión General del Sistema

ArchsGo es una **plataforma distribuida** que simula un sistema operativo mediante una arquitectura de microservicios. El frontend (Angular) renderiza el escritorio virtual y gestiona la interacción del usuario; el backend (Go y C# .NET) custodia la lógica, persistencia y comunicación entre servicios.

**Propósito:** Plataforma de demostración y aprendizaje de arquitectura distribuida con tecnologías heterogéneas (Go, C# .NET, TypeScript), patrones de diseño sólidos (Clean Architecture, DDD, CQRS, Microservicios, Database per Service) y una experiencia de usuario inmersiva.

---

## 2. División de la Arquitectura

### 2.1 Componentes Principales

| Componente | Tecnología | Responsabilidad | Ubicación |
|-----------|-----------|-----------------|-----------|
| **Frontend / UI** | Angular 19 (TypeScript/SCSS) | Simulación visual del SO, gestión de ventanas, interacción con microservicios | `Angular/` |
| **Backend Core** | Go (Gin, JWT, SQL Server) | Lógica central del SO, autenticación, enrutamiento, chats básicos | `Go/` |
| **Microservicio Chat** | C# / ASP.NET Core 8 (Clean Architecture + DDD) | Chat en tiempo real tipo Discord, persistencia independiente | `GoNET/` |

### 2.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CAPA DE PRESENTACIÓN                             │
│   Angular 19 (Standalone + Signals + Lazy Loading)                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ app.component.ts          desktop.component.ts                    │  │
│  │ core/features/auth/ (login/register)                              │  │
│  │ core/features/desktop/apps (terminal, archtx, gonet-app)          │  │
│  │ interceptors/auth.interceptor.ts                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ HTTP REST / WebSocket
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CAPA DE SERVICIOS                               │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐ │
│  │ API Gateway (Go)    │──▶│ Service SO (Go)     │◀─│ Service Chat    │ │
│  │ jwt-gonic + routing │  │ lógica SO           │  │ C# .NET         │ │
│  │ auth centralizada   │  │ DB SQL Server       │  │ Azure SQL       │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CAPA DE PERSISTENCIA                               │
│   SQL Server (Go services)        Azure SQL (GoNET)                      │
│   Users / Messages / Processes    Users / Messages                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Justificación de las Decisiones de Diseño

### 3.1 Separación Angular / Go / GoNET (Programación Políglota)

**Decisión:** No usar un solo lenguaje o framework para todo el proyecto.

**Justificación técnica:**
- **Angular 19:** Es el estándar industrial para SPAs con interfaces complejas. Su sistema de señales (`signals`) y componentes `standalone` permiten construir una simulación de escritorio interactiva sin los pesos muertos de `NgModule`. El lazy loading dinámico optimiza la primera carga de una interfaz con múltiples aplicaciones.
- **Go (Gin):** Ideal para microservicios de entrada (API Gateway) y alta concurrencia (`service-so`, `service-chat`). El workspace `go.work` permite gestionar módulos independientes sin publicar paquetes en un registro externo.
- **C# .NET 8 (GoNET):** Proporciona un ecosistema maduro para modelos de dominio complejos con Clean Architecture, DDD, CQRS + MediatR, y middleware estructurado (Serilog). Es la primera aplicación "instalable" demostrando que un microservicio independiente funciona sin consultar la BD principal.

> **Patrón aplicado:** *Polyglot Programming* — cada servicio emplea el lenguaje y framework más idóneo para su dominio.

---

### 3.2 Microservicios con API Gateway

**Decisión:** `api-gateway/`, `service-so/` y `service-chat/` como servicios independientes gestionados por `go.work`.

**Justificación técnica:**
- **Punto de entrada único (Single Entry Point):** El Gateway centraliza autenticación JWT, enrutamiento y coordinación básica. El frontend no debe conocer las URLs internas de cada servicio.
- **Despliegue independiente:** `service-so/` y `service-chat/` se escalan y actualizan sin afectar al otro.
- **Workspace:** `go.work` facilita el desarrollo local con referencias cruzadas a `internal/` sin publicar paquetes.

> **Patrón:** *API Gateway Pattern + Microservices*.

---

### 3.3 Database per Service (Aislamiento de Datos)

**Decisión:** Cada microservicio posee su propia persistencia: `database/` (SQL Server) para los servicios Go y una base de datos Azure SQL Serverless independiente para GoNET.

**Justificación técnica:**
- **GoNET** nunca consulta la BD de ArchsGo en Go; solo interactúa mediante `HttpClient` (`IArchsGoClient`) con la API pública del Gateway para validar credenciales.
- **Beneficio:** Si `service-chat` requiere una migración o cae, `service-so` permanece operativo; los esquemas y datos están aislados.

---

### 3.4 Clean Architecture y DDD en GoNET

**Decisión:** Capas estrictas `API` → `Application` → `Domain` → `Infrastructure`.

**Justificación técnica:**
- **Segregación de responsabilidades:** Lógica de negocio en `Domain/` y `Application/`; infraestructura (EF Core, Identity, Serilog, HttpClient) en `Infrastructure/`; presentación en `API/`.
- **Testabilidad:** Las capas internas se prueban sin base de datos (mock de repositorios).
- **CQRS + MediatR:** Separación de comandos (escritura) y consultas (lectura), con pipelines de comportamiento (`ExceptionHandlingBehavior`, `ValidationBehavior`) que inyectan validación, logging y manejo de errores de forma transversal.
- **DDD:** Entidades (`User`, `Message`) encapsulan reglas de dominio (factory `Create`, `UpdateProfile`) en lugar de ser DTOs planos.

---

### 3.5 Frontend: Standalone + Signals + Lazy Loading

**Decisión:** Sin `NgModules`; componentes `standalone` con gestión de estado reactiva vía señales (`DesktopStateService`).

**Justificación técnica:**
- **Standalone:** Elimina la dependencia de módulos globales; cada componente declara sus propias importaciones, reduciendo acoplamiento.
- **Signals:** Reactividad nativa sin bibliotecas externas (NgRx/Redux) para el estado del escritorio (ventanas, iconos, notificaciones).
- **Lazy Loading:** Las rutas (`app.routes.ts`) cargan componentes dinámicamente, mejorando el tiempo de primera carga.

---

### 3.6 Autenticación Federada (GoNET ↔ ArchsGo Go)

**Decisión:** GoNET valida credenciales consumiendo la API pública de ArchsGo mediante `HttpClient`, sin conocer el esquema interno de la base de datos.

**Justificación técnica:**
- **Contrato estable:** Si el core cambia su modelo de usuario, GoNET no se ve afectado porque su contrato es la API, no la BD.
- **Seguridad:** El microservicio de chat nunca tiene visibilidad directa sobre los datos de persistencia del core.

---

## 4. APIs y Contratos de Servicios

### 4.1 API Gateway (Go) — `api-gateway/`

| Método | Endpoint | Responsable | Archivo | Tabla |
|--------|----------|-------------|---------|-------|
| POST | `/api/auth/register` | Crear cuenta de usuario independiente | `internal/interfaces/http/auth_handler.go` | `Users` |
| POST | `/api/auth/login` | Validar credenciales, emitir JWT | `internal/interfaces/http/auth_handler.go` | `Users` |
| GET | `/api/status` | Estado del gateway y conectividad de servicios | `internal/interfaces/http/gateway_handler.go` | - |
| GET | `/api/services/chat/health` | Proxi de salud al servicio chat | `internal/interfaces/http/proxy_handler.go` | - |

### 4.2 Service SO (Go) — `service-so/`

| Método | Endpoint | Responsable | Archivo | Tabla |
|--------|----------|-------------|---------|-------|
| GET | `/api/so/processes` | Listar procesos simulados activos | `internal/interfaces/http/process_handler.go` | `Processes` |
| POST | `/api/so/process/start` | Iniciar un proceso simulado | `internal/interfaces/http/process_handler.go` | `Processes` |
| POST | `/api/so/process/stop` | Detener un proceso simulado | `internal/interfaces/http/process_handler.go` | `Processes` |

### 4.3 Service Chat (Go) — `service-chat/`

| Método | Endpoint | Responsable | Archivo | Tabla |
|--------|----------|-------------|---------|-------|
| GET | `/api/chat/messages` | Recuperar historial de mensajes de un canal | `internal/interfaces/http/chat_handler.go` | `Messages` |
| POST | `/api/chat/messages` | Enviar nuevo mensaje al chat | `internal/interfaces/http/chat_handler.go` | `Messages` |
| GET | `/api/chat/channels` | Listar canales disponibles | `internal/interfaces/http/chat_handler.go` | `Channels` |

### 4.4 GoNET (.NET) — `GoNET.API`

| Método | Endpoint | Responsable | Archivo | Tabla |
|--------|----------|-------------|---------|-------|
| POST | `/api/auth/register` | Crear cuenta en GoNET (Azure SQL) | `GoNET.API/Controllers/AuthController.cs` | `Users` |
| POST | `/api/auth/login` | Autenticar JWT, vinculación con ArchsGo | `GoNET.API/Controllers/AuthController.cs` | `Users` |
| GET | `/api/profile/{userId}` | Recuperar perfil público | `GoNET.API/Controllers/ProfileController.cs` | `Users` |
| POST | `/api/messages` | Enviar mensaje de chat | `GoNET.API/Controllers/MessageController.cs` | `Messages` |
| GET | `/api/messages/history?userId=&limit=` | Historial paginado de mensajes | `GoNET.API/Controllers/MessageController.cs` | `Messages` |

### 4.5 Cliente de Integración GoNET ↔ ArchsGo

| Método | Endpoint (invocado desde GoNET) | Responsable | Archivo |
|--------|--------------------------------|-------------|---------|
| GET | `/api/users/{userId}` (ArchsGo) | `IArchsGoClient.ValidateUserCredentialsAsync` | `GoNET.Infrastructure/Services/ArchsGoClient.cs` |
| POST | `/api/users/link` (ArchsGo) | `IArchsGoClient.LinkAccountAsync` | `GoNET.Infrastructure/Services/ArchsGoClient.cs` |

---

## 5. Resumen de Decisiones Clave

| Decisión | Beneficio | Riesgo Mitigado |
|----------|-----------|-----------------|
| **Programación políglota** (Angular/Go/C#) | Cada capa usa la mejor herramienta para su dominio | Ningún lenguaje se convierte en cuello de botella |
| **Microservicios + API Gateway** | Autenticación centralizada, despliegue independiente | Fallo de un servicio no derriba el sistema completo |
| **Database per Service** | Aislamiento de datos y migraciones independientes | Corrupción de datos cruzados y dependencia de una sola BD |
| **Clean Architecture + DDD (.NET)** | Código mantenible, testable, dominio explícito | Deuda técnica y acoplamiento entre UI y persistencia |
| **Standalone Angular + Signals** | Rendimiento, modularidad, carga inicial rápida | Complejidad de NgModules y bundles pesados |
| **Federación de autenticación por HTTP** | Seguridad e independencia de esquemas internos | Exposición de la estructura interna de bases de datos entre servicios |

---

## 6. Estado Actual del Proyecto

- **Frontend:** Angular 19 operativo (escritorio simulado con apps instaladas)
- **Backend Go:** Workspace activo (`go.work`), servicios ejecutándose independientemente
- **Microservicio GoNET:** Documentado con arquitectura limpia, APIs documentadas y CI/CD con matrices de pruebas
- **Integración:** Frontend → Gateway de Go; GoNET → vinculación federada vía `HttpClient`; aislamiento total de persistencia

---

*Estado: Documentación de arquitectura distribuida completa*

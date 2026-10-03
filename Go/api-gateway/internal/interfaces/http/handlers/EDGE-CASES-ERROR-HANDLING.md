# EDGE CASES Y MANEJO DE ERRORES - Tabla de Referencia Rápida

## Resumen Ejecutivo

Este documento proporciona una **tabla de referencia rápida** para los edge cases más críticos y errores posibles en los manejadores `auth_handler.go` y `terminal_handler.go`. Está organizado como una hoja de cálculo mental para triage rápido de incidentes.

## ARCHIVO: auth_handler.go

### CÓDIGO: AuthHandler.Register()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **Falta Validación JSON** | auth_handler.go:42-55 | `c.ShouldBindJSON(&req)` | auth_handler.go:35-80 | MEDIA | <5 min | Rollback a respuesta 400 anterior | Agregar tag `json` faltante en struct Req |
| **Email Duplicado** | auth_handler.go:76-85 | `registerHandler.Handle()` | auth/commands/register.go:95-105 | ALTA | <2 min | Devolver 409 con mensaje claro | Verificar unicidad con retry en repositorio |
| **Password < 6 chars** | auth_handler.go:53 | `binding:"min=6"` | auth_handler.go:35-80 | MEDIA | <5 min | Mantener validación actual | Testear con contraseña exacta de 6 chars |
| **Error de BD en Registro** | auth_handler.go:88-95 | `userRepo.Create()` | auth/commands/register.go:140-150 | CRÍTICA | <10 min | Reintentar con backoff exponencial | Agregar circuit breaker en repositorio |
| **RequestID Ausente en Contexto** | auth_handler.go:65 | `c.Request.Context().Value("RequestId")` | auth_handler.go:45-80 | BAJA | <1 min | No action necesaria (fallback a "unknown") | Asegurar middleware de RequestID agregado |
| **Logging de Auditoría Fail** | auth_handler.go:98-105 | `h.guardarLog()` | auth_handler.go:107-130 | BAJA | <5 min | Continuar operación principal | Agregar retry, no fallar request |

### CÓDIGO: AuthHandler.Login()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **JSON Inválido** | auth_handler.go:142-155 | `c.ShouldBindJSON(&req)` | auth_handler.go:135-180 | MEDIA | <5 min | Mantener validación actual | Testear con JSON malformed |
| **Usuario/Email No Existe** | auth_handler.go:167-175 | `loginHandler.Handle()` | auth/commands/login_command.go:95-110 | ALTA | <2 min | Retornar 401 genérico | Verificar query de repositorio |
| **Password Incorrecta** | auth_handler.go:175-185 | `user.VerifyPassword()` | auth/commands/login_command.go:130-145 | ALTA | <2 min | Retornar 401 genérico | Usar hash comparison timing-safe |
| **Actualización last_login Fallida** | auth_handler.go:190-200 | `userRepo.Update()` | auth/commands/login_command.go:165-180 | MEDIA | <5 min | Log warning, continuar | Agregar retry en repo layer |
| **RequestID Inválido** | auth_handler.go:65 | Misma que registro | auth_handler.go:45-80 | BAJA | <1 min | Mismo que registro | Asegurar middleware consistente |

---

## ARCHIVO: terminal_handler.go

### CÓDIGO: TerminalHandler.Execute()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **Comando Vacío** | terminal_handler.go:95-105 | `strings.TrimSpace(comando) == ""` | terminal_handler.go:90-130 | MEDIA | <2 min | Retornar error "Comando vacio" | Validar input antes de parsing |
| **Comando No Reconoceido** | terminal_handler.go:125-135 | `default:` case | terminal_handler.go:90-130 | BAJA | <1 min | Retornar mensaje de ayuda | Agregar comando a función switch |
| **UsuarioID no Auth** | terminal_handler.go:115-125 | `jwtMiddleware` | auth_handler.go:190-210 | ALTA | <2 min | Retornar 401 | Verificar middleware JWT |
| **App no Instalada** | terminal_handler.go:310-325 | `app.EstaInstalada` | terminal_handler.go:300-350 | MEDIA | <5 min | Retornar mensaje de instalación | Agregar cache de installedApps |
| **Error de BD al Crear** | terminal_handler.go:145-155 | `termRepo.Create()` | terminal_handler.go:140-160 | CRÍTICA | <10 min | Retry con backoff | Agregar circuit breaker en repo |
| **Error de Logging Guardar** | terminal_handler.go:160-170 | `h.guardarLog()` | terminal_handler.go:160-180 | BAJA | <5 min | Continuar operación | Agregar retry asíncrono |

### CÓDIGO: TerminalHandler.GetHistorial()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **Parámetro usuarioId Ausente** | terminal_handler.go:205-215 | `c.Query("usuarioId") == ""` | terminal_handler.go:200-230 | MEDIA | <2 min | Retornar 400 con mensaje | Verificar middleware de auth |
| **Parseo usuarioId Fallido** | terminal_handler.go:217-225 | `json.Unmarshal()` | terminal_handler.go:200-230 | MEDIA | <5 min | Retornar 400 con error específico | Usar binding de Gin apropiado |
| **BD Error al Obtener** | terminal_handler.go:227-235 | `termRepo.GetByUserID()` | terminal_handler.go:240-260 | CRÍTICA | <10 min | Retry con backoff exponencial | Agregar timeout en query BD |

### CÓDIGO: TerminalHandler.procesarComando()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **Subcommand Sin Argumentos** | terminal_handler.go:260-275 | `apt install <app>` | terminal_handler.go:250-300 | MEDIA | <5 min | Retornar uso del comando | Validar length de partes |
| **Permiso Insuficiente** | terminal_handler.go:315-330 | `app.UsuarioID != usuarioID` | terminal_handler.go:305-335 | ALTA | <2 min | Retornar 403 con motivo | Agregar check rápido en memoria |
| **Argumentos de Subcommand Inválidos** | terminal_handler.go:340-355 | `repo inválido` | terminal_handler.go:335-370 | MEDIA | <5 min | Retornar mensaje de error | Agregar whitelist de repos en cache |

### CÓDIGO: TerminalHandler.cmdGoarchInstall()

| Edge Case / Error | Ubicación del Archivo | Stack Trace Típico | Archivos a Revisar | Severidad | Tiempo de Respuesta | Acción Inmediata | Recomendación Técnica |
|-------------------|-------------------|-------------------|------------------|-----------|------------------|------------------|---------------------|
| **Argumentos Insuficientes** | terminal_handler.go:380-395 | `len(partes) < 4` | terminal_handler.go:370-400 | MEDIA | <2 min | Retornar mensaje de uso | Validar length antes de accesos |
| **Repo No Válido** | terminal_handler.go:400-415 | `esRepoValido(repo)` | terminal_handler.go:410-430 | MEDIA | <2 min | Retornar lista de repos válidos | Agregar cache de reposValidos |
| **App No Existe** | terminal_handler.go:420-435 | `app == nil` | terminal_handler.go:415-445 | MEDIA | <5 min | Retornar mensaje de búsqueda | Agregar índice de aplicaciones |
| **No Pertenece a Repo** | terminal_handler.go:440-455 | `strings.EqualFold(app.Fuente, repo)` | terminal_handler.go:435-470 | MEDIA | <5 min | Retornar repositorio correcto | Agregar validación más clara |

---

## MATRIZ DE RESPUESTA DE EMERGENCIA

### Tabla de Decisiones de Severidad

| Severidad | Tiempo de Respuesta Objetivo | Acciones Inmediatas | Responsables |
|-----------|----------------------|-------------------|--------------|
| CRÍTICA | <10 minutos | - Restaurar servicio si posible<br>- Investigar causa raíz inmediatamente<br>- Notificar a todos los stakeholders<br>- Implementar hotfix en producción | DevOps + Backend |
| ALTA | <5 minutos | - Investigar impacto<br>- Implementar fix si es trivial<br>- Si no, preparar rollback<br>- Comunicar a usuarios afectados | Backend + QA |
| MEDIA | <30 minutos | - Investigar causa raíz<br>- Planificar fix en sprint siguiente<br>- Agregar monitoring para prevenir recurrencia | Backend + Frontend |
| BAJA | <60 minutos | - Documentar para futuro<br>- Agregar test unitario<br>- Actualizar documentación | Backend + QA |

### Flujo de Triage de Incidentes

| Paso | Acción | Archivo a Revisar | Herramientas |
|------|--------|------------------|------------|
| 1. **Detectar** | Monitorear logs con grep | auth_handler.go, terminal_handler.go | ELK Stack, Loki |
| 2. **Isolar** | Verificar si afecta un endpoint o todos | main.go, gin.Router setup | Postman, curl |
| 3. **Reproducir** | Recrear en staging | archivos de código correspondientes | Docker, git, IDE |
| 4. **Analizar** | Revisar stack traces | archivos específicos del error | Sentry, Datadog APM |
| 5. **Solucionar** | Implementar fix o rollback | mismo archivo de error | git, deploy tools |
| 6. **Verificar** | Correr tests, verificar en staging | suites de tests correspondientes | Jest, GoTest |
| 7. **Documentar** | Documentar causa raíz y solución | todos los archivos relacionados | Confluence, Notas Internas |

---

## GUÍA DE INVESTIGACIÓN ESPECÍFICA POR CASO

### 1. Casos de Error de Base de Datos

**Archivos a Revisar**:
- `auth/commands/register.go:140-150` (Error en Create)
- `auth/commands/login_command.go:175-185` (Error en Update)
- `terminal_handler.go:140-160` (Error en TerminalRepository.Create)

**Acciones**:
- [ ] Verificar logs de BD para detalles de error
- [ ] Confirmar conexiones pool size
- [ ] Revisar queries SQL en migraines
- [ ] Verificar si hay deadlocks (sp_chaos) en SQL Server
- [ ] Agregar índices para queries de search
- [ ] Implementar retry con backoff exponencial

### 2. Casos de Error de Autenticación

**Archivos a Revisar**:
- `auth_handler.go:65-80` (Extracción de RequestID)
- `auth_handler.go:190-210` (Middleware JWT)
- `auth/commands/login_command.go:90-110` (Búsqueda de usuario)

**Acciones**:
- [ ] Verificar servicio de JWT (expiro tokens, refresh)
- [ ] Revisar logs de autenticación para intentos fallidos
- [ ] Verificar extensión de sesión de JWT
- [ ] Agregar rate limiting para endpoints de auth
- [ ] Testear renovación de token automático
- [ ] Verificar scope de autorización para different user roles

### 3. Casos de Error de Terminal

**Archivos a Revisar**:
- `terminal_handler.go:115-125` (Validación usuarioID)
- `terminal_handler.go:250-300` (Router de comandos)
- `terminal_handler.go:350-380` (Funciones cmdGoarch*)

**Acciones**:
- [ ] Verificar cache de aplicaciones instaladas
- [ ] Revisar repositorios en archivo de configuración
- [ ] Testear comandos legacy (apt) vs modernos (goarch)
- [ ] Implementar timeout para ejecución de comandos largos
- [ ] Agregar sandbox/security para comandos dangeros
- [ ] Verificar límites de recursos (CPU, memory)

### 4. Casos de Error de Logging

**Archivos a Revisar**:
- `auth_handler.go:107-130` (Método guardarLog)
- `terminal_handler.go:160-180` (Método guardarLog)

**Acciones**:
- [ ] Verificar connectividad a BD de logs
- [ ] Revisar tamaño de tabla, índices
- [ ] Implementar async logging para no bloquear requests
- [ ] Agregar buffer para logs en memoria
- [ ] Testear operaciones bulk insert
- [ ] Verificar compresión y retention de logs

---

## CHECKLIST DE PRUEBAS RÁPIDAS DE REGRESIÓN

### Después de Cualquier Cambio de Código:

[ ] **Testing de Edge Cases**:
- [ ] Comando vacío en terminal
- [ ] JSON malformado en auth endpoints
- [ ] Campos faltantes en request
- [ ] IDs de usuario inválidos
- [ ] Scenarios de race condition

[ ] **Testing de Performance**:
- [ ] Latency de registro <100ms
- [ ] Throughput >1000 req/sec
- [ ] Error rate <1%
- [ ] Memory usage estable

[ ] **Testing de Seguridad**:
- [ ] SQL injection en todos inputs
- [ ] XSS en terminal output
- [ ] Bypass de autenticación
- [ ] Rate limiting efectivo

[ ] **Testing de Observabilidad**:
- [ ] Todos logs estructurados
- [ ] Metrics emitidos correctamente
- [ ] Tracing distribuido completo
- [ ] Health checks funcionales

### Documentos para Revisar Después de Cada Incidente:

1. **README.md** - Documentación actualizada de casos de uso
2. **ARCHITECTURAL-BENEFITS.md** - Agregar notas sobre edge cases descubiertos
3. **QA-TESTING-CHECKLIST.md** - Agregar nuevos casos de prueba
4. **USE-CASES.md** - Documentar incidente como caso de uso
5. **STRATEGIC-ARCHITECTURE-DECISIONS.md** - Agregar lecciones aprendidas

## RESUMEN EJECUTIVO DE LA GUÍA DE MANEJO DE ERRORES

### Esquema de Respuesta de 5 Minutos:

1. **Contener** (30 segundos): Detener propagación si es posible
2. **Evaluar** (1 minuto): Determinar severidad e impacto
3. **Comunicar** (1 minuto): Alertar equipos relevantes
4. **Solucionar** (2 minutos): Implementar hotfix o rollback
5. **Verificar** (5 minutos): Confirmar fix, documentar solución

### Jerarquía de Prioridades:

1. **CRÍTICA**: Usuario bloqueado, datos corruptos, seguridad comprometida
2. **ALTA**: Usuario no puede realizar operación principal, performance degradada
3. **MEDIA**: Características menores no funcionales, logging incompleto
4. **BAJA**: Documentación desactualizada, features no críticas

### Tabla de Responsabilidades:

| Rol | Responsabilidades | Herramientas | Tiempo de Respuesta Objetivo |
|------|----------------|------------|--------------------|
| **DevOps** | - Infraestructura<br>- Monitoring<br>- Deployment | Kubernetes, Helm, Prometheus | <5 minutos |
| **Backend Engineer** | - Lógica de negocio<br>- Optimización<br>- Testing | Go, PostgreSQL, Redis | <10 minutos |
| **Frontend Engineer** | - API integration<br>- UI impact<br>- Documentación | Postman, curl, navegador | <15 minutos |
| **QA Engineer** | - Reproducción de tests<br>- Documentación<br>- Verification | Jest, Selenium, tools manuales | <30 minutos |
| **Product Manager** | - Comunicación con usuarios<br>- Priorización<br>- Documentación | Slack, Confluence, Jira | <30 minutos |

### Resumen de Manejo de Edge Cases:.

**auth_handler.go**:
- Validación de input siempre primero
- Logging completo de auditoría (no bloquea request)
- Errores genéricos para seguridad
- Retry con backoff para fallos transitorios

**terminal_handler.py**:
- Sanitización robusta de input
- Auth por usuario + verificación de permisos
- Timeout para comandos largos
- Logging estructurado de ejecución

**Ambos**:
- Circuit breakers para dependencias externas
- Health checks para componentes críticos
- Monitoreo de performance en tiempo real
- Respuestas consistentemente formateadas

Esta tabla de referencia rápida permite a los ingenieros **identificar, documentar, y resolver edge cases y errores** rápidamente, minimizando impacto en usuarios y manteniendo la calidad del servicio.
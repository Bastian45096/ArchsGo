# Documentación del ApiLogger - Middleware HTTP

## Resumen

Este documento describe el middleware **ApiLogger**, una herramienta central de observabilidad para el API Gateway de Go. Este middleware registra todas las solicitudes HTTP entrantes y salientes para auditoría, debugging, y análisis de performance.

## Ubicación del Archivo

**Ruta Completa**: `Go/api-gateway/internal/interfaces/http/middleware/api_logger.go`

## Propósito Principal

El ApiLogger sirve como middleware **centralizado de logging** que captura, procesa, y persiste **todos los eventos HTTP** del API Gateway. Actúa como la **source única de verdad** para:

- Trazabilidad de solicitudes completa
- Análisis de performance
- Auditoría de seguridad
- Debugging de aplicaciones
- Monitoreo operativo

## Características Técnicas Clave

### 1. Captura Integral de Datos

#### A. Body Capture Bidireccional
- **Request Body**: Lee y conserva cuerpo original de request
- **Response Body**: Captura cuerpo de response antes de enviarlo al cliente
- **Reconstitución**: Reconstruye request body original para logging

```go
// Extrae request body completo
bodyBytes, _ := io.ReadAll(c.Request.Body)
c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
```

#### B. Extracción Múltiple de Usuario ID
- **Source 1**: Cuerpo de request (`"usuarioId"`)
- **Source 2**: Header HTTP (`X-User-Id`) - Desde interceptor Angular
- **Source 3**: Context (después de autenticación JWT)
- **Fallback**: `nil` si ninguno está presente

### 2. Modelo de Riesgo Basado en Context

#### A. Niveles de Riesgo (alto/medio/bajo)
```go
def determinarRiesgo(status int, endpoint string) string:
    {
    if endpoint.contains("/auth/"):
        if status == 401 || status == 403: return "alto"
        if status >= 400: return "medio"
        return "bajo"
    
    switch:
    case status >= 500: return "alto"
    case status >= 400: return "medio"  
    default: return "bajo"
    }
```

#### B. Criterios de Clasificación
- **Alto Riesgo**: Errores de autenticación, errores del servidor
- **Medio Riesgo**: Bad requests, clientes normales
- **Bajo Riesgo**: Operaciones exitosas normales

### 3. Procesamiento Asíncrono

#### A. Escritura Asíncrona a Base de Datos
```go
go func() {
    if err := apiRepository.Create(nil, apiLog); err != nil {
        log.Printf("[ApiLog] ERROR al guardar log: %v", err)
    }
}()
```

#### B. Beneficios
- **No bloqueante**: No afecta performance del request
- **Resiliencia**: Fallo en logging no afecta la aplicación
- **Escalabilidad**: Puede manejar alto volumen de logs

### 4. Logging Doble

#### A. Log de Consola (Tiempo Real)
```go
if statusCode >= 400 {
    log.Printf("[ApiLog] ERROR | %s %s | status=%d | duracion=%dms | ip=%s | usuario=%v",
        method, endpoint, statusCode, durationMs, ip, usuarioID)
} else {
    log.Printf("[ApiLog] OK | %s %s | status=%d | duracion=%dms | usuario=%v",
        method, endpoint, statusCode, durationMs, usuarioID)
}
```

#### B. Persistencia en Base de Datos (Audit Trail)
- **Modelo**: `apiEntities.ApiLog` con 20+ campos
- **Retención**: Persiste para análisis a largo plazo
- **Consulta**: Posibilidad de queries complejos

## Arquitectura del Sistema

### 1. Flujo de Request

```
Cliente HTTP → Gin Router → ApiLogger Middleware → Handler → ApiRepo → DB
                                    ↑                ↓
                              Log de Consola    Log de Base de Datos
```

### 2. Componentes Principales

#### A. BodyWriter
```go
type bodyWriter struct {
    gin.ResponseWriter
    body *bytes.Buffer
}

func (w *bodyWriter) Write(b []byte) (int, error) {
    w.body.Write(b)                    // Captura response
    return w.ResponseWriter.Write(b)   // Escribe al cliente
}
```

#### B. ApiRepository
- **Interfaz**: `apiRepo.ApiRepository`
- **Implementación**: `apiRepo.ApiRepositoryImpl`
- **Método**: `Create(context.Context, *ApiLog) error`

#### C. ApiLog Entity
```go
type ApiLog struct {
    UsuarioID       *uint     `json:"usuarioId,omitempty"`
    MetodoHTTP      string    `json:"metodoHttp"`
    Endpoint        string    `json:"endpoint"`
    EstadoHTTP      int       `json:"estadoHttp"`
    Mensaje         string    `json:"mensaje"`
    DireccionIP     string    `json:"direccionIp"`
    AgenteUsuario   string    `json:"agenteUsuario"`
    EstaAutenticado bool      `json:"estaAutenticado"`
    NivelRiesgo     string    `json:"nivelRiesgo"`
    DuracionMs      int       `json:"duracionMs"`
    MensajeError    string    `json:"mensajeError"`
    CuerpoPeticion  string    `json:"cuerpoPeticion"`
    // ... campos adicionales
}
```

## Decisiones de Diseño

### 1. Middleware Pattern

#### ¿Por qué Middleware?
- **Centralizado**: Una vez para todo el gateway
- **Transparent**: No requiere cambios en handlers
- **Consistente**: Mismo behavior en todos los endpoints
- **Reutilizable**: Puede ser usado en múltiples services

#### Ubicación Estratégica
```go
// En Gin router setup (ejemplo)
router.Use(middleware.CORS())
router.Use(middleware.Recovery())
router.Use(middleware.Logger())  // <- ApiLogger here
router.Use(middleware.RateLimit())
```

### 2. Modelos de Extracción de Usuario ID

#### A. Body → Header → Context
```go
var usuarioID *uint

// 1. Intentar extraer del cuerpo
if bodyBytes.length > 0 {
    parse usuarioId del JSON
    si exitoso, asignar a usuarioID
}

// 2. Intentar extraer del header (Angular interceptor)
if usuarioID == nil {
    usuarioID del header X-User-Id
}

// 3. Intentar extraer del context (JWT middleware)
if usuarioID == nil {
    usuarioID del context "userId"
}
```

#### B. Justificación de Múltiples Sources
- **Angular App**: Proporciona userId via header para requests autenticadas
- **JWT Middleware**: Guarda userId en context para handlers internos
- **Legacy APIs**: Algunos services aún envían userId en body request

### 3. Procesamiento Asíncrono

#### ¿Por qué Asíncrono?
- **Performance**: No bloquear requests críticos
- **Resiliencia**: Falla en logging no afecta aplicación
- **Escalabilidad**: Puede manejar logs altos sin bottleneck
- **User Experience**: Menor latencia percibida por usuarios

#### Consideraciones de Diseño
- **Error Handling**: Log del error, no fallar request principal
- **Retry Logic**: Implementar más adelante para fallos transitorios
- **Backpressure**: Limitar rate de escritura a DB

### 4. Estrategia de Logging Doble

#### Consola vs Base de Datos

| Canal | Uso Principal | Características | Latencia |
|-------|-------------|---------------|----------|
| **Consola** | Debugging, monitoreo en tiempo real | Formato legible por humanos, rápido | <10ms |
| **Base de Datos** | Análisis, auditoría, reportes históricos | Consultable, persistente, estructurado | ~50ms |

#### Decisiones de Contenido

**Datos Esenciales**:
- **Identity**: usuarioID, EstaAutenticado
- **Request/Response**: method, endpoint, status, duration
- **Source Info**: ip, user-agent
- **Error Info**: mensajeError, nivelRiesgo
- **Content**: cuerpo request truncado (4KB)

## Beneficios Operacionales

### 1. Debugging Eficaz

#### Cómo Ayuda
- **Request ID**: Seguimiento de solicitud completa
- **Tiempo de Respuesta**: Identificación rápida de cuellos de botella
- **Error Context**: Información completa sobre fallos
- **User Context**: Asociación de requests con usuarios

#### Ejemplo de Inspección de Logs
```bash
# Error específico de autenticación
[ApiLog] ERROR | POST /api/auth/login | status=401 | duracion=245ms | ip=192.168.1.100 | usuario=<nil>

# Lentitud en endpoint
[ApiLog] OK | GET /api/users/123 | status=200 | duracion=1500ms | usuario=123

# Error interno del servidor
[ApiLog] ERROR | GET /api/products | status=500 | duracion=50ms | ip=192.168.1.50 | usuario=<nil>
```

### 2. Análisis de Seguridad

#### Detecta
- **Patrones de Ataque**: Múltiples 401/403 desde misma IP
- **Escaneo de Puertos**: Requests de diferentes endpoints
- **Exfiltración de Datos**: Requests grandes suspicious
- ** credential stuffing**: Múltiples fallos de login rápido

#### Enriquecimiento de Alertas
- **Correlation**: Múltiples requests del mismo usuario/IP
- **Time-based**: Detección de ataques time-based
- **Geographic**: Location-based anomaly detection

### 3. Análisis de Performance

#### Métricas Recopiladas
- **Latency**: Por request, por endpoint
- **Throughput**: Requests por segundo
- **Error Rates**: Por código de estado, por endpoint
- **Resource Usage**: Tiempo CPU, memory allocation

#### Uso Típico
```bash
# Análisis de cuellos de botella
api_logs
WHERE estadoHttp >= 400
GROUP BY endpoint
ORDER BY avg(duracionMs) DESC
LIMIT 10

# Autenticación performance
api_logs  
WHERE endpoint LIKE '/api/auth/%'
GROUP BY estadoHttp
ORDER BY count(*) DESC
```

### 4. Cumplimiento y Auditoría

#### Requisitos Regulatarios
- **GDPR**: Conservación de logs de acceso a datos
- **SOX**: Auditoría de acceso a datos financieros
- **HIPAA**: Auditar acceso a información de salud
- **PCI-DSS**: Monitorizar acceso a tarjetas de crédito

#### Bitácora de Auditoría
- **Completo**: Todos los access logs preservados
- **Imutable**: No puede ser alterado
- **Consultable**: Búsqueda rápida y filtrado
- **Retenido**: Retención apropiada para cumplimiento

## Integración con Otros Componentes

### 1. JWT Middleware
```go
// flujo de request típico
router.Use(middleware.JWTAuth())
router.Use(middleware.ApiLogger(repo))  // ApiLogger después de auth
```

- **Orden**: Auth primero, logging segundo
- **Context**: ApiLogger extrae usuarioId del context

### 2. Rate Limiting
```go
// router setup
router.Use(middleware.RateLimit())
router.Use(middleware.Recovery())
router.Use(middleware.ApiLogger(repo))
```

- **Prioridad**: Rate limit → Auth → Logging
- **Interaction**: ApiLogger registra resultados del rate limit

### 3. CORS
```go
// router setup  
router.Use(middleware.CORS())
router.Use(middleware.ApiLogger(repo))
```

- **Skip**: ApiLogger ignora requests OPTIONS
- **Reason**: CORS preflight no necesita logging audit

## Estrategias de Pruebas

### 1. Pruebas Unitarias

#### Casos de Prueba
- **Endpoint Completo**: Request/response roundtrip completo
- **Usuario ID Múltiple**: Extracción del cuerpo, header, context
- **Niveles de Riesgo**: Different status codes y endpoints
- **Error Handling**: Fallo de DB, panics, timeouts
- **Performance**: High volume de logs

#### Herramientas de Prueba
- **Mock ApiRepository**: Simular éxito/fallo de DB
- **Gin Testing**: Contexturas de request real
- **Table-driven Tests**: Múltiples escenarios

### 2. Pruebas de Integración

#### Escenarios
- **Flujo Completo**: Request → Middleware → Handler → DB
- **Concurrency**: Múltiples requests simultáneos
- **Error Scenarios**: Network failures, DB issues
- **Performance**: Load testing con cientos de requests/min

### 3. Pruebas de Seguridad

#### Casos de Seguridad
- **Log Injection**: Inyección de newlines, caracteres especiales
- **Sensitive Data**: Asegurar passwords/tokens no están logs
- **Privacy**: Usuarios anonymized en logs
- **Integrity**: Logs no pueden ser modificados

## Mejoras Futuras

### 1. Enriquecimiento de Datos

#### Próximas Mejoras
- **Geographic Info**: Geo-IP para análisis de ubicación
- **Device Fingerprinting**: Tipo de dispositivo, navegador info
- **Session Tracking**: Seguimiento de sesión multi-request
- **Behavior Analysis**: Patrones de navegación anómalos

### 2. Optimización de Performance

#### Mejoras de Rendimiento
- **Batching**: Escritura batch de logs para reducir DB load
- **Compression**: Logs comprimidos para storage
- **Sampling**: Muestreo estadístico para alta traza
- **Caching**: Logs frecuentes en cache en memoria

### 3. Alerting Integrado

#### Detección de Alertas
- **Umbral Basado**: Error rate > X%, latency > Yms
- **Pattern-based**: Detección automática de ataques
- **Machine Learning**: Anomalía detection proactivo
- **Integration**: Alertas a Slack, PagerDuty, email

## Resumen Técnico

### Implementación Crítica

El ApiLogger es un **componente crítico de infraestructura** que:

1. **No bloquea**: Escritura asíncrona previene cuellos de botella
2. **Completo**: Captura toda la información necesaria para debugging
3. **Estandarizado**: Formato consistente para todos los endpoints
4. **Seguro**: Múltiples layers de seguridad para logs
5. **Escalable**: Puede manejar alto volumen de tráfico

### Principios de Diseño Emphasizados

1. **Defense in Depth**: Múltiples layers de logging y respaldo
2. **Fail Open**: Falla en logging no falla aplicación
3. **Privacy First**: Sin información sensible en logs
4. **Performance First**: Diseño optimizado para velocidad
5. **Observability First**: Datos completos para debugging

### Casos de Uso Principales

| Caso de Uso | Qué Hace | Cuándo Usar |
|-------------|------------|------------|
| **Debugging** | Encontrar causa raíz de errores | Bugs de aplicación |
| **Security Investigation** | Reconstruir ataques | Incidentes de seguridad |
| **Performance Analysis** | Identificar cuellos de botella | Optimización |
| **Compliance Auditing** | Probar acceso a datos | Auditorías reguladoras |
| **Business Intelligence** | Analizar usage patterns | Planning estratégico |

### Conclusión

El ApiLogger implementa **observabilidad completa** para el API Gateway:

- **Centraliza**: Todos los logs en un sistema unificado
- **Standardiza**: Formato consistente para todos los requests
- **Persiste**: Datos históricos para análisis a largo plazo
- **Secures**: Protección de información sensible
- **Scales**: Puede manejar alta carga sin degradación

Este middleware es fundamental para **operaciones confiables, debugging efectivo, y cumplimiento regulatorio** en un API Gateway moderno.

---

**TLDR**: ApiLogger es el middleware de logging de nivel empresarial que captura todo, desde la primera solicitud hasta la última respuesta, para auditaje, debugging, y analysis de performance, con diseño pensando en no bloquear requests y multiple layers de redundancia.
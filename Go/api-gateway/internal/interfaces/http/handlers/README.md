# Documentación del Módulo de Handlers HTTP

## Resumen

Este módulo contiene los manejadores HTTP para la API Gateway de Go. Implementa el patrón controlador-servicio, actuando como capa de entrada que procesa solicitudes HTTP entrantes y las delega a los servicios de aplicación correspondientes.

## Arquitectura General

Los handlers HTTP siguen una clara separación de responsabilidades:
- **Controladores**: Procesan solicitudes HTTP, validan entradas, formatean respuestas
- **Servicios**: Contienen la lógica de negocio a través de comandos de aplicación
- **Repositorios**: Acceden a la base de datos y datos persistentes

## Archivos

### 1. auth_handler.go

**Responsabilidad Principal**: Maneja las solicitudes de autenticación de usuarios (registro e inicio de sesión) a través de la API REST.

#### Características Clave:

#### A. Validación de Entradas Robustas
- **Validación de JSON**: Usa `c.ShouldBindJSON()` con validaciones declarativas de Gin
- **Validaciones Múltiples**:
  - Campos requeridos (`binding:"required"`)
  - Formato de email (`binding:"email"`)
  - Longitud mínima de password (`binding:"min=6"`)
- **Sanitización**: Extrae y valida datos estructurados

#### B. Manejo de Errores Estructurado
- **Errores de Binding**: Captura errores específicos de validación de JSON
- **Errores de Negocio**: Diferencia entre errores de validación y de negocio
- **Códigos HTTP**: Usa códigos de estado apropiados (400, 401, 409, 201, 200)
- **Mensajes de Error**: Mensajes genéricos para seguridad, detalles técnicos para debugging

#### C. Logging y Trazabilidad
- **Timestamps**: Marca de inicio para cálculo de durationes
- **Log de Auditoría**: `guardarLog()` registra cada solicitud con contexto completo
- **Log de Debugging**: Logs informativos para operaciones exitosas

#### D. Patrones de Diseño Implementados
- **Handler-Controller**: `AuthHandler` coordina operaciones
- **Middleware-aware**: Extrae IP, user-agent, y gestiona contexto
- **Logging Centralizado**: `guardarLog()` como servicio reutilizable

#### E. Contexto de RequestId
- **Transmisión**: Pasa contexto entre manejadores HTTP y comandos de aplicación
- **Trazabilidad**: Mantiene seguimiento entre capas de la aplicación

#### F. Respuestas Estructuradas
- **Format estándar**: `c.JSON()` con respuestas JSON consistentes
- **Campos comunes**: `message`, `userId`, `username`, `email`
- **Metadata**: Información de sesión y perfil según endpoint

#### Casos Borde Manejados:
- **JSON malformado**: Capturado con mensaje específico
- **Campos faltantes**: Validación temprana con error apropiado
- **Usuario existente**: Error 409 (conflicto) con mensaje claro
- **Login fallido**: Error 401 con mensaje genérico por seguridad
- **Log de auditoría fallido**: Warning, pero no falla la operación principal

### 2. terminal_handler.go

**Responsabilidad Principal**: Gestiona la ejecución de comandos de terminal y proporciona historial para usuarios autenticados.

#### Características Clave:

#### A. Gestión de Comandos Avanzada
- **Parser de Comandos**: Sistema robusto de parsing de múltiples niveles
- **Subcomandos**: Soporta jerarquía como `apt install <app>`, `goarch install <repo> <app>`
- **Help Integrado**: `help`, `goarch help`, `apt install <app> --help` (implícito)
- **Comandos del Sistema**: `neofetch`, `whoami`, `clear`, `ls`

#### B. Manejo de Sesiones Integrado
- **Autenticación**: Verifica `usuarioId` de JWT/autenticación
- **Autorización**: Cada comando verifica que usuario puede ejecutar la acción
- **Control de Acceso**: Verifica aplicaciones instaladas vs repositorios

#### C. Estructura de Respuesta Estructurada
- **Ejecución**: `ExecuteResponse` con `salida`, `codigoSalida`, `estado`, `comando`
- **Historial**: Obtiene y devuelve comando ejecución historial completo
- **Metadata**: Información de usuario, repositorio, aplicación

#### D. Arquitectura Modular
- **Separación de Preocupaciones**:
  - `procesarComando()`: Router principal de comandos
  - Funciones `cmd*`: Manejadores individuales de comandos
  - `goarchInstall()`, `goarchRemove()`: Lógica de gestión de paquetes
- **Múltiples Repositorios**: `TerminalRepository`, `AplicacionRepository`, `ApiRepository`

#### E. Logging y Auditoría
- **Múltiples Niveles**: Logs de request, logs de auditoría, logs de warnings
- **Riesgo por Nivel**: Clasifica logs como "bajo" o "medio" según operación
- **Trazabilidad**: Mantiene historial de cada comando ejecutado

#### F. Diseño Orientado a Seguridad
- **Sanitización**: Strings toφίados, límites de entrada
- **Validación**: Validación de `usuarioId` vs autorización de app
- **Logging Seguro**: No expone passwords o tokens en logs

#### Casos Borde Manejados:
- **Comando vacío**: Error con mensaje específico
- **Comando no reconocido**: Help sugerido
- **Permisos insuficientes**: Error de autorización
- **App no instalada**: Mensaje claro vs error de sistema
- **JSON malformado**: Validación temprana con error

## Buenas Prácticas Implementadas

### 1. Validación Consistente
```go
// En ambos archivos - mismo patrón para validation
if err := c.ShouldBindJSON(&req); err != nil {
    log.Printf("[Login] ERROR JSON invalido: %v", err)
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
}
```

### 2. Logging Estandarizado
```go
// Ambos usan timestamp de inicio y duration cálculo
start := time.Now()
// ... lógica de negocio ...
log.Printf("[Login] OK | ID: %d | %v", user.ID, time.Since(start))
```

### 3. Respuestas JSON Consistentes
```go
// Ambos usan estructura similar de respuesta
c.JSON(http.StatusOK, gin.H{
    "message": "Inicio de sesion exitoso",
    "userId": user.ID,
    "username": user.Username,
    "email": user.Email,
    "role": user.Role,
    "profileImage": user.ProfileImage,
})
```

### 4. Manejo de Errores Centralizado
```go
// Ambos tienen pattern similar: validar -> procesar -> manejar error
if user, err := h.loginHandler.Handle(...); err != nil {
    log.Printf("[Login] ERROR: %v", err)
    h.guardarLog(...)
    c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
    return
}
```

### 5. Logging de Auditoría Reutilizable
```go
// Función `guardarLog` común a ambos archivos para trazabilidad
func (h *AuthHandler) guardarLog(c *gin.Context, usuarioID *uint, ...) {
    // ... crea ApiLog y persiste a través de apiRepo
}
```

## Beneficios Arquitecturales

### 1. Separación de Capas
- **HTTP Layer**: Manejadores procesan solicitudes y respuestas
- **Aplicación Layer**: Commands contienen lógica de negocio
- **Dominio Layer**: Entidades y repositorios contienen rules de negocio
- **Infraestructura Layer**: Base de datos y caches

### 2. Testabilidad
- **Mocks Fáciles**: Handlers inyectan dependencias (repo, comandos)
- **Pruebas Unitarias**: Cada handler probado independientemente
- **Integración End-to-End**: Flujo completo request-response probado

### 3. Escalabilidad
- **Concurrencia**: Cada request maneja independientemente
- **Mantenibilidad**: Múltiples handlers con responsabilidades separadas
- **Extensión**: Nuevos endpoints agregados fácilmente

### 4. Seguridad
- **Input Validation**: Validación temprana y consistente
- **Error Blind**: Mensajes genéricos para información sensible
- **Auditoría**: Logging completo de todas las operaciones

## Guía de Implementación

### Agregar Nuevo Endpoint
1. **Crear Handler**: Nuevo método en AuthHandler o TerminalHandler apropiado
2. **Inyectar Dependencias**: Agregar al constructor NewAuthHandler/NewTerminalHandler
3. **Actualizar Rutas**: Agregar al router HTTP en main.go
4. **Testear**: Agregar tests unitarios y de integración
5. **Logging**: Asegurar trazabilidad a través de guardarLog

### Patrones de Diseño Utilizados
- **Command Pattern**: Los handlers actúan como mediadores de comandos
- **Observer Pattern**: Logging y auditoría como observers de operaciones
- **Strategy Pattern**: Diferentes parsers y validadores para diferentes endpoints
- **Template Method**: Múltiples comandos comparten flujo base

## Prácticas Recomendadas para QA

### 1. Pruebas de Request/Response
- **Casos Válidos**: Datos correctos → respuesta exitosa
- **Casos Inválidos**: Datos incorrectos → error apropiado
- **Casos Límite**: Campos frontera, strings largos, UTF-8
- **Casos de Seguridad**: Inyección, XSS, bypass de auth

### 2. Pruebas de Concurrencia
- **Múltiples Requests**: Mismo usuario creando concurrentemente
- **Requests Solapados**: Registro y login concurrentes
- **Fallo y Recuperación**: Handler continúa tras error interno

### 3. Pruebas de Performance
- **Load Testing**: 1000+ requests simultáneos
- **Latencia**: <100ms para casos felices
- **Memory**: No memory leaks en ejecuciones largas

### 4. Pruebas de Seguridad
- **OWASP ZAP**: Escaneo de vulnerabilidades
- **Burp Suite**: Prueba de penetración
- **JWT Validation**: Verificación de tokens
- **Rate Limiting**: Protección contra brute force

## Futuras Mejoras

### 1. Middlewares
- **CORS**: Configuración explícita de políticas CORS
- **Rate Limiting**: Protección contra brute force y DDoS
- **JWT Validation**: Validación de tokens antes de procesar
- **Request Size**: Limitación de tamaño de cuerpo

### 2. Observabilidad
- **Metrics**: Prometheus metrics para cada endpoint
- **Distributed Tracing**: OpenTelemetry integration
- **Health Checks**: /health y /ready endpoints

### 3. Features
- **Multipart Upload**: Para avatar de perfil
- **WebSockets**: Para terminal en tiempo real
- **GraphQL**: Alternative a REST API
- **gRPC**: Para microservicios internos

## Conclusión

Estos handlers HTTP representan un **diseño limpio y mantenible**:

1. **Principio de Responsabilidad Única**: Cada handler tiene una preocupación clara
2. **Inversión de Dependencias**: Los handlers dependen de abstracciones
3. **Principio de Segregación de Intereses**: Componentes altamente cohesionados
4. **Principio Abierto/Cerrado**: Fácil de extender, difícil de romper

El resultado es un **servicio HTTP escalable, seguro y fácil de mantener** listo para evolución futura.
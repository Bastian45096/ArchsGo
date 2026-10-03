# Documentación del Módulo de Comandos de Autenticación

## Resumen

Este módulo contiene los manejadores de comandos para operaciones de autenticación de usuarios en el API Gateway de Go. Se utiliza el patrón de comandos para separar la lógica de procesamiento de solicitudes del flujo de la aplicación, proporcionando mejor capacidad de prueba y mantenibilidad.

## Estructura de Archivos

### 1. register.go

**Responsabilidad Principal**: Maneja las solicitudes de registro de usuarios, validando entradas, verificando usuarios existentes, creando entidades de usuario y persistiéndolas en la base de datos.

#### Características Clave:
- **Validación de Entradas**: Valida campos requeridos (nombre de usuario, email, contraseña)
- **Reglas de Negocio**: Aplica requisitos mínimos de contraseña (6 caracteres)
- **Integridad de Datos**: Verifica usuarios/emails duplicados antes de la creación
- **Seguridad**: Encripta contraseñas usando el método interno de la entidad de usuario
- **Trazabilidad**: Logging detallado con ID de solicitud para debugging

#### Casos Borde Manejados:
- Campos de nombre de usuario o email vacíos
- Contraseñas más cortas que 6 caracteres
- Nombres de usuario o emails duplicados
- Fallos en la persistencia en base de datos
- Extracción de valores del contexto (fallback a "desconocido")

#### Procesamiento por Fases:
1. **CMD_START**: Logging inicial del intento de registro
2. **CMD_VALIDATION**: Validación básica de campos
3. **USER_CHECK**: Verificación de existencia de usuario
4. **ENTITY_CREATION**: Creación de entidad de usuario y encriptado de contraseña
5. **DB_PERSISTENCE**: Operación de guardado en base de datos
6. **CMD_COMPLETE**: Logging de éxito/fallo con ID de usuario

### 2. login_command.go

**Responsabilidad Principal**: Maneja las solicitudes de autenticación de usuarios, validando credenciales, verificando contraseñas y actualizando datos de sesión.

#### Características Clave:
- **Entrada Dual**: Acepta tanto nombre de usuario como email para login
- **Verificación Segura**: Comparación de hash de contraseñas
- **Gestión de Sesiones**: Actualiza timestamp de último login en éxito
- **Logging Completo**: Misma estructura de trazabilidad que el comando de registro
- **Manejo de Errores**: Errores genéricos para seguridad

#### Casos Borde Manejados:
- Campos de username/email o contraseña vacíos
- Usuarios inexistentes (devuelve error genérico)
- Contraseñas incorrectas (devuelve error genérico)
- Errores en base de datos durante búsqueda de usuario
- Fallos en actualización de last_login (no crítico, advertido)
- Valores de contexto faltantes (fallback a "desconocido")

#### Procesamiento por Fases:
1. **CMD_START**: Logging inicial del intento de login
2. **CMD_VALIDATION**: Validación básica de campos
3. **USER_LOOKUP**: Búsqueda de usuario en base de datos
4. **PASSWORD_VERIFICATION**: Verificación hash de contraseña
5. **PROFILE_UPDATE**: Actualización de timestamp de last_login
6. **CMD_COMPLETE**: Logging de éxito/fallo con ID de usuario

## Patrones Comunes

Ambos manejadores de comandos comparten:

### Estructura de Logging
- Extracción de ID de solicitud del contexto (fallback: "desconocido")
- Logging por fases para debugging
- Formato estandarizado: `[RequestId] [Phase: PhaseName] [Status: Status] Message`

### Manejo de Errores
- Errores contextualizados con logging
- Mensajes genéricos para el usuario por seguridad
- Distinción entre errores de validación y de sistema

### Arquitectura
- Estructura de comando que contiene datos de entrada
- Manejador que contiene dependencias (userRepo)
- Patrón de fábrica mediante funciones `New*Handler`
- Inyección de dependencias basada en interfaces

## Dependencias

Ambos comandos dependen de:
- `api-gateway/internal/domain/user/entities`: Operaciones de entidad de usuario
- `api-gateway/internal/domain/user/repositories`: Interfaz de repositorio de usuario
- Operaciones conscientes del contexto con soporte de trazabilidad

## Consideraciones de Seguridad

1. **Almacenamiento de Contraseñas**: Usa hashing (nunca almacena contraseñas en texto plano)
2. **Mensajes de Error**: Errores genéricos de autenticación para prevenir enumeración
3. **Validación de Entrada**: Validación estricta de todas las entradas de usuario
4. **Logging**: Nunca se loguean datos sensibles (contraseñas)

## Recomendaciones de Pruebas

1. **Pruebas Unitarias**: Prueban lógica de validación independientemente
2. **Pruebas de Integración**: Prueban interacciones con base de datos
3. **Cobertura de Casos Borde**: Prueban entradas vacías, condiciones límite
4. **Verificación de Logging**: Aseguran trazabilidad adecuada
5. **Pruebas de Concurrencia**: Múltiples registros/logins simultáneos

## Futuras Mejoras

1. **Rate Limiting**: Añadir límites de intentos para registro/login
2. **Verificación de Email**: Agregar confirmación por email para nuevos registros
3. **Autenticación Multifactor**: Soporte para 2FA
4. **Fortaleza de Contraseña**: Requisitos de contraseña más complejos
5. **Gestión de Sesiones**: Generación y validación de tokens JWT
# Documentación Técnica: Proceso de Inicio de Sesión (LoginGo)
**Fecha:** 2026-09-08

## 1. Introducción
El proceso de inicio de sesión en el sistema `ArchsGo` implementa un flujo de autenticación seguro siguiendo los principios de arquitectura limpia (Clean Architecture). El sistema permite la identificación del usuario mediante un identificador dual (nombre de usuario o correo electrónico), asegurando que la verificación de credenciales se realice de forma eficiente y protegiendo la información sensible contra ataques comunes.

## 2. Flujo de Ejecución (End-to-End)

El flujo de autenticación se desplaza a través de las siguientes capas:

### A. Capa de Interfaz (Interfaces/HTTP)
El punto de entrada es el `AuthHandler.Login`.
1. **Recepción**: Se recibe una solicitud HTTP POST con el payload JSON conteniendo `usernameOrEmail` y `password`.
2. **Binding y Validación Inicial**: Se utiliza Gin para validar que ambos campos sean obligatorios.
3. **Trazabilidad**: Se extrae el `RequestId` del contexto para permitir el seguimiento de la solicitud a través de todos los logs del sistema.
4. **Despacho**: Se encapsulan los datos en un `LoginCommand` y se delega la ejecución al `LoginHandler`.

### B. Capa de Aplicación (Application/Commands)
El `LoginHandler.Handle` coordina la transacción de autenticación.
1. **Validación de Negocio**: Se verifica que los campos no estén vacíos antes de proceder a la base de datos.
2. **Búsqueda de Identidad**: Se invoca al repositorio (`UserRepository`) mediante el método `FindByUsernameOrEmail`. Este método busca una coincidencia exacta en cualquiera de las dos columnas de la base de datos.
3. **Verificación de Credenciales**: Si el usuario es encontrado, se delega la validación de la contraseña a la entidad de dominio.
4. **Actualización de Actividad**: Una vez autenticado el usuario, se invoca el método `UpdateLastLogin` para registrar la fecha y hora del acceso, persistiendo el cambio mediante el repositorio.

### C. Capa de Dominio (Domain/Entities)
La entidad `UsersGo` es la encargada de la seguridad de las credenciales.
1. **Verificación de Password**: Implementa el método `VerifyPassword` que utiliza la librería **bcrypt** para comparar el hash almacenado en la base de datos con la contraseña en texto plano proporcionada por el usuario.
2. **Gestión de Estado**: Actualiza el campo `last_login` para propósitos de auditoría y seguridad.

### D. Capa de Infraestructura (Infrastructure/Repositories)
El `UserRepositoryImpl` ejecuta las operaciones de datos.
1. **Consulta**: Realiza una búsqueda optimizada en SQL Server utilizando un operador `OR` para filtrar por nombre de usuario o email.
2. **Persistencia**: Ejecuta la sentencia `UPDATE` para actualizar la marca de tiempo del último inicio de sesión.

---

## 3. Consideraciones Técnicas y Reglas de Negocio

| Factor | Implementación | Razón Técnica |
| :--- | :--- | :--- |
| **Seguridad de Credenciales** | Bcrypt Compare | Evita la exposición de contraseñas y es resistente a ataques de diccionario. |
| **Privacidad de Error** | Mensaje Genérico | El sistema retorna "usuario o contraseña incorrectos" tanto si el usuario no existe como si la clave es errónea, evitando la enumeración de usuarios. |
| **Identificador Dual** | `username` $\lor$ `email` | Mejora la experiencia de usuario permitiendo flexibilidad en el método de identificación. |
| **Trazabilidad** | `RequestId` | Permite correlacionar los logs de la capa HTTP con los de la capa de aplicación y dominio. |

---

## 4. Casos Borde (Edge Cases)

- **Usuario Inexistente**: El sistema detecta la ausencia del usuario en el repositorio y retorna un error de no autorizado (`http.StatusUnauthorized`) con un mensaje ambiguo por seguridad.
- **Contraseña Incorrecta**: Al fallar la verificación de `bcrypt`, se retorna el mismo error que en el caso de usuario inexistente.
- **Fallo en Actualización de Perfil**: Si la actualización de `last_login` falla, el sistema lo trata como un `WARNING` en los logs pero permite el acceso al usuario, ya que no es un fallo crítico para la autenticación.
- **JSON Malformado**: Se captura el error de binding de Gin y se retorna un `http.StatusBadRequest` inmediatamente.

---

## 5. Mapa de Responsabilidades (Archivos Vinculados)

| Archivo | Responsabilidad en el Flujo | Acción Recomendada ante Cambios |
| :--- | :--- | :--- |
| `auth_handler.go` | Entrada HTTP, parsing de JSON y respuesta final al cliente. | Modificar si cambia el formato de la respuesta o los endpoints. |
| `login_command.go` | Orquestación del flujo de búsqueda, verificación y actualización. | Modificar si se añade lógica de bloqueo de cuentas o MFA. |
| `user.go` | Lógica de verificación de password y actualización de timestamps. | Modificar si cambia el algoritmo de hashing o la entidad de usuario. |
| `user_repository_impl.go` | Implementación de la consulta SQL para búsqueda dual y update. | Modificar si se optimiza la query de búsqueda o se cambia la DB. |

---

## 6. Guía de Mantenimiento y Evolución

Dependiendo del cambio requerido, diríjase a la sección correspondiente:

- **$\rightarrow$ ¿Implementar Bloqueo de Cuenta tras N intentos?** $\implies$ Modificar `login_command.go` $\rightarrow$ `Handle` y añadir campos de intentos fallidos en `user.go`.
- **$\rightarrow$ ¿Añadir Autenticación de Dos Factores (2FA)?** $\implies$ Crear un nuevo flujo en `auth_handler.go` y añadir validación en `login_command.go`.
- **$\rightarrow$ ¿Cambiar la forma de buscar usuarios?** $\implies$ Modificar la implementación de `FindByUsernameOrEmail` en `user_repository_impl.go`.
- **$\rightarrow$ ¿Actualizar la política de seguridad de passwords?** $\implies$ Modificar la lógica de verificación en `user.go`.

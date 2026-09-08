# Documentación Técnica: Proceso de Creación de Usuarios (UsersGo)
**Fecha:** 2026-09-06

## 1. Introducción
El proceso de creación de usuarios en el sistema `ArchsGo` sigue una arquitectura limpia (Clean Architecture) basada en capas, separando estrictamente la interfaz de usuario (HTTP), la lógica de aplicación (Use Cases) y las reglas de dominio (Entities). El objetivo es garantizar que la creación de una identidad sea atómica, segura y validada en múltiples niveles.

## 2. Flujo de Ejecución (End-to-End)

El flujo de creación de un usuario se desplaza a través de las siguientes capas:

### A. Capa de Interfaz (Interfaces/HTTP)
El punto de entrada es el `AuthHandler.Register`.
1. **Recepción**: Se recibe una solicitud HTTP POST con el payload JSON.
2. **Binding y Validación Inicial**: Se utiliza el motor de binding de Gin para validar que los campos `username`, `email` y `password` estén presentes y que el email tenga un formato válido y la contraseña un mínimo de 6 caracteres.
3. **Despacho**: Si la validación es exitosa, se encapsulan los datos en un `RegisterCommand` y se delega la ejecución al `RegisterHandler`.

### B. Capa de Aplicación (Application/Commands)
El `RegisterHandler.Handle` coordina la transacción de negocio.
1. **Saneamiento**: Se eliminan espacios en blanco (`TrimSpace`) de los inputs.
2. **Verificación de Unicidad**: Se consulta el repositorio (`UserRepository`) para verificar si el `username` o el `email` ya existen en la base de datos. Si existe, se retorna un error de conflicto (`http.StatusConflict`).
3. **Instanciación de Dominio**: Se solicita al dominio la creación de una nueva entidad `UsersGo`.
4. **Persistencia**: Una vez obtenida la entidad válida, se invoca al repositorio para persistir el usuario en la base de datos.

### C. Capa de Dominio (Domain/Entities)
La entidad `UsersGo` es la encargada de mantener la integridad del negocio.
1. **Validación de Negocio**: El constructor `NewUser` valida que los campos no estén vacíos y que el email sea válido.
2. **Normalización**: El email se convierte a minúsculas y se limpian los espacios para evitar duplicados por capitalización.
3. **Seguridad (Hashing)**: Se implementa el hashing de la contraseña utilizando el algoritmo **bcrypt** con el costo por defecto. Nunca se almacena la contraseña en texto plano.
4. **Valores por Defecto**: Se asignan roles predeterminados (`User`), estado activo (`true`) y una imagen de perfil default.

### D. Capa de Infraestructura (Infrastructure/Repositories)
El `UserRepositoryImpl` traduce las operaciones de dominio a consultas de base de datos.
1. **Persistencia**: Utiliza GORM para ejecutar la sentencia `INSERT` en SQL Server.
2. **Contexto**: Se propaga el `context.Context` para permitir la cancelación de la solicitud o el rastreo (tracing) de la transacción.

---

## 3. Consideraciones Técnicas y Reglas de Negocio

| Factor | Implementación | Razón Técnica |
| :--- | :--- | :--- |
| **Seguridad** | Bcrypt | Resistencia contra ataques de fuerza bruta y rainbow tables. |
| **Unicidad** | `uniqueIndex` en DB | Garantiza la integridad a nivel de almacenamiento independientemente de la aplicación. |
| **Normalización** | `strings.ToLower` | Evita que `User@Email.com` y `user@email.com` sean tratados como cuentas distintas. |
| **Validación** | Multi-capa (Binding $\rightarrow$ Handler $\rightarrow$ Entity) | Defensa en profundidad: si una validación falla en la entrada, el dominio actúa como última línea de defensa. |

---

## 4. Casos Borde (Edge Cases)

- **Colisión de Identidad**: El sistema detecta si el email o el username ya están registrados antes de intentar la inserción, evitando errores crudos de SQL y proporcionando un mensaje amigable.
- **Inyecciones de Espacios**: El uso de `TrimSpace` en múltiples capas previene la creación de usuarios con nombres como `" admin "` que podrían confundir a los administradores.
- **Fallos de Base de Datos**: Si la conexión con SQL Server cae durante el `Create`, el error se propaga hacia arriba y se retorna un error 500, asegurando que el cliente no crea que el usuario fue creado.
- **Contraseñas Cortas**: Se valida tanto en el binding de Gin como en la lógica del handler para evitar datos inconsistentes.

---

## 5. Mapa de Responsabilidades (Archivos Vinculados)

| Archivo | Responsabilidad en el Flujo | Acción Recomendada ante Cambios |
| :--- | :--- | :--- |
| `auth_handler.go` | Entrada HTTP, parsing de JSON y respuesta al cliente. | Cambiar si se modifican los endpoints o el formato de respuesta. |
| `register.go` | Orquestación del flujo de registro y validación de existencia. | Cambiar si se añade lógica de negocio (ej. enviar email de bienvenida). |
| `user.go` | Reglas de integridad, hashing de password y normalización. | Cambiar si se modifica la política de contraseñas o el modelo de datos. |
| `user_repository.go` | Definición del contrato de acceso a datos (Interface). | Cambiar si se añaden nuevos métodos de búsqueda o filtrado. |
| `user_repository_impl.go` | Implementación técnica de persistencia en SQL Server. | Cambiar si se migra de base de datos o se optimizan queries. |

## 6. Guía de Mantenimiento y Evolución

Dependiendo del cambio requerido, diríjase a la sección correspondiente:

- **$\rightarrow$ ¿Cambiar el algoritmo de cifrado?** $\implies$ Modificar `user.go` $\rightarrow$ `SetPassword`.
- **$\rightarrow$ ¿Agregar un campo nuevo al registro (ej. Teléfono)?** $\implies$ Actualizar `auth_handler.go` (Request struct) $\rightarrow$ `register.go` (`RegisterCommand`) $\rightarrow$ `user.go` (Entity).
- **$\rightarrow$ ¿Cambiar la base de datos a MongoDB o PostgreSQL?** $\implies$ Crear nueva implementación de `UserRepository` en la capa de infraestructura.
- **$\rightarrow$ ¿Modificar el rol asignado por defecto?** $\implies$ Modificar el constructor `NewUser` en `user.go`.

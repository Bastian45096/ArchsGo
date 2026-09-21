// src/GoNET.Infrastructure/Logging/LogMessages.cs
//
// Mensajes centralizados para no repetir strings.
// Cada operacion tiene un patron de log definido aqui.
namespace GoNET.Infrastructure.Logging;

/// <summary>
/// Patrones de log para toda la aplicacion.
/// Usar con ILogger:
///   _logger.LogInformation(LogMessages.Register.Started, username);
/// </summary>
public static class LogMessages
{
    public static class Register
    {
        public const string Started =
            "╔══ REGISTRO INICIADO ══ Username: {Username}, Email: {Email}, IP: {IpAddress}";

        public const string ValidationPassed =
            "╠══ Validaciones OK para {Username}";

        public const string UsernameDuplicate =
            "╠══ FALLO: Username '{Username}' ya existe en BD";

        public const string EmailDuplicate =
            "╠══ FALLO: Email '{Email}' ya registrado en BD";

        public const string PasswordTooShort =
            "╠══ FALLO: Password muy corto ({Length} chars, minimo 6)";

        public const string AvatarSaving =
            "╠══ Guardando avatar para {Username} ({Size} chars base64)";

        public const string AvatarSaved =
            "╠══ Avatar guardado: {AvatarUrl}";

        public const string AvatarSkipped =
            "╠══ Sin avatar para {Username}";

        public const string CreatingUser =
            "╠══ Creando usuario en BD: {Username} ({Email})";

        public const string UserCreated =
            "╠══ Usuario creado exitosamente: Id={UserId}, Username={Username}";

        public const string TokenGenerated =
            "╠══ Token generado para {Username}";

        public const string Success =
            "╚══ REGISTRO EXITOSO ══ Id: {UserId}, Username: {Username}, Duracion: {Elapsed}ms";

        public const string Failed =
            "╚══ REGISTRO FALLIDO ══ Username: {Username}, Razon: {Reason}, Duracion: {Elapsed}ms";
    }

    public static class Login
    {
        public const string Started =
            "╔══ LOGIN INICIADO ══ UserOrEmail: {UserOrEmail}, IP: {IpAddress}";

        public const string UserFound =
            "╠══ Usuario encontrado: Id={UserId}, Username={Username}";

        public const string UserNotFound =
            "╠══ FALLO: Usuario no encontrado para '{UserOrEmail}'";

        public const string PasswordVerify =
            "╠══ Verificando password para {Username}...";

        public const string PasswordInvalid =
            "╠══ FALLO: Password incorrecto para {Username}";

        public const string Success =
            "╚══ LOGIN EXITOSO ══ Id: {UserId}, Username: {Username}, Duracion: {Elapsed}ms";

        public const string Failed =
            "╚══ LOGIN FALLIDO ══ UserOrEmail: {UserOrEmail}, Razon: {Reason}, Duracion: {Elapsed}ms";
    }

    public static class Database
    {
        public const string QueryExecuted =
            "║ SQL: {Query} | Parametros: {Params} | Duracion: {Elapsed}ms";

        public const string ConnectionOpened =
            "║ BD: Conexion abierta a {Database}";

        public const string ConnectionClosed =
            "║ BD: Conexion cerrada a {Database}";
    }

    public static class Middleware
    {
        public const string RequestStarted =
            "┌── HTTP {Method} {Path} desde {IP} ({Browser}/{OS})";

        public const string RequestCompleted =
            "└── HTTP {Method} {Path} → {StatusCode} en {Elapsed}ms | Riesgo: {Risk} | Memoria: {MemoryDelta} bytes";

        public const string RequestError =
            "└── HTTP {Method} {Path} → ERROR {StatusCode} en {Elapsed}ms | {ErrorMessage}";
    }
}
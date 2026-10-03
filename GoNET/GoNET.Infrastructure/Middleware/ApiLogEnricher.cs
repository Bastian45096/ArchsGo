// GoNET.Infrastructure/Middleware/ApiLogEnricher.cs
using Microsoft.AspNetCore.Http;
namespace GoNET.Infrastructure.Middleware;

/// <summary>
/// Claves que el ApiLoggingMiddleware lee al final del request para
/// enriquecer el registro de auditoría con datos que solo el controller
/// conoce (ej: el usuario que acaba de registrarse/loguearse, cuando
/// aún no existe un JWT en el HttpContext).
///
/// Uso en un controller:
///   context.EnrichApiLog(usuarioId: 4, nombre: "Azure", email: "x@y.com");
///   context.EnrichApiLog(notas: "Cold start de BD detectado");
/// </summary>
public static class ApiLogEnricher
{
    public const string KeyUsuarioId = "ApiLog:UsuarioId";
    public const string KeyUsuarioNombre = "ApiLog:UsuarioNombre";
    public const string KeyUsuarioEmail = "ApiLog:UsuarioEmail";
    public const string KeyUsuarioRoles = "ApiLog:UsuarioRoles";
    public const string KeyNotas = "ApiLog:Notas";

    /// <summary>Etiqueta el request con la identidad del usuario resultante.</summary>
    public static void EnrichApiLog(
        this HttpContext context,
        int? usuarioId = null,
        string? nombre = null,
        string? email = null,
        string? roles = null,
        string? notas = null)
    {
        if (usuarioId.HasValue) context.Items[KeyUsuarioId] = usuarioId.Value;
        if (!string.IsNullOrEmpty(nombre)) context.Items[KeyUsuarioNombre] = nombre;
        if (!string.IsNullOrEmpty(email)) context.Items[KeyUsuarioEmail] = email;
        if (!string.IsNullOrEmpty(roles)) context.Items[KeyUsuarioRoles] = roles;
        if (!string.IsNullOrEmpty(notas)) context.Items[KeyNotas] = notas;
    }
}
// src/GoNET.Infrastructure/Middleware/ApiLoggingMiddleware.cs
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GoNET.Application.Interfaces;
using GoNET.Domain.entities;

namespace GoNET.Infrastructure.Middleware;

public class ApiLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiLoggingMiddleware> _logger;

    public ApiLoggingMiddleware(RequestDelegate next, ILogger<ApiLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await _next(context);
            return;
        }

        var traceId = Guid.NewGuid().ToString("N")[..16];
        var stopwatch = Stopwatch.StartNew();
        var memoriaAntes = GC.GetTotalMemory(false);
        var threadId = Environment.CurrentManagedThreadId;
        var method = context.Request.Method;
        var path = context.Request.Path;
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var ua = context.Request.Headers.UserAgent.ToString();
        var (browser, os, device) = ParseUserAgent(ua);

        _logger.LogInformation("┌── PETICION ENTRANTE ── {TraceId}", traceId);
        _logger.LogInformation("│  {Method} {Path}", method, path);
        _logger.LogInformation("│  IP: {IP} | {Browser}/{OS} ({Device})", ip, browser, os, device);
        _logger.LogInformation("│  Host: {Host} | Schema: {Scheme} | Protocol: {Protocol}", context.Request.Host, context.Request.Scheme, context.Request.Protocol);

        if (context.Request.QueryString.HasValue)
            _logger.LogInformation("│  Query: {Query}", context.Request.QueryString);

        if (context.User.Identity?.IsAuthenticated == true)
            _logger.LogInformation("│  Usuario: {Name} (Id: {Id})", context.User.Identity.Name, context.User.FindFirstValue(ClaimTypes.NameIdentifier));

        string? requestBody = null;
        int statusCode = 200;
        string? errorMessage = null;
        string? stackTrace = null;
        string? tipoExcepcion = null;
        string? innerException = null;
        string? responseBody = null;
        long responseBytes = 0;

        if (method is "POST" or "PUT" or "PATCH")
        {
            requestBody = await ReadAndMaskBody(context);
            _logger.LogDebug("│  Body: {Body}", Truncate(requestBody, 500));
        }

        var originalBody = context.Response.Body;
        using var captured = new MemoryStream();
        context.Response.Body = captured;

        try
        {
            _logger.LogDebug("│  Ejecutando pipeline...");
            await _next(context);
            statusCode = context.Response.StatusCode;
            _logger.LogInformation("│  Respuesta: {StatusCode} ({Status})", statusCode, StatusMessage(statusCode));
        }
        catch (Exception ex)
        {
            statusCode = 500;
            errorMessage = ex.Message;
            stackTrace = ex.StackTrace;
            tipoExcepcion = ex.GetType().FullName;
            innerException = ex.InnerException?.Message;
            _logger.LogError(ex, "│  EXCEPCION: {Type}: {Message}", tipoExcepcion, errorMessage);
            throw;
        }
        finally
        {
            stopwatch.Stop();
            var memoriaDespues = GC.GetTotalMemory(false);

            captured.Position = 0;
            responseBody = await ReadStreamSafe(captured);
            responseBytes = captured.Length;
            captured.Position = 0;
            await captured.CopyToAsync(originalBody);
            context.Response.Body = originalBody;

            var (riskLevel, riskReason) = AnalyzeRisk(context, statusCode, errorMessage, stopwatch.ElapsedMilliseconds);

            if (statusCode >= 500)
                _logger.LogError("└── {Method} {Path} → {StatusCode} en {Ms}ms | Riesgo: {Risk} | Mem: +{Mem} bytes", method, path, statusCode, stopwatch.ElapsedMilliseconds, riskLevel, memoriaDespues - memoriaAntes);
            else if (statusCode >= 400)
                _logger.LogWarning("└── {Method} {Path} → {StatusCode} en {Ms}ms | Riesgo: {Risk}", method, path, statusCode, stopwatch.ElapsedMilliseconds, riskLevel);
            else
                _logger.LogInformation("└── {Method} {Path} → {StatusCode} en {Ms}ms | Riesgo: {Risk} | Mem: +{Mem} bytes", method, path, statusCode, stopwatch.ElapsedMilliseconds, riskLevel, memoriaDespues - memoriaAntes);

            try
            {
                using var scope = context.RequestServices.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IApiGoNetRepository>();

                // ══════════════════════════════════════════════════════════
                //  IDENTIDAD: Items (dejado por el controller) con fallback a claims
                //
                //  En register/login NO existe JWT — el controller deja los datos
                //  del usuario resultante en HttpContext.Items via ApiLogEnricher.
                //  En endpoints [Authorize], los claims son la fuente.
                // ══════════════════════════════════════════════════════════
                var userId = ResolveInt(context, ApiLogEnricher.KeyUsuarioId)
                             ?? TryParseInt(context.User.FindFirstValue(ClaimTypes.NameIdentifier));
                var userName = ResolveString(context, ApiLogEnricher.KeyUsuarioNombre)
                             ?? context.User.FindFirstValue(ClaimTypes.Name);
                var userEmail = ResolveString(context, ApiLogEnricher.KeyUsuarioEmail)
                             ?? context.User.FindFirstValue(ClaimTypes.Email);

                var userRoles = context.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
                var userClaims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();

                var rolesFromItems = ResolveString(context, ApiLogEnricher.KeyUsuarioRoles);
                var notasFromItems = ResolveString(context, ApiLogEnricher.KeyNotas);

                var endpoint = context.GetEndpoint();
                var routeValues = context.GetRouteData()?.Values;

                // ═══ EndpointTemplate: DisplayName si existe, sino armado desde route values ═══
                var endpointTemplate = endpoint?.DisplayName;
                if (string.IsNullOrEmpty(endpointTemplate) && routeValues?.Any() == true)
                {
                    var ctrl = routeValues["controller"]?.ToString();
                    var act = routeValues["action"]?.ToString();
                    if (!string.IsNullOrEmpty(ctrl))
                        endpointTemplate = $"api/{ctrl}/{act}";
                }

                // ═══ Notas: combinamos lo que dejó el controller + contexto técnico ═══
                var notas = BuildNotas(context, notasFromItems, stopwatch.ElapsedMilliseconds);

                await repo.AddAsync(new ApiGoNet
                {
                    TraceId = traceId,
                    UsuarioId = userId,
                    UsuarioNombre = Truncate(userName, 100),
                    UsuarioEmail = Truncate(userEmail, 200),
                    EstaAutenticado = context.User.Identity?.IsAuthenticated ?? false,
                    UsuarioRoles = userRoles.Any() ? JsonSerializer.Serialize(userRoles) : rolesFromItems,
                    UsuarioClaims = userClaims.Any() ? JsonSerializer.Serialize(userClaims) : null,
                    MetodoHttp = method,
                    Endpoint = path,
                    EndpointTemplate = Truncate(endpointTemplate, 500),
                    ControllerNombre = routeValues?["controller"]?.ToString(),
                    ActionNombre = routeValues?["action"]?.ToString(),
                    QueryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : null,
                    RouteValues = routeValues?.Any() == true ? JsonSerializer.Serialize(routeValues.ToDictionary(r => r.Key, r => r.Value?.ToString())) : null,
                    CuerpoPeticion = requestBody,
                    TamanoPeticionBytes = context.Request.ContentLength ?? 0,
                    ContentTypePeticion = context.Request.ContentType,
                    HeadersPeticion = CaptureHeaders(context.Request.Headers, new[] { "Authorization", "Cookie" }),
                    EstadoHttp = statusCode,
                    Mensaje = StatusMessage(statusCode),
                    CuerpoRespuesta = Truncate(responseBody, 10000),
                    TamanoRespuestaBytes = responseBytes,
                    ContentTypeRespuesta = context.Response.ContentType,
                    HeadersRespuesta = CaptureHeaders(context.Response.Headers),
                    MensajeError = errorMessage,
                    StackTrace = Truncate(stackTrace, 5000),
                    TipoExcepcion = tipoExcepcion,
                    InnerException = Truncate(innerException, 2000),
                    DireccionIp = ip,
                    IpReal = GetRealIp(context),
                    AgenteUsuario = Truncate(ua, 1000) ?? string.Empty,
                    Browser = browser,
                    SistemaOperativo = os,
                    TipoDispositivo = device,
                    Host = context.Request.Host.Value,
                    Esquema = context.Request.Scheme,
                    Protocolo = context.Request.Protocol,
                    Puerto = context.Connection.RemotePort,
                    Origin = context.Request.Headers.Origin.ToString(),
                    Referer = context.Request.Headers.Referer.ToString(),
                    AcceptLanguage = context.Request.Headers.AcceptLanguage.ToString(),
                    DuracionMs = stopwatch.ElapsedMilliseconds,
                    NivelRiesgo = riskLevel,
                    RiesgoRazon = riskReason,
                    MemoriaAntesBytes = memoriaAntes,
                    MemoriaDespuesBytes = memoriaDespues,
                    MemoriaDeltaBytes = memoriaDespues - memoriaAntes,
                    Maquina = Environment.MachineName,
                    Entorno = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                    DotnetVersion = Environment.Version.ToString(),
                    ThreadId = threadId,
                    FechaCreacion = DateTime.UtcNow,
                    EsExitoso = statusCode is >= 200 and <= 299,
                    EsExcepcion = statusCode == 500,
                    Notas = notas
                });
            }
            catch { }
        }
    }

    // ══════════════════════════════════════════════════════════════
    //  HELPERS para leer los Items dejados por el controller
    // ══════════════════════════════════════════════════════════════
    private static int? ResolveInt(HttpContext ctx, string key)
    {
        if (ctx.Items.TryGetValue(key, out var v) && v is int i) return i;
        if (ctx.Items.TryGetValue(key, out var s) && int.TryParse(s?.ToString(), out var p)) return p;
        return null;
    }

    private static string? ResolveString(HttpContext ctx, string key)
    {
        return ctx.Items.TryGetValue(key, out var v) ? v?.ToString() : null;
    }

    private static int? TryParseInt(string? value)
        => int.TryParse(value, out var i) ? i : null;

    private static string? BuildNotas(HttpContext ctx, string? notasController, long ms)
    {
        var partes = new List<string>();

        if (!string.IsNullOrEmpty(notasController))
            partes.Add(notasController);

        // ─── Autenticación: 3 estados ───
        if (ctx.User.Identity?.IsAuthenticated == true)
            partes.Add("JWT valido");
        else if (ctx.Items.ContainsKey(ApiLogEnricher.KeyUsuarioId))
            partes.Add("Identificado post-login/registro (sin JWT al llegar)");   // ⬅️ NUEVO estado
        else
            partes.Add("Anonimo");   // ⬅️ ahora SOLO significa anónimo de verdad

        if (ms > 5000)
            partes.Add($"Latencia alta ({ms}ms) — posible cold start de BD");

        return partes.Any() ? string.Join(" | ", partes) : null;
    }

    private static async Task<string> ReadAndMaskBody(HttpContext context)
    {
        context.Request.EnableBuffering();
        using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0;
        if (string.IsNullOrWhiteSpace(body)) return body;
        try
        {
            var json = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(body);
            if (json == null) return body;
            foreach (var key in json.Keys.ToList())
            {
                var lower = key.ToLower();
                if (lower.Contains("password") || lower.Contains("token") || lower.Contains("secret"))
                    json[key] = JsonSerializer.SerializeToElement("***");
                else if (lower.Contains("avatar") || lower.Contains("base64") || lower.Contains("image"))
                {
                    var raw = json[key].GetRawText();
                    json[key] = JsonSerializer.SerializeToElement($"[{raw.Length} chars]");
                }
            }
            return JsonSerializer.Serialize(json);
        }
        catch { return body; }
    }

    private static async Task<string> ReadStreamSafe(Stream stream)
    {
        try { using var r = new StreamReader(stream, Encoding.UTF8, leaveOpen: true); return await r.ReadToEndAsync(); }
        catch { return "[unreadable]"; }
    }

    private static string CaptureHeaders(IHeaderDictionary headers, string[]? redact = null)
    {
        try
        {
            var d = new Dictionary<string, string>();
            foreach (var h in headers)
                d[h.Key] = redact != null && redact.Contains(h.Key, StringComparer.OrdinalIgnoreCase) ? "[REDACTED]" : h.Value.ToString();
            return JsonSerializer.Serialize(d);
        }
        catch { return "{}"; }
    }

    private static string? GetRealIp(HttpContext ctx)
    {
        var f = ctx.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(f)) return f.Split(',')[0].Trim();
        return ctx.Request.Headers["X-Real-IP"].FirstOrDefault();
    }

    private static (string, string, string) ParseUserAgent(string ua)
    {
        if (string.IsNullOrEmpty(ua)) return ("unknown", "unknown", "unknown");
        string b = "unknown", o = "unknown", d = "desktop";
        if (ua.Contains("Edg/")) b = "Edge"; else if (ua.Contains("Chrome")) b = "Chrome";
        else if (ua.Contains("Firefox")) b = "Firefox"; else if (ua.Contains("Safari") && !ua.Contains("Chrome")) b = "Safari";
        else if (ua.Contains("Postman")) b = "Postman"; else if (ua.Contains("curl")) b = "curl";
        if (ua.Contains("Windows NT 10")) o = "Windows 10/11"; else if (ua.Contains("Windows")) o = "Windows";
        else if (ua.Contains("Mac OS X")) o = "macOS"; else if (ua.Contains("Android")) o = "Android";
        else if (ua.Contains("Linux")) o = "Linux"; else if (ua.Contains("iPhone")) o = "iOS";
        if (ua.Contains("Mobile") || ua.Contains("Android")) d = "mobile";
        else if (ua.Contains("Tablet") || ua.Contains("iPad")) d = "tablet";
        return (b, o, d);
    }

    private static (string, string?) AnalyzeRisk(HttpContext ctx, int code, string? err, long ms)
    {
        if (code == 500) return ("critico", $"Excepcion: {Truncate(err, 200)}");
        if (code == 401) return ("alto", "No autorizado");
        if (code == 403) return ("alto", "Prohibido");
        if (code == 400 && ctx.Request.Path.ToString().Contains("login")) return ("alto", "Login fallido");
        if (ms > 5000) return ("alto", $"Lenta: {ms}ms");
        if (code == 400) return ("medio", "Validacion");
        if (code == 404) return ("medio", "No encontrado");
        if (ctx.Request.Method == "DELETE") return ("medio", "Destructiva");
        return ("bajo", null);
    }

    private static string StatusMessage(int c) => c switch
    {
        200 => "OK", 201 => "Creado", 400 => "Bad Request",
        401 => "Unauthorized", 403 => "Forbidden", 404 => "Not Found",
        500 => "Internal Error", _ => $"HTTP {c}"
    };

    private static string? Truncate(string? t, int m)
    {
        if (string.IsNullOrEmpty(t)) return t;
        return t.Length > m ? t[..m] + "...[truncated]" : t;
    }
}
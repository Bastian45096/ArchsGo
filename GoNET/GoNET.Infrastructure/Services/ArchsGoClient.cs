// GoNET.Infrastructure/Services/ArchsGoClient.cs
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;                        // ⬅️ NUEVO — ILogger<>
using Microsoft.Extensions.Configuration;                  // ⬅️ (por si luego lees la URL del config)
using GoNET.Application.Interfaces;

namespace GoNET.Infrastructure.Services;

public class ArchsGoClient : IArchsGoClient
{
    private readonly HttpClient _http;
    private readonly ILogger<ArchsGoClient> _logger;

    public ArchsGoClient(HttpClient http, ILogger<ArchsGoClient> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<ArchsGoLoginResult> LoginAsync(string usernameOrEmail, string password)
    {
        var payload = new
        {
            usernameOrEmail,
            password
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _logger.LogInformation(@"
┌───────────────────────────────────────────────────────────────────────┐
│  ARCHSGO CLIENT │  Validando credenciales en ArchsGo (Go)            │
├───────────────────────────────────────────────────────────────────────┤
│  URL:       http://localhost:8080/api/auth/login                      │
│  Input:     {Input,-53}│
│  Estado:    Enviando request...                                       │
└───────────────────────────────────────────────────────────────────────┘",
            usernameOrEmail);

        var sw = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            var response = await _http.PostAsync("http://localhost:8080/api/auth/login", content);
            var body = await response.Content.ReadAsStringAsync();
            sw.Stop();

            _logger.LogInformation(@"│  HTTP:      {Status}                                                  │
│  Body:      {Body,-53}│
│  Tiempo:    {Ms}ms                                                    │
└───────────────────────────────────────────────────────────────────────┘",
                (int)response.StatusCode,
                body.Length > 53 ? body[..50] + "..." : body,
                sw.ElapsedMilliseconds);

            if (response.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(body);
                var root = doc.RootElement;

                var userId = root.GetProperty("userId").GetInt32();
                var username = root.TryGetProperty("username", out var u) ? u.GetString() : null;
                var email = root.TryGetProperty("email", out var e) ? e.GetString() : null;

                _logger.LogInformation(@"│  Resultado: CREDENCIALES VALIDAS (ArchsGo UserId={Id})                │
└───────────────────────────────────────────────────────────────────────┘", userId);

                return new ArchsGoLoginResult(true, userId, username, email, null);
            }

            // 401 / 400 / 409 — credenciales inválidas u otro error
            string errorMsg = "Credenciales de ArchsGo incorrectas";
            try
            {
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("error", out var err))
                    errorMsg = err.GetString() ?? errorMsg;
            }
            catch { /* body no es JSON, usamos el mensaje default */ }

            _logger.LogWarning(@"│  Resultado: RECHAZADO — {Error}│
└───────────────────────────────────────────────────────────────────────┘", errorMsg);

            return new ArchsGoLoginResult(false, null, null, null, errorMsg);
        }
        catch (HttpRequestException ex)
        {
            sw.Stop();
            _logger.LogError(ex, @"│  ARCHSGO NO RESPONDE │  http://localhost:8080 inaccesible           │
└───────────────────────────────────────────────────────────────────────┘");
            return new ArchsGoLoginResult(false, null, null, null,
                "No se pudo conectar con ArchsGo. Verifica que esté corriendo en el puerto 8080.");
        }
    }
}
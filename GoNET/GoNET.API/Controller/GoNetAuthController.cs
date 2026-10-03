// GoNETAPI/Controllers/GoNetAuthController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;                    // ⬅️ NUEVO — fix CS0246 HttpContext
using Microsoft.AspNetCore.Mvc;
using GoNET.Application.DTOs;
using GoNET.Application.Interfaces;
using GoNET.Infrastructure.Middleware;

namespace GoNETAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class GoNetAuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public GoNetAuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromBody] RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);

        if (!result.Success)
        {
            // Auditoría: motivo del rechazo (útil para detectar registros repetidos)
            HttpContext.EnrichApiLog(notas: $"Registro rechazado: {Trunc(result.Message, 150)}");
            return Conflict(result);
        }

        // ⬅️ Datos del usuario recién creado — no hay JWT en este request
        HttpContext.EnrichApiLog(
            usuarioId: result.User?.Id,
            nombre: result.User?.DisplayName,
            email: result.User?.Email,
            notas: "Nuevo usuario registrado");

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);

        if (!result.Success)
        {
            // ⬅️ Útil para detectar fuerza bruta: intento fallido con este email
            HttpContext.EnrichApiLog(
                email: request.Email,
                notas: $"Login fallido para: {Trunc(request.Email, 100)}");
            return Unauthorized(result);
        }

        // ⬅️ FIX CS1061: ya no accedemos a result.User.estado (UserDto no lo tiene)
        HttpContext.EnrichApiLog(
            usuarioId: result.User?.Id,
            nombre: result.User?.DisplayName,
            email: result.User?.Email,
            notas: "Login exitoso");

        return Ok(result);
    }

    // SIN [Authorize] — el link es login/registro federado.
    [HttpPost("link-archsgo")]
    public async Task<ActionResult<AuthResponse>> LinkArchsGo(
        [FromBody] LinkArchsGoRequest request)
    {
        var result = await _auth.LinkArchsGoAsync(request);

        if (!result.Success)
        {
            var nota = result.Message?.Contains("otra cuenta") == true
                ? "Link rechazado: ya vinculado a otra cuenta ArchsGo"
                : result.Message?.Contains("incorrectas") == true
                    ? "Link rechazado: credenciales ArchsGo invalidas"
                    : $"Link fallido: {Trunc(result.Message, 120)}";

            HttpContext.EnrichApiLog(notas: nota);

            if (result.Message?.Contains("otra cuenta") == true)
                return Conflict(result);
            if (result.Message?.Contains("incorrectas") == true)
                return Unauthorized(result);
            return BadRequest(result);
        }

        // El link es registro O login federado — registrar quién quedó autenticado
        HttpContext.EnrichApiLog(
            usuarioId: result.User?.Id,
            nombre: result.User?.DisplayName,
            email: result.User?.Email,
            notas: "Login federado via ArchsGo");

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var user = await _auth.GetUserByIdAsync(int.Parse(userId));

        if (user is null)
            return NotFound();

        return Ok(user);
    }

    private static string? Trunc(string? t, int m)
        => string.IsNullOrEmpty(t) ? t : (t.Length > m ? t[..m] + "..." : t);
}
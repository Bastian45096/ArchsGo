// GoNETAPI/Controllers/AuthController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GoNET.Application.DTOs;
using GoNET.Application.Interfaces;

namespace GoNETAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromBody] RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);

        if (!result.Success)
            return Conflict(result);

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);

        if (!result.Success)
            return Unauthorized(result);

        return Ok(result);
    }

    // ⬅️ SIN [Authorize] — el link es un mecanismo de login/registro federado.
    // La seguridad vive en que las credenciales de ArchsGo se validan en ArchsGo.
    [HttpPost("link-archsgo")]
    public async Task<ActionResult<AuthResponse>> LinkArchsGo(
        [FromBody] LinkArchsGoRequest request)
    {
        var result = await _auth.LinkArchsGoAsync(request);

        if (!result.Success)
        {
            // Conflictos reales (ya vinculado a otra cuenta ArchsGo) → 409
            if (result.Message?.Contains("otra cuenta") == true)
                return Conflict(result);

            // Credenciales rechazadas por ArchsGo → 401
            if (result.Message?.Contains("incorrectas") == true)
                return Unauthorized(result);

            // Errores de datos/validación → 400
            return BadRequest(result);
        }

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
}
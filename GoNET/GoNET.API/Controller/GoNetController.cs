// src/GoNET.API/Controllers/GoNetController.cs
//
// POR QUE EXISTE:
// Puerta de entrada HTTP.
// Recibe request → crea Command → despacha via MediatR.
// NO tiene logica de negocio.
//
// La peticion ANTES pasa por ApiLoggingMiddleware
// (guarda en api_gonet) y DESPUES llega aqui.
using MediatR;
using Microsoft.AspNetCore.Mvc;
using GoNET.Application.Commands.Register;
using GoNET.Application.DTOs;

namespace GoNET.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoNetController : ControllerBase
{
    private readonly IMediator _mediator;

    public GoNetController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// POST /api/gonet/register
    ///
    /// Crea cuenta nueva.
    /// El ApiLoggingMiddleware ya guardo la peticion en api_gonet.
    /// Aqui solo despachamos el command y devolvemos el resultado.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest req)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var ua = Request.Headers.UserAgent.ToString();

        var result = await _mediator.Send(
            RegisterCommand.From(req, ip, ua));

        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(
            nameof(Register),
            new { userId = result.Data!.Id },
            result.Data);
    }
}
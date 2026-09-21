// src/GoNET.Application/Commands/Register/RegisterCommand.cs
//
// POR QUE EXISTE:
// Encapsula la intencion de crear cuenta.
// MediatR lo enruta al RegisterCommandHandler.
using MediatR;
using GoNET.Application.Common;
using GoNET.Application.DTOs;

namespace GoNET.Application.Commands.Register;

public class RegisterCommand : IRequest<Result<UsuarioDto>>
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? AvatarBase64 { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    public static RegisterCommand From(RegisterRequest req, string? ip, string? ua) => new()
    {
        Username = req.Username,
        Email = req.Email,
        DisplayName = req.DisplayName,
        Password = req.Password,
        AvatarBase64 = req.AvatarBase64,
        IpAddress = ip,
        UserAgent = ua
    };
}
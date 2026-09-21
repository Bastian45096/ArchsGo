// src/GoNET.Application/DTOs/UsuarioDto.cs
//
// POR QUE EXISTE:
// Datos de usuario para enviar al frontend.
// NUNCA se envia PasswordHash ni SecurityStamp.
namespace GoNET.Application.DTOs;

public class UsuarioDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string Estado { get; set; } = "offline";
    public bool TieneCuentaArchsGo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public string Token { get; set; } = string.Empty;
}
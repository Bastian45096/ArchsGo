// GoNET.Application/DTOs/RegisterRequest.cs
using System.ComponentModel.DataAnnotations;

namespace GoNET.Application.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Entre 3 y 50 caracteres")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "Mínimo 6 caracteres")]
    public string Password { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string? AvatarBase64 { get; set; }
}
// GoNET.Application/DTOs/LoginRequest.cs
using System.ComponentModel.DataAnnotations;

namespace GoNET.Application.DTOs;

public class LoginRequest
{
    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "Mínimo 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}
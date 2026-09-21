// GoNET.Infrastructure/Identity/CustomPasswordValidator.cs
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using GoNET.Domain.entities;

namespace GoNET.Infrastructure.Identity;

/// <summary>
/// Validador de contraseñas custom para GoNET.
/// Reglas: mínimo 6 caracteres, 1 mayúscula, 1 número y 2 caracteres especiales.
/// Complementa las PasswordOptions estándar de Identity (que solo soportan 1 especial).
/// </summary>
public class CustomPasswordValidator : IPasswordValidator<Usuario>
{
    private static readonly Regex UpperCaseRegex = new(@"[A-Z]", RegexOptions.Compiled);
    private static readonly Regex DigitRegex = new(@"\d", RegexOptions.Compiled);
    private static readonly Regex SpecialCharRegex = new(@"[^A-Za-z0-9]", RegexOptions.Compiled);

    private const int RequiredSpecialChars = 2;
    private const int MinLength = 6;

    public Task<IdentityResult> ValidateAsync(UserManager<Usuario> manager, Usuario? user, string? password)
    {
        var errors = new List<IdentityError>();

        if (string.IsNullOrEmpty(password))
        {
            errors.Add(new IdentityError
            {
                Code = "PasswordEmpty",
                Description = "La contraseña es obligatoria"
            });
            return Task.FromResult(IdentityResult.Failed(errors.ToArray()));
        }

        // ═══ Regla 1: longitud mínima ═══
        if (password.Length < MinLength)
        {
            errors.Add(new IdentityError
            {
                Code = "PasswordTooShort",
                Description = $"La contraseña debe tener al menos {MinLength} caracteres"
            });
        }

        // ═══ Regla 2: al menos una mayúscula ═══
        if (!UpperCaseRegex.IsMatch(password))
        {
            errors.Add(new IdentityError
            {
                Code = "PasswordRequiresUpper",
                Description = "La contraseña debe incluir al menos una mayúscula"
            });
        }

        // ═══ Regla 3: al menos un número ═══
        if (!DigitRegex.IsMatch(password))
        {
            errors.Add(new IdentityError
            {
                Code = "PasswordRequiresDigit",
                Description = "La contraseña debe incluir al menos un número"
            });
        }

        // ═══ Regla 4: al menos DOS caracteres especiales ═══
        //     (Identity nativo solo soporta exigir UNO — por esto existe este validador)
        var specialCount = SpecialCharRegex.Matches(password).Count;
        if (specialCount < RequiredSpecialChars)
        {
            errors.Add(new IdentityError
            {
                Code = "PasswordRequiresSpecialChars",
                Description = $"La contraseña debe incluir al menos {RequiredSpecialChars} caracteres especiales (ej: !@#$%&*)"
            });
        }

        return Task.FromResult(errors.Count > 0
            ? IdentityResult.Failed(errors.ToArray())
            : IdentityResult.Success);
    }
}
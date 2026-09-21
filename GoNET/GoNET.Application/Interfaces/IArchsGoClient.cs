namespace GoNET.Application.Interfaces;

/// <summary>Resultado de validar credenciales contra ArchsGo.</summary>
public record ArchsGoLoginResult(
    bool Success,
    int? UserId,
    string? Username,
    string? Email,
    string? Error);

public interface IArchsGoClient
{
    /// <summary>Valida credenciales contra el login de ArchsGo (Go) vía HTTP.</summary>
    Task<ArchsGoLoginResult> LoginAsync(string usernameOrEmail, string password);
}
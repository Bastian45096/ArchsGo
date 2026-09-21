// GoNET.Application/Interfaces/IAuthService.cs
using GoNET.Application.DTOs;

namespace GoNET.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto?> GetUserByIdAsync(int userId);
    Task<AuthResponse> LinkArchsGoAsync(LinkArchsGoRequest request);
}
// src/GoNET.Infrastructure/Services/TokenGeneratorService.cs
using System.Text;
using GoNET.Application.Interfaces;

namespace GoNET.Infrastructure.Services;

public class TokenGeneratorService : ITokenGenerator
{
    public string Generate(int userId, string username)
    {
        return Convert.ToBase64String(
            Encoding.UTF8.GetBytes(
                $"{userId}:{username}:{DateTime.UtcNow.Ticks}"));
    }
}
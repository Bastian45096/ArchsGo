// src/GoNET.Infrastructure/Services/PasswordHasherService.cs
//
// POR QUE EXISTE:
// Aunque Identity hashea passwords via UserManager,
// esta clase existe para verificar passwords en login
// sin UserManager (si fuera necesario).
using System.Security.Cryptography;
using System.Text;
using GoNET.Application.Interfaces;

namespace GoNET.Infrastructure.Services;

public class PasswordHasherService : IPasswordHasher
{
    private const string Salt = "GoNET_Salt_2024";

    public string Hash(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(
            Encoding.UTF8.GetBytes(password + Salt));
        return Convert.ToBase64String(bytes);
    }

    public bool Verify(string password, string hash)
    {
        return Hash(password) == hash;
    }
}
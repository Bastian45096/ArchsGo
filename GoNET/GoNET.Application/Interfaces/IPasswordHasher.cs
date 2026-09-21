// src/GoNET.Application/Interfaces/IPasswordHasher.cs
namespace GoNET.Application.Interfaces;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
// src/GoNET.Application/Interfaces/ITokenGenerator.cs
namespace GoNET.Application.Interfaces;

public interface ITokenGenerator
{
    string Generate(int userId, string username);
}
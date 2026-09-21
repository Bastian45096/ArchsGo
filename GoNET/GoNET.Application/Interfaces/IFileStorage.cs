// src/GoNET.Application/Interfaces/IFileStorage.cs
namespace GoNET.Application.Interfaces;

public interface IFileStorage
{
    Task<string?> SaveAvatarAsync(string? base64Image);
}
// src/GoNET.Infrastructure/Services/FileStorageService.cs
using GoNET.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace GoNET.Infrastructure.Services;

public class FileStorageService : IFileStorage
{
    private readonly ILogger<FileStorageService> _logger;

    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    public FileStorageService(ILogger<FileStorageService> logger)
    {
        _logger = logger;
    }

    public async Task<string?> SaveAvatarAsync(string? base64Image)
    {
        if (string.IsNullOrEmpty(base64Image))
            return null;

        try
        {
            var base64 = base64Image;
            var extension = ".png";

            // Si viene como data URL: "data:image/jpeg;base64,/9j/4AAQ..."
            if (base64.Contains(','))
            {
                var parts = base64.Split(',', 2);
                var header = parts[0]; // "data:image/jpeg;base64"
                base64 = parts[1];

                if (header.Contains("jpeg") || header.Contains("jpg"))
                    extension = ".jpg";
                else if (header.Contains("png"))
                    extension = ".png";
                else if (header.Contains("gif"))
                    extension = ".gif";
                else if (header.Contains("webp"))
                    extension = ".webp";
            }

            var bytes = Convert.FromBase64String(base64);

            if (bytes.Length > MaxFileSizeBytes)
            {
                _logger.LogWarning("Avatar demasiado grande: {Size} bytes (max 5MB)", bytes.Length);
                return null;
            }

            var fileName = $"avatar_{Guid.NewGuid():N}{extension}";

            // Ruta absoluta robusta (no relativa al cwd)
            var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var dir = Path.Combine(webRoot, "uploads", "avatars");
            var path = Path.Combine(dir, fileName);

            Directory.CreateDirectory(dir);
            await File.WriteAllBytesAsync(path, bytes);

            var url = $"/uploads/avatars/{fileName}";

            _logger.LogInformation(
                "Avatar guardado: {File} ({Size} bytes) -> {Url}",
                fileName, bytes.Length, url);

            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al guardar avatar: {Error}", ex.Message);
            return null;
        }
    }
}
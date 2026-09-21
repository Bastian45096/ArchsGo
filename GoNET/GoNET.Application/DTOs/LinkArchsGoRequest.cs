// src/GoNET.Application/DTOs/LinkArchsGoRequest.cs
namespace GoNET.Application.DTOs;

public class LinkArchsGoRequest
{
    public string ArchsGoUsernameOrEmail { get; set; } = string.Empty;
    public string ArchsGoPassword { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarBase64 { get; set; }
}
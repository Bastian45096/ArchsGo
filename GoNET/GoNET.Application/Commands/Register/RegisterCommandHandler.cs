// src/GoNET.Application/Commands/Register/RegisterCommandHandler.cs
//
// CON LOGS MASIVOS: cada paso del handler escribe en terminal.
using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;
using GoNET.Application.Common;
using GoNET.Application.DTOs;
using GoNET.Application.Interfaces;
using GoNET.Domain.entities;
using GoNET.Domain.Exceptions;

namespace GoNET.Application.Commands.Register;

public class RegisterCommandHandler
    : IRequestHandler<RegisterCommand, Result<UsuarioDto>>
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IFileStorage _fileStorage;
    private readonly ITokenGenerator _tokenGen;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        IUsuarioRepository usuarioRepo,
        IFileStorage fileStorage,
        ITokenGenerator tokenGen,
        ILogger<RegisterCommandHandler> logger)
    {
        _usuarioRepo = usuarioRepo;
        _fileStorage = fileStorage;
        _tokenGen = tokenGen;
        _logger = logger;
    }

    public async Task<Result<UsuarioDto>> Handle(
        RegisterCommand cmd, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();

        // ═══ INICIO ═══
        _logger.LogInformation(
            "╔══ REGISTRO INICIADO ══ Username: {Username}, Email: {Email}, IP: {Ip}",
            cmd.Username, cmd.Email, cmd.IpAddress);

        try
        {
            // ═══ VALIDAR USERNAME ═══
            _logger.LogDebug(
                "╠══ Verificando username '{Username}' en BD...",
                cmd.Username);

            if (await _usuarioRepo.ExistsByUsernameAsync(cmd.Username))
            {
                _logger.LogWarning(
                    "╠══ FALLO: Username '{Username}' ya existe",
                    cmd.Username);
                sw.Stop();
                _logger.LogWarning(
                    "╚══ REGISTRO FALLIDO ══ Razon: Username duplicado, Duracion: {Ms}ms",
                    sw.ElapsedMilliseconds);
                throw new DuplicateUserException("username", cmd.Username);
            }

            _logger.LogDebug(
                "╠══ Username '{Username}' disponible ✓",
                cmd.Username);

            // ═══ VALIDAR EMAIL ═══
            _logger.LogDebug(
                "╠══ Verificando email '{Email}' en BD...",
                cmd.Email);

            if (await _usuarioRepo.ExistsByEmailAsync(cmd.Email))
            {
                _logger.LogWarning(
                    "╠══ FALLO: Email '{Email}' ya registrado",
                    cmd.Email);
                sw.Stop();
                _logger.LogWarning(
                    "╚══ REGISTRO FALLIDO ══ Razon: Email duplicado, Duracion: {Ms}ms",
                    sw.ElapsedMilliseconds);
                throw new DuplicateUserException("email", cmd.Email);
            }

            _logger.LogDebug(
                "╠══ Email '{Email}' disponible ✓",
                cmd.Email);

            // ═══ VALIDAR PASSWORD ═══
            _logger.LogDebug(
                "╠══ Validando password ({Length} caracteres)...",
                cmd.Password.Length);

            if (cmd.Password.Length < 6)
            {
                _logger.LogWarning(
                    "╠══ FALLO: Password muy corto ({Length} chars)",
                    cmd.Password.Length);
                sw.Stop();
                _logger.LogWarning(
                    "╚══ REGISTRO FALLIDO ══ Razon: Password corto, Duracion: {Ms}ms",
                    sw.ElapsedMilliseconds);
                return Result<UsuarioDto>.Failure(
                    "La contrasena debe tener al menos 6 caracteres");
            }

            _logger.LogDebug("╠══ Password OK ✓");

            // ═══ AVATAR ═══
            string? avatarUrl = null;
            if (!string.IsNullOrEmpty(cmd.AvatarBase64))
            {
                _logger.LogInformation(
                    "╠══ Guardando avatar ({Size} chars)...",
                    cmd.AvatarBase64.Length);
                avatarUrl = await _fileStorage.SaveAvatarAsync(cmd.AvatarBase64);
                _logger.LogInformation(
                    "╠══ Avatar guardado: {Url}",
                    avatarUrl);
            }
            else
            {
                _logger.LogDebug("╠══ Sin avatar");
            }

            // ═══ CREAR USUARIO ═══
            _logger.LogInformation(
                "╠══ Creando usuario en BD: {Username} ({Email})...",
                cmd.Username, cmd.Email);

            var usuario = new Usuario
            {
                UserName = cmd.Username,
                Email = cmd.Email,
                DisplayName = cmd.DisplayName,
                AvatarUrl = avatarUrl ?? string.Empty,
                Bio = string.Empty,
                Estado = "offline",
                TieneCuentaArchsGo = false,
                FechaCreacion = DateTime.UtcNow,
                FechaUpdate = DateTime.UtcNow
            };

            var (success, createdUser, errors) = await _usuarioRepo.CreateAsync(
                usuario, cmd.Password);

            if (!success)
            {
                var errorMsg = string.Join(", ", errors);
                _logger.LogError(
                    "╠══ FALLO al crear usuario: {Errors}",
                    errorMsg);
                sw.Stop();
                _logger.LogError(
                    "╚══ REGISTRO FALLIDO ══ Razon: {Reason}, Duracion: {Ms}ms",
                    errorMsg, sw.ElapsedMilliseconds);
                return Result<UsuarioDto>.Failure(errorMsg);
            }

            _logger.LogInformation(
                "╠══ Usuario creado: Id={Id}, Username={Username}",
                createdUser!.Id, createdUser.UserName);

            // ═══ GENERAR TOKEN ═══
            var token = _tokenGen.Generate(
                createdUser.Id, createdUser.UserName ?? string.Empty);
            _logger.LogDebug(
                "╠══ Token generado para {Username}",
                createdUser.UserName);

            // ═══ EXITO ═══
            sw.Stop();
            _logger.LogInformation(
                "╚══ REGISTRO EXITOSO ══ Id: {Id}, Username: {Username}, Duracion: {Ms}ms",
                createdUser.Id, createdUser.UserName, sw.ElapsedMilliseconds);

            return Result<UsuarioDto>.Success(new UsuarioDto
            {
                Id = createdUser.Id,
                Username = createdUser.UserName ?? string.Empty,
                Email = createdUser.Email ?? string.Empty,
                DisplayName = createdUser.DisplayName,
                AvatarUrl = createdUser.AvatarUrl,
                Bio = createdUser.Bio,
                Estado = createdUser.Estado,
                TieneCuentaArchsGo = createdUser.TieneCuentaArchsGo,
                FechaCreacion = createdUser.FechaCreacion,
                Token = token
            });
        }
        catch (DuplicateUserException)
        {
            throw;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex,
                "╚══ REGISTRO CRASH ══ Username: {Username}, Error: {Error}, Duracion: {Ms}ms",
                cmd.Username, ex.Message, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
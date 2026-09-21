// GoNET.Application/Services/AuthService.cs
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using GoNET.Application.DTOs;
using GoNET.Application.Interfaces;
using GoNET.Domain.entities;

namespace GoNET.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<Usuario> _userManager;
    private readonly SignInManager<Usuario> _signInManager;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;
    private readonly IFileStorage _fileStorage;
    private readonly IArchsGoClient _archsGoClient;

    public AuthService(
        UserManager<Usuario> userManager,
        SignInManager<Usuario> signInManager,
        IConfiguration config,
        ILogger<AuthService> logger,
        IFileStorage fileStorage,
        IArchsGoClient archsGoClient)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
        _logger = logger;
        _fileStorage = fileStorage;
        _archsGoClient = archsGoClient;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var sw = Stopwatch.StartNew();
        var step = 0;

        _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║                      R E G I S T R O   N U E V O                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Username     │ {Username,-40} ║
║  Email        │ {Email,-40} ║
║  DisplayName  │ {DisplayName,-40} ║
║  Password     │ {PassLen,-40} ║
║  Avatar       │ {Avatar,-40} ║
╚═══════════════════════════════════════════════════════════════════════╝",
            request.Username, request.Email, request.DisplayName,
            $"{request.Password.Length} caracteres",
            string.IsNullOrEmpty(request.AvatarBase64) ? "NO proporcionado" : $"SI ({request.AvatarBase64.Length} chars)");

        try
        {
            // ═══ PASO 1: BUSCAR EMAIL ═══
            step = 1;
            var swStep = Stopwatch.StartNew();
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 1/7 │ BUSCAR EMAIL — Resultado: {Result,-44}│
│           │ Tiempo: {Ms}ms                                                    │",
                existingUser is not null ? $"ENCONTRADO (Id={existingUser.Id})" : "NO EXISTE",
                swStep.ElapsedMilliseconds);

            if (existingUser is not null)
            {
                sw.Stop();
                _logger.LogWarning(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  ERROR: Email ya registrado                                         ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Email        │ {Email,-52}║
║  UserId existente │ {Id,-48}║
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 409 Conflict                                         ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    request.Email, existingUser.Id, sw.ElapsedMilliseconds);

                return new AuthResponse { Success = false, Message = "Este email ya está registrado" };
            }

            // ═══ PASO 2: PROCESAR AVATAR + CONSTRUIR USUARIO ═══
            step = 2;
            string avatarUrl;

            if (!string.IsNullOrEmpty(request.AvatarBase64))
            {
                _logger.LogInformation(@"│  STEP 2/7 │ GUARDAR AVATAR SUBIDO EN wwwroot ({Len} chars)         │",
                    request.AvatarBase64.Length);

                var savedUrl = await _fileStorage.SaveAvatarAsync(request.AvatarBase64);

                if (savedUrl is not null)
                {
                    avatarUrl = savedUrl;
                    _logger.LogInformation(@"│           │ Avatar guardado: {Url,-49}│", avatarUrl);
                }
                else
                {
                    var fallbackSeed = Uri.EscapeDataString(request.Username);
                    avatarUrl = $"https://api.dicebear.com/7.x/bottts-neutral/svg?seed={fallbackSeed}&backgroundColor=2b2d31";
                    _logger.LogWarning(@"│           │ Avatar fallo — usando DiceBear fallback              │");
                }
            }
            else
            {
                var avatarSeed = Uri.EscapeDataString(request.Username);
                avatarUrl = $"https://api.dicebear.com/7.x/bottts-neutral/svg?seed={avatarSeed}&backgroundColor=2b2d31";
                _logger.LogInformation(@"│  STEP 2/7 │ GENERAR AVATAR DICEBEAR (sin foto subida)            │");
            }

            var user = new Usuario
            {
                UserName = request.Email,
                Email = request.Email.ToLower(),
                DisplayName = request.Username,
                AvatarUrl = avatarUrl,
                Estado = "online",
                FechaCreacion = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow
            };

            // ═══ PASO 3: CREAR EN BD ═══
            step = 3;
            swStep.Restart();
            var result = await _userManager.CreateAsync(user, request.Password);
            swStep.Stop();

            if (!result.Succeeded)
            {
                var errors = string.Join(" | ", result.Errors.Select(e => $"[{e.Code}] {e.Description}"));
                sw.Stop();
                _logger.LogError(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  REGISTRO FALLIDO                                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Username     │ {Username,-52}║
║  Errores      │ {Errors,-52}║
║  HTTP         │ 400 Bad Request                                     ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    request.Username, errors);

                return new AuthResponse { Success = false, Message = errors };
            }

            _logger.LogInformation(@"│  STEP 3/7 │ USUARIO CREADO — UserId={Id} | {Ms}ms                     │",
                user.Id, swStep.ElapsedMilliseconds);

            // ═══ PASO 4: GENERAR JWT ═══
            step = 4;
            swStep.Restart();
            var token = GenerateToken(user);
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 4/7 │ JWT GENERADO — {Len} chars | {Ms}ms                      │",
                token.Length, swStep.ElapsedMilliseconds);

            // ═══ PASO 5: MAPEAR DTO ═══
            step = 5;
            var dto = MapToDto(user);

            // ═══ EXITO ═══
            sw.Stop();
            _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  REGISTRO EXITOSO                                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Id           │ {Id,-51}║
║  Username     │ {Username,-51}║
║  Email        │ {Email,-51}║
║  DisplayName  │ {Display,-51}║
║  Estado       │ {Estado,-51}║
║  Token        │ {Len} caracteres                                      ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 200 OK                                                ║
╚═══════════════════════════════════════════════════════════════════════╝",
                dto.Id, dto.Username, dto.Email, dto.DisplayName,
                dto.Estado, token.Length, sw.ElapsedMilliseconds);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                Message = "Cuenta creada exitosamente",
                User = dto
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogCritical(ex, @"
╔═══════════════════════════════════════════════════════════════════════╗
║  REGISTRO CRASH — Paso {Step}/7                                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Error        │ {Error,-52}║
╚═══════════════════════════════════════════════════════════════════════╝",
                step, ex.Message);
            throw;
        }
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var sw = Stopwatch.StartNew();
        var step = 0;

        _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║                      I N I C I O   D E   S E S I O N                ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Email        │ {Email,-51}║
║  Password     │ {PassLen,-51}║
╚═══════════════════════════════════════════════════════════════════════╝",
            request.Email, $"{request.Password.Length} caracteres");

        try
        {
            // ═══ PASO 1: BUSCAR USUARIO ═══
            step = 1;
            var swStep = Stopwatch.StartNew();
            var user = await _userManager.FindByEmailAsync(request.Email.ToLower());
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 1/5 │ BUSCAR USUARIO — Resultado: {Result,-44}│
│           │ Tiempo: {Ms}ms                                                    │",
                user is not null ? $"ENCONTRADO (Id={user.Id})" : "NO EXISTE",
                swStep.ElapsedMilliseconds);

            if (user is null)
            {
                sw.Stop();
                _logger.LogWarning("LOGIN FALLIDO: Usuario no existe | Email={Email} | {Ms}ms",
                    request.Email, sw.ElapsedMilliseconds);

                return new AuthResponse { Success = false, Message = "Email o contraseña incorrectos" };
            }

            // ═══ PASO 2: VERIFICAR PASSWORD ═══
            step = 2;
            swStep.Restart();
            var pwdResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 2/5 │ PASSWORD — Succeeded={Succeeded} | {Ms}ms                │",
                pwdResult.Succeeded, swStep.ElapsedMilliseconds);

            if (!pwdResult.Succeeded)
            {
                sw.Stop();
                _logger.LogWarning("LOGIN FALLIDO: Password incorrecto | UserId={Id} | {Ms}ms",
                    user.Id, sw.ElapsedMilliseconds);

                return new AuthResponse { Success = false, Message = "Email o contraseña incorrectos" };
            }

            // ═══ PASO 3: ACTUALIZAR ESTADO ═══
            step = 3;
            user.LastLogin = DateTime.UtcNow;
            user.Estado = "online";

            swStep.Restart();
            await _userManager.UpdateAsync(user);
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 3/5 │ ESTADO ACTUALIZADO — online | {Ms}ms                     │",
                swStep.ElapsedMilliseconds);

            // ═══ PASO 4: GENERAR JWT ═══
            step = 4;
            swStep.Restart();
            var token = GenerateToken(user);
            swStep.Stop();

            _logger.LogInformation(@"│  STEP 4/5 │ JWT GENERADO — {Len} chars | {Ms}ms                      │",
                token.Length, swStep.ElapsedMilliseconds);

            // ═══ EXITO ═══
            var dto = MapToDto(user);
            sw.Stop();

            _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  LOGIN EXITOSO                                                      ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Id           │ {Id,-51}║
║  Username     │ {Username,-51}║
║  Email        │ {Email,-51}║
║  DisplayName  │ {Display,-51}║
║  Estado       │ {Estado,-51}║
║  ArchsGo      │ {ArchsGo,-51}║
║  Token        │ {Len} caracteres                                      ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 200 OK                                                ║
╚═══════════════════════════════════════════════════════════════════════╝",
                dto.Id, dto.Username, dto.Email, dto.DisplayName,
                dto.Estado,
                user.TieneCuentaArchsGo ? $"VINCULADA (ArchsGo Id={user.UsuarioId})" : "NO vinculada",
                token.Length, sw.ElapsedMilliseconds);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                Message = "Inicio de sesión exitoso",
                User = dto
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogCritical(ex, "LOGIN CRASH — Paso {Step}/5 | Error: {Error}", step, ex.Message);
            throw;
        }
    }

    // ════════════════════════════════════════════════════════════════
    //  LINK ARCHSGO — Login federado / Registro por vinculación
    //
    //  CASO A: Usuario GoNET ya vinculado a esas credenciales ArchsGo
    //          → LOGIN DIRECTO (JWT → dashboard)
    //  CASO B: Existe cuenta GoNET con el email de ArchsGo (sin vincular)
    //          → SE VINCULA esa cuenta existente
    //  CASO C: Usuario nuevo → SE CREA registro en GoNET vinculado
    //          (sin contraseña local — su identidad es ArchsGo)
    // ════════════════════════════════════════════════════════════════
    public async Task<AuthResponse> LinkArchsGoAsync(LinkArchsGoRequest request)
    {
        var sw = Stopwatch.StartNew();
        var step = 0;

        _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║           L I N K   /   L O G I N   A R C H S G O                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  ArchsGo User │ {User,-51}║
║  Password     │ {PassLen,-51}║
║  DisplayName  │ {Display,-51}║
║  Avatar       │ {Avatar,-51}║
╚═══════════════════════════════════════════════════════════════════════╝",
            request.ArchsGoUsernameOrEmail,
            $"{request.ArchsGoPassword.Length} caracteres",
            string.IsNullOrWhiteSpace(request.DisplayName) ? "(usar de ArchsGo)" : request.DisplayName,
            string.IsNullOrEmpty(request.AvatarBase64) ? "NO proporcionado" : $"SI ({request.AvatarBase64.Length} chars)");

        try
        {
            // ═══ PASO 1: VALIDAR CREDENCIALES EN ARCHSGO ═══
            step = 1;
            var archsGoResult = await _archsGoClient.LoginAsync(
                request.ArchsGoUsernameOrEmail, request.ArchsGoPassword);

            if (!archsGoResult.Success || archsGoResult.UserId is null)
            {
                sw.Stop();
                _logger.LogWarning(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  LINK FALLIDO: ArchsGo rechazo las credenciales                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Razon        │ {Reason,-52}║
║  HTTP         │ 401 Unauthorized                                    ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    archsGoResult.Error);

                return new AuthResponse
                {
                    Success = false,
                    Message = archsGoResult.Error ?? "Credenciales de ArchsGo incorrectas"
                };
            }

            _logger.LogInformation(@"│  STEP 1/5 │ ARCHSGO OK — UserId={Id} | User={User}                  │",
                archsGoResult.UserId, archsGoResult.Username);

            // ═══ PASO 2: CASO A — ¿YA EXISTE USUARIO GONET VINCULADO A ESTA CUENTA? ═══
            step = 2;
            var linkedUser = (await _userManager.Users
                .Where(u => u.UsuarioId == archsGoResult.UserId)
                .ToListAsync())
                .FirstOrDefault();

            if (linkedUser is not null)
            {
                _logger.LogInformation(@"│  STEP 2/5 │ CASO A — LOGIN FEDERADO: GoNET Id={Id} ya vinculado    │",
                    linkedUser.Id);

                // Actualizar estado/login como en un login normal
                linkedUser.LastLogin = DateTime.UtcNow;
                linkedUser.Estado = "online";

                // Si el form trae DisplayName nuevo, actualizarlo
                if (!string.IsNullOrWhiteSpace(request.DisplayName) &&
                    request.DisplayName.Trim() != linkedUser.DisplayName)
                {
                    linkedUser.DisplayName = request.DisplayName.Trim();
                    _logger.LogInformation(@"│           │ DisplayName actualizado a: {Name}                      │",
                        linkedUser.DisplayName);
                }

                // Si el form trae foto nueva, actualizarla
                if (!string.IsNullOrEmpty(request.AvatarBase64))
                {
                    var savedAvatar = await _fileStorage.SaveAvatarAsync(request.AvatarBase64);
                    if (savedAvatar is not null)
                    {
                        linkedUser.AvatarUrl = savedAvatar;
                        _logger.LogInformation(@"│           │ AVATAR ACTUALIZADO — {Url}                │", savedAvatar);
                    }
                }

                await _userManager.UpdateAsync(linkedUser);

                var fedToken = GenerateToken(linkedUser);
                var fedDto = MapToDto(linkedUser);
                sw.Stop();

                _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  LOGIN FEDERADO EXITOSO (via ArchsGo)                               ║
╠═══════════════════════════════════════════════════════════════════════╣
║  GoNET UserId   │ {UserId,-49}║
║  ArchsGo UserId │ {ArchId,-49}║
║  DisplayName    │ {Display,-49}║
║  Token          │ {Len} caracteres                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 200 OK                                                ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    linkedUser.Id, archsGoResult.UserId, linkedUser.DisplayName,
                    fedToken.Length, sw.ElapsedMilliseconds);

                return new AuthResponse
                {
                    Success = true,
                    Token = fedToken,
                    Message = "Inicio de sesión exitoso via ArchsGo",
                    User = fedDto
                };
            }

            _logger.LogInformation(@"│  STEP 2/5 │ Sin cuenta GoNET vinculada a ArchsGo Id={Id}            │",
                archsGoResult.UserId);

            // ═══ PASO 3: CASO B — ¿EXISTE CUENTA GONET SIN VINCULAR CON EL EMAIL DE ARCHSGO? ═══
            step = 3;
            var archsGoEmail = (archsGoResult.Email ?? "").ToLower();

            Usuario? existingUser = null;
            if (!string.IsNullOrEmpty(archsGoEmail))
            {
                existingUser = await _userManager.FindByEmailAsync(archsGoEmail);
            }

            if (existingUser is not null)
            {
                if (existingUser.TieneCuentaArchsGo || existingUser.UsuarioId is not null)
                {
                    // Ya está vinculado a OTRA cuenta ArchsGo — conflicto real
                    sw.Stop();
                    _logger.LogWarning(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  LINK RECHAZADO: Email GoNET ya vinculado a otra cuenta ArchsGo     ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Email        │ {Email,-52}║
║  ArchsGo UserId actual │ {ArchId,-40}║
║  HTTP         │ 409 Conflict                                       ║
╚═══════════════════════════════════════════════════════════════════════╝",
                        archsGoEmail, existingUser.UsuarioId);

                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Ese email ya está registrado en GoNET y vinculado a otra cuenta ArchsGo"
                    };
                }

                // CASO B: cuenta GoNET existente sin vincular → VINCULARLA
                _logger.LogInformation(@"│  STEP 3/5 │ CASO B — VINCULANDO cuenta GoNET existente Id={Id}      │",
                    existingUser.Id);

                if (!string.IsNullOrWhiteSpace(request.DisplayName))
                    existingUser.DisplayName = request.DisplayName.Trim();

                if (!string.IsNullOrEmpty(request.AvatarBase64))
                {
                    var savedAvatar = await _fileStorage.SaveAvatarAsync(request.AvatarBase64);
                    if (savedAvatar is not null)
                    {
                        existingUser.AvatarUrl = savedAvatar;
                        _logger.LogInformation(@"│           │ AVATAR ACTUALIZADO — {Url}                │", savedAvatar);
                    }
                }

                existingUser.UsuarioId = archsGoResult.UserId;
                existingUser.TieneCuentaArchsGo = true;
                existingUser.LastLogin = DateTime.UtcNow;
                existingUser.Estado = "online";

                var linkResult = await _userManager.UpdateAsync(existingUser);

                if (!linkResult.Succeeded)
                {
                    var errors = string.Join(" | ", linkResult.Errors.Select(e => $"[{e.Code}] {e.Description}"));
                    sw.Stop();
                    _logger.LogError("LINK FALLIDO al vincular cuenta existente: {Errors}", errors);
                    return new AuthResponse { Success = false, Message = errors };
                }

                var linkToken = GenerateToken(existingUser);
                var linkDto = MapToDto(existingUser);
                sw.Stop();

                _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  VINCULACION EXITOSA (cuenta GoNET existente)                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  GoNET UserId   │ {UserId,-49}║
║  ArchsGo UserId │ {ArchId,-49}║
║  DisplayName    │ {Display,-49}║
║  Token          │ {Len} caracteres                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 200 OK                                                ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    existingUser.Id, archsGoResult.UserId, existingUser.DisplayName,
                    linkToken.Length, sw.ElapsedMilliseconds);

                return new AuthResponse
                {
                    Success = true,
                    Token = linkToken,
                    Message = "Cuenta de ArchsGo vinculada exitosamente",
                    User = linkDto
                };
            }

            // ═══ PASO 4: CASO C — CREAR REGISTRO NUEVO EN GONET VINCULADO ═══
            step = 4;
            _logger.LogInformation(@"│  STEP 4/5 │ CASO C — CREANDO NUEVO REGISTRO GONET vinculado         │");

            string avatarUrl;

            if (!string.IsNullOrEmpty(request.AvatarBase64))
            {
                var savedAvatar = await _fileStorage.SaveAvatarAsync(request.AvatarBase64);
                if (savedAvatar is not null)
                {
                    avatarUrl = savedAvatar;
                    _logger.LogInformation(@"│           │ Avatar guardado: {Url,-49}│", avatarUrl);
                }
                else
                {
                    var fallbackSeed = Uri.EscapeDataString(archsGoResult.Username ?? "user");
                    avatarUrl = $"https://api.dicebear.com/7.x/bottts-neutral/svg?seed={fallbackSeed}&backgroundColor=2b2d31";
                    _logger.LogWarning(@"│           │ Avatar invalido — usando DiceBear fallback              │");
                }
            }
            else
            {
                var fallbackSeed = Uri.EscapeDataString(archsGoResult.Username ?? request.DisplayName ?? "user");
                avatarUrl = $"https://api.dicebear.com/7.x/bottts-neutral/svg?seed={fallbackSeed}&backgroundColor=2b2d31";
                _logger.LogInformation(@"│           │ GENERANDO AVATAR DICEBEAR (sin foto subida)             │");
            }

            var newUser = new Usuario
            {
                // ⚠️ Usuario creado por federación: NO tiene PasswordHash local.
                // Su identidad es ArchsGo — entra siempre via link/login federado.
                UserName = !string.IsNullOrEmpty(archsGoEmail) ? archsGoEmail : $"archsgo_{archsGoResult.UserId}",
                Email = !string.IsNullOrEmpty(archsGoEmail) ? archsGoEmail : $"archsgo_{archsGoResult.UserId}@vinculado.local",
                DisplayName = !string.IsNullOrWhiteSpace(request.DisplayName)
                    ? request.DisplayName.Trim()
                    : (archsGoResult.Username ?? "Usuario"),
                AvatarUrl = avatarUrl,
                Estado = "online",
                FechaCreacion = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow,
                UsuarioId = archsGoResult.UserId,
                TieneCuentaArchsGo = true
            };

            var createResult = await _userManager.CreateAsync(newUser);   // SIN password

            if (!createResult.Succeeded)
            {
                var errors = string.Join(" | ", createResult.Errors.Select(e => $"[{e.Code}] {e.Description}"));
                sw.Stop();
                _logger.LogError(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  LINK FALLIDO: No se pudo crear el registro GoNET                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Errores      │ {Errors,-52}║
║  HTTP         │ 400 Bad Request                                     ║
╚═══════════════════════════════════════════════════════════════════════╝",
                    errors);
                return new AuthResponse { Success = false, Message = errors };
            }

            _logger.LogInformation(@"│           │ USUARIO GONET CREADO — Id={Id} vinculado a ArchsGo {ArchId}  │",
                newUser.Id, archsGoResult.UserId);

            // ═══ PASO 5: GENERAR JWT (login automático) ═══
            step = 5;
            var token = GenerateToken(newUser);
            var dto = MapToDto(newUser);
            sw.Stop();

            _logger.LogInformation(@"
╔═══════════════════════════════════════════════════════════════════════╗
║  VINCULACION + REGISTRO EXITOSO (nuevo usuario)                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║  GoNET UserId   │ {UserId,-49}║
║  ArchsGo UserId │ {ArchId,-49}║
║  DisplayName    │ {Display,-49}║
║  Email          │ {Email,-49}║
║  Avatar         │ {Avatar,-49}║
║  Password local │ (NINGUNA — identidad via ArchsGo)                  ║
║  Token          │ {Len} caracteres                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Duracion     │ {Ms}ms                                                ║
║  HTTP         │ 200 OK                                                ║
╚═══════════════════════════════════════════════════════════════════════╝",
                newUser.Id, archsGoResult.UserId, newUser.DisplayName,
                newUser.Email,
                avatarUrl.Length > 49 ? avatarUrl[..46] + "..." : avatarUrl,
                token.Length, sw.ElapsedMilliseconds);

            return new AuthResponse
            {
                Success = true,
                Token = token,
                Message = "Cuenta vinculada y creada exitosamente",
                User = dto
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogCritical(ex, @"
╔═══════════════════════════════════════════════════════════════════════╗
║  LINK CRASH — Paso {Step}/5                                         ║
╠═══════════════════════════════════════════════════════════════════════╣
║  ArchsGo User │ {User,-52}║
║  Error        │ {Error,-52}║
╚═══════════════════════════════════════════════════════════════════════╝",
                step, request.ArchsGoUsernameOrEmail, ex.Message);
            throw;
        }
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            _logger.LogWarning("GET USER BY ID: UserId={Id} NO ENCONTRADO", userId);
            return null;
        }

        _logger.LogInformation("GET USER BY ID: UserId={Id} ENCONTRADO (User={User})", userId, user.UserName);

        return MapToDto(user);
    }

    private string GenerateToken(Usuario user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.DisplayName ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim("avatar", user.AvatarUrl ?? ""),
            new Claim("estado", user.Estado ?? "offline"),
            new Claim("tieneArchsGo", user.TieneCuentaArchsGo.ToString().ToLower()),
            new Claim("archsGoUserId", user.UsuarioId?.ToString() ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapToDto(Usuario user) => new()
    {
        Id = user.Id,
        Username = user.UserName ?? "",
        Email = user.Email ?? "",
        DisplayName = user.DisplayName,
        AvatarUrl = user.AvatarUrl,
        Bio = user.Bio,
        Estado = user.Estado,
        FechaCreacion = user.FechaCreacion,
        LastLogin = user.LastLogin
    };
}
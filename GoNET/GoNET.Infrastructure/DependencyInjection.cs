// src/GoNET.Infrastructure/DependencyInjection.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GoNET.Application.Interfaces;
using GoNET.Application.Services;
using GoNET.Domain.entities;
using GoNET.Infrastructure.Data;
using GoNET.Infrastructure.Identity;                     // ⬅️ NUEVO (CustomPasswordValidator)
using GoNET.Infrastructure.Repositories;
using GoNET.Infrastructure.Services;

namespace GoNET.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<GoNetDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString("GoNET"));

            options.LogTo(
                message => Serilog.Log.Information("║ SQL: {Query}", message),
                LogLevel.Information);
        });

        services.AddIdentity<Usuario, IdentityRole<int>>(options =>
        {
            // ═══ Políticas de contraseña alineadas con el frontend y el validador custom ═══
            options.Password.RequireDigit = true;              // ⬅️ CAMBIO: exigir 1 número (lo valida el frontend)
            options.Password.RequireUppercase = true;          // ⬅️ CAMBIO: exigir 1 mayúscula
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;   // lo maneja el CustomPasswordValidator (exige 2, no 1)
            options.Password.RequiredLength = 6;               // mínimo 6 caracteres
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<GoNetDbContext>()
        .AddDefaultTokenProviders();

        // ⬅️ NUEVO: validador custom — exige 2 caracteres especiales (Identity nativo solo soporta 1)
        services.AddScoped<IPasswordValidator<Usuario>,
                          CustomPasswordValidator>();

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IApiGoNetRepository, ApiGoNetRepository>();

        services.AddScoped<IPasswordHasher, PasswordHasherService>();
        services.AddScoped<ITokenGenerator, TokenGeneratorService>();
        services.AddScoped<IFileStorage, FileStorageService>();

        // ═══ AUTH ═══
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
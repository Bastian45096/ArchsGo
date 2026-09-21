// src/GoNET.API/Program.cs
using System.Text;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using GoNET.Infrastructure;
using GoNET.Infrastructure.Middleware;
using GoNET.Application.Common.Behaviors;
using GoNET.Application.Interfaces;
using GoNET.Infrastructure.Services;
using System.Reflection;

// ═══ SERILOG: configurar ANTES de construir la app ═══
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .Enrich.WithProcessId()
    .Enrich.WithEnvironmentName()
    .Enrich.FromLogContext()
    .WriteTo.Console(
        outputTemplate:
            "[{Timestamp:HH:mm:ss.fff}] " +
            "[{Level:u3}] " +
            "[{MachineName}] " +
            "[T:{ThreadId}] " +
            "{SourceContext}{NewLine}" +
            "    {Message:lj}{NewLine}" +
            "{Exception}{NewLine}",
        restrictedToMinimumLevel: LogEventLevel.Verbose)
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting.Diagnostics", LogEventLevel.Information)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .MinimumLevel.Override("GoNET", LogEventLevel.Verbose)
    .MinimumLevel.Override("GoNET.Application", LogEventLevel.Verbose)
    .MinimumLevel.Override("GoNET.Infrastructure", LogEventLevel.Verbose)
    .CreateLogger();

try
{
    Log.Information("═══════════════════════════════════════");
    Log.Information("  GoNET API arrancando...");
    Log.Information("  Maquina: {Machine}", Environment.MachineName);
    Log.Information("  .NET: {Version}", Environment.Version);
    Log.Information("  Entorno: {Env}",
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production");
    Log.Information("═══════════════════════════════════════");

    var builder = WebApplication.CreateBuilder(args);

    // ═══ Usar Serilog como logger ═══
    builder.Host.UseSerilog();

    // ═══ MediatR + Behavior ═══
    builder.Services.AddMediatR(cfg =>
    {
        cfg.RegisterServicesFromAssembly(
            Assembly.Load("GoNET.Application"));
        cfg.AddOpenBehavior(typeof(ExceptionHandlingBehavior<,>));
    });

    // ═══ Infrastructure (DbContext + Identity + Repos + Services) ═══
    builder.Services.AddInfrastructure(builder.Configuration);

    // ═══ File Storage (guardar avatares en wwwroot) ═══
    builder.Services.AddScoped<IFileStorage, FileStorageService>();

    // ═══ ArchsGo HTTP Client (vincular cuentas con ArchsGo en Go) ═══   ⬅️ NUEVO
    builder.Services.AddHttpClient<IArchsGoClient, ArchsGoClient>();

    // ═══ JWT Authentication ═══
    var jwtKey = builder.Configuration["Jwt:Key"]!;

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

    builder.Services.AddControllers();

    // ═══ CORS ═══
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Angular", policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    // ═══ ORDEN DE MIDDLEWARE ═══
    app.UseCors("Angular");

    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} → {StatusCode} en {Elapsed:0.0000}ms";
        options.GetLevel = (httpContext, elapsed, ex) =>
        {
            if (ex != null) return LogEventLevel.Error;
            if (httpContext.Response.StatusCode >= 500) return LogEventLevel.Error;
            if (httpContext.Response.StatusCode >= 400) return LogEventLevel.Warning;
            if (elapsed > 5000) return LogEventLevel.Warning;
            return LogEventLevel.Information;
        };
        options.EnrichDiagnosticContext = (diagnostic, httpContext) =>
        {
            diagnostic.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString());
            diagnostic.Set("UserAgent", httpContext.Request.Headers.UserAgent.ToString());
            diagnostic.Set("UserName", httpContext.User.Identity?.Name ?? "anonimo");
        };
    });

    app.UseMiddleware<ApiLoggingMiddleware>();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseStaticFiles();
    app.MapControllers();

    Log.Information("GoNET API lista. Escuchando...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "GoNET API CRASH");
    throw;
}
finally
{
    Log.Information("GoNET API apagada.");
    Log.CloseAndFlush();
}
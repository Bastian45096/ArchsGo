// src/GoNET.Application/Common/Behaviors/ExceptionHandlingBehavior.cs
//
// POR QUE EXISTE:
// Captura GoNetException del handler y la convierte
// en Result.Failure(mensaje). El controller nunca
// recibe excepciones volando.
using MediatR;
using GoNET.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace GoNET.Application.Common.Behaviors;

public class ExceptionHandlingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<ExceptionHandlingBehavior<TRequest, TResponse>> _logger;

    public ExceptionHandlingBehavior(
        ILogger<ExceptionHandlingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        try
        {
            return await next();
        }
        catch (GoNetException ex)
        {
            _logger.LogWarning(ex,
                "Excepcion de dominio en {Request}: {Message}",
                typeof(TRequest).Name, ex.Message);

            return CreateFailureResult(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error inesperado en {Request}",
                typeof(TRequest).Name);

            return CreateFailureResult("Error interno del servidor");
        }
    }

    private static TResponse CreateFailureResult(string error)
    {
        var responseType = typeof(TResponse);

        if (responseType.IsGenericType &&
            responseType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var failureMethod = responseType.GetMethod(
                "Failure",
                new[] { typeof(string) });

            if (failureMethod != null)
            {
                var result = failureMethod.Invoke(null, new object[] { error });
                return (TResponse)result!;
            }
        }

        throw new InvalidOperationException(
            "No se pudo crear Result.Failure para " + typeof(TResponse).Name);
    }
}
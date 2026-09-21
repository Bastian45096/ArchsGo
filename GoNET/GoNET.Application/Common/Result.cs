// src/GoNET.Application/Common/Result.cs
//
// POR QUE EXISTE:
// Envuelve exito/error de cualquier operacion.
// Los handlers devuelven Result<T>.
// El controller mapea IsSuccess a HTTP status codes.
namespace GoNET.Application.Common;

public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public T? Data { get; private set; }
    public string? Error { get; private set; }

    private Result() { }

    public static Result<T> Success(T data) => new()
    {
        IsSuccess = true,
        Data = data
    };

    public static Result<T> Failure(string error) => new()
    {
        IsSuccess = false,
        Error = error
    };
}
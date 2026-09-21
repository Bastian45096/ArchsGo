// src/GoNET.Domain/Exceptions/GoNetExceptions.cs
//
// POR QUE EXISTE:
// Las excepciones de dominio se capturan en el
// ExceptionHandlingBehavior y se convierten en
// Result.Failure(mensaje) para el frontend.
//
// Cuando el handler lanza DuplicateUserException("username", "Gojo"),
// el behavior captura y devuelve:
//   Result.Failure("Ya existe un usuario con username='Gojo'")
// El controller devuelve:
//   400 { "error": "Ya existe un usuario con username='Gojo'" }
namespace GoNET.Domain.Exceptions;

public class GoNetException : Exception
{
    public GoNetException(string message) : base(message) { }
}

public class DuplicateUserException : GoNetException
{
    public DuplicateUserException(string field, string value)
        : base($"Ya existe un usuario con {field}='{value}'") { }
}

public class UserNotFoundException : GoNetException
{
    public UserNotFoundException(int id)
        : base($"Usuario con Id '{id}' no encontrado") { }
}

public class InvalidCredentialsException : GoNetException
{
    public InvalidCredentialsException()
        : base("Credenciales incorrectas") { }
}

public class AccountAlreadyLinkedException : GoNetException
{
    public AccountAlreadyLinkedException(int archsGoId)
        : base($"La cuenta de ArchsGo '{archsGoId}' ya esta vinculada") { }
}
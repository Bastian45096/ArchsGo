// src/GoNET.Domain/Common/AuditableEntity.cs
//
// POR QUE EXISTE:
// ApiGoNet y RegisterAttempt necesitan CreatedAt.
// Esta clase base evita repetir ese campo.
// Usuario no la necesita porque ya tiene FechaCreacion.
namespace GoNET.Domain.Common;

public abstract class AuditableEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
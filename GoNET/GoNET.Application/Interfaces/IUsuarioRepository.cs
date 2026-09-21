// src/GoNET.Application/Interfaces/IUsuarioRepository.cs
//
// POR QUE EXISTE:
// Application necesita buscar, crear y verificar usuarios.
// NO usa UserManager directamente (eso es infraestructura).
// Define el contrato, Infrastructure implementa con UserManager.
//
// NOTA: Se llama IUsuarioRepository (no IUserRepository)
// porque la entidad se llama Usuario.
using GoNET.Domain.entities;

namespace GoNET.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByIdAsync(int id);
    Task<Usuario?> GetByUsernameOrEmailAsync(string userOrEmail);
    Task<Usuario?> GetByArchsGoIdAsync(int archsGoUserId);
    Task<bool> ExistsByUsernameAsync(string username);
    Task<bool> ExistsByEmailAsync(string email);
    Task<(bool success, Usuario? user, IEnumerable<string> errors)> CreateAsync(
        Usuario usuario, string password);
    Task UpdateAsync(Usuario usuario);
}
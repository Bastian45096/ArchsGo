// src/GoNET.Infrastructure/Repositories/UsuarioRepository.cs
//
// POR QUE EXISTE:
// Implementa IUsuarioRepository usando UserManager<Usuario>.
// UserManager es lo que Identity provee para crear usuarios,
// hashear passwords, validar, etc.
//
// El handler NUNCA toca UserManager directamente.
// Siempre pasa por esta interface.
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using GoNET.Application.Interfaces;
using GoNET.Domain.entities;
using GoNET.Infrastructure.Data;

namespace GoNET.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly UserManager<Usuario> _userManager;
    private readonly GoNetDbContext _db;

    public UsuarioRepository(
        UserManager<Usuario> userManager,
        GoNetDbContext db)
    {
        _userManager = userManager;
        _db = db;
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _userManager.FindByIdAsync(id.ToString());
    }

    public async Task<Usuario?> GetByUsernameOrEmailAsync(string userOrEmail)
    {
        var user = await _userManager.FindByNameAsync(userOrEmail);
        if (user != null) return user;

        return await _userManager.FindByEmailAsync(userOrEmail);
    }

    public async Task<Usuario?> GetByArchsGoIdAsync(int archsGoUserId)
    {
        return await _db.Users.FirstOrDefaultAsync(
            u => u.UsuarioId == archsGoUserId);
    }

    public async Task<bool> ExistsByUsernameAsync(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        return user != null;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return user != null;
    }

    /// <summary>
    /// Crea el usuario usando UserManager.
    /// UserManager.Hashea el password automaticamente.
    /// Devuelve si fue exitoso + errores si fallo.
    /// </summary>
    public async Task<(bool success, Usuario? user, IEnumerable<string> errors)> CreateAsync(
        Usuario usuario, string password)
    {
        var result = await _userManager.CreateAsync(usuario, password);

        if (result.Succeeded)
            return (true, usuario, Enumerable.Empty<string>());

        return (false, null, result.Errors.Select(e => e.Description));
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        await _userManager.UpdateAsync(usuario);
    }
}
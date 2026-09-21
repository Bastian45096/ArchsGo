// src/GoNET.Infrastructure/Repositories/ApiGoNetRepository.cs
using GoNET.Application.Interfaces;
using GoNET.Domain.entities;
using GoNET.Infrastructure.Data;

namespace GoNET.Infrastructure.Repositories;

public class ApiGoNetRepository : IApiGoNetRepository
{
    private readonly GoNetDbContext _db;

    public ApiGoNetRepository(GoNetDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(ApiGoNet log)
    {
        _db.ApiLogs.Add(log);
        await _db.SaveChangesAsync();
    }
}
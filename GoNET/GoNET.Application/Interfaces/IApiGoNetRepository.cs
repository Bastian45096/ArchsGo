// src/GoNET.Application/Interfaces/IApiGoNetRepository.cs
//
// POR QUE EXISTE:
// Cada peticion HTTP se guarda en api_gonet.
// Esta interface define como guardar esos registros.
using GoNET.Domain.entities;

namespace GoNET.Application.Interfaces;

public interface IApiGoNetRepository
{
    Task AddAsync(ApiGoNet log);
}
using Microsoft.AspNetCore.Identity;

namespace GoNET.Domain.entities
{

    public class Usuario : IdentityUser<int>
    {
        // ═══ CAMPOS PROPIOS DE GONET (los que IdentityUser NO trae) ═══
        public string DisplayName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Estado { get; set; } = "offline";
        public int? UsuarioId { get; set; }
        public bool TieneCuentaArchsGo { get; set; } = false;
        public DateTime? LastLogin { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public DateTime FechaUpdate { get; set; } = DateTime.UtcNow;
    }
}
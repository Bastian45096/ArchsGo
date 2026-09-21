using GoNET.Domain.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GoNET.Infrastructure.Data
{
    // ═══ HEREDA DE IDENTITYCONTEXT ═══
    // Crea TODAS las tablas de Identity automaticamente
    //   + tu tabla users_gonet con campos extra
    public class GoNetDbContext : IdentityDbContext<Usuario, IdentityRole<int>, int>
    {
        public GoNetDbContext(DbContextOptions<GoNetDbContext> options) : base(options) { }

        public DbSet<ApiGoNet> ApiLogs => Set<ApiGoNet>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ═══ IMPORTANTE: llama a base primero ═══
            // Esto crea todas las tablas de Identity:
            //   AspNetUsers (aka users_gonet)
            //   AspNetRoles
            //   AspNetUserRoles
            //   AspNetUserClaims
            //   AspNetUserLogins
            //   AspNetUserTokens
            //   AspNetRoleClaims
            base.OnModelCreating(modelBuilder);

            // ═══ RENOMBRAR TABLAS DE IDENTITY ═══
            modelBuilder.Entity<Usuario>().ToTable("users_gonet");
            modelBuilder.Entity<IdentityRole<int>>().ToTable("roles_gonet");
            modelBuilder.Entity<IdentityUserRole<int>>().ToTable("user_roles_gonet");
            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("user_claims_gonet");
            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("user_logins_gonet");
            modelBuilder.Entity<IdentityUserToken<int>>().ToTable("user_tokens_gonet");
            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("role_claims_gonet");

            // ═══ CONFIG USUARIO ═══
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.Property(e => e.DisplayName).HasMaxLength(100);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
                entity.Property(e => e.Bio).HasMaxLength(500);
                entity.Property(e => e.Estado).HasMaxLength(20).HasDefaultValue("offline");
                entity.Property(e => e.TieneCuentaArchsGo).HasDefaultValue(false);
            });

            // ═══ CONFIG API LOG ═══
            modelBuilder.Entity<ApiGoNet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NivelRiesgo).HasDefaultValue("bajo");
                entity.Property(e => e.EstaAutenticado).HasDefaultValue(false);
            });
        }
    }
}
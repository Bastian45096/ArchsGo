using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GoNET.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "api_gonet",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    metodo_http = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    endpoint = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    estado_http = table.Column<int>(type: "int", nullable: false),
                    mensaje = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    direccion_ip = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: false),
                    agente_usuario = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    esta_autenticado = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    nivel_riesgo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "bajo"),
                    duracion_ms = table.Column<int>(type: "int", nullable: false),
                    mensaje_error = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cuerpo_peticion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_api_gonet", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles_gonet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles_gonet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users_gonet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "offline"),
                    UsuarioId = table.Column<int>(type: "int", nullable: true),
                    TieneCuentaArchsGo = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaUpdate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_gonet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "role_claims_gonet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_claims_gonet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_role_claims_gonet_roles_gonet_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_claims_gonet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_claims_gonet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_claims_gonet_users_gonet_UserId",
                        column: x => x.UserId,
                        principalTable: "users_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_logins_gonet",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_logins_gonet", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_user_logins_gonet_users_gonet_UserId",
                        column: x => x.UserId,
                        principalTable: "users_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_roles_gonet",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles_gonet", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_gonet_roles_gonet_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_gonet_users_gonet_UserId",
                        column: x => x.UserId,
                        principalTable: "users_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_tokens_gonet",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_tokens_gonet", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_user_tokens_gonet_users_gonet_UserId",
                        column: x => x.UserId,
                        principalTable: "users_gonet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_role_claims_gonet_RoleId",
                table: "role_claims_gonet",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "roles_gonet",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_user_claims_gonet_UserId",
                table: "user_claims_gonet",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_logins_gonet_UserId",
                table: "user_logins_gonet",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_gonet_RoleId",
                table: "user_roles_gonet",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "users_gonet",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "users_gonet",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "api_gonet");

            migrationBuilder.DropTable(
                name: "role_claims_gonet");

            migrationBuilder.DropTable(
                name: "user_claims_gonet");

            migrationBuilder.DropTable(
                name: "user_logins_gonet");

            migrationBuilder.DropTable(
                name: "user_roles_gonet");

            migrationBuilder.DropTable(
                name: "user_tokens_gonet");

            migrationBuilder.DropTable(
                name: "roles_gonet");

            migrationBuilder.DropTable(
                name: "users_gonet");
        }
    }
}

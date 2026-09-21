using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GoNET.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LogMasivos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "mensaje",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "endpoint",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "duracion_ms",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "direccion_ip",
                table: "api_gonet",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(45)",
                oldMaxLength: 45);

            migrationBuilder.AlterColumn<string>(
                name: "agente_usuario",
                table: "api_gonet",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<string>(
                name: "accept_language",
                table: "api_gonet",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "action_nombre",
                table: "api_gonet",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "browser",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "content_type_peticion",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "content_type_respuesta",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "controller_nombre",
                table: "api_gonet",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "cuerpo_respuesta",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dotnet_version",
                table: "api_gonet",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "endpoint_template",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "entorno",
                table: "api_gonet",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "es_excepcion",
                table: "api_gonet",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "es_exitoso",
                table: "api_gonet",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "esquema",
                table: "api_gonet",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "headers_peticion",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "headers_respuesta",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "host",
                table: "api_gonet",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "inner_exception",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ip_real",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "maquina",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "memoria_antes_bytes",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "memoria_delta_bytes",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "memoria_despues_bytes",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "notas",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "origin",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "protocolo",
                table: "api_gonet",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "puerto",
                table: "api_gonet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "query_string",
                table: "api_gonet",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "referer",
                table: "api_gonet",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "riesgo_razon",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "route_values",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sistema_operativo",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "stack_trace",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "tamano_peticion_bytes",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "tamano_respuesta_bytes",
                table: "api_gonet",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "thread_id",
                table: "api_gonet",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "tipo_dispositivo",
                table: "api_gonet",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tipo_excepcion",
                table: "api_gonet",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "trace_id",
                table: "api_gonet",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "usuario_claims",
                table: "api_gonet",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuario_email",
                table: "api_gonet",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuario_nombre",
                table: "api_gonet",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuario_roles",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "accept_language",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "action_nombre",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "browser",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "content_type_peticion",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "content_type_respuesta",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "controller_nombre",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "cuerpo_respuesta",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "dotnet_version",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "endpoint_template",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "entorno",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "es_excepcion",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "es_exitoso",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "esquema",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "headers_peticion",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "headers_respuesta",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "host",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "inner_exception",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "ip_real",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "maquina",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "memoria_antes_bytes",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "memoria_delta_bytes",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "memoria_despues_bytes",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "notas",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "origin",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "protocolo",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "puerto",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "query_string",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "referer",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "riesgo_razon",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "route_values",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "sistema_operativo",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "stack_trace",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "tamano_peticion_bytes",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "tamano_respuesta_bytes",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "thread_id",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "tipo_dispositivo",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "tipo_excepcion",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "trace_id",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "usuario_claims",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "usuario_email",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "usuario_nombre",
                table: "api_gonet");

            migrationBuilder.DropColumn(
                name: "usuario_roles",
                table: "api_gonet");

            migrationBuilder.AlterColumn<string>(
                name: "mensaje",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "endpoint",
                table: "api_gonet",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<int>(
                name: "duracion_ms",
                table: "api_gonet",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "direccion_ip",
                table: "api_gonet",
                type: "nvarchar(45)",
                maxLength: 45,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "agente_usuario",
                table: "api_gonet",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);
        }
    }
}

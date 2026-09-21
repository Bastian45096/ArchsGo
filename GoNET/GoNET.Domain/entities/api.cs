// src/GoNET.Domain/Entities/ApiGoNet.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GoNET.Domain.entities
{
    [Table("api_gonet")]
    public class ApiGoNet
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // ═══ TRAZABILIDAD ═══
        [Required]
        [MaxLength(50)]
        [Column("trace_id")]
        public string TraceId { get; set; } = string.Empty;

        // ═══ USUARIO ═══
        [Column("usuario_id")]
        public int? UsuarioId { get; set; }

        [MaxLength(100)]
        [Column("usuario_nombre")]
        public string? UsuarioNombre { get; set; }

        [MaxLength(200)]
        [Column("usuario_email")]
        public string? UsuarioEmail { get; set; }

        [Column("esta_autenticado")]
        public bool EstaAutenticado { get; set; } = false;

        [MaxLength(500)]
        [Column("usuario_roles")]
        public string? UsuarioRoles { get; set; }

        [Column("usuario_claims")]
        public string? UsuarioClaims { get; set; }

        // ═══ PETICION ═══
        [Required]
        [MaxLength(10)]
        [Column("metodo_http")]
        public string MetodoHttp { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        [Column("endpoint")]
        public string Endpoint { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("endpoint_template")]
        public string? EndpointTemplate { get; set; }

        [MaxLength(200)]
        [Column("controller_nombre")]
        public string? ControllerNombre { get; set; }

        [MaxLength(200)]
        [Column("action_nombre")]
        public string? ActionNombre { get; set; }

        [MaxLength(2000)]
        [Column("query_string")]
        public string? QueryString { get; set; }

        [Column("route_values")]
        public string? RouteValues { get; set; }

        [Column("cuerpo_peticion")]
        public string? CuerpoPeticion { get; set; }

        [Column("tamano_peticion_bytes")]
        public long TamanoPeticionBytes { get; set; }

        [MaxLength(100)]
        [Column("content_type_peticion")]
        public string? ContentTypePeticion { get; set; }

        [Column("headers_peticion")]
        public string? HeadersPeticion { get; set; }

        // ═══ RESPUESTA ═══
        [Column("estado_http")]
        public int EstadoHttp { get; set; }

        [MaxLength(100)]
        [Column("mensaje")]
        public string Mensaje { get; set; } = string.Empty;

        [Column("cuerpo_respuesta")]
        public string? CuerpoRespuesta { get; set; }

        [Column("tamano_respuesta_bytes")]
        public long TamanoRespuestaBytes { get; set; }

        [MaxLength(100)]
        [Column("content_type_respuesta")]
        public string? ContentTypeRespuesta { get; set; }

        [Column("headers_respuesta")]
        public string? HeadersRespuesta { get; set; }

        // ═══ ERRORES ═══
        [Column("mensaje_error")]
        public string? MensajeError { get; set; }

        [Column("stack_trace")]
        public string? StackTrace { get; set; }

        [MaxLength(300)]
        [Column("tipo_excepcion")]
        public string? TipoExcepcion { get; set; }

        [Column("inner_exception")]
        public string? InnerException { get; set; }

        // ═══ RED ═══
        [MaxLength(50)]
        [Column("direccion_ip")]
        public string DireccionIp { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("ip_real")]
        public string? IpReal { get; set; }

        [MaxLength(1000)]
        [Column("agente_usuario")]
        public string AgenteUsuario { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("browser")]
        public string? Browser { get; set; }

        [MaxLength(100)]
        [Column("sistema_operativo")]
        public string? SistemaOperativo { get; set; }

        [MaxLength(20)]
        [Column("tipo_dispositivo")]
        public string? TipoDispositivo { get; set; }

        [MaxLength(200)]
        [Column("host")]
        public string? Host { get; set; }

        [MaxLength(10)]
        [Column("esquema")]
        public string? Esquema { get; set; }

        [MaxLength(20)]
        [Column("protocolo")]
        public string? Protocolo { get; set; }

        [Column("puerto")]
        public int? Puerto { get; set; }

        [MaxLength(500)]
        [Column("origin")]
        public string? Origin { get; set; }

        [MaxLength(1000)]
        [Column("referer")]
        public string? Referer { get; set; }

        [MaxLength(200)]
        [Column("accept_language")]
        public string? AcceptLanguage { get; set; }

        // ═══ PERFORMANCE ═══
        [Column("duracion_ms")]
        public long DuracionMs { get; set; }

        [MaxLength(10)]
        [Column("nivel_riesgo")]
        public string NivelRiesgo { get; set; } = "bajo";

        [MaxLength(500)]
        [Column("riesgo_razon")]
        public string? RiesgoRazon { get; set; }

        [Column("memoria_antes_bytes")]
        public long MemoriaAntesBytes { get; set; }

        [Column("memoria_despues_bytes")]
        public long MemoriaDespuesBytes { get; set; }

        [Column("memoria_delta_bytes")]
        public long MemoriaDeltaBytes { get; set; }

        // ═══ ENTORNO ═══
        [MaxLength(100)]
        [Column("maquina")]
        public string? Maquina { get; set; }

        [MaxLength(30)]
        [Column("entorno")]
        public string? Entorno { get; set; }

        [MaxLength(30)]
        [Column("dotnet_version")]
        public string? DotnetVersion { get; set; }

        [Column("thread_id")]
        public int ThreadId { get; set; }

        // ═══ METADATA ═══
        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [Column("es_exitoso")]
        public bool EsExitoso { get; set; }

        [Column("es_excepcion")]
        public bool EsExcepcion { get; set; }

        [Column("notas")]
        public string? Notas { get; set; }
    }
}
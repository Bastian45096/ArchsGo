# CI/CD - Pruebas y Matrices Completas de GoNET

## 1. Introducción a la Estrategia de Pruebas

El microservicio **GoNET** requiere una cobertura de pruebas integral que valide:
- **Autenticación**: JWT, Identity, vinculación con ArchsGo
- **Integridad de Datos**: EF Core, Azure SQL Serverless, Database per Service
- **Performance**: Latencia de API, concurrencia, carga
- **Seguridad**: CORS, middleware de auditoría, validación

**Herramientas:** xUnit, NUnit, MSTest, Postman/Newman, JMeter (carga)
**Entornos:** Dev (`localhost:5124`), Staging (Azure), Prod

---

## 2. Matriz de Pruebas por Endpoint (Completa)

### 2.1 POST /api/auth/register

**Responsabilidad:** Creación de cuenta independiente en GoNET con validación completa.

| ID Caso | Caso de Uso | Datos de Entrada | Resultado Esperado | Métrica de Éxito | Clase/Tabla | Estado |
|---------|-------------|------------------|--------------------|------------------|-------------|--------|
| R01 | Registro exitoso | username="jdoe", email="j@d.com", pass="Secure1!" | 200 OK, userId generado | Tiempo < 200ms, DB insert OK | `User`, `Users` | ✅ Pass |
| R02 | Username duplicado | username="existing", email="new@d.com", pass="Pass123!" | 400 Bad Request | Error message claro | `UserRepository.ExistsAsync()` | ✅ Pass |
| R03 | Email duplicado | username="newuser", email="existing@d.com", pass="Pass123!" | 400 Bad Request | Error message claro | `User` | ✅ Pass |
| R04 | Password corta (<8) | pass="short" | 400 | Mensaje "Mínimo 8 caracteres" | `RegisterRequest` validación | ✅ Pass |
| R05 | Email mal formado | email="notanemail" | 400 | Validación Regex Falla | `LoginRequest/Response` | ✅ Pass |
| R06 | Username vacío | username="", email="test@test.com", pass="Pass123!" | 400 | Campo requerido | `FluentValidation` | ✅ Pass |
| R07 | Lenguaje/Charset especial (Unicode) | username="cafe_ñ", email="cafe@ñ.com" | 200 OK si válido | UTF-8 soportado | `DB Context` | ✅ Pass |
| R08 | Registro concurrente (race) | 2 requests simultáneos con mismo username | 1 OK, 1 400 (excepción de concurrencia) | No corrupción de datos | `UserRepository` + Lock | ✅ Pass |

**Criterios de Éxito:**
- Todos los casos positivos (R01, R07) devuelven `userId > 0`
- DbContext guarda correctamente en `Users`
- `PasswordHash` es varbinary, nunca texto plano
- Confirmar que `CreatedAt` y `UpdatedAt` se inicializan
- Latencia promedio < 250ms (percentil 95)

---

### 2.2 POST /api/auth/login

**Responsabilidad:** Autenticación JWT con validación de credenciales y emisión de token.

| ID Caso | Caso de Uso | Datos de Entrada | Resultado Esperado | Métrica de Éxito | Clase/Tabla | Estado |
|---------|-------------|------------------|--------------------|------------------|-------------|--------|
| L01 | Login válido | username="jdoe", pass="Secure1!" | 200 + token JWT | Token decodable, `ValidateToken` = true | `LoginResponse`, `User` | ✅ Pass |
| L02 | Credenciales incorrectas | username="bad", pass="bad" | 401 Unauthorized | No token emitido | `AuthService` | ✅ Pass |
| L03 | Usuario inexistente | username="ghost", pass="anything" | 401 | No leak de existencia | `UserRepository` | ✅ Pass |
| L04 | Cuenta con vinculación ArchsGo pendiente | usuario existente vinculado | 200 + mensaje de vinculación | `ArchsGoClient` se activa | `IArchsGoClient` | ✅ Pass |
| L05 | Login repetido (2 rápidos) | Mismo usuario 2x en 1s | 200 ambas (o 429 si rate limit) | Token distinto por sesión | `JwtBearer` | ✅ Pass |
| L06 | Token expirado recibido | Authorization: Bearer {expired_token} | 401 | Mensaje "Token expirado" | `TokenValidationParameters` | ✅ Pass |

**Métricas de Rendimiento:**
- **Latency:** < 150ms promedio
- **Throughput:** > 100 req/s por instancia
- **Token Size:** < 2KB
- **Validación:** `SymmetricSecurityKey` funciona correctamente

---

### 2.3 GET /api/profile/{userId}

**Responsabilidad:** Recuperación de perfil con protección de datos y verificación del token.

| ID Caso | Caso de Uso | Datos de Entrada | Resultado Esperado | Métrica | Clase/Tabla | Estado |
|---------|-------------|------------------|--------------------|---------|-------------|--------|
| P01 | Perfil existente con token | userId=1, Authorization válido | 200, `ProfileImage` presente | Datos completos | `ProfileResponse`, `User` | ✅ Pass |
| P02 | Perfil sin imagen | userId=2, token válido | 200, `ProfileImage` = null | Campo opcional manejado | `User.ProfileImage` | ✅ Pass |
| P03 | Token faltante | Request sin header | 401 | No acceso | `JwtBearer` middleware | ✅ Pass |
| P04 | Token con rol no autorizado (si aplica RBAC futuro) | Token de rol "User" pidiendo admin profile | 403 (futuro) | RBAC implementado | `Role` property | 🟡 Futuro |
| P05 | Perfil eliminado (soft delete futuro) | userId=99 (eliminado) | 404 | No crash | `UserRepository` | ✅ Pass |

---

### 2.4 POST /api/messages

**Responsabilidad:** Persistencia de mensajes de chat y validación de remitente.

| ID Caso | Caso de Uso | Datos de Entrada | Resultado Esperado | Métrica | Clase/Tabla | Estado |
|---------|-------------|------------------|--------------------|---------|-------------|--------|
| M01 | Mensaje simple | content="Hola", senderId=1, recipientId=2 | 201 + ID mensaje | DB insert OK | `Message`, `Messages` | ✅ Pass |
| M02 | Mensaje largo (límite) | content=5000 chars | 400 o truncado según regla | Límite aplicado | `Message.Content` (text) | 🟡 Definir |
| M03 | Remitente inexistente | senderId=999 | 400 / 404 | Validación sender | `MessageRequest` | ✅ Pass |
| M04 | Contenido vacío | content="" | 400 | No permitir vacío | `FluentValidation` | ✅ Pass |
| M05 | Mensaje con emojis/Unicode | content="🎉 Hola 👋" | 201 | UTF-8 en SQL | `DB Context` | ✅ Pass |
| M06 | Enviar mensaje sin token | Request sin Authorization | 401 | Bloqueado | `JwtBearer` | ✅ Pass |

---

### 2.5 GET /api/messages/history

**Responsabilidad:** Recuperación paginada del historial de mensajes.

| ID Caso | Caso de Uso | Datos de Entrada | Resultado Esperado | Métrica | Clase/Tabla | Estado |
|---------|-------------|------------------|--------------------|---------|-------------|--------|
| H01 | Historial básico | userId=1, limit=10 | 200, array 10 elementos | Tiempo < 300ms | `MessageHistoryResponse` | ✅ Pass |
| H02 | Historial vacío | userId=999 (sin mensajes) | 200, array vacío | No error | `IMessageRepository` | ✅ Pass |
| H03 | Limit excesivo (10000) | limit=10000 | 200, truncado a límite sistema (ej. 100) | Proteger DB | `Query` con `.Take()` | ✅ Pass |
| H04 | Filtros de fecha | from="2025-01-01", to="2025-01-31" | 200, mensajes filtrados | Índice por fecha usado | `SentAt` indexado | ✅ Pass |

---

## 3. Métricas y KPIs por Componente

| Componente | Métrica | Objetivo | Herramienta | Responsable |
|------------|---------|----------|-------------|-------------|
| `AuthService` | Tiempo de login | < 150ms | JMeter / K6 | Performance |
| `UserRepository` | Queries DB | < 10ms/p99 | SQL Profiler | DB Admin |
| `MessageRepository` | Insert msg | < 50ms | EF Core Log | Dev |
| `ApiLoggingMiddleware` | Latencia total | < 500ms | Serilog + Grafana | DevOps |
| `ArchsGoClient` | Vinculación federada | < 300ms | HttpClient timer | Dev |
| `JWT Validation` | Tiempo validación | < 10ms | Benchmark .NET | Security |

---

## 4. Pipeline CI/CD Completo (YAML)

```yaml
name: GoNET CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  DOTNET_VERSION: '8.0.x'
  API_PORT: 5124

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}
      
      - name: Restore
        run: dotnet restore GoNET.sln
      
      - name: Build
        run: dotnet build GoNET.sln --configuration Release --no-restore
      
      - name: Test Unit
        run: dotnet test GoNET.Application.Tests/GoNET.Application.Tests.csproj --filter "FullyQualifiedName~Unit" --logger trx --results-directory ./test-results
      
      - name: Test Integration
        run: dotnet test GoNET.API.Tests/GoNET.API.Tests.csproj --filter "FullyQualifiedName~Integration" --logger trx --results-directory ./test-results
      
      - name: Publish Test Results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: ./test-results/*.trx
      
      - name: Code Coverage
        run: dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
        if: github.event_name == 'pull_request'

  deploy-staging:
    needs: build-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t gonet-staging:latest .
      - run: docker tag gonet-staging:latest registry/gonet-staging:latest
      - run: docker push registry/gonet-staging:latest
      - name: Deploy to Staging
        run: kubectl apply -f k8s/staging/ -n staging

  deploy-production:
    needs: [build-and-test, deploy-staging]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t gonet-prod:latest .
      - run: docker tag gonet-prod:latest registry/gonet-prod:latest
      - run: docker push registry/gonet-prod:latest
      - name: Deploy to Production (Blue/Green)
        run: kubectl apply -f k8s/prod/ -n production
      - name: Smoke Test
        run: |
          sleep 30
          curl -f -X POST http://prod-go-net:5124/api/auth/login -H "Content-Type: application/json" -d '{"usernameOrEmail":"test","password":"test"}' || exit 1
```

---

## 5. Criterios de Aceptación (DoD - Definition of Done)

| # | Criterio | Método de Verificación | Estado |
|---|----------|------------------------|--------|
| 1 | Todos los casos R01-R08 (register) pasan | Ejecución de matriz de pruebas | ✅ |
| 2 | Todos los casos L01-L06 (login) pasan | Ejecución de matriz de pruebas | ✅ |
| 3 | Perfil recuperado sin exposición de datos sensibles | Revisión de respuesta JSON + tests | ✅ |
| 4 | Mensajes creados con integridad referencial (FK) | Test DB: constraint check | ✅ |
| 5 | Middleware de auditoría captura datos | Log de Serilog verificado | ✅ |
| 6 | Token JWT se valida correctamente | Test con token expirado/inválido | ✅ |
| 7 | CORS permite únicamente Angular | Verificación de headers `Access-Control-Allow-Origin` | ✅ |
| 8 | Base de datos independiente (Database per Service) | Revisión de connection string + despliegue | ✅ |
| 9 | Integración con ArchsGo funciona (IArchsGoClient) | Mock + integración con endpoint Go | ✅ |
| 10 | Prisma de rendimiento < 500ms en p95 | JMeter / K6 con 100 usuarios concurrentes | ✅ |

---

## 6. Herramientas de Validación

| Herramienta | Uso | Comando / Config |
|-------------|-----|------------------|
| **Postman** | Pruebas manuales de endpoints | Crear colección con variables de entorno |
| **Newman** | Pruebas automatizadas de Postman | `newman run GoNET.postman_collection.json` |
| **xUnit** | Tests unitarios de C# | `dotnet test` |
| **JMeter** | Carga de performance | Plan con 100 threads, 1000 requests |
| **K6** | Pruebas de carga modernas | `k6 run --vus 100 --duration 30s load-test.js` |
| **SonarQube** | Calidad de código | Analizar `GoNET.sln` |
| **Docker Compose** | Entorno local completo | `docker-compose -f docker-compose.yml up` |

---

## 7. Reporte de Pruebas (Ejemplo)

```
=== GoNET Test Report ===
Fecha: 2025-01-15
Versión: 1.2.0
Entorno: Development (localhost:5124)

Resumen:
- Total casos: 30
- Pases: 30 (100%)
- Fallos: 0
- Bloqueados: 0
- Tiempo total ejecución: 4.2s

Por Endpoint:
- /api/auth/register: 8/8 ✅
- /api/auth/login: 6/6 ✅
- /api/profile/{id}: 5/5 ✅
- /api/messages: 6/6 ✅
- /api/messages/history: 5/5 ✅

Métricas de Rendimiento:
- Latencia promedio (login): 142ms
- Latencia promedio (message): 89ms
- Throughput (max): 312 req/s
- Error Rate: 0.00%
- DB Query Time (p99): 12ms

Observaciones:
- Middleware ApiLoggingMiddleware capturó 30 peticiones
- Serilog registró 0 errores críticos
- JWT tokens válidos confirmados con 100% de aciertos
- Vinculación ArchsGo (IArchsGoClient) simulada OK

Estado: ✅ Aprobado para despliegue a Staging
```

---

*Documentación CI/CD: En constante actualización*
*Última actualización: Enero 2025*
*Estado: ✅ Completo para desarrollo profesional*

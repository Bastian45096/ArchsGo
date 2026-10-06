# Documentación del Frontend de ArchsGo

## Resumen

Esta documentación detalla la implementación del frontend de ArchsGo, un simulador de sistema operativo basado en web desarrollado con **Angular 19**. El frontend renderiza el entorno de escritorio virtual y gestiona todas las interacciones del usuario con los microservicios del backend.

## Arquitectura General

El frontend sigue un patrón de arquitectura limpia con componentes standalone, signal-based state management, y lazy loading para óptima performance.

### Principios Clave

1. **Componentes Standalone**: Cada componente es independiente sin módulos
2. **Gestión Reactiva**: Uso de señales de Angular para state management
3. **Lazy Loading**: Carga dinámica de componentes para mejor performance
4. **Inyección de Dependencias**: Servicios inyectados de forma limpia
5. **Separación de Concerns**: UI separado de lógica de negocio

## Arquitectura del Proyecto

### Estructura del Sistema de Archivos

```
Angular/
├── src/
│   └── app/                    # Aplicación principal de Angular
│       ├── app.component.ts    # Componente raíz
│       ├── app.config.ts       # Configuración de aplicación
│       ├── app.routes.ts      # Rutas de navegación
│       └── core/                # Núcleo de la aplicación
│           ├── features/        # Características principales
│           │   ├── auth/         # Características de autenticación
│           │   │   ├── login/     # Login
│           │   │   └── register/  # Registro
│           │   └── desktop/      # Escritorio virtual
│           │       ├── apps/     # Aplicaciones instaladas
│           │       │   ├── terminal-app/  # Terminal
│           │       │   ├── archtx-app/    # Utilidades
│           │       │   └── gonet-app/    # Chat
│           │       └── ...       # Otros componentes
│           ├── interceptors/    # Interceptores HTTP
│           └── services/        # Servicios principales
│               └── auth.service.ts  # Autenticación
```

## Componentes Principales

### 1. Componente de Escritorio (`desktop.component.ts`)

Renderiza el simulador completo de sistema operativo:

- **Wallpaper**: Fondo animado con efecto mesh gradient
- **Iconos de Escritorio**: Iconos de archivos arrastrables
- **Gestión de Ventanas**: Múltiples ventanas con redimensionado y arrastre
- **Dock**: Toolbar inferior con aplicaciones en ejecución
- **Barra Superior**: Hora, red, y controles del sistema
- **Menú Contextural**: Menú contextual del escritorio
- **Notificaciones**: Alertas del sistema
- **Lanzador**: Acceso rápido a aplicaciones

### 2. Módulo de Autenticación (`core/features/auth/`)

Gestiona todo el flujo de autenticación de usuario:

#### Componente de Login (`login.component.ts`)
- Interfaz de usuario para autenticación
- Validación de credenciales
- Redirección post-login

#### Componente de Registro (`register/create.component.ts`)
- Formulario de registro de usuario
- Validación de datos
- Flujo de verificación

#### Servicio de Autenticación (`core/services/auth.service.ts`)
```typescript
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  message: string;
  userId: number;
  username: string;
  email: string;
  role: string;
  profileImage: string;
}
```

#### Interceptor de Autenticación (`interceptors/auth.interceptor.ts`)
- Añade headers de autenticación automáticamente
- Gestiona tokens JWT
- Interceptor de peticiones HTTP

### 3. Aplicaciones Integradas

#### Terminal (`terminal-app.component.ts`)
- Interfaz de línea de comandos
- Simulación de terminal
- Comandos básicos del sistema

#### Archtx (`archtx-app.component.ts`)
- Utilidades del sistema
- Herramientas de diagnóstico
- Información del sistema

#### GoNET (`gonet-app.component.ts`)
- Aplicación de chat en tiempo real
- Comunicación WebSocket
- Integración con backend

## Gestión de Estado

### DesktopStateService
Centraliza el estado del escritorio:

- **Estado de Ventanas**: Posición y tamaño de ventanas
- **Aplicaciones Instaladas**: Gestión del ciclo de vida de aplicaciones
- **Posición de Iconos**: Layout de iconos de escritorio
- **UI State**: Mostrar/ocultar paneles, menús, notificaciones

### Patrón de Comunicación
- **Señales de Angular**: State management reactivo
- **Inyección de Servicios**: Servicios inyectados donde needed
- **Async Pipes**: Sincronización automática de datos

## Configuración y Desarrollo

### Herramientas de Build

#### Angular CLI
```bash
# Desarrollo
ng serve

# Producción
ng build --configuration production

# Pruebas
ng test

# Generación de código
ng generate component component-name
```

#### Scripts NPM (`package.json`)
```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "watch": "ng build --watch --configuration development"
  }
}
```

### Configuración del Proyecto

#### `angular.json`
- Configuración de proyectos
- Opciones de build (desarrollo/producción)
- Configuración de estilos y assets
- Esquemas para generación de código

#### `tsconfig.json`
- Configuración de TypeScript
- Paths y tipos
- Configuración de compilación

### Variables de Entorno

#### `app.config.ts`
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};
```

## Integración con Backend

### API Gateway
```typescript
// auth.service.ts
private apiUrl = 'http://localhost:8080/api/auth';

register(data: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
}
```

### Protocolos de Comunicación

1. **REST APIs**: Para operaciones CRUD
   - `/api/auth/register`
   - `/api/auth/login`
   - Endpoints del escritorio

2. **WebSocket**: Para tiempo real
   - GoNET para chat
   - Sincronización de estado
   - Mensajes en tiempo real

3. **HTTP Interceptors**: Para manejo general
   - Autenticación
   - Manejo de errores
   - Logging

## Estilo de Codigo y Convenciones

### Patrones de Componentes

#### Estructura de Componente
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [RouterOutlet, SomeOtherComponent],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss'
})
export class ComponentNameComponent {
  // Propiedades
  // Métodos
  // Lógica del ciclo de vida
}
```

### Convenciones de Nombres
- **Componentes**: kebab-case para selector, PascalCase para clase
- **Servicios**: PascalCase para clase, snake_case para métodos
- **Interfaces**: PascalCase terminadas en Interface/Request/Response
- **Archivos**: kebab-case.component.ts, kebab-case.component.html, kebab-case.component.scss

### Convenios de Codigo
- **TypeScript**: Strict mode habilitado
- **HTML**: Sin valores de atributo entre comillas cuando posible
- **SCSS**: Variables en case snake, mixins reutilizables
- **Pruebas**: Unit tests para componentes y servicios

## Configuración del Sistema

### Requisitos del Sistema

#### Desarrollador
- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (v19)

#### Entorno de Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
cd Angular
npm start

# Acceder a http://localhost:4200/
```

#### Build de Producción
```bash
# Build para producción
ng build --configuration production

# Output en dist/angular/
```

### Configuración VS Code

#### Extensiones Recomendadas
- Angular Language Service
- ESLint
- Prettier
- SASS IntelliSense

#### Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "angular.enableStrictMode": true,
  "typescript.preferences.importModuleSpecifier": "project-relative"
}
```

## Escalabilidad y Mantenibilidad

### Patrones de Diseño Implementados

1. **Component Composition**: Componentes pequeños y reutilizables
2. **Dependency Injection**: Inversión de control limpia
3. **Signal-based State**: Reactividad sin buses de eventos
4. **Pipe-Based Formatting**: Transformación de datos
5. **Interceptor-Based HTTP**: Envoltorio HTTP consistente

### Estrategias de Escalabilidad

#### 1. Arquitectura Modular
- Características separadas en carpetas lógicas
- Aplicaciones como componentes independientes
- Servicios compartidos entre componentes

#### 2. Puntos de Extensión
- Componentes extendibles via inheritance
- Servicios pluggable via inyección
- Configuración basada en tokens

#### 3. Patrones de Comunicación
- @Input/@Output para componentes padre-hijo
- Signals para state compartido
- Services para comunicación entre componentes no relacionados

### Guías de Mantenimiento

#### 1. Crecimiento de Código
- Mantener componentes bajo 200 líneas
- Usar componentes hacia afuera (output) para comunicación descendente
- Usar servicios para lógica compartida

#### 2. Pruebas
- Unit tests para componentes y servicios
- Tests de integación para flujos de usuario
- Tests de renderizado para interfaces críticas

#### 3. Performance
- Lazy loading para módulos no críticos
- Change detection óptimo para signals
- Optimización de bundles para producción

## Características Avanzadas

### 1. PWA (Progressive Web App)
```json
// service-worker-config.json
{
  "globPatterns": [
    "**/*.{html,css,js,webp,avif,png,svg,jpg,jpeg,gif}"
  ],
  "globDirectories": ["dist/angular"]
}
```

### 2. Internacionalización
```typescript
// i18n-configuration.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideL10nConfiguration({
      defaultLanguage: 'es',
      supportedLanguages: ['es', 'en']
    })
  ]
};
```

### 3. Observabilidad
```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = Date.now();
    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          const elapsed = Date.now() - start;
          console.log(`${req.method} ${req.urlWithParams} -> ${event.status} (${elapsed}ms)`);
        }
      })
    );
  }
}
```

## Futuro y Roadmap

### Próximas Mejoras

1. **Desktop App**: Contenedor nativo con Electron
2. **Gestures Avanzadas**: Soporte para gestos táctiles
3. **Personalización**: Temas personalizables por usuario
4. **Colaboración**: Compartir escritorio en tiempo real
5. **Extensiones**: Sistema de plugins para aplicaciones

### Oportunidades Técnicas

- **Web Workers**: Para cálculos pesados
- **Service Workers**: Cache offline avanzado
- **WebRTC**: Comunicación directa peer-to-peer
- **WebComponents**: Componentes web reutilizables

## Solución de Problemas

### Problemas Comunes

#### 1. Errores de Componentes
```bash
# Resolver problemas de componentes
ng generate component new-component
ng add @angular/pwa
```

#### 2. Errores de Build
```bash
# Limpiar builds
rm -rf node_modules dist
npm install
ng build
```

#### 3. Problemas de Autenticación
```typescript
// Interceptor de auth debug
console.log('Token:', localStorage.getItem('user'));
```

### Guías de Debugging

#### 1. Inspección de Componentes
- Usar Chrome DevTools con Angular DevTools
- Inspeccionar Change Detection
- Debuggear señales con NgRx DevTools

#### 2. Logging de Estado
```typescript
// Debuggear señales
import { debug } from 'console';

console.log('Ventanas:', this.state.wins());
console.log('Launcher:', this.state.launcher());
```

## Conclusión

El frontend de Angular de ArchsGo demuestra una implementación moderna de una aplicación web compleja con:

- **Arquitectura Limpia**: Separación clara de preocupaciones
- **Angular Avanzado**: Componentes standalone, señales, lazy loading
- **Integración Completa**: Comunicación fluida con backend en Go
- **Experiencia de Usuario**: Escritorio virtual realista con todas las características
- **Escalabilidad**: Patrones y convenciones para crecimiento futuro

El código está listo para producción y sigue las mejores prácticas de Angular para mantenibilidad y performance a largo plazo.

---
*Documentación actualizada: $(06/10/2026)*
*Angular Version: 19.2.27*

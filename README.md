# ArchsGo

Plataforma web que simula la interfaz y el funcionamiento de un sistema operativo, implementada mediante una arquitectura de microservicios.

## 🏗️ Arquitectura

El proyecto sigue un modelo distribuido donde el core y la lógica de negocio residen en el backend, y la interfaz de usuario se encarga de la simulación visual del sistema operativo.

### Backend (Go)
El backend está desarrollado en **Go** utilizando un espacio de trabajo (`go.work`) para gestionar múltiples módulos. Se aplica la **Clean Architecture** (Domain, Application, Infrastructure, Interfaces) en cada servicio.

- **API Gateway**: Punto de entrada único para el frontend. Gestiona la autenticación, el enrutamiento de peticiones y la coordinación básica entre servicios.
- **Service SO (Core)**: Microservicio encargado de la lógica central del sistema operativo simulado.
- **Service Chat**: Microservicio dedicado a la gestión de comunicaciones y mensajería dentro del sistema.
- **Database**: Capa de persistencia basada en SQL Server.

### Frontend (Angular)
Desarrollado con **Angular 19**, se encarga de renderizar el escritorio virtual, la gestión de ventanas y la interacción del usuario con los microservicios del backend.

## 🛠️ Stack Tecnológico

- **Lenguajes**: 
  - Go (Backend)
  - TypeScript / HTML / CSS (Frontend)
- **Frameworks**: 
  - Angular 19 (Frontend)
- **Base de Datos**: 
  - SQL Server
- **Patrones de Diseño**: 
  - Microservicios
  - Clean Architecture
  - API Gateway

## 📂 Estructura del Proyecto

```text
.
├── Angular/              # Frontend de la plataforma (simulador de SO)
│   └── src/              # Código fuente de Angular
└── Go/                   # Backend en Go
    ├── api-gateway/      # Gateway de entrada y autenticación
    ├── service-chat/     # Microservicio de Chat
    ├── service-so/       # Microservicio Core del SO
    └── database/         # Scripts de inicialización de base de datos
```

## 🚀 Ejecución

### Backend
Para ejecutar los servicios de Go, se requiere tener instalado Go y configurado el workspace.
```bash
cd Go
go run ./api-gateway/cmd/main.go
# Ejecutar los demás servicios en terminales independientes
```

### Frontend
Para levantar la interfaz de usuario:
```bash
cd Angular
npm install
npm start
```

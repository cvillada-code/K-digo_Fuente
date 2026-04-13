# 🎫 SupportDesk — Sistema de Gestión de Tickets

![CI/CD](https://github.com/cvillada-code/K-digo_Fuente/actions/workflows/ci-cd.yml/badge.svg)

Sistema web para registrar y gestionar tickets de soporte técnico, controlando su estado y prioridad en tiempo real.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Levantar el Proyecto](#levantar-el-proyecto)
- [Base de Datos](#base-de-datos)
- [Endpoints API](#endpoints-api)
- [Funcionalidades](#funcionalidades)
- [CI/CD](#cicd)

---

## Descripción

SupportDesk permite a los equipos de soporte técnico gestionar tickets de manera eficiente. Incluye control de estados, prioridades, asignación de agentes y exportación de reportes a Excel.

### Funcionalidades principales

- ✅ Crear tickets con título, descripción, cliente, prioridad y agente
- ✅ Listar todos los tickets con ordenamiento por cualquier columna
- ✅ Avanzar el estado: **Abierto → En progreso → Resuelto**
- ✅ Eliminar tickets (solo si están en estado Abierto)
- ✅ Resumen en tiempo real por estado
- ✅ Exportar tickets a Excel con dos pestañas (Tickets + Resumen)
- ✅ Paginación configurable (10, 25, 50, 100, Todos)
- ✅ Fechas en formato `dd/mm/yyyy hh:mm:ss` en 24H

---

## Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | 18.x / 4.x |
| Backend | Node.js + Express | 20.x |
| Base de datos | SQL Server | 2019 |
| Contenedores | Docker + Docker Compose | - |
| CI/CD | GitHub Actions | - |
| Registro de imágenes | GitHub Packages (ghcr.io) | - |

---

## Arquitectura

```
Usuario (Navegador)
        ↓  http://localhost:5173
┌─────────────────────────┐
│   Frontend — React      │  Puerto 5173
│   Nginx (producción)    │
└────────────┬────────────┘
             │  /api/*  (proxy)
┌────────────▼────────────┐
│   Backend — Node.js     │  Puerto 3001
│   Express REST API      │
└────────────┬────────────┘
             │  mssql driver
┌────────────▼────────────┐
│   SQL Server 2019       │  Puerto 1433
│   192.168.1.24\BD1      │
│   Base de datos:        │
│   SupportTickets        │
└─────────────────────────┘
```

---

## Estructura del Proyecto

```
support-tickets/
├── docker-compose.yml          # Orquestación de contenedores
├── seed_data.sql               # Datos de prueba
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Flujo GitHub Actions
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .eslintrc.js
│   ├── tests/
│   │   └── tickets.test.js     # Pruebas unitarias (Jest)
│   └── src/
│       ├── index.js            # Entrada principal
│       ├── db/
│       │   └── index.js        # Conexión SQL Server + init tablas
│       ├── routes/
│       │   └── index.js        # Definición de rutas
│       └── controllers/
│           ├── ticketsController.js
│           └── catalogController.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    ├── vitest.config.js
    ├── .eslintrc.cjs
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── __tests__/
        │   ├── setup.js
        │   └── components.test.jsx   # Pruebas unitarias (Vitest)
        ├── components/
        │   ├── SummaryCards.jsx
        │   ├── TicketTable.jsx
        │   ├── CreateTicketModal.jsx
        │   └── Toast.jsx
        ├── hooks/
        │   └── useTickets.js
        └── services/
            ├── api.js
            └── exportExcel.js
```

---

## Requisitos Previos

| Herramienta | Descripción | Descarga |
|---|---|---|
| Docker Desktop | Único requisito para levantar el proyecto | [docker.com](https://www.docker.com/products/docker-desktop/) |
| SQL Server 2019 | Servidor externo en `192.168.1.24` | Ya instalado |
| SSMS | Para administrar la base de datos | Opcional |

> **Nota:** No es necesario instalar Node.js, npm ni ninguna otra herramienta. Docker se encarga de todo.

---

## Configuración

### Variables de entorno

Todas las variables se configuran en `docker-compose.yml`:

```yaml
environment:
  DB_SERVER: 192.168.1.24     # IP del servidor SQL Server
  DB_PORT: 1433               # Puerto SQL Server
  DB_USER: sa                 # Usuario
  DB_PASSWORD: "TuPassword"   # Contraseña
  DB_NAME: SupportTickets     # Nombre de la base de datos
  PORT: 3001                  # Puerto del backend
```

### Requisitos en el servidor SQL Server (`192.168.1.24`)

Antes de levantar el proyecto, verificar en el servidor Windows 2019:

**1. Crear la base de datos:**
```sql
CREATE DATABASE SupportTickets;
```

**2. Habilitar usuario `sa`:**
```sql
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'TuPassword';
```

**3. Verificar autenticación mixta:**
```
SSMS → clic derecho servidor → Properties
→ Security → SQL Server and Windows Authentication mode
```

**4. Habilitar TCP/IP en puerto 1433:**
```
SQL Server Configuration Manager
→ SQL Server Network Configuration
→ Protocols for BD1 → TCP/IP → Enable
```

**5. Abrir puerto 1433 en Firewall:**
```
Windows Firewall → Reglas de entrada
→ Nueva regla → Puerto TCP 1433 → Permitir
```

**6. Verificar conectividad:**
```powershell
Test-NetConnection -ComputerName 192.168.1.24 -Port 1433
# TcpTestSucceeded debe ser: True
```

---

## Levantar el Proyecto

### Primera vez

```powershell
# 1. Descomprimir el proyecto
# 2. Abrir PowerShell en la carpeta
cd C:\ruta\support-tickets

# 3. Levantar todos los servicios
docker-compose up --build
```

Esperar el mensaje:
```
✅ Database initialized successfully
🚀 Backend running on http://localhost:3001
```

### Abrir la aplicación

```
http://localhost:5173
```

### Detener la aplicación

```powershell
# Detener
Ctrl + C

# Detener y limpiar contenedores
docker-compose down
```

### Cambios posteriores (sin --build)

```powershell
docker-compose down
docker-compose up
```

---

## Base de Datos

### Diagrama de tablas

```
priorities          statuses
──────────          ────────
id (PK)             id (PK)
name                name
level               display_order
color

agents              clients
──────              ───────
id (PK)             id (PK)
name                name
email               email

tickets (tabla principal)
─────────────────────────
id (PK)
title
description
client_id   → FK clients
priority_id → FK priorities
status_id   → FK statuses
agent_id    → FK agents
created_at
updated_at

ticket_history
──────────────
id (PK)
ticket_id      → FK tickets
old_status_id  → FK statuses
new_status_id  → FK statuses
changed_at
notes
```

### Datos iniciales (seed)

El backend crea automáticamente los datos base al iniciar:

| Tabla | Registros |
|---|---|
| priorities | Crítico, Alto, Medio, Bajo |
| statuses | Abierto, En progreso, Resuelto |
| agents | 6 agentes de soporte |
| clients | 8 empresas clientes |

### Poblar con datos de prueba

Ejecutar en SSMS el archivo `seed_data.sql` incluido en el proyecto. Inserta 15 tickets de prueba distribuidos en los 3 estados.

---

## Endpoints API

Base URL: `http://localhost:3001/api`

### Tickets

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/tickets` | Listar todos los tickets |
| `GET` | `/tickets/summary` | Conteo por estado |
| `POST` | `/tickets` | Crear nuevo ticket |
| `PATCH` | `/tickets/:id/advance` | Avanzar estado del ticket |
| `DELETE` | `/tickets/:id` | Eliminar ticket (solo Abierto) |

### Catálogos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/agents` | Listar agentes |
| `GET` | `/clients` | Listar clientes |
| `GET` | `/priorities` | Listar prioridades |

### Ejemplo — Crear ticket

```json
POST /api/tickets
Content-Type: application/json

{
  "title": "Servidor sin conexión",
  "description": "El servidor principal no responde desde las 8am",
  "client_id": 1,
  "priority_id": 1,
  "agent_id": 2
}
```

### Respuesta exitosa

```json
{
  "id": 16,
  "message": "Ticket creado exitosamente"
}
```

---

## Funcionalidades

### Estados y transiciones

```
Abierto ──→ En progreso ──→ Resuelto
```

- Un ticket **Resuelto** no puede modificarse
- Solo se pueden **eliminar** tickets en estado **Abierto**

### Prioridades

| Prioridad | Color | Descripción |
|---|---|---|
| 🔴 Crítico | Rojo | Afecta operación completa |
| 🟠 Alto | Naranja | Afecta área o proceso |
| 🟡 Medio | Amarillo | Inconveniente moderado |
| 🟢 Bajo | Verde | Solicitud o mejora |

### Exportar a Excel

El botón **↓ Exportar Excel** genera un archivo con:
- **Pestaña Tickets:** todos los registros con columnas ID, Título, Descripción, Cliente, Prioridad, Estado, Agente y Fecha
- **Pestaña Resumen:** conteo por estado

Nombre del archivo generado:
```
tickets_soporte_12-04-2026.xlsx
```

---

## CI/CD

### Flujo automático

Cada `push` a `main` activa el flujo:

```
git push origin main
       ↓
Job 1: Lint y Pruebas Unitarias
  ├── ESLint Backend
  ├── Jest (8 pruebas unitarias)
  ├── ESLint Frontend
  ├── Vitest (7 pruebas unitarias)
  └── Build Vite
       ↓ (solo si Job 1 pasa)
Job 2: Build y Push Docker Images
  ├── supportdesk-backend → ghcr.io
  └── supportdesk-frontend → ghcr.io
```

### Imágenes publicadas

```
ghcr.io/cvillada-code/supportdesk-backend:latest
ghcr.io/cvillada-code/supportdesk-frontend:latest
```

### Ver historial de ejecuciones

```
https://github.com/cvillada-code/K-digo_Fuente/actions
```

---

## Conectarse a la BD desde SSMS o Azure Data Studio

| Campo | Valor |
|---|---|
| Host | `192.168.1.24` |
| Puerto | `1433` |
| Usuario | `sa` |
| Base de datos | `SupportTickets` |
| Trust server certificate | ✅ Activado |

---

*Desarrollado con React, Node.js, SQL Server y Docker.*

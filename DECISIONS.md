# 📐 Decisiones Tecnológicas — SupportDesk

Este documento explica el **por qué** detrás de cada decisión tecnológica tomada en el proyecto. Sirve como referencia para el equipo de desarrollo y para futuras personas que se unan al proyecto.

---

## 1. Frontend — React + Vite
- **Es un requisito del proyecto** 
---

## 2. Backend — Node.js + Express
- **Es un requisito del proyecto** 

### Alternativas consideradas

| Framework | Motivo de descarte |
|---|---|
| NestJS | Mayor complejidad para un proyecto de este tamaño |
| Fastify | Menos familiar para el equipo |
| Hapi | Ecosistema más pequeño |

---

## 3. Base de Datos — SQL Server

### ¿Por qué SQL Server?

La elección de SQL Server estaba dentro de un **requisito del proyecto**, dado que ya tengo un servidor SQL Server 2019 Interprise instalado en la infraestructura de mi laboratorio en `192.168.1.24`. Esto lo tengo en una máquina virtual.

Adicionalmente SQL Server ofrece:

- **Confiabilidad empresarial:** ampliamente usado en entornos corporativos con soporte oficial de Microsoft.
- **Integridad referencial:** las llaves foráneas entre tablas garantizan consistencia en los datos.
- **Transacciones ACID:** garantiza que las operaciones en la base de datos sean atómicas y consistentes.
- **Herramientas de administración:** SSMS y Azure Data Studio facilitan la administración y consulta de datos.

### ¿Por qué 6 tablas?

El modelo de datos se diseñó con un **mínimo necesario de tablas** para cumplir con requerimientos funcionales, teniendo en cuenta que puede haber muchas más:

| Tabla | Propósito |
|---|---|
| `priorities` | Catálogo de prioridades (Crítico, Alto, Medio, Bajo) |
| `statuses` | Catálogo de estados (Abierto, En progreso, Resuelto) |
| `agents` | Agentes de soporte disponibles |
| `clients` | Clientes que generan tickets |
| `tickets` | Tabla principal con los registros de soporte |
| `ticket_history` | Auditoría de cambios de estado |

Separar prioridades y estados en tablas propias (en lugar de texto libre) garantiza **consistencia** en los datos y facilita agregar nuevos valores en el futuro sin cambiar código.

### Driver de conexión — mssql

Se usó la librería `mssql` para Node.js porque:

- Es el driver oficial y más usado para conectar Node.js con SQL Server.
- Soporta conexiones con instancias con nombre (`BD1`).
- Maneja pool de conexiones para mejorar el rendimiento.
- Compatible con autenticación SQL Server (usuario y contraseña).

---

## 4. Contenedores — Docker + Docker Compose
- **Es un requisito del proyecto** 

### ¿Por qué Docker Compose?

Docker Compose permite levantar múltiples contenedores con un solo comando:

```bash
docker-compose up --build
```

Sin Docker Compose habría que ejecutar múltiples comandos manuales para construir y arrancar cada contenedor por separado.

### Decisión — SQL Server externo (no en Docker)

Inicialmente el proyecto incluía SQL Server como un tercer contenedor en Docker Compose. Se decidió **usar el servidor SQL Server existente en `192.168.1.24`** por las siguientes razones:

- **Infraestructura ya disponible:** la empresa ya tiene SQL Server instalado y licenciado.
- **Persistencia garantizada:** los datos viven en el servidor corporativo con sus propios respaldos y políticas de seguridad.
- **Menor consumo de recursos:** SQL Server en Docker consume más de 2GB de RAM adicionales.
- **Gestión centralizada:** el equipo de infraestructura ya administra ese servidor.

---

## 5. Servidor Web Frontend — Nginx

### ¿Por qué Nginx en producción?

En desarrollo, Vite incluye su propio servidor. En producción (dentro del contenedor Docker) se usa **Nginx** porque:

- **Alto rendimiento:** Nginx está diseñado para servir archivos estáticos de forma muy eficiente.
- **Proxy reverso:** redirige las llamadas a `/api/*` al contenedor del backend sin que el frontend necesite conocer la IP del backend.
- **SPA compatible:** configurado para redirigir todas las rutas a `index.html`, necesario para que React Router funcione correctamente.
- **Imagen liviana:** la imagen `nginx:alpine` pesa solo ~23MB.

### Configuración multi-stage en Dockerfile

El Dockerfile del frontend usa **multi-stage build**:

```dockerfile
# Etapa 1: compilar React con Node.js
FROM node:20-alpine AS builder
RUN npm run build

# Etapa 2: servir con Nginx (imagen final liviana)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

Esto produce una imagen final pequeña que no incluye Node.js ni el código fuente, solo los archivos compilados.

---

## 6. Pruebas — Jest y Vitest

### ¿Por qué Jest para el backend?

Jest es el framework de pruebas más popular para Node.js:

- **Zero configuración:** funciona sin configuración adicional en proyectos Node.js.
- **Mocks integrados:** permite simular la conexión a la base de datos sin necesitar SQL Server en el entorno de pruebas.
- **Cobertura de código:** genera reportes de qué porcentaje del código está cubierto por pruebas.

### ¿Por qué Vitest para el frontend?

Vitest es el framework de pruebas nativo de Vite:

- **Integración nativa:** al usar Vite para construir el proyecto, Vitest reutiliza la misma configuración sin necesidad de setup adicional.
- **API compatible con Jest:** los tests se escriben igual que en Jest, sin curva de aprendizaje adicional.
- **Más rápido:** al estar integrado con Vite, las pruebas corren significativamente más rápido que con Jest.

### Estrategia de pruebas

Se priorizaron **pruebas unitarias** sobre pruebas de integración o end-to-end porque:

- Son más rápidas de ejecutar en el pipeline de CI/CD.
- No requieren base de datos ni servicios externos.
- Verifican las reglas de negocio más importantes: validaciones, manejo de errores y estados.

---

## 7. CI/CD — GitHub Actions

### ¿Por qué GitHub Actions?

- **Nativo en GitHub:** al alojar el código en GitHub, GitHub Actions está disponible sin configurar servicios externos como Jenkins o CircleCI.
- **Gratuito para repositorios públicos y privados (con límites):** suficiente para este proyecto.
- **YAML simple:** el flujo se define en un archivo `.yml` versionado junto al código.
- **Marketplace de acciones:** existen acciones predefinidas para Docker, Node.js, etc., que simplifican la configuración.

### ¿Por qué GitHub Packages como registro de imágenes?

- **Integración nativa:** GitHub Packages está integrado con GitHub Actions, la autenticación es automática mediante `GITHUB_TOKEN`.
- **Sin configuración adicional:** no requiere crear cuentas en DockerHub ni configurar secretos adicionales.
- **Trazabilidad:** cada imagen publicada está vinculada al commit y al repositorio que la generó.

### Decisión — Job 2 solo en rama main

El job de construcción y publicación de imágenes Docker **solo se ejecuta en push a `main`**, no en Pull Requests ni en la rama `develop`. Esto evita publicar imágenes de código que aún no ha sido revisado y aprobado.

---

## 8. Librerías Adicionales

### xlsx — Exportar a Excel

Se eligió la librería `xlsx` (SheetJS) para la exportación porque:

- Es la librería más completa y usada para generar archivos Excel desde JavaScript.
- Funciona completamente en el navegador, sin necesidad de llamadas al backend.
- Permite crear múltiples pestañas (Tickets + Resumen) en un solo archivo.
- Controla el ancho de columnas para mejorar la legibilidad del reporte.

### ESLint — Calidad de código

ESLint garantiza que todo el código siga las mismas convenciones:

- Detecta errores antes de que lleguen a producción.
- Estandariza el estilo de código entre diferentes desarrolladores.
- Se ejecuta automáticamente en cada push mediante GitHub Actions.

---

## Resumen de Decisiones

| Decisión | Elección | Alternativa descartada | Motivo principal |
|---|---|---|---|
| Framework UI | React | Vue, Angular | Ecosistema y adopción |
| Build tool | Vite | Create React App | CRA descontinuado |
| Backend | Node.js + Express | NestJS, Python/FastAPI | Mismo lenguaje que frontend |
| Base de datos | SQL Server | PostgreSQL, MySQL | Servidor ya disponible |
| Contenedores | Docker Compose | Kubernetes | Complejidad innecesaria |
| Servidor web | Nginx | Apache | Rendimiento y ligereza |
| Pruebas backend | Jest | Mocha | Zero configuración |
| Pruebas frontend | Vitest | Jest | Integración nativa con Vite |
| CI/CD | GitHub Actions | Jenkins, CircleCI | Nativo en GitHub |
| Registro Docker | GitHub Packages | DockerHub | Sin configuración adicional |
| Export Excel | xlsx (SheetJS) | Implementación manual | Más completo y mantenido |

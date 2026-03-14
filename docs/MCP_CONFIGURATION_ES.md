# Configuración MCP (Model Context Protocol) — Spring Framework Petclinic

## Índice

1. [¿Qué es MCP?](#qué-es-mcp)
2. [Servicios Detectados](#servicios-detectados)
3. [Arquitectura de Integración](#arquitectura-de-integración)
4. [Servidores MCP Configurados](#servidores-mcp-configurados)
5. [Variables de Entorno](#variables-de-entorno)
6. [Instrucciones de Configuración](#instrucciones-de-configuración)
7. [Verificación de la Configuración](#verificación-de-la-configuración)
8. [Resolución de Problemas](#resolución-de-problemas)

---

## ¿Qué es MCP?

**Model Context Protocol (MCP)** es un estándar abierto que permite a los asistentes de IA interactuar de forma segura con herramientas externas, fuentes de datos y servicios. Los servidores MCP proporcionan:

- **Herramientas (Tools):** Acciones que la IA puede ejecutar (crear archivos, consultar bases de datos, llamar APIs).
- **Recursos (Resources):** Datos a los que la IA puede acceder (archivos, registros de base de datos, documentación).
- **Prompts:** Plantillas predefinidas para tareas comunes.

La configuración MCP de este proyecto se encuentra en el archivo `.mcp/settings.json` en la raíz del repositorio.

---

## Servicios Detectados

Se ha realizado un análisis del proyecto para identificar los servicios que se benefician de la integración MCP:

| Servicio        | Indicadores Encontrados                                                                  | Servidor MCP Recomendado      |
|-----------------|------------------------------------------------------------------------------------------|-------------------------------|
| **GitHub**      | Directorio `.github/` con workflows, agents y skills; GitHub Actions CI/CD; SonarCloud   | `github-mcp-server` (Docker)  |
| **PostgreSQL**  | Driver PostgreSQL v42.7.9 en `pom.xml`; scripts SQL en `src/main/resources/db/postgresql/` | `@anthropic/mcp-postgres`     |
| **Playwright**  | Dependencia en `package.json`; configuración previa en `.vscode/mcp.json`                | `@playwright/mcp`             |
| **Filesystem**  | Agentes en `.claude/` y `.github/agents/` que requieren acceso a archivos del proyecto   | `@anthropic/mcp-filesystem`   |

---

## Arquitectura de Integración

```
┌─────────────────────────────────────────────────────┐
│                   IDE / Editor                       │
│              (VS Code, JetBrains, etc.)              │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │           Asistente IA (Copilot/Claude)         │ │
│  └──────────┬──────┬──────┬──────┬────────────────┘ │
│             │      │      │      │                   │
└─────────────┼──────┼──────┼──────┼───────────────────┘
              │      │      │      │
    ┌─────────▼──┐ ┌─▼────┐ ┌▼─────┐ ┌▼──────────┐
    │  GitHub    │ │Postgres│ │FS   │ │Playwright │
    │  MCP       │ │ MCP   │ │ MCP │ │  MCP      │
    │  Server    │ │Server │ │Server│ │  Server   │
    └─────┬──────┘ └──┬───┘ └──┬──┘ └─────┬─────┘
          │           │        │           │
    ┌─────▼──────┐ ┌──▼───┐ ┌──▼──┐ ┌─────▼─────┐
    │  GitHub    │ │  DB  │ │Local│ │ Navegador │
    │  API       │ │ PostgreSQL│ │Disco│ │  Chrome   │
    └────────────┘ └──────┘ └─────┘ └───────────┘
```

---

## Servidores MCP Configurados

### 1. GitHub MCP Server

**Propósito:** Permite a la IA interactuar con el repositorio GitHub del proyecto — gestión de issues, pull requests, workflows de CI/CD y revisiones de código.

**Configuración:**
```json
{
  "github": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "-e", "GITHUB_TOKEN", "ghcr.io/github/github-mcp-server"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Requisitos:**
- Docker Desktop instalado y en ejecución.
- Token de acceso personal de GitHub (PAT) con alcance `repo`.

**Capacidades:**
- Crear y gestionar issues y pull requests.
- Consultar el estado de workflows de GitHub Actions.
- Buscar código en el repositorio.
- Gestionar ramas y commits.

---

### 2. PostgreSQL MCP Server

**Propósito:** Permite a la IA consultar directamente la base de datos PostgreSQL utilizada por el proyecto, facilitando la exploración de datos y la depuración de consultas JPA/SQL.

**Configuración:**
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-postgres", "${DATABASE_URL}"]
  }
}
```

**Requisitos:**
- Node.js v18+ instalado.
- Instancia de PostgreSQL accesible.
- Cadena de conexión `DATABASE_URL` configurada.

**Capacidades:**
- Ejecutar consultas SQL de solo lectura.
- Explorar el esquema de la base de datos (tablas, columnas, índices).
- Verificar datos de prueba y migraciones.

> **Nota:** Este servidor es relevante cuando el proyecto se despliega con el perfil PostgreSQL. El proyecto soporta además HSQLDB (por defecto), H2 y MySQL.

---

### 3. Filesystem MCP Server

**Propósito:** Proporciona acceso controlado al sistema de archivos del proyecto, permitiendo a la IA leer y escribir archivos dentro del directorio del workspace.

**Configuración:**
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-filesystem", "${workspaceFolder}"]
  }
}
```

**Requisitos:**
- Node.js v18+ instalado.
- Permisos de lectura/escritura en el directorio del proyecto.

**Capacidades:**
- Leer y escribir archivos del proyecto.
- Listar directorios y buscar archivos.
- Crear y eliminar archivos y directorios.

> **Seguridad:** El acceso está restringido al directorio del workspace (`${workspaceFolder}`). No se permite el acceso a directorios externos.

---

### 4. Playwright MCP Server

**Propósito:** Habilita la automatización de navegador para pruebas E2E, capturas de pantalla de la interfaz JSP del proyecto y web scraping.

**Configuración:**
```json
{
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest"]
  }
}
```

**Requisitos:**
- Node.js v18+ instalado.
- Navegadores de Playwright instalados (`npx playwright install`).

**Capacidades:**
- Navegar por la aplicación web PetClinic desplegada.
- Capturar pantallas de las vistas JSP.
- Interactuar con formularios y elementos de la interfaz.
- Generar pruebas de aceptación visual.

---

## Variables de Entorno

Las siguientes variables de entorno son necesarias para el correcto funcionamiento de los servidores MCP:

| Variable         | Descripción                                              | Obligatoria | Ejemplo                                                    |
|------------------|----------------------------------------------------------|:-----------:|------------------------------------------------------------|
| `GITHUB_TOKEN`   | Token de acceso personal de GitHub con alcance `repo`    | ✅ Sí       | `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                 |
| `DATABASE_URL`   | Cadena de conexión a PostgreSQL                          | ⚠️ Opcional | `postgresql://usuario:contraseña@localhost:5432/petclinic` |

### Cómo obtener las credenciales

#### GITHUB_TOKEN

1. Acceder a [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens).
2. Hacer clic en **"Generate new token (classic)"**.
3. Seleccionar los siguientes alcances (scopes):
   - `repo` — Acceso completo a repositorios privados.
   - `read:org` — Lectura de información de la organización.
   - `workflow` — Gestión de workflows de GitHub Actions.
4. Copiar el token generado y configurarlo como variable de entorno:

   ```bash
   # Linux / macOS
   export GITHUB_TOKEN="ghp_tu_token_aqui"

   # Windows (PowerShell)
   $env:GITHUB_TOKEN = "ghp_tu_token_aqui"
   ```

#### DATABASE_URL (Solo si se usa PostgreSQL)

La cadena de conexión sigue el formato estándar de PostgreSQL:

```
postgresql://<usuario>:<contraseña>@<host>:<puerto>/<base_de_datos>
```

**Ejemplo para desarrollo local:**
```
postgresql://petclinic:petclinic@localhost:5432/petclinic
```

> **Recordatorio:** Por defecto, el proyecto utiliza HSQLDB como base de datos embebida. La configuración de PostgreSQL solo es necesaria si se activa el perfil correspondiente en la configuración de Spring.

---

## Instrucciones de Configuración

### Paso 1: Verificar Prerrequisitos

```bash
# Verificar Node.js (v18+ requerido)
node --version

# Verificar Docker (necesario para GitHub MCP)
docker --version

# Verificar npx
npx --version
```

### Paso 2: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto (ya incluido en `.gitignore`):

```env
GITHUB_TOKEN=ghp_tu_token_aqui
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/petclinic
```

> ⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` al repositorio. Verifica que esté incluido en `.gitignore`.

### Paso 3: Instalar Dependencias de Playwright (si aplica)

```bash
npx playwright install
```

### Paso 4: Verificar el Archivo de Configuración

El archivo `.mcp/settings.json` ya está incluido en el repositorio. Verifica que contiene la configuración correcta:

```bash
cat .mcp/settings.json
```

### Paso 5: Reiniciar el IDE

Tras configurar las variables de entorno y el archivo `.mcp/settings.json`, reinicia VS Code (u otro editor compatible) para que los servidores MCP se detecten automáticamente.

---

## Verificación de la Configuración

### Verificar GitHub MCP Server

```bash
# Verificar que Docker puede ejecutar la imagen
docker run --rm -e GITHUB_TOKEN ghcr.io/github/github-mcp-server --help
```

### Verificar PostgreSQL MCP Server

```bash
# Verificar conectividad con la base de datos
npx -y @anthropic/mcp-postgres "postgresql://usuario:contraseña@localhost:5432/petclinic"
```

### Verificar Filesystem MCP Server

```bash
# Verificar que el servidor se inicia correctamente
npx -y @anthropic/mcp-filesystem .
```

### Verificar Playwright MCP Server

```bash
# Verificar que Playwright está instalado
npx playwright --version
```

---

## Resolución de Problemas

### El servidor GitHub MCP no se conecta

| Problema                          | Solución                                                                 |
|-----------------------------------|--------------------------------------------------------------------------|
| `GITHUB_TOKEN` no definido        | Configurar la variable de entorno según las instrucciones anteriores      |
| Docker no está ejecutándose       | Iniciar Docker Desktop antes de abrir el IDE                             |
| Error de autenticación (401)      | Verificar que el token tiene los alcances `repo`, `read:org`, `workflow` |
| La imagen no se descarga          | Ejecutar `docker pull ghcr.io/github/github-mcp-server`                 |

### El servidor PostgreSQL MCP no se conecta

| Problema                           | Solución                                                             |
|------------------------------------|----------------------------------------------------------------------|
| `DATABASE_URL` no definida         | Configurar la variable de entorno con la cadena de conexión          |
| Error de conexión rechazada        | Verificar que PostgreSQL está ejecutándose en el puerto indicado     |
| Error de autenticación             | Verificar usuario y contraseña en la cadena de conexión              |
| Base de datos no existe            | Crear la base de datos: `createdb petclinic`                         |

### Playwright no encuentra navegadores

```bash
# Instalar navegadores necesarios
npx playwright install chromium

# O instalar todos los navegadores
npx playwright install
```

### Los servidores MCP no aparecen en el IDE

1. Verificar que el archivo `.mcp/settings.json` está en la raíz del proyecto.
2. Reiniciar completamente el IDE.
3. Comprobar que las extensiones del IDE soportan MCP.
4. Revisar los logs del IDE para errores de inicialización de MCP.

---

## Archivos de Referencia

| Archivo                       | Descripción                                      |
|-------------------------------|--------------------------------------------------|
| `.mcp/settings.json`          | Configuración principal de servidores MCP         |
| `.vscode/mcp.json`            | Configuración MCP específica de VS Code (legacy)  |
| `docs/MCP_CONFIGURATION_ES.md`| Este documento                                   |

---

> **Última actualización:** Marzo 2026  
> **Generado por:** MCP Expert Agent

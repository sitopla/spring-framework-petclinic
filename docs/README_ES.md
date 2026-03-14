# Spring Framework PetClinic

<div align="center">

![Spring Framework](https://img.shields.io/badge/Spring%20Framework-7.0.3-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-Apache%202.0-blue?style=for-the-badge)

[![Java CI with Maven](https://github.com/spring-petclinic/spring-framework-petclinic/actions/workflows/maven-build.yml/badge.svg)](https://github.com/spring-petclinic/spring-framework-petclinic/actions/workflows/maven-build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=spring-petclinic_spring-framework-petclinic&metric=alert_status)](https://sonarcloud.io/dashboard?id=spring-petclinic_spring-framework-petclinic)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=spring-petclinic_spring-framework-petclinic&metric=coverage)](https://sonarcloud.io/dashboard?id=spring-petclinic_spring-framework-petclinic)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=spring-petclinic_spring-framework-petclinic&metric=bugs)](https://sonarcloud.io/dashboard?id=spring-petclinic_spring-framework-petclinic)

**Una implementación de referencia lista para producción de una aplicación web Spring Framework que muestra la arquitectura clásica de 3 capas con múltiples estrategias de persistencia.**

[Inicio Rápido](#-inicio-rápido) •
[Características](#-características-principales) •
[Arquitectura](#-arquitectura) •
[Configuración](#%EF%B8%8F-configuración) •
[Referencia API](#-referencia-api) •
[Contribuir](#-contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Inicio Rápido](#-inicio-rápido)
- [Instalación](#-instalación)
- [Arquitectura](#-arquitectura)
- [Configuración](#%EF%B8%8F-configuración)
- [Configuración de Base de Datos](#%EF%B8%8F-configuración-de-base-de-datos)
- [Referencia API](#-referencia-api)
- [Desarrollo](#%EF%B8%8F-desarrollo)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

Spring Framework PetClinic es la **aplicación de referencia oficial** que demuestra las capacidades de Spring Framework con una arquitectura tradicional de 3 capas. A diferencia de la versión Spring Boot, esta implementación usa **configuración pura de Spring Framework** para proporcionar una visión más profunda de cómo funciona Spring internamente.

Esta aplicación simula un sistema de gestión de clínica veterinaria donde puedes:
- Gestionar propietarios de mascotas y su información de contacto
- Registrar mascotas con tipos, fechas de nacimiento y propiedad
- Programar y hacer seguimiento de visitas veterinarias
- Ver el directorio de veterinarios con especialidades

<div align="center">
<img width="800" alt="petclinic-screenshot" src="https://cloud.githubusercontent.com/assets/838318/19727082/2aee6d6c-9b8e-11e6-81fe-e889a5ddfded.png">
</div>

---

## ✨ Características Principales

| Característica | Descripción |
|----------------|-------------|
| 🏗️ **Arquitectura de 3 Capas** | Separación clara: capas de Presentación → Servicio → Repositorio |
| 🔄 **Múltiples Opciones de Persistencia** | Elige entre JDBC, JPA o Spring Data JPA via perfiles |
| 🗄️ **Soporte Multi-Base de Datos** | H2 (por defecto), HSQLDB, MySQL y PostgreSQL |
| 📦 **Gestión de Transacciones** | Transacciones declarativas con `@Transactional` |
| ⚡ **Caché** | Caché a nivel de método con Caffeine |
| 🎨 **UI Moderna** | Diseño responsive Bootstrap 5.3.8 |
| 🔍 **Monitorización** | Monitoreo de rendimiento habilitado para JMX |
| 🐳 **Listo para Docker** | Imágenes pre-construidas y contenedorización con Jib |
| ✅ **Bien Probado** | Tests unitarios y de integración completos |
| 📊 **Calidad de Código** | Integración con SonarCloud con puertas de calidad |

---

## 🚀 Inicio Rápido

Ejecuta PetClinic en menos de 2 minutos:

### Opción 1: Docker (Más Rápido)

```bash
docker run -p 8080:8080 springcommunity/spring-framework-petclinic
```

### Opción 2: Maven

```bash
# Clonar el repositorio
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
cd spring-framework-petclinic

# Ejecutar con Jetty embebido
./mvnw jetty:run-war

# Usuarios de Windows
mvnw.cmd jetty:run-war
```

### Acceder a la Aplicación

🌐 Abre [http://localhost:8080](http://localhost:8080) en tu navegador.

---

## 📦 Instalación

### Prerrequisitos

| Requisito | Versión | Notas |
|-----------|---------|-------|
| **Java JDK** | 17 ó 21 | JDK completo, no JRE |
| **Maven** | 3.8.4+ | O usa el wrapper `mvnw` incluido |
| **Git** | Última | Para clonar el repositorio |

### Requisitos del Sistema

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| RAM | 512 MB | 1 GB |
| Disco | 200 MB | 500 MB |
| CPU | 1 núcleo | 2 núcleos |

### Métodos de Instalación

#### Método 1: Maven Wrapper (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
cd spring-framework-petclinic

# Construir la aplicación
./mvnw clean install

# Ejecutar con Jetty
./mvnw jetty:run-war
```

#### Método 2: Docker

```bash
# Descargar y ejecutar la última imagen
docker run -d \
  --name petclinic \
  -p 8080:8080 \
  springcommunity/spring-framework-petclinic:latest

# Ver logs
docker logs -f petclinic
```

#### Método 3: Despliegue WAR

```bash
# Construir el archivo WAR
./mvnw clean package

# Desplegar en tu servidor de aplicaciones
# Archivo WAR: target/petclinic.war
# Compatible con: Tomcat 11+, Jetty 11+
```

#### Método 4: Configuración IDE

**Eclipse / Spring Tool Suite:**
```
1. File → Import → Maven → Existing Maven Project
2. Seleccionar el repositorio clonado
3. Ejecutar: ./mvnw generate-resources (para CSS)
4. Configurar servidor Jetty/Tomcat
5. Desplegar petclinic.war
```

**IntelliJ IDEA:**
```
1. File → Open → Seleccionar pom.xml
2. Maven → Generate Sources and Update Folders
3. Run → Edit Configurations → Añadir Tomcat/Jetty
4. Desplegar spring-petclinic.war
5. Click en Run
```

### Verificar Instalación

```bash
# Verificar salud de la aplicación
curl http://localhost:8080

# Esperado: página HTML de bienvenida
```

---

## 🏛️ Arquitectura

### Vista General de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Vistas JSP      │  │  Controladores   │  │ Dispatcher   │  │
│  │  (UI Bootstrap)  │  │  (@Controller)   │  │ Servlet      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE SERVICIO                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ClinicService (@Service, @Transactional, @Cacheable)    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE REPOSITORIO                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    JDBC     │  │     JPA     │  │   Spring Data JPA       │ │
│  │  (Perfil)   │  │  (Defecto)  │  │      (Perfil)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE DATOS                             │
│     H2 (Defecto)  │  HSQLDB  │  MySQL  │  PostgreSQL           │
└─────────────────────────────────────────────────────────────────┘
```

### Modelo de Dominio

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Owner     │──────<│    Pet      │──────<│   Visit     │
│ (Propiet.)  │  1:N  │  (Mascota)  │  1:N  │  (Visita)   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ firstName   │       │ name        │       │ date        │
│ lastName    │       │ birthDate   │       │ description │
│ address     │       │ type        │       └─────────────┘
│ city        │       └─────────────┘
│ telephone   │              │
└─────────────┘              │ N:1
                       ┌─────────────┐
                       │  PetType    │
                       │ (TipoMasc.) │
                       ├─────────────┤
                       │ name        │
                       └─────────────┘

┌─────────────┐       ┌─────────────┐
│    Vet      │──────<│  Specialty  │
│ (Veterin.)  │  N:M  │ (Especial.) │
├─────────────┤       ├─────────────┤
│ firstName   │       │ name        │
│ lastName    │       └─────────────┘
└─────────────┘
```

### Estructura del Proyecto

```
spring-framework-petclinic/
├── 📁 src/main/java/org/springframework/samples/petclinic/
│   ├── 📄 PetclinicInitializer.java     # Inicializador Servlet 3.0
│   ├── 📁 model/                         # Entidades de dominio
│   │   ├── BaseEntity.java
│   │   ├── Owner.java
│   │   ├── Pet.java
│   │   ├── Vet.java
│   │   └── Visit.java
│   ├── 📁 repository/                    # Capa de acceso a datos
│   │   ├── 📁 jdbc/                      # Implementaciones JDBC
│   │   ├── 📁 jpa/                       # Implementaciones JPA
│   │   └── 📁 springdatajpa/             # Spring Data JPA
│   ├── 📁 service/                       # Lógica de negocio
│   │   ├── ClinicService.java
│   │   └── ClinicServiceImpl.java
│   └── 📁 web/                           # Controladores
│       ├── OwnerController.java
│       ├── PetController.java
│       ├── VetController.java
│       └── VisitController.java
├── 📁 src/main/resources/
│   ├── 📁 spring/                        # Configuración XML de Spring
│   │   ├── business-config.xml
│   │   ├── datasource-config.xml
│   │   └── mvc-core-config.xml
│   └── 📁 db/                            # Scripts de base de datos
├── 📁 src/main/webapp/
│   ├── 📁 resources/                     # Assets estáticos
│   └── 📁 WEB-INF/jsp/                   # Vistas JSP
└── 📁 src/test/                          # Suite de tests
```

---

## ⚙️ Configuración

### Perfiles de Capa de Persistencia

La aplicación soporta **tres estrategias de persistencia**, seleccionables via perfiles de Spring:

| Perfil | Tecnología | Caso de Uso |
|--------|------------|-------------|
| `jpa` | Hibernate JPA | **Por defecto** - Características ORM completas |
| `jdbc` | Spring JdbcClient | Ligero, SQL directo |
| `spring-data-jpa` | Spring Data JPA | Abstracción de repositorio |

**Activar un perfil:**

```bash
# Via línea de comandos
./mvnw jetty:run-war -Dspring.profiles.active=jdbc

# Via variable de entorno
export SPRING_PROFILES_ACTIVE=spring-data-jpa
./mvnw jetty:run-war
```

### Perfiles de Base de Datos

| Perfil | Base de Datos | Por Defecto |
|--------|---------------|-------------|
| `H2` | H2 En Memoria | ✅ Sí |
| `HSQLDB` | HyperSQL | No |
| `MySQL` | MySQL 8+ | No |
| `PostgreSQL` | PostgreSQL 9.6+ | No |

**Activar una base de datos:**

```bash
# MySQL
./mvnw jetty:run-war -P MySQL

# PostgreSQL
./mvnw jetty:run-war -P PostgreSQL
```

### Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| `SPRING_PROFILES_ACTIVE` | Perfil de persistencia | `jpa` |
| `JDBC_URL` | URL de conexión a BD | H2 en memoria |
| `JDBC_USERNAME` | Usuario de BD | `sa` |
| `JDBC_PASSWORD` | Contraseña de BD | (vacío) |

---

## 🗄️ Configuración de Base de Datos

### H2 (Por Defecto - Sin Configuración Requerida)

H2 ejecuta en memoria por defecto. Los datos se reinician en cada arranque.

### Configuración MySQL

**1. Iniciar MySQL:**
```bash
docker run -d \
  --name mysql-petclinic \
  -e MYSQL_USER=petclinic \
  -e MYSQL_PASSWORD=petclinic \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=petclinic \
  -p 3306:3306 \
  mysql:8.0
```

**2. Ejecutar aplicación:**
```bash
./mvnw jetty:run-war -P MySQL
```

### Configuración PostgreSQL

**1. Iniciar PostgreSQL:**
```bash
docker run -d \
  --name postgres-petclinic \
  -e POSTGRES_PASSWORD=petclinic \
  -e POSTGRES_DB=petclinic \
  -p 5432:5432 \
  postgres:15
```

**2. Ejecutar aplicación:**
```bash
./mvnw jetty:run-war -P PostgreSQL
```

---

## 📡 Referencia API

### Endpoints Web

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Página de bienvenida |
| `GET` | `/owners/find` | Formulario de búsqueda de propietarios |
| `GET` | `/owners` | Listar propietarios (con búsqueda) |
| `GET` | `/owners/new` | Formulario nuevo propietario |
| `POST` | `/owners/new` | Crear propietario |
| `GET` | `/owners/{id}` | Detalles del propietario |
| `GET` | `/owners/{id}/edit` | Formulario editar propietario |
| `POST` | `/owners/{id}/edit` | Actualizar propietario |
| `GET` | `/owners/{id}/pets/new` | Formulario nueva mascota |
| `POST` | `/owners/{id}/pets/new` | Crear mascota |
| `GET` | `/owners/{id}/pets/{petId}/edit` | Formulario editar mascota |
| `POST` | `/owners/{id}/pets/{petId}/edit` | Actualizar mascota |
| `GET` | `/owners/{id}/pets/{petId}/visits/new` | Formulario nueva visita |
| `POST` | `/owners/{id}/pets/{petId}/visits/new` | Crear visita |
| `GET` | `/vets` | Listar veterinarios (HTML) |
| `GET` | `/vets.json` | Listar veterinarios (JSON) |
| `GET` | `/vets.xml` | Listar veterinarios (XML) |
| `GET` | `/oups` | Provocar error (demo) |

### Ejemplo API JSON

**Petición:**
```bash
curl http://localhost:8080/vets.json
```

**Respuesta:**
```json
{
  "vetList": [
    {
      "id": 1,
      "firstName": "James",
      "lastName": "Carter",
      "specialties": []
    },
    {
      "id": 2,
      "firstName": "Helen",
      "lastName": "Leary",
      "specialties": [
        { "id": 1, "name": "radiology" }
      ]
    }
  ]
}
```

---

## 🛠️ Desarrollo

### Comandos de Construcción

```bash
# Construcción limpia
./mvnw clean install

# Saltar tests
./mvnw clean install -DskipTests

# Generar CSS desde SCSS
./mvnw generate-resources -P css

# Ejecutar con perfil específico
./mvnw jetty:run-war -Dspring.profiles.active=jdbc
```

### Estilo de Código

- **EditorConfig**: Pre-configurado en `.editorconfig`
- **Indentación**: 4 espacios
- **Codificación**: UTF-8
- **Finales de línea**: LF

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
./mvnw test

# Perfil específico
./mvnw test -Dspring.profiles.active=jdbc

# Con informe de cobertura
./mvnw verify
```

### Cobertura de Tests

Los informes de cobertura se generan con JaCoCo en `target/site/jacoco/`.

### Estructura de Tests

| Paquete | Descripción |
|---------|-------------|
| `model/` | Tests unitarios de entidades |
| `service/` | Tests de integración de servicio (los 3 perfiles) |
| `web/` | Tests de controlador con MockMvc |

---

## 🐳 Despliegue

### Docker Hub

Imágenes pre-construidas disponibles:

```bash
# Última versión
docker pull springcommunity/spring-framework-petclinic:latest

# Versión específica
docker pull springcommunity/spring-framework-petclinic:7.0.3
```

### Construir Imagen Personalizada

```bash
# Construir y publicar usando Jib
./mvnw jib:build

# Construir imagen local
./mvnw jib:dockerBuild
```

### Ejemplo Docker Compose

```yaml
version: '3.8'
services:
  petclinic:
    image: springcommunity/spring-framework-petclinic:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=jpa
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: petclinic
      MYSQL_USER: petclinic
      MYSQL_PASSWORD: petclinic
    ports:
      - "3306:3306"
```

---

## 🔧 Solución de Problemas

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| **Puerto 8080 en uso** | Cambiar puerto: `./mvnw jetty:run-war -Djetty.http.port=9090` |
| **Error de versión Java** | Asegurar que JDK 17+ está instalado y `JAVA_HOME` configurado |
| **Fallo del wrapper Maven** | Ejecutar `chmod +x mvnw` (Unix) o usar `mvn` directamente |
| **CSS no carga** | Ejecutar `./mvnw generate-resources -P css` |
| **Conexión a base de datos** | Verificar que la BD está corriendo y credenciales correctas |
| **Sin memoria** | Aumentar heap: `MAVEN_OPTS="-Xmx1024m"` |

### Configuración de Logs

Los logs se configuran en `src/main/resources/logback.xml`. Ajustar niveles:

```xml
<logger name="org.springframework" level="INFO"/>
<logger name="org.hibernate" level="WARN"/>
```

---

## 🤝 Contribuir

¡Damos la bienvenida a contribuciones! Por favor sigue estos pasos:

1. **Fork** del repositorio
2. **Crear** una rama feature (`git checkout -b feature/caracteristica-increible`)
3. **Commit** de cambios (`git commit -m 'Añadir característica increíble'`)
4. **Push** a la rama (`git push origin feature/caracteristica-increible`)
5. **Abrir** un Pull Request

### Directrices

- Seguir el estilo de código existente (ver `.editorconfig`)
- Escribir tests para nuevas características
- Actualizar documentación según sea necesario
- Mantener commits atómicos y bien descritos

### Reportar Problemas

Reporta bugs y solicita características via [GitHub Issues](https://github.com/spring-petclinic/spring-framework-petclinic/issues).

---

## 📚 Recursos Adicionales

- 📊 [Presentación del Diagrama de Arquitectura](http://fr.slideshare.net/AntoineRey/spring-framework-petclinic-sample-application)
- 🌐 [Familia Spring Petclinic](https://spring-petclinic.github.io/)
- 📖 [Documentación Spring Framework](https://docs.spring.io/spring-framework/reference/)
- 🔧 [Forks de Spring Petclinic](https://spring-petclinic.github.io/docs/forks.html)

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia Apache 2.0** - ver el archivo [LICENSE](LICENSE.txt) para detalles.

```
Copyright 2002-2024 los autores originales.

Licenciado bajo la Licencia Apache, Versión 2.0 (la "Licencia");
no puedes usar este archivo excepto en cumplimiento con la Licencia.
Puedes obtener una copia de la Licencia en

    http://www.apache.org/licenses/LICENSE-2.0
```

---

<div align="center">

**Hecho con ❤️ por la Comunidad Spring**

[⬆ Volver Arriba](#spring-framework-petclinic)

</div>

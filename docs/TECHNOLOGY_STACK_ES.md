# Stack Tecnológico - Spring Framework Petclinic

> Informe de análisis tecnológico generado automáticamente — Fecha: 2026-02-25

## Resumen Ejecutivo

| Categoría | Tecnologías |
|-----------|-------------|
| **Lenguaje Principal** | Java 17 (compatible con JDK 21) |
| **Framework** | Spring Framework 7.0.3 (MVC tradicional, sin Spring Boot) |
| **Herramienta de Construcción** | Apache Maven 3.8.4+ con Maven Wrapper |
| **Tipo de Empaquetado** | WAR |
| **Capa de Vista** | JSP + JSTL + Custom Tags |
| **Persistencia** | Hibernate 7.2.3 / Spring Data JPA / JDBC (seleccionable por perfil) |
| **Base de Datos por Defecto** | H2 en memoria |
| **CI/CD** | GitHub Actions + SonarCloud |

---

## 1. Lenguajes de Programación

| Lenguaje | Uso | Archivos |
|----------|-----|----------|
| Java 17 | Código de aplicación backend (modelo, repositorios, servicios, controladores) | 47 (main) + 14 (test) = **61** |
| JSP 3.0 | Plantillas de vistas server-side | **9** |
| JSP Tag Files | Librería de etiquetas custom para layout y componentes UI | **10** |
| SCSS | Preprocesador CSS (compilado con LibSass) | **4** |
| CSS | Hoja de estilos compilada | **1** |
| XML | Configuración Spring, Maven POM, esquemas de BD | **12+** |
| SQL | Scripts DDL y datos iniciales (H2, HSQLDB, MySQL, PostgreSQL) | **8** |
| YAML | Workflows CI/CD y Dependabot | **3** |
| Properties | Configuración de acceso a datos e internacionalización | **5** |
| JMX (XML) | Plan de pruebas de rendimiento JMeter | **1** |

---

## 2. Frameworks y Librerías Principales

### 2.1 Framework Principal — Spring Framework 7.0.3

| Módulo Spring | Versión | Propósito |
|---------------|---------|-----------|
| spring-webmvc | 7.0.3 | Framework MVC para controladores y vistas |
| spring-jdbc | 7.0.3 | Abstracción JDBC con `JdbcClient` y `NamedParameterJdbcTemplate` |
| spring-orm | 7.0.3 | Integración con Hibernate/JPA (`LocalContainerEntityManagerFactoryBean`) |
| spring-context-support | 7.0.3 | Soporte de caché con anotaciones (`@Cacheable`) |
| spring-oxm | 7.0.3 | Object/XML Mapping |
| spring-test | 7.0.3 | Testing de integración con `MockMvc` |
| Spring Data JPA | 2025.1.2 (BOM) | Repositorios declarativos con interfaces |

> **Nota:** Configuración 100% basada en XML (no hay `@Configuration` ni Spring Boot). Los beans se definen en 5 archivos XML bajo `src/main/resources/spring/`.

### 2.2 Persistencia y ORM

| Librería | Versión | Propósito |
|----------|---------|-----------|
| Hibernate ORM | 7.2.3.Final | Implementación JPA (EntityManager, queries) |
| Hibernate Validator | 9.1.0.Final | Bean Validation (JSR 380) |
| Hibernate JCache | 7.2.3.Final | Caché de segundo nivel |
| Jakarta Persistence API | 3.2.0 | Especificación JPA estándar |

### 2.3 Perfiles de Acceso a Datos

La aplicación soporta **3 estrategias de persistencia** seleccionables mediante Spring Profiles:

| Perfil | Implementación | Paquete |
|--------|---------------|---------|
| `jdbc` | Spring JDBC (`JdbcClient`, `NamedParameterJdbcTemplate`) | `repository.jdbc` (8 clases) |
| `jpa` | JPA/Hibernate directo (`@PersistenceContext`) | `repository.jpa` (5 clases) |
| `spring-data-jpa` | Spring Data JPA (interfaces con queries derivados) | `repository.springdatajpa` (4 interfaces) |
| `javaee` | JNDI DataSource (entornos JavaEE) | Configuración en `datasource-config.xml` |

### 2.4 Drivers de Base de Datos (Perfiles Maven)

| Base de Datos | Driver | Versión | Perfil Maven | Por Defecto |
|---------------|--------|---------|--------------|-------------|
| H2 | `com.h2database:h2` | 2.4.240 | `H2` | ✅ Sí |
| HSQLDB | `org.hsqldb:hsqldb` | 2.7.4 | `HSQLDB` | No |
| MySQL | `mysql:mysql-connector-java` | 8.1.0 | `MySQL` | No |
| PostgreSQL | `org.postgresql:postgresql` | 42.7.9 | `PostgreSQL` | No |

### 2.5 Web y Frontend

| Librería | Versión | Mecanismo | Propósito |
|----------|---------|-----------|-----------|
| Bootstrap | 5.3.8 | WebJars | Framework CSS responsivo |
| Font Awesome | 4.7.0 | WebJars NPM | Iconos vectoriales |
| Flatpickr | 4.6.13 | WebJars NPM | Selector de fechas JavaScript |
| JSTL | 3.0.2 (API) / 3.0.1 (impl) | Jakarta Servlet | Librería de etiquetas estándar JSP |
| JSP Custom Tags | — | `.tag` files | 10 tags custom: layout, menu, inputField, selectField, etc. |

### 2.6 Serialización y Marshalling

| Librería | Versión | Propósito |
|----------|---------|-----------|
| Jackson Core | 3.0.4 | Serialización/deserialización JSON |
| Jackson Databind | 3.0.4 | Data binding JSON ↔ objetos Java |
| JAXB Runtime (Glassfish) | 4.0.6 | Marshalling XML (lista de veterinarios en XML) |
| Jakarta XML Bind API | 4.0.4 | Especificación JAXB |
| Jakarta Activation API | 2.1.4 | Framework de activación para JAXB |

### 2.7 Caché

| Librería | Versión | Propósito |
|----------|---------|-----------|
| Caffeine | 3.2.3 | Caché en memoria de alto rendimiento (cachés: `default`, `vets`) |
| Spring Cache (`@Cacheable`) | 7.0.3 | Abstracción de caché declarativa |

### 2.8 Logging

| Librería | Versión | Propósito |
|----------|---------|-----------|
| SLF4J | 2.0.17 | Fachada de logging |
| Logback Classic | 1.5.27 | Implementación de logging (configurada en `logback.xml`) |

### 2.9 AOP y Monitorización

| Librería | Versión | Propósito |
|----------|---------|-----------|
| AspectJ Weaver | 1.9.25.1 | Programación orientada a aspectos |
| `CallMonitoringAspect` | — | Aspecto JMX que monitoriza invocaciones y tiempos de ejecución |
| Spring JMX (`context:mbean-export`) | 7.0.3 | Exposición de métricas via JMX (`@ManagedResource`) |

### 2.10 Pool de Conexiones

| Librería | Versión | Propósito |
|----------|---------|-----------|
| Tomcat JDBC Pool | 11.0.18 | Pool de conexiones JDBC (`org.apache.tomcat.jdbc.pool.DataSource`) |

---

## 3. Internacionalización (i18n)

La aplicación soporta múltiples idiomas mediante archivos de mensajes:

| Archivo | Idioma |
|---------|--------|
| `messages.properties` | Idioma por defecto |
| `messages_en.properties` | Inglés |
| `messages_de.properties` | Alemán |
| `messages_es.properties` | Español |

---

## 4. Frameworks de Testing

| Framework | Versión | Propósito |
|-----------|---------|-----------|
| JUnit Jupiter | 6.0.2 | Framework de pruebas unitarias (JUnit 5+) |
| Mockito | 5.21.0 | Framework de mocking para tests unitarios |
| Mockito JUnit Jupiter | 5.21.0 | Integración Mockito con JUnit 5 |
| AssertJ | 3.27.7 | Aserciones fluidas y expresivas |
| Hamcrest | 3.0 | Librería de matchers para MockMvc |
| Spring Test | 7.0.3 | `MockMvc`, `@WebMvcTest`, contexto de test Spring |
| JsonPath | 2.10.0 | Validación de respuestas JSON en tests |
| **Apache JMeter** | — | Pruebas de rendimiento/carga (`src/test/jmeter/petclinic_test_plan.jmx`) |

### Distribución de Tests

| Paquete | Tests | Tipo |
|---------|-------|------|
| `web` | 6 clases | Tests de controladores (MockMvc) |
| `model` | 4 clases | Tests de entidades y validación |
| `service` | 3 clases (+1 abstracta) | Tests de integración (JDBC, JPA, Spring Data JPA) |

---

## 5. Herramientas de Construcción y Plugins

### 5.1 Sistema de Construcción

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| Apache Maven | ≥ 3.8.4 | Versión mínima requerida (enforcer plugin) |
| Maven Wrapper | Incluido | `mvnw` (Unix) / `mvnw.cmd` (Windows) |

### 5.2 Plugins de Maven

| Plugin | Versión | Propósito |
|--------|---------|-----------|
| maven-compiler-plugin | 3.14.1 | Compilación Java 17 con `-parameters` |
| maven-surefire-plugin | 3.5.4 | Ejecución de tests (`**/*Tests.java`) |
| maven-war-plugin | 3.5.1 | Empaquetado WAR (sin `web.xml` requerido) |
| maven-resources-plugin | 3.4.0 | Filtrado y copia de recursos (UTF-8) |
| maven-assembly-plugin | 3.8.0 | Empaquetado jar-with-dependencies |
| maven-eclipse-plugin | 2.10 | Integración con IDE Eclipse |
| maven-enforcer-plugin | 3.6.2 | Validación de versiones mínimas (Maven 3.8.4, Java 17) |
| **jacoco-maven-plugin** | 0.8.14 | Cobertura de código (reporte XML en fase `prepare-package`) |
| jetty-maven-plugin | 11.0.26 | Servidor Jetty embebido para desarrollo |
| **jib-maven-plugin** | 3.5.1 | Construcción de imágenes Docker sin Dockerfile |
| libsass-maven-plugin | 0.3.4 | Compilación SCSS → CSS (perfil `css`) |

---

## 6. Servidor de Aplicaciones

| Servidor | Versión | Uso |
|----------|---------|-----|
| Eclipse Jetty | 11.0.26 | Servidor de desarrollo local (plugin Maven) |
| Apache Tomcat | 11.0.18 | Pool de conexiones JDBC en runtime |
| Cualquier servidor Jakarta EE | — | Despliegue como WAR en Tomcat/Jetty/WildFly |

> **Imagen Docker base:** `jetty:11.0-jdk17` (configurada en Jib)

---

## 7. APIs Jakarta EE

| API | Versión | Propósito |
|-----|---------|-----------|
| Jakarta Servlet API | 6.1.0 | Especificación de servlets (scope: provided) |
| Jakarta Persistence API | 3.2.0 | Especificación JPA |
| Jakarta XML Bind API | 4.0.4 | Marshalling XML |
| Jakarta Activation API | 2.1.4 | Framework de activación |
| Jakarta Servlet JSP JSTL API | 3.0.2 | Tags estándar JSP |

---

## 8. DevOps, CI/CD y Calidad

### 8.1 GitHub Actions — Integración Continua

| Workflow | Trigger | JDK Matrix | Análisis |
|----------|---------|------------|----------|
| `maven-build-main.yml` | Push a `main` | 17, 21 | `mvn verify` + SonarCloud |
| `maven-build-pull-request.yml` | PR (opened/sync/reopen) | 17, 21 | `mvn verify` |

### 8.2 Calidad de Código

| Herramienta | Configuración | Propósito |
|-------------|---------------|-----------|
| **SonarCloud** | `sonar.organization=spring-petclinic` | Análisis estático integrado en CI |
| **JaCoCo** | Plugin Maven 0.8.14 | Cobertura de código (reporte XML) |

### 8.3 Contenedorización

| Herramienta | Versión | Detalle |
|-------------|---------|---------|
| Google Jib | 3.5.1 | Construcción de imagen Docker sin Dockerfile |
| Imagen base | `jetty:11.0-jdk17` | Servidor Jetty con JDK 17 |
| Registro | `docker.io/springcommunity/spring-framework-petclinic` | Docker Hub |
| Tags | `{version}`, `latest` | Versionado automático |

### 8.4 Gestión de Dependencias

| Herramienta | Configuración |
|-------------|---------------|
| **Dependabot** | `.github/dependabot.yml` — Actualizaciones mensuales de Maven |

---

## 9. Entorno de Desarrollo

### 9.1 Dev Containers

| Propiedad | Valor |
|-----------|-------|
| Imagen base | `mcr.microsoft.com/devcontainers/universal:2` |
| Java | 17 |
| Maven | 3.8.6 |
| Extensiones VS Code | `vscjava.vscode-java-pack`, `redhat.vscode-xml`, `vmware.vscode-boot-dev-pack` |

### 9.2 Soporte de IDEs

| IDE | Soporte |
|-----|---------|
| **VS Code** | Dev Containers + extensiones Java |
| **Eclipse** | Plugin Maven configurado con Spring Nature |
| **IntelliJ IDEA** | Compatible vía importación Maven |

### 9.3 Archivos de Configuración del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `.editorconfig` | Estándar de formato: UTF-8, LF, indent 4 espacios (Java/XML) |
| `.gitattributes` | Atributos de Git para normalización de líneas |
| `.gitignore` | Exclusiones de Git |

### 9.4 GitHub Copilot — Agentes y Skills

El proyecto incluye configuración avanzada de IA para desarrollo asistido:

**Agentes** (`.github/agents/`):
| Agente | Propósito |
|--------|-----------|
| java-expert | Especialista en Spring Boot, Java 21+ y Microservicios |
| jsp-expert | Especialista en JSP, Servlets, JSTL/EL y MVC clásico |
| architect | Experto en microservicios FastAPI/Spring Boot |
| architecture_analyzer | Análisis de patrones de arquitectura |
| dependency_extractor | Extracción y análisis de dependencias |
| endpoint_discoverer | Descubrimiento de endpoints API |
| functional_spec_agent | Especificaciones funcionales desde código fuente |
| technology_detector | Detección de stack tecnológico |
| test_documentation_agent | Documentación de planes y casos de test |
| aitmpl_documentation_expert | Documentación técnica con framework Diátaxis |
| mcp_expert | Configuración de Model Context Protocol |

**Skills** (`.github/skills/`):
| Skill | Propósito |
|-------|-----------|
| cucumber-api | Tests BDD de integración con Cucumber |
| resilience | Patrones de tolerancia a fallos con Resilience4j |
| security | Spring Security con JWT y CORS |
| testing | Tests de integración con Testcontainers y Cucumber |

---

## 10. Configuración Spring (XML)

| Archivo de Configuración | Propósito |
|--------------------------|-----------|
| `mvc-core-config.xml` | DispatcherServlet, component scanning, view resolvers |
| `mvc-view-config.xml` | Configuración del InternalResourceViewResolver para JSP |
| `business-config.xml` | Beans de servicio, scanning de `service` package, TX |
| `datasource-config.xml` | DataSource (Tomcat JDBC Pool), inicialización de BD, perfil JNDI |
| `tools-config.xml` | AOP (AspectJ), JMX, Caffeine Cache Manager |
| `data-access.properties` | Propiedades JDBC filtradas por perfil Maven |

---

## 11. Estructura del Proyecto

```
spring-framework-petclinic/
├── .devcontainer/                      # Configuración Dev Containers
│   └── devcontainer.json
├── .github/
│   ├── agents/                         # 11 agentes GitHub Copilot
│   ├── skills/                         # 4 skills (cucumber, resilience, security, testing)
│   ├── workflows/                      # 2 workflows CI (main + PR)
│   ├── copilot-instructions.md         # Instrucciones para Copilot
│   └── dependabot.yml                  # Actualizaciones automáticas mensuales
├── docs/                               # Documentación del proyecto
├── src/
│   ├── main/
│   │   ├── java/                       # 47 archivos Java
│   │   │   └── org/springframework/samples/petclinic/
│   │   │       ├── model/              # 10 entidades de dominio (BaseEntity → Owner, Pet, Vet...)
│   │   │       ├── repository/         # 4 interfaces de repositorio
│   │   │       │   ├── jdbc/           # 8 clases — Implementación JDBC
│   │   │       │   ├── jpa/            # 5 clases — Implementación JPA directa
│   │   │       │   └── springdatajpa/  # 4 interfaces — Spring Data JPA
│   │   │       ├── service/            # 2 clases (interfaz + implementación)
│   │   │       ├── util/               # 2 clases (EntityUtils, CallMonitoringAspect)
│   │   │       └── web/               # 6 controladores + formatter + validator
│   │   ├── resources/
│   │   │   ├── db/                     # Scripts SQL (h2, hsqldb, mysql, postgresql)
│   │   │   ├── messages/              # i18n (default, en, de, es)
│   │   │   ├── spring/                # 5 XML configs + 1 properties
│   │   │   └── logback.xml            # Configuración de logging
│   │   └── webapp/
│   │       ├── resources/
│   │       │   ├── css/               # CSS compilado
│   │       │   ├── scss/              # 4 archivos SCSS fuente
│   │       │   ├── fonts/             # Fuentes tipográficas
│   │       │   └── images/            # Imágenes estáticas
│   │       └── WEB-INF/
│   │           ├── jsp/               # 9 vistas JSP (welcome, owners, pets, vets, exception)
│   │           ├── tags/              # 10 custom tags (layout, menu, inputField, etc.)
│   │           └── jetty-web.xml      # Configuración específica Jetty
│   └── test/
│       ├── java/                      # 14 clases de test
│       │   └── org/springframework/samples/petclinic/
│       │       ├── model/             # 4 tests de modelo y validación
│       │       ├── service/           # 3 tests de integración + 1 abstracto
│       │       └── web/              # 6 tests de controladores
│       ├── jmeter/                    # Plan de pruebas de rendimiento
│       │   └── petclinic_test_plan.jmx
│       └── resources/                 # Recursos de test
├── pom.xml                            # Configuración Maven (653 líneas)
├── mvnw / mvnw.cmd                    # Maven Wrapper (Unix/Windows)
└── agents.md                          # Documentación de agentes
```

---

## 12. Puntuación de Confianza del Análisis

```json
{
  "primary_language": {
    "name": "Java",
    "version": "17",
    "confidence": 100
  },
  "languages": ["Java", "JSP", "SCSS", "SQL", "XML", "YAML", "Properties"],
  "frameworks": [
    "Spring Framework 7.0.3",
    "Spring MVC 7.0.3",
    "Spring Data JPA 2025.1.2",
    "Hibernate ORM 7.2.3.Final",
    "Hibernate Validator 9.1.0.Final"
  ],
  "tools": [
    "Maven 3.8.4+",
    "GitHub Actions",
    "SonarCloud",
    "JaCoCo 0.8.14",
    "Google Jib 3.5.1",
    "Jetty 11.0.26",
    "Dependabot",
    "Dev Containers",
    "JMeter"
  ],
  "databases": ["H2 (default)", "HSQLDB", "MySQL", "PostgreSQL"],
  "package_managers": ["Maven"],
  "build_systems": ["Maven + Maven Wrapper"],
  "testing_frameworks": [
    "JUnit Jupiter 6.0.2",
    "Mockito 5.21.0",
    "AssertJ 3.27.7",
    "Hamcrest 3.0",
    "Spring Test 7.0.3",
    "JMeter"
  ],
  "confidence": 98
}
```

---

## 13. Observaciones y Notas Clave

1. **Aplicación Spring MVC tradicional** — No utiliza Spring Boot. La configuración es 100% basada en XML con ficheros en `src/main/resources/spring/`.
2. **Renderizado server-side con JSP** — Usa JSP + JSTL + 10 custom tags, no frameworks SPA modernos (React, Angular, Vue).
3. **Triple estrategia de persistencia** — Soporta JDBC, JPA e Spring Data JPA mediante Spring Profiles, lo que permite comparar las tres aproximaciones.
4. **Soporte multi-base de datos** — Perfiles Maven para H2 (defecto), HSQLDB, MySQL y PostgreSQL, cada uno con su esquema SQL.
5. **Contenedorización sin Dockerfile** — Utiliza Google Jib para construir imágenes Docker directamente desde Maven.
6. **Internacionalización** — Soporte i18n con mensajes en 4 idiomas (default, inglés, alemán, español).
7. **Monitorización JMX** — `CallMonitoringAspect` expuesto via JMX para métricas de invocaciones.
8. **Pruebas de rendimiento** — Plan JMeter incluido en `src/test/jmeter/`.
9. **CI matrix** — Los tests se ejecutan en JDK 17 y 21 para garantizar compatibilidad futura.
10. **Desarrollo asistido por IA** — Configuración extensiva de GitHub Copilot con 11 agentes y 4 skills especializadas.
11. **Requiere Java 17+** y Maven 3.8.4+ (validado por `maven-enforcer-plugin`).

---

*Generado por el Agente Detector de Tecnologías — v2.0*

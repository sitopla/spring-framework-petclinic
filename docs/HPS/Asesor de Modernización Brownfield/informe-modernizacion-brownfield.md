# Informe de Modernización Brownfield

## Spring Framework PetClinic v7.0.3

| Campo | Valor |
|-------|-------|
| **Fecha del análisis** | 2026-03-07 |
| **Analista** | Brownfield Modernization Advisor + Copilot CLI |
| **Versión de la aplicación** | 7.0.3 |
| **Stack tecnológico** | Java 17, Spring MVC 7.0.3, Hibernate 7.2.3, JSP, WAR/Jetty 11 |
| **Empaquetado** | WAR desplegable en contenedor de servlets |

---

## 1. Resumen Ejecutivo

```
╔══════════════════════════════════════════════════════════════════════╗
║  CLASIFICACIÓN DEL SISTEMA                                          ║
╠══════════════════════════════════════════════════════════════════════╣
║  Criticidad asistencial:   MEDIA (demo clínica veterinaria)         ║
║  Índice de deuda técnica:  ALTO                                     ║
║  Plataformas EOL:          2 (Jetty 11, Maven 3.8.4)               ║
║  Dependencias con CVEs:    2 (Jackson 3.0.4, MySQL Connector 8.1.0)║
║  Cobertura de tests:       55% clases (86% web, 100% service)   ║
║  Complejidad ciclomática:  3.2 media (excelente)                ║
║  Código fuente:            ~4.908 LOC (Java + JSP + SQL + XML)  ║
║  Antigüedad del patrón:    Legado (Spring MVC XML, pre-Boot)        ║
╚══════════════════════════════════════════════════════════════════════╝
```

La aplicación PetClinic utiliza un **patrón arquitectónico legado** basado en Spring MVC con configuración XML, JSP como motor de vistas y empaquetado WAR. Aunque las **versiones de las dependencias principales son modernas** (Spring 7.0.3, Hibernate 7.2.3, Java 17), el **estilo arquitectónico es de la generación 2010-2015**: configuración XML declarativa, despliegue en contenedor de servlets externo, vistas JSP server-side, y ausencia total de Spring Boot.

Los principales vectores de deuda técnica son:

1. **Arquitectura pre-Spring Boot** — Configuración XML en 5 ficheros, sin auto-configuración
2. **Servidor de aplicaciones EOL** — Jetty 11 alcanzó EOL el 1 de enero de 2025
3. **Maven wrapper EOL** — Maven 3.8.4 EOL desde junio 2025
4. **Dependencias con CVEs activos** — Jackson 3.0.4 (CVE-2026-29062, CVSS 8.7) y MySQL Connector 8.1.0 (CVE-2023-22102, CVSS 8.3)
5. **Capa de presentación obsoleta** — JSP/JSTL sin posibilidad de SPA moderna
6. **Ausencia total de seguridad** — Sin Spring Security, sin autenticación, sin CSRF, sin cabeceras de seguridad
7. **Credenciales hardcoded** — Contraseñas MySQL/PostgreSQL en pom.xml

---

## 2. Inventario Tecnológico Completo

### 2.1 Plataforma y Runtime

| Componente | Versión actual | Estado soporte | Última versión | Acción |
|-----------|---------------|---------------|----------------|--------|
| **Java SE** | 17 (LTS) | ✅ Soporte activo hasta sep 2029 | 21 LTS / 24 | Migrar a 21 LTS (planificable) |
| **Maven** | 3.8.4 (wrapper) | ❌ **EOL desde jun 2025** | 3.9.12 / 4.0-RC | 🔴 Actualizar inmediatamente |
| **Jetty** | 11.0 (base Docker) | ❌ **EOL desde ene 2025** | 12.0.x | 🔴 Migrar a Jetty 12 o Spring Boot embedded |

### 2.2 Framework y Dependencias Core

| Dependencia | Versión | CVEs conocidos | Estado | Acción |
|------------|---------|---------------|--------|--------|
| Spring Framework | 7.0.3 | ✅ Sin CVEs en 7.0.x | Activo (soporte hasta jun 2027) | OK |
| Spring Data JPA | 2025.1.2 (BOM) | ✅ Sin CVEs conocidos | Activo | OK |
| Hibernate ORM | 7.2.3.Final | ✅ Sin CVEs en 7.2.x core | Activo | OK |
| Hibernate Validator | 9.1.0.Final | ✅ Parcheado (CVE-2025-35036 era <7.0) | Activo | OK |
| **Jackson Core/Databind** | **3.0.4** | ❌ **CVE-2026-29062** (CVSS 8.7) DoS nested JSON | Vulnerable | 🔴 Actualizar a ≥3.1.0 |
| Caffeine Cache | 3.2.3 | ✅ Sin CVEs | Activo | OK |
| AspectJ | 1.9.25.1 | ✅ Sin CVEs | Activo | OK |
| SLF4J | 2.0.17 | ✅ Sin CVEs | Activo | OK |
| Logback | 1.5.27 | ✅ Sin CVEs | Activo | OK |

### 2.3 Drivers de Base de Datos

| Driver | Versión | CVEs conocidos | Acción |
|--------|---------|---------------|--------|
| H2 Database | 2.4.240 | ✅ Sin CVEs | OK |
| HSQLDB | 2.7.4 | ✅ Sin CVEs conocidos | OK |
| **MySQL Connector/J** | **8.1.0** | ❌ **CVE-2023-22102** (CVSS 8.3) — Takeover | 🔴 Actualizar a ≥8.2.0 |
| PostgreSQL Driver | 42.7.9 | ✅ Sin CVEs | OK |

### 2.4 Frontend (WebJars)

| Librería | Versión | Estado | Acción |
|----------|---------|--------|--------|
| Bootstrap | 5.3.8 | ✅ Activo | OK |
| **Font Awesome** | **4.7.0** | ❌ **EOL** (última release 2016) | 🟠 Migrar a Font Awesome 6.x |
| Flatpickr | 4.6.13 | ⚠️ Mantenimiento limitado | 🟡 Evaluar alternativas |

### 2.5 CDN Externos sin SRI

| URL | Librería | Riesgo |
|-----|----------|--------|
| `https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js` | HTML5 Shiv (IE8) | 🟠 CDN sin SRI + librería obsoleta (IE8) |
| `https://oss.maxcdn.com/respond/1.4.2/respond.min.js` | Respond.js (IE8) | 🟠 CDN sin SRI + librería obsoleta (IE8) |

### 2.6 Plugins de Build

| Plugin | Versión | Estado | Acción |
|--------|---------|--------|--------|
| maven-compiler-plugin | 3.14.1 | ✅ | OK |
| maven-surefire-plugin | 3.5.4 | ✅ | OK |
| maven-war-plugin | 3.5.1 | ✅ | OK |
| **maven-eclipse-plugin** | **2.10** | ❌ **Retirado** (última release 2015) | 🟡 Eliminar |
| jacoco-maven-plugin | 0.8.14 | ✅ | OK |
| jib-maven-plugin | 3.5.1 | ✅ | OK |
| **libsass-maven-plugin** | **0.3.4** | ⚠️ Proyecto poco mantenido | 🟡 Migrar a dart-sass |
| jetty-maven-plugin | 11.0.26 | ❌ EOL (sigue Jetty 11) | 🟠 Migrar a Jetty 12 plugin |

---

## 3. Análisis de Deuda Técnica

### 3.1 Deuda Arquitectónica — Patrón Pre-Spring Boot

**Severidad: 🔴 CRÍTICA**

La aplicación utiliza un estilo de configuración **Spring MVC XML puro** que fue estándar en 2010-2015 pero que hoy supone una barrera significativa de mantenimiento:

| Aspecto | Estado actual (Legacy) | Estado objetivo (Moderno) |
|---------|----------------------|--------------------------|
| Configuración | 5 ficheros XML (`business-config.xml`, `datasource-config.xml`, `mvc-core-config.xml`, `mvc-view-config.xml`, `tools-config.xml`) + `data-access.properties` | `application.yml` único con auto-configuración Spring Boot |
| Inicialización | `PetclinicInitializer` (programático Servlet 3.0) | `@SpringBootApplication` + `main()` |
| Empaquetado | WAR → contenedor externo (Jetty/Tomcat) | JAR ejecutable con servidor embebido |
| Perfiles BD | Perfiles Maven + propiedades filtradas | `application-{profile}.yml` con Spring Boot profiles |
| Pool conexiones | `org.apache.tomcat.jdbc.pool.DataSource` (manual) | HikariCP (auto-configurado por Boot) |
| Vista | JSP + JSTL + Custom Tags (server-side rendering) | Thymeleaf o SPA (React/Angular/Vue) |
| JNDI | Perfil `javaee` con `jee:jndi-lookup` | Innecesario con Boot |
| MBean export | XML explícito `<context:mbean-export/>` | Auto-configurado por Spring Boot Actuator |

**Impacto:**
- Curva de aprendizaje elevada para nuevos desarrolladores (XML vs anotaciones modernas)
- Imposibilidad de usar el ecosistema Spring Boot (Actuator, DevTools, auto-configuración)
- Dificultad para contenedorizar correctamente (WAR vs JAR embebido)
- Tres implementaciones paralelas de repositorio (JDBC, JPA, Spring Data JPA) que multiplican el mantenimiento

### 3.2 Deuda de Seguridad

**Severidad: 🔴 CRÍTICA**

| # | Hallazgo | Severidad | Evidencia |
|---|----------|-----------|-----------|
| SEC-01 | **Sin autenticación** | 🔴 CRÍTICO | No existe Spring Security ni mecanismo de auth — 19 endpoints públicos |
| SEC-02 | **Sin protección CSRF** | 🔴 CRÍTICO | `PetclinicInitializer` solo registra `CharacterEncodingFilter` |
| SEC-03 | **Credenciales en pom.xml** | 🔴 CRÍTICO | MySQL: `petclinic/petclinic` (línea 569-570), PostgreSQL: `postgres/petclinic` (línea 588-589) |
| SEC-04 | **IDOR via IDs secuenciales** | 🟠 ALTO | `GenerationType.IDENTITY` en `BaseEntity.java` línea 32 → `/owners/{id}` enumerables |
| SEC-05 | **JMX sin autenticación** | 🟠 ALTO | `CallMonitoringAspect` es `@ManagedResource` sin control de acceso |
| SEC-06 | **CDN sin SRI** | 🟠 ALTO | `htmlHeader.tag` carga scripts desde `oss.maxcdn.com` sin `integrity` |
| SEC-07 | **DEBUG en producción** | 🟠 ALTO | `logback.xml`: nivel DEBUG para petclinic + `jpa.showSql=true` en `data-access.properties` |
| SEC-08 | **PII en toString()** | 🟡 MEDIO | `Owner.toString()` expone firstName, lastName, address, city, telephone |
| SEC-09 | **CrashController en producción** | 🟡 MEDIO | `/oups` lanza `RuntimeException` deliberada → información del sistema en stack trace |
| SEC-10 | **Sin cabeceras de seguridad** | 🟡 MEDIO | Sin CSP, HSTS, X-Content-Type-Options, X-Frame-Options |

### 3.3 Métricas de Calidad del Código

#### Tamaño del código fuente

| Tipo | Ficheros | LOC |
|------|----------|-----|
| Java (main) | 43 | 2.750 |
| Java (test) | 14 | 962 |
| JSP | 9 | 367 |
| Custom Tags | 10 | 164 |
| SQL (schemas + data) | 8 | 414 |
| XML (config Spring) | 5 | 251 |
| **Total** | **89** | **4.908** |

#### Complejidad ciclomática

| Clase | CC | LOC | Métodos | Evaluación |
|-------|-----|-----|---------|------------|
| `OneToManyResultSetExtractor` | **13** | 160 | — | ⚠️ Más alta del proyecto — JDBC extraction complejo |
| `JdbcOwnerRepositoryImpl` | **11** | 157 | 4 | ⚠️ Múltiples queries con procesamiento |
| `OwnerController` | **9** | 133 | 8 | 🟡 Aceptable para controlador |
| `EntityUtils` | 5 | — | — | ✅ OK |
| `PetValidator` | 5 | — | — | ✅ OK |
| **Media del proyecto** | **3.2** | — | — | ✅ Excelente (<5 es sano) |

**Distribución de complejidad:**
- 28 clases (65%): CC 1-3 (trivial)
- 12 clases (28%): CC 4-9 (moderada)
- 3 clases (7%): CC 10-13 (alta — vigilar)
- 0 clases: CC >15 (sin god classes)

#### Ratio de testing

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Clases main | 43 | — |
| Clases test | 14 | 55% de clases main con test asociado |
| Métodos `@Test` | 53 (28 web + 14 model + 11 service) | — |
| Ratio LOC test/main | 962/2750 = **35,0%** | ⚠️ Por debajo del 50% recomendado |

**Cobertura por capa:**

| Capa | Clases con test | Total clases | Cobertura |
|------|----------------|--------------|-----------|
| Web/Controllers | 6 | 7 | **86%** ✅ |
| Service | 1 | 1 | **100%** ✅ |
| Model | 4 | 11 | **36%** ⚠️ |
| Repository | 0 (directo) | 12 | **0%** ❌ (testados indirectamente vía servicio) |
| Utility | 0 | 2 | **0%** ❌ |

**Clases SIN tests directos:**
- Todas las implementaciones JDBC y JPA de repositorios (12 clases)
- Row mappers JDBC (`JdbcPetRowMapper`, `JdbcVisitRowMapper`, `JdbcPetVisitExtractor`)
- `OneToManyResultSetExtractor` (la clase más compleja del proyecto — CC 13 — sin test)
- Utilidades (`EntityUtils`, `CallMonitoringAspect`)
- Modelos parciales (`Visit`, `Specialty`, `PetType`, `NamedEntity`, `BaseEntity`, `Person`)
- Inicialización (`PetclinicInitializer`)

#### Anti-patrones detectados

| Anti-patrón | Localización | Severidad |
|-------------|-------------|-----------|
| **3 implementaciones paralelas de repositorio** | Paquetes `jdbc/`, `jpa/`, `springdatajpa/` — 3 formas de hacer lo mismo (~1.300 LOC redundantes) | 🟠 ALTO — Triplicación de mantenimiento |
| **Sin DTOs** | Entidades JPA expuestas directamente en controladores y API JSON | 🟠 ALTO |
| **EAGER fetch en Pet.visits** | Pet carga todas las visitas al leer — riesgo de N+1 en datasets grandes | 🟡 MEDIO |
| **Lógica en `toString()`** | `Owner.toString()` con iteración de pets + `PropertyToString` | 🟡 MEDIO |
| **OneToManyResultSetExtractor sin test** | Clase más compleja del proyecto (CC 13) sin ningún test unitario | 🟡 MEDIO |
| **Caché sin invalidación** | `@Cacheable("vets")` sin `@CacheEvict` si se editaran vets | 🟡 MEDIO |
| **Organización por capa** | Paquetes: `model/`, `web/`, `service/`, `repository/` (no por dominio) | 🟡 MEDIO — Dificulta extracción de bounded contexts |

**Anti-patrones NO detectados (positivo):**
- ✅ Sin god classes (ninguna >300 LOC o >20 métodos)
- ✅ Sin SQL concatenado — todas las queries usan parámetros
- ✅ Sin excepciones tragadas — catch blocks correctos
- ✅ Sin `new` en lógica de negocio — DI por constructor correcta
- ✅ Adherencia a SOLID: A- (excelente para aplicación demo)

#### Herencia profunda en entidades

```
BaseEntity (id)
  └─ NamedEntity (name)
       ├─ PetType
       ├─ Specialty
       └─ Pet (birthDate, type, owner, visits)
  └─ Person (firstName, lastName)
       ├─ Owner (address, city, telephone, pets)
       └─ Vet (specialties)
  └─ Visit (date, description, pet)
```

**Profundidad máxima: 3 niveles** (`PetType` → `NamedEntity` → `BaseEntity`) — Aceptable pero con modelo anémico.

### 3.4 Deuda de Infraestructura

| # | Hallazgo | Severidad | Detalle |
|---|----------|-----------|---------|
| INF-01 | **Docker image sin digest** | 🟠 ALTO | `jetty:11.0-jdk17` sin SHA256 → supply-chain attack |
| INF-02 | **Sin non-root user en Docker** | 🟠 ALTO | Jib no configura usuario no-root |
| INF-03 | **Sin health check** | 🟡 MEDIO | No hay endpoint `/actuator/health` ni Docker HEALTHCHECK |
| INF-04 | **Sin JVM tuning** | 🟡 MEDIO | No se configuran flags JVM (`-Xmx`, `-XX:+UseG1GC`, etc.) en Jib |
| INF-05 | **Tag `latest` en imagen** | 🟡 MEDIO | Imagen publicada con tag `latest` + version — ambigüedad |
| INF-06 | **Maven wrapper desactualizado** | 🟠 ALTO | Maven 3.8.4 EOL → maven-wrapper 3.1.1 obsoleto |
| INF-07 | **Sin Flyway/Liquibase** | 🟡 MEDIO | Esquema inicializado por `<jdbc:initialize-database>` — sin versionado de migraciones |

---

## 4. Dependencias con CVEs — Detalle

### 4.1 🔴 CVE-2026-29062 — Jackson Core 3.0.4 (CVSS 8.7 HIGH)

| Campo | Valor |
|-------|-------|
| **Dependencia** | `tools.jackson.core:jackson-core:3.0.4` / `jackson-databind:3.0.4` |
| **CVE** | CVE-2026-29062 |
| **CVSS v3** | 8.7 (HIGH) |
| **Tipo** | Denegación de Servicio (DoS) |
| **Descripción** | El parser JSON no aplica la restricción de profundidad máxima de anidamiento. Un atacante puede enviar payloads JSON profundamente anidados causando `StackOverflowError` y crash de la aplicación. |
| **Vector de ataque** | Red (Network) — sin autenticación requerida |
| **Afecta a** | Endpoint `/vets.json` (VetController) y cualquier endpoint que acepte JSON |
| **Versión corregida** | ≥ 3.1.0 |

**Adicionalmente:** GHSA-72hv-8253-57qq — El parser async ignora la restricción de longitud numérica, permitiendo números JSON arbitrariamente largos que consumen memoria y CPU.

**Remediación:**

```xml
<!-- pom.xml: Actualizar versión de Jackson -->
<jackson.version>3.1.0</jackson.version>  <!-- o la última 3.1.x disponible -->
```

### 4.2 🔴 CVE-2023-22102 — MySQL Connector/J 8.1.0 (CVSS 8.3 HIGH)

| Campo | Valor |
|-------|-------|
| **Dependencia** | `mysql:mysql-connector-java:8.1.0` |
| **CVE** | CVE-2023-22102 |
| **CVSS v3** | 8.3 (HIGH) |
| **Tipo** | Takeover — Control total del conector |
| **Descripción** | Vulnerabilidad en MySQL Connectors que permite a un atacante no autenticado comprometer completamente el conector MySQL vía red. Requiere interacción del usuario. |
| **Impacto** | Confidencialidad, integridad y disponibilidad comprometidas |
| **Versión corregida** | ≥ 8.2.0 |

**Nota adicional:** El artefacto `mysql:mysql-connector-java` fue renombrado a `com.mysql:mysql-connector-j`. La migración debe incluir el cambio de coordenadas Maven.

**Remediación:**

```xml
<!-- pom.xml: Actualizar MySQL Connector y renombrar artefacto -->
<mysql-driver.version>9.2.0</mysql-driver.version>

<!-- En el perfil MySQL, cambiar: -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>${mysql-driver.version}</version>
    <scope>runtime</scope>
</dependency>
```

### 4.3 🟠 Plataformas EOL

#### Jetty 11.0 — EOL desde 1 de enero de 2025

| Campo | Valor |
|-------|-------|
| **Componentes afectados** | `jetty:11.0-jdk17` (imagen Docker), `jetty-maven-plugin:11.0.26` |
| **EOL** | 1 de enero de 2025 |
| **Fin de publicación Maven** | 1 de enero de 2026 |
| **Riesgo** | Sin parches de seguridad futuros |
| **Migración** | Jetty 12.0.x o mejor, Spring Boot con Tomcat/Jetty embebido |

#### Maven 3.8.4 — EOL desde junio de 2025

| Campo | Valor |
|-------|-------|
| **Componente afectado** | `.mvn/wrapper/maven-wrapper.properties` |
| **EOL** | 14 de junio de 2025 |
| **Riesgo** | Sin parches de seguridad, incompatibilidad con plugins modernos |
| **Migración** | Maven 3.9.12 (estable) o Maven 4.0 (cuando alcance GA) |

**Remediación Maven:**

```properties
# .mvn/wrapper/maven-wrapper.properties — Actualizar a Maven 3.9.12
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.12/apache-maven-3.9.12-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar
```

---

## 5. Análisis de Acoplamiento y Bounded Contexts

### 5.1 Mapa de dependencias entre paquetes

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MAPA DE ACOPLAMIENTO                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  web (controllers)                                                   │
│    ├── OwnerController ──→ ClinicService ──→ OwnerRepository         │
│    ├── PetController ───→ ClinicService ──→ PetRepository            │
│    ├── VisitController ─→ ClinicService ──→ VisitRepository          │
│    ├── VetController ───→ ClinicService ──→ VetRepository            │
│    └── CrashController (independiente)                               │
│                                                                      │
│  service                                                             │
│    └── ClinicServiceImpl ──→ [4 repositorios]  ← GOD SERVICE        │
│         Aferente: 4 controllers                                      │
│         Eferente: 4 repositories                                     │
│         ACOPLAMIENTO: ALTO — punto único de fallo                    │
│                                                                      │
│  model                                                               │
│    └── Owner ←→ Pet ←→ Visit    (bidireccional)                      │
│    └── Vet ←→ Specialty         (bidireccional)                      │
│    └── Todos dependen de BaseEntity/NamedEntity/Person               │
│                                                                      │
│  repository (3 implementaciones paralelas por perfil)                │
│    ├── jdbc/     (5 clases + 3 mappers)                              │
│    ├── jpa/      (4 clases)                                          │
│    └── springdatajpa/ (4 interfaces)                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.2 Bounded Contexts identificados

Para una migración Strangler Fig, los siguientes dominios funcionales son extraíbles:

| Bounded Context | Entidades | Endpoints | Complejidad de extracción |
|----------------|-----------|-----------|--------------------------|
| **Gestión de Propietarios** | `Owner`, `Person` | `/owners/**` | 🟡 MEDIA — relación bidireccional con Pet |
| **Gestión de Mascotas** | `Pet`, `PetType`, `Visit` | `/owners/*/pets/**`, `/owners/*/pets/*/visits/**` | 🟠 ALTA — acoplado a Owner + Visit |
| **Gestión de Veterinarios** | `Vet`, `Specialty`, `Vets` | `/vets`, `/vets.json`, `/vets.xml` | ✅ BAJA — dominio aislado, candidato ideal |
| **Visitas Clínicas** | `Visit` | `/owners/*/pets/*/visits/**` | 🟠 ALTA — depende de Pet que depende de Owner |

**Cuello de botella identificado:** `ClinicServiceImpl` es un **God Service** que gestiona los 4 dominios a través de una única interfaz `ClinicService`. Toda extracción de bounded context requiere primero descomponer esta clase.

---

## 6. Estrategia de Modernización Recomendada

### Patrón: **Strangler Fig** (incremental)

**Justificación:**
- El sistema es funcional y no puede detenerse durante la migración
- La aplicación es suficientemente pequeña (~2.700 LOC Java) para una migración completa en fases
- El acoplamiento a través de `ClinicServiceImpl` es manejable
- No hay integraciones externas complejas que dificulten la extracción

### Fase 0 — Estabilización Inmediata (Semanas 1-2)

> **Objetivo:** Eliminar vulnerabilidades críticas sin cambiar la arquitectura.

| # | Acción | Prioridad | Esfuerzo |
|---|--------|-----------|----------|
| 0.1 | Actualizar Jackson a ≥3.1.0 (CVE-2026-29062) | 🔴 CRÍTICO | 1 hora |
| 0.2 | Actualizar MySQL Connector a ≥8.2.0 + renombrar artefacto (CVE-2023-22102) | 🔴 CRÍTICO | 1 hora |
| 0.3 | Actualizar Maven wrapper a 3.9.12 | 🔴 CRÍTICO | 30 min |
| 0.4 | Eliminar credenciales de pom.xml → variables de entorno | 🔴 CRÍTICO | 2 horas |
| 0.5 | Cambiar logback.xml a nivel INFO (no DEBUG) + `jpa.showSql=false` | 🟠 ALTO | 30 min |
| 0.6 | Eliminar `CrashController` o protegerlo con perfil de desarrollo | 🟡 MEDIO | 30 min |
| 0.7 | Eliminar CDN de IE8 (html5shiv, respond.js) del `htmlHeader.tag` | 🟡 MEDIO | 30 min |
| 0.8 | Actualizar Font Awesome de 4.7.0 a 6.x | 🟡 MEDIO | 2 horas |
| 0.9 | Eliminar `maven-eclipse-plugin` obsoleto | 🟡 MEDIO | 15 min |

**Remediación — Credenciales (0.4):**

```xml
<!-- pom.xml: Reemplazar credenciales hardcoded por variables de entorno -->
<profile>
    <id>MySQL</id>
    <properties>
        <jdbc.username>${env.MYSQL_USER}</jdbc.username>
        <jdbc.password>${env.MYSQL_PASSWORD}</jdbc.password>
    </properties>
</profile>
<profile>
    <id>PostgreSQL</id>
    <properties>
        <jdbc.username>${env.PG_USER}</jdbc.username>
        <jdbc.password>${env.PG_PASSWORD}</jdbc.password>
    </properties>
</profile>
```

**Remediación — Logging (0.5):**

```xml
<!-- logback.xml: Producción segura -->
<logger name="org.springframework.samples.petclinic" level="INFO"/>

<!-- data-access.properties -->
jpa.showSql=false
```

### Fase 1 — Migración a Spring Boot (Meses 1-3)

> **Objetivo:** Modernizar la base sin cambiar funcionalidad. Máximo impacto con mínimo riesgo.

| # | Acción | Impacto |
|---|--------|---------|
| 1.1 | Crear clase `@SpringBootApplication` con `main()` | Habilita auto-configuración, server embebido, Actuator |
| 1.2 | Migrar 5 XML configs → `application.yml` + clases `@Configuration` | Elimina XML, habilita profiles Boot |
| 1.3 | Cambiar empaquetado WAR → JAR ejecutable | Elimina dependencia de Jetty/Tomcat externo |
| 1.4 | Eliminar `PetclinicInitializer` (reemplazado por Boot) | Simplificación |
| 1.5 | Migrar pool Tomcat JDBC → HikariCP (auto-configurado) | Pool moderno, mejor rendimiento |
| 1.6 | Eliminar perfiles de repositorio redundantes (dejar solo `spring-data-jpa`) | Elimina ~600 LOC de las implementaciones jdbc/ y jpa/ |
| 1.7 | Añadir Spring Boot Actuator (`/actuator/health`, `/actuator/info`) | Observabilidad, health checks |
| 1.8 | Reemplazar `SimpleMappingExceptionResolver` → `@RestControllerAdvice` con `ProblemDetail` (RFC 7807) | Error handling moderno |
| 1.9 | Añadir Flyway para versionado de migraciones SQL | Migraciones reproducibles |
| 1.10 | Migrar Docker de Jib/Jetty → Spring Boot OCI con Buildpacks o Jib+Tomcat embebido | Imagen más ligera, non-root |

**`@SpringBootApplication` objetivo:**

```java
package org.springframework.samples.petclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PetclinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetclinicApplication.class, args);
    }
}
```

**`application.yml` objetivo:**

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:petclinic
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
  cache:
    type: caffeine
    cache-names: vets

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    org.springframework.samples.petclinic: INFO

---
spring:
  config:
    activate:
      on-profile: mysql
  datasource:
    url: jdbc:mysql://localhost:3306/petclinic?useUnicode=true
    username: ${MYSQL_USER}
    password: ${MYSQL_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### Fase 2 — Seguridad y Observabilidad (Meses 3-6)

> **Objetivo:** Añadir la capa de seguridad y monitorización inexistente.

| # | Acción | Impacto |
|---|--------|---------|
| 2.1 | Añadir Spring Security con autenticación (JWT o sesiones) | Elimina acceso anónimo a todo el sistema |
| 2.2 | Configurar CSRF, CORS, cabeceras de seguridad (CSP, HSTS, etc.) | Protección contra ataques web |
| 2.3 | Implementar control de acceso por roles (RBAC) en endpoints | Autorización granular |
| 2.4 | Reemplazar IDs secuenciales por UUID en URLs externas | Elimina IDOR |
| 2.5 | Eliminar JMX no autenticado o protegerlo | Cierra vector de ataque |
| 2.6 | Integrar Micrometer + Prometheus/Grafana vía Boot Actuator | Métricas de rendimiento |
| 2.7 | Configurar logging estructurado (JSON) con correlation IDs | Trazabilidad distribuida |
| 2.8 | Añadir rate limiting (`spring-boot-starter-actuator` + Bucket4j o similar) | Protección DoS |

**Spring Security mínima:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/webjars/**", "/resources/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"))
                .frameOptions(fo -> fo.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000))
            )
            .csrf(Customizer.withDefaults())
            .build();
    }
}
```

### Fase 3 — Modernización del Frontend (Meses 6-9)

> **Objetivo:** Migrar de JSP server-side a una arquitectura moderna.

| # | Opción A: Thymeleaf (conservadora) | Opción B: SPA (moderna) |
|---|-------------------------------------|------------------------|
| 3.1 | Migrar 9 JSPs → templates Thymeleaf | Crear SPA con React/Vue/Angular |
| 3.2 | Mantener MVC server-side | Convertir controllers en REST API |
| 3.3 | Reutilizar controladores existentes | Añadir DTOs + OpenAPI docs |
| 3.4 | Esfuerzo: ~2-3 semanas | Esfuerzo: ~6-8 semanas |
| 3.5 | Riesgo: bajo | Riesgo: medio |

**Recomendación:** Opción A (Thymeleaf) para la primera iteración. Permite mantener el modelo MVC existente y reaprovechar los controladores. La migración a SPA puede hacerse en una fase posterior si se requiere.

### Fase 4 — Descomposición en Bounded Contexts (Meses 9-18)

> **Objetivo:** Preparar la arquitectura para microservicios si la escala lo requiere.

**Secuencia de extracción recomendada (por independencia de dominio):**

```
┌────────────────────────────────────────────────────────────┐
│  ORDEN DE EXTRACCIÓN STRANGLER FIG                          │
│                                                              │
│  1. 🟢 Veterinarios (independiente — 0 dependencias)        │
│     Vet + Specialty → VetService microservicio               │
│     API: /api/v1/vets, /api/v1/specialties                  │
│                                                              │
│  2. 🟡 Propietarios (1 dependencia: Pet)                     │
│     Owner → OwnerService microservicio                       │
│     API: /api/v1/owners                                      │
│     ACL: referencia a Pet por ID (no objeto embebido)        │
│                                                              │
│  3. 🟠 Mascotas + Visitas (depende de Owner + PetType)       │
│     Pet + PetType + Visit → PetCareService microservicio     │
│     API: /api/v1/pets, /api/v1/visits                        │
│     ACL: Anti-Corruption Layer hacia OwnerService             │
│                                                              │
│  4. 🔵 API Gateway (enrutamiento unificado)                  │
│     Spring Cloud Gateway delante de los microservicios       │
│     Redirige tráfico del monolito al nuevo servicio           │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

**Paso previo obligatorio:** Descomponer `ClinicServiceImpl` (God Service) en:
- `VetService` (gestión de veterinarios y especialidades)
- `OwnerService` (gestión de propietarios)
- `PetCareService` (gestión de mascotas, tipos y visitas)

```java
// Antes: God Service
public interface ClinicService {
    Collection<PetType> findPetTypes();
    Owner findOwnerById(int id);
    Pet findPetById(int id);
    void savePet(Pet pet);
    void saveVisit(Visit visit);
    Collection<Vet> findVets();
    // ... todo mezclado
}

// Después: Servicios por dominio
public interface VetService {
    Collection<Vet> findAll();
    Vet findById(int id);
}

public interface OwnerService {
    Owner findById(int id);
    Collection<Owner> findByLastName(String lastName);
    void save(Owner owner);
}

public interface PetCareService {
    Collection<PetType> findPetTypes();
    Pet findPetById(int id);
    void savePet(Pet pet);
    void saveVisit(Visit visit);
    Collection<Visit> findVisitsByPetId(int petId);
}
```

---

## 7. Estimación de Esfuerzo

| Fase | Esfuerzo estimado | Equipo mínimo | Riesgo |
|------|-------------------|---------------|--------|
| **Fase 0** — Estabilización | 1-2 días | 1 dev senior | ✅ Bajo |
| **Fase 1** — Migración a Spring Boot | 3-6 semanas | 1-2 devs | 🟡 Medio |
| **Fase 2** — Seguridad y observabilidad | 4-6 semanas | 1-2 devs | 🟡 Medio |
| **Fase 3** — Frontend (Thymeleaf) | 2-3 semanas | 1 dev frontend | ✅ Bajo |
| **Fase 4** — Bounded contexts | 2-4 meses | 2-3 devs | 🟠 Alto |
| **Total** | **5-8 meses** | **2-3 devs** | — |

**Perfiles necesarios:**
- 1 Desarrollador Java Senior (Spring Boot, seguridad)
- 1 Desarrollador Java Mid-level (migración, tests)
- 1 DevOps (Docker, CI/CD, Maven) — tiempo parcial

---

## 8. Matriz de Priorización

```
                    IMPACTO EN SEGURIDAD / OPERACIÓN
                    ALTO                    BAJO
               ┌─────────────────────┬─────────────────────┐
   BAJO        │   QUICK WINS 🏆     │   EN PARALELO       │
   ESFUERZO    │                     │                     │
               │ • CVE Jackson 3.0.4 │ • Font Awesome 6.x  │
               │ • CVE MySQL 8.1.0   │ • maven-eclipse rm  │
               │ • Maven 3.9.12      │ • CDN IE8 rm        │
               │ • Credenciales env   │ • CrashController   │
               │ • Logging INFO       │                     │
               ├─────────────────────┼─────────────────────┤
   ALTO        │   STRANGLER FIG     │   EVALUAR SaaS      │
   ESFUERZO    │   (incremental)     │                     │
               │                     │                     │
               │ • Spring Boot        │ • Frontend SPA      │
               │ • Spring Security    │ • Microservicios    │
               │ • Jetty 12 / embed  │ • FHIR compliance   │
               │ • Flyway migrations │ • Terminology svc   │
               │ • Health checks     │                     │
               └─────────────────────┴─────────────────────┘
```

---

## 9. Checklist de Modernización

### Fase 0 — Estabilización Inmediata

- [ ] Actualizar `jackson.version` a ≥3.1.0
- [ ] Actualizar `mysql-driver.version` a ≥8.2.0 + renombrar groupId/artifactId
- [ ] Actualizar Maven wrapper a 3.9.12
- [ ] Externalizar credenciales BD de pom.xml a variables de entorno
- [ ] Cambiar `logback.xml` a nivel INFO + `jpa.showSql=false`
- [ ] Eliminar o restringir `CrashController`
- [ ] Eliminar CDN de IE8 en `htmlHeader.tag`
- [ ] Actualizar Font Awesome a 6.x
- [ ] Eliminar `maven-eclipse-plugin`

### Fase 1 — Spring Boot

- [ ] Añadir `spring-boot-starter-parent` o BOM
- [ ] Crear `PetclinicApplication` con `@SpringBootApplication`
- [ ] Migrar `business-config.xml` → `@Configuration`
- [ ] Migrar `datasource-config.xml` → `application.yml`
- [ ] Migrar `mvc-core-config.xml` → `WebMvcConfigurer`
- [ ] Migrar `mvc-view-config.xml` → `application.yml` (view resolver)
- [ ] Migrar `tools-config.xml` → `@Configuration` (AOP, cache)
- [ ] Eliminar `data-access.properties` (fusionar en `application.yml`)
- [ ] Cambiar empaquetado WAR → JAR
- [ ] Eliminar `PetclinicInitializer`
- [ ] Eliminar `jetty-web.xml`
- [ ] Integrar Flyway o Liquibase
- [ ] Añadir Spring Boot Actuator
- [ ] Eliminar implementaciones JDBC y JPA manuales (mantener solo Spring Data JPA)
- [ ] Actualizar imagen Docker a Spring Boot OCI image

### Fase 2 — Seguridad

- [ ] Añadir `spring-boot-starter-security`
- [ ] Configurar autenticación (form login o JWT)
- [ ] Configurar CSRF protection
- [ ] Añadir cabeceras de seguridad (CSP, HSTS, X-Frame-Options)
- [ ] Implementar RBAC en endpoints
- [ ] Proteger JMX o deshabilitarlo
- [ ] Reemplazar IDs secuenciales por UUID en URLs
- [ ] Añadir rate limiting
- [ ] Configurar logging estructurado con correlation IDs
- [ ] Integrar métricas Micrometer

### Fase 3 — Frontend

- [ ] Migrar JSPs a Thymeleaf templates
- [ ] Eliminar dependencia JSTL
- [ ] Crear DTOs para separar entidades de la vista
- [ ] Documentar API REST con OpenAPI/Swagger

### Fase 4 — Descomposición

- [ ] Descomponer `ClinicServiceImpl` en servicios por dominio
- [ ] Extraer `VetService` como primer bounded context
- [ ] Reorganizar paquetes de layer-based a domain-based
- [ ] Implementar Anti-Corruption Layer si se integra con sistemas legados

---

## 10. Conclusiones

| Dimensión | Estado | Puntuación |
|-----------|--------|------------|
| **Versiones de plataforma** | 2 componentes EOL (Jetty 11, Maven 3.8.4), resto actualizado | 🟡 65/100 |
| **Vulnerabilidades (CVEs)** | 2 CVEs HIGH activos (Jackson, MySQL), 0 CRITICAL | 🟠 50/100 |
| **Arquitectura** | Patrón legacy (XML config, WAR, JSP) sobre framework moderno | 🟠 40/100 |
| **Seguridad aplicativa** | Inexistente — sin auth, CSRF, cabeceras, IDOR | 🔴 5/100 |
| **Calidad de código** | Baja complejidad (media 3.2), sin god classes, SOLID A-, pero 3 repos paralelos | 🟢 75/100 |
| **Cobertura de tests** | 55% clases con test (86% web, 100% service) pero 0% repos directos | 🟡 55/100 |
| **Infraestructura Docker** | Imagen sin digest, sin non-root, sin health check | 🟠 30/100 |
| **Observabilidad** | Solo logging básico, AOP JMX artesanal, sin métricas | 🟠 25/100 |

### Puntuación Global de Deuda Técnica

```
╔══════════════════════════════════════════════════════════════╗
║  ÍNDICE DE DEUDA TÉCNICA:  42 / 100  — MODERADO-ALTO            ║
║                                                              ║
║  Componentes modernos:  Spring 7.0.3, Hibernate 7.2.3,      ║
║                         Java 17 (✅ estado del arte)          ║
║                                                              ║
║  Arquitectura legada:   XML config, WAR, JSP, God Service   ║
║                         (❌ patrón 2010-2015)                 ║
║                                                              ║
║  Seguridad:             Prácticamente inexistente            ║
║                         (❌ bloqueante para producción)        ║
║                                                              ║
║  VEREDICTO: Las dependencias están actualizadas pero el      ║
║  estilo arquitectónico y la ausencia de seguridad generan    ║
║  una deuda técnica significativa. La migración a Spring Boot ║
║  es la acción de mayor impacto con menor riesgo.             ║
╚══════════════════════════════════════════════════════════════╝
```

**Contexto atenuante:** PetClinic es una **aplicación de demostración** del framework Spring. En un entorno de producción sanitario, la puntuación de seguridad (5/100) sería absolutamente bloqueante. La buena noticia es que las versiones de las dependencias core son modernas, lo que facilita enormemente la migración a Spring Boot sin saltos de versión mayores.

---

## 11. Referencias

| Referencia | URL |
|-----------|-----|
| Spring Framework Security Advisories | https://spring.io/security |
| CVE-2026-29062 (Jackson) | https://vulert.com/vuln-db/CVE-2026-29062 |
| CVE-2023-22102 (MySQL Connector) | https://nvd.nist.gov/vuln/detail/CVE-2023-22102 |
| Jetty 11 EOL Announcement | https://github.com/jetty/jetty.project/issues/13918 |
| Maven EOL Dates | https://endoflife.date/apache-maven |
| Font Awesome EOL | https://endoflife.date/font-awesome |
| Spring Boot Migration Guide | https://docs.spring.io/spring-boot/migration/index.html |
| Strangler Fig Pattern | https://martinfowler.com/bliki/StranglerFigApplication.html |
| OWASP Dependency-Check | https://owasp.org/www-project-dependency-check/ |
| Snyk Vulnerability Database | https://security.snyk.io/ |

---

> **Nota:** Este informe evalúa la deuda técnica del código fuente tal como se encuentra. Las recomendaciones están priorizadas por impacto en seguridad y esfuerzo de implementación. La Fase 0 (estabilización) es ejecutable inmediatamente sin cambios arquitectónicos. La migración a Spring Boot (Fase 1) es el punto de inflexión que desbloquea todas las mejoras posteriores.

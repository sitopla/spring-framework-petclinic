# 🛡️ Informe de Cumplimiento ENS — Spring Framework PetClinic

**Proyecto:** Spring Framework PetClinic v7.0.3  
**Fecha de análisis:** 2026-03-05  
**Referencia legal:** Real Decreto 311/2022 (BOE-A-2022-7191) — Esquema Nacional de Seguridad  
**Analista:** Agente ENS Compliance Analyzer  

---

## 1. Resumen Ejecutivo

| Categoría | Puntuación | Estado |
|-----------|-----------|--------|
| **BÁSICA** | **~28%** | 🔴 No cumple |
| **MEDIA** | **~15%** | 🔴 No cumple |
| **ALTA** | **~8%** | 🔴 No cumple |

El proyecto Spring Framework PetClinic es una aplicación de demostración MVC clásica **sin medidas de seguridad implementadas**. No existe autenticación, autorización, cifrado, gestión de sesiones, ni protección CSRF/XSS. La aplicación en su estado actual **no es apta para su despliegue en un entorno sujeto al ENS**.

### Hallazgos clave

- ❌ **Sin Spring Security**: No hay dependencia ni configuración de seguridad
- ❌ **Sin autenticación/autorización**: Todos los endpoints son públicos
- ❌ **Sin cifrado**: No hay TLS/SSL, ni cifrado de datos en reposo
- ❌ **Sin protección CSRF/XSS**: No hay cabeceras de seguridad HTTP
- ❌ **Sin logging de auditoría**: Solo logging básico por consola sin traceId/spanId
- ❌ **Sin SECURITY.md**: No existe política de seguridad documentada
- ⚠️ **jpa.showSql=true**: Las consultas SQL se loguean en texto plano (exposición de datos)
- ✅ **Validación de entrada**: Se usa `@Valid` y `@NotEmpty` en formularios
- ✅ **CI/CD con SonarQube**: Análisis de calidad de código en GitHub Actions
- ✅ **Dependabot activo**: Actualizaciones automáticas mensuales de dependencias Maven

---

## 2. Puntuación por Dimensión de Seguridad

| Dimensión | BAJO | MEDIO | ALTO |
|-----------|------|-------|------|
| **D** — Disponibilidad | 20% | 5% | 0% |
| **A** — Autenticidad | 10% | 5% | 0% |
| **I** — Integridad | 25% | 10% | 5% |
| **C** — Confidencialidad | 10% | 5% | 0% |
| **T** — Trazabilidad | 15% | 5% | 0% |

## 3. Puntuación por Marco

| Marco | BÁSICA | MEDIA | ALTA |
|-------|--------|-------|------|
| **org** — Marco Organizativo | 25% | 25% | 25% |
| **op** — Marco Operacional | 30% | 15% | 8% |
| **mp** — Medidas de Protección | 20% | 10% | 5% |

---

## 4. Análisis Detallado por Medida

### 4.1 Marco Organizativo [org]

| Código | Medida | Estado | Evidencia |
|--------|--------|--------|-----------|
| org.1 | Política de seguridad | ❌ NO CUMPLE | No existe `SECURITY.md` ni documento de política de seguridad en el repositorio |
| org.2 | Normativa de seguridad | ⚠️ PARCIAL | Existe SonarQube configurado como estándar de calidad, pero no hay normativa de seguridad codificada (reglas de seguridad, Checkstyle security rules) |
| org.3 | Procedimientos de seguridad | ⚠️ PARCIAL | CI/CD con GitHub Actions para build/test, pero sin pasos de seguridad (SAST, DAST, security gates) |
| org.4 | Proceso de autorización | ⚠️ PARCIAL | Se usa Pull Request workflow (`maven-build-pull-request.yml`), pero sin requisitos de aprobación explícitos ni branch protection documentada |

### 4.2 Marco Operacional [op]

#### Planificación [op.pl]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.pl.1 | Análisis de riesgos | aplica | +R1 | +R2 | ⚠️ PARCIAL | Dependabot configurado (`.github/dependabot.yml`) para vulnerabilidades Maven, pero no hay análisis de riesgos formal (OWASP Dependency-Check, Snyk) |
| op.pl.2 | Arquitectura de seguridad | aplica | +R1 | +R1+R2+R3 | ❌ NO CUMPLE | No existe documentación de arquitectura de seguridad. La aplicación no tiene capas de seguridad |
| op.pl.3 | Adquisición de componentes | aplica | aplica | aplica | ⚠️ PARCIAL | Se usan lock files (Maven), pero no hay política de registros aprobados ni verificación de firmas de artefactos |
| op.pl.4 | Dimensionamiento/capacidad | aplica | +R1 | +R1 | ❌ NO CUMPLE | No hay configuración de health checks, resource limits, ni auto-scaling |
| op.pl.5 | Componentes certificados | n.a. | aplica | aplica | ❌ NO CUMPLE | No se utilizan bibliotecas criptográficas certificadas (no hay cifrado implementado) |

#### Control de acceso [op.acc]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.acc.1 | Identificación | aplica | aplica | aplica | ❌ NO CUMPLE | No hay mecanismo de identificación de usuarios. Todos los endpoints son públicos |
| op.acc.2 | Requisitos de acceso | aplica | aplica | +R1 | ❌ NO CUMPLE | No hay RBAC/ABAC, ni listas de control de acceso |
| op.acc.3 | Segregación de funciones | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay separación de roles. No existe concepto de roles en la aplicación |
| op.acc.4 | Gestión de derechos de acceso | aplica | aplica | aplica | ❌ NO CUMPLE | No hay proceso de provisioning/deprovisioning de usuarios |
| op.acc.5 | Autenticación (usuarios externos) | +R | +R+R5 | +R+R5 | ❌ NO CUMPLE | Sin mecanismo de autenticación |
| op.acc.6 | Autenticación (usuarios organización) | +R | +R+R5 | +R+R5 | ❌ NO CUMPLE | Sin mecanismo de autenticación |

#### Explotación [op.exp]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.exp.1 | Inventario de activos | aplica | aplica | +R1 | ❌ NO CUMPLE | No existe SBOM (Software Bill of Materials) ni registro de activos |
| op.exp.2 | Configuración de seguridad | aplica | aplica | +R1 | ❌ NO CUMPLE | `jpa.showSql=true` expone consultas SQL. No hay security headers (CSP, X-Frame-Options, X-Content-Type-Options) |
| op.exp.3 | Gestión de la configuración | aplica | aplica | +R1 | ⚠️ PARCIAL | Configuración versionada en Git (XML Spring configs), pero credenciales JDBC gestionadas por property placeholders sin vault externo |
| op.exp.4 | Mantenimiento y actualizaciones | aplica | aplica | aplica | ✅ CUMPLE | Dependabot configurado con actualizaciones mensuales. GitHub Actions ejecuta builds automáticos |
| op.exp.5 | Gestión de cambios | aplica | aplica | +R1 | ⚠️ PARCIAL | Git + PR workflow, pero sin approval gates formales ni change management documentado |
| op.exp.6 | Protección frente código dañino | aplica | aplica | +R1 | ⚠️ PARCIAL | SonarQube en CI para análisis estático, pero no hay SAST dedicado (SpotBugs, Find Security Bugs), ni container scanning |
| op.exp.7 | Gestión de incidentes | aplica | +R1+R2 | +R1+R2+R3 | ❌ NO CUMPLE | No hay procedimiento de respuesta a incidentes, ni alertas configuradas |
| op.exp.8 | Registro de actividad | aplica | +R1+R2 | +R1+R2+R3 | ⚠️ PARCIAL | Logback configurado pero solo consola. No hay audit trail, ni traceId/spanId, ni log centralizado (ELK/Splunk). Patrón de log: `%-5level %logger{0} - %msg%n` sin timestamp |
| op.exp.9 | Registro gestión incidentes | aplica | aplica | aplica | ❌ NO CUMPLE | No hay issue templates para incidentes de seguridad |

#### Recursos externos [op.ext]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.ext.1 | Contratación y SLA | aplica | aplica | +R1 | ℹ️ NO APLICA (código) | Requiere verificación organizacional |
| op.ext.2 | Gestión diaria | aplica | aplica | aplica | ❌ NO CUMPLE | No hay dashboards de monitorización ni métricas de operación |
| op.ext.3 | Cadena de suministro | n.a. | aplica | aplica | ⚠️ PARCIAL | Dependabot mitiga parcialmente. No hay verificación de firmas de artefactos ni SLSA |

#### Servicios en la nube [op.nub]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.nub.1 | Protección servicios en la nube | aplica | +R1 | +R1+R2+R3 | ❌ NO CUMPLE | No hay configuración de cloud security, IAM policies, ni cifrado en reposo |

#### Continuidad del servicio [op.cont]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.cont.1 | Análisis de impacto | n.a. | aplica | aplica | ❌ NO CUMPLE | No existe BIA ni definición de RTO/RPO |
| op.cont.2 | Plan de continuidad | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay DR configs ni despliegue multi-región |
| op.cont.3 | Pruebas periódicas | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay chaos engineering ni pruebas de DR automatizadas |
| op.cont.4 | Medios alternativos | n.a. | n.a. | aplica | ❌ NO CUMPLE | No hay failover configurado |

#### Monitorización [op.mon]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| op.mon.1 | Detección de intrusión | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay IDS/IPS, WAF, ni detección de anomalías |
| op.mon.2 | Sistema de métricas | aplica | +R1 | +R1 | ❌ NO CUMPLE | No hay Micrometer, Prometheus, ni métricas de negocio. Existe `CallMonitoringAspect` pero solo cuenta invocaciones JMX |
| op.mon.3 | Vigilancia | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay SIEM, ni reglas de alerta de seguridad |

### 4.3 Medidas de Protección [mp]

#### Protección de instalaciones [mp.if]

| Código | Medida | Estado | Nota |
|--------|--------|--------|------|
| mp.if.1–7 | Todas las medidas de instalaciones | ℹ️ NO APLICA (código) | Requiere verificación física/organizacional |

#### Gestión del personal [mp.per]

| Código | Medida | Estado | Nota |
|--------|--------|--------|------|
| mp.per.1–4 | Todas las medidas de personal | ℹ️ NO APLICA (código) | Requiere verificación organizacional |

#### Protección de equipos [mp.eq]

| Código | Medida | Estado | Nota |
|--------|--------|--------|------|
| mp.eq.1–4 | Todas las medidas de equipamiento | ℹ️ NO APLICA (código) | Requiere verificación física/organizacional |

#### Protección de comunicaciones [mp.com]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| mp.com.1 | Perímetro seguro | aplica | aplica | +R1 | ❌ NO CUMPLE | No hay firewall rules, network policies, ni configuración de ingress |
| mp.com.2 | Protección de confidencialidad | +R | +R2 | +R2 | ❌ NO CUMPLE | No hay configuración TLS/SSL. No se fuerza HTTPS. Sin certificate management |
| mp.com.3 | Protección integridad/autenticidad | +R | +R2 | +R2 | ❌ NO CUMPLE | No hay firma de mensajes, HMAC, ni verificación de integridad |
| mp.com.4 | Separación de flujos | n.a. | aplica | +R1 | ❌ NO CUMPLE | No hay segmentación de red ni namespace isolation |

#### Protección de soportes de información [mp.si]

| Código | Medida | Estado | Evidencia |
|--------|--------|--------|-----------|
| mp.si.1 | Etiquetado | ❌ NO CUMPLE | No hay clasificación de datos |
| mp.si.2 | Criptografía | ❌ NO CUMPLE | No hay cifrado implementado |
| mp.si.3–4 | Custodia y transporte | ℹ️ NO APLICA (código) | Requiere verificación organizacional |
| mp.si.5 | Borrado y destrucción | ❌ NO CUMPLE | No hay mecanismo de borrado seguro de datos |

#### Protección de aplicaciones [mp.sw]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| mp.sw.1 | Desarrollo de aplicaciones | aplica | +R1 | +R1 | ⚠️ PARCIAL | Tests unitarios e integración con JUnit/Mockito. SonarQube. Pero no hay SAST dedicado (Find Security Bugs), ni revisión de seguridad codificada |
| mp.sw.2 | Aceptación y puesta en servicio | aplica | +R1 | +R1 | ⚠️ PARCIAL | CI/CD ejecuta tests, pero no hay security gates, ni staging environments, ni acceptance criteria de seguridad |

#### Protección de la información [mp.info]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| mp.info.1 | Datos de carácter personal | aplica | aplica | aplica | ❌ NO CUMPLE | Se almacenan datos personales (Owner: firstName, lastName, address, city, telephone) sin protección GDPR, sin anonimización, sin consentimiento |
| mp.info.2 | Calificación de la información | aplica | aplica | aplica | ❌ NO CUMPLE | No hay clasificación de datos ni etiquetas de sensibilidad |
| mp.info.3 | Cifrado de la información | aplica | +R1 | +R1+R2 | ❌ NO CUMPLE | No hay cifrado en reposo. DB en texto plano |
| mp.info.4 | Firma electrónica | +R | +R2 | +R2+R3 | ❌ NO CUMPLE | No hay firma digital implementada |
| mp.info.5 | Sellos de tiempo | aplica | aplica | +R1 | ⚠️ PARCIAL | Los registros de Visit tienen `date`, pero no hay timestamp de auditoría con servicio de sello de tiempo cualificado |
| mp.info.6 | Limpieza de documentos | aplica | aplica | aplica | ❌ NO CUMPLE | No hay stripping de metadatos ni sanitización de documentos |
| mp.info.7 | Copias de seguridad | aplica | +R1 | +R1+R2 | ❌ NO CUMPLE | No hay configuración de backups, ni scripts automatizados, ni políticas de retención |

#### Protección de servicios [mp.s]

| Código | Medida | BÁSICA | MEDIA | ALTA | Estado | Evidencia |
|--------|--------|--------|-------|------|--------|-----------|
| mp.s.1 | Protección correo electrónico | aplica | aplica | +R1 | ℹ️ NO APLICA (código) | La aplicación no gestiona correo electrónico |
| mp.s.2 | Protección servicios web | aplica | +R | +R2+R3 | ⚠️ PARCIAL | Validación de entrada con `@Valid`/`@NotEmpty` y `PetValidator`. `SimpleMappingExceptionResolver` para errores. Pero NO hay: CSRF protection, CSP headers, XSS escaping explícito, WAF |
| mp.s.3 | Protección navegación web | aplica | aplica | +R1 | ❌ NO CUMPLE | No hay content filtering ni proxy configs |
| mp.s.4 | Protección frente DoS | aplica | aplica | +R1 | ❌ NO CUMPLE | No hay rate limiting, ni circuit breakers, ni protección DDoS |

---

## 5. Hoja de Ruta de Remediación

### 🔴 Prioridad CRÍTICA — Implementar inmediatamente

#### 5.1.1 Implementar Spring Security con autenticación y autorización
**Medidas ENS:** op.acc.1, op.acc.2, op.acc.3, op.acc.4, op.acc.5, op.acc.6  
**Estado actual:** Sin autenticación. Todos los endpoints públicos.  
**Estado requerido:** Autenticación obligatoria, roles diferenciados (ADMIN, VET, OWNER), MFA para MEDIA/ALTA  
**Complejidad:** Alta  
**Pasos:**
1. Añadir dependencia `spring-security-web` y `spring-security-config` al `pom.xml`
2. Crear `SecurityConfig.xml` o clase `@Configuration` con:
   - Autenticación basada en formulario o JWT
   - Roles: `ROLE_ADMIN`, `ROLE_VET`, `ROLE_OWNER`
   - Protección CSRF habilitada
   - Política de contraseñas (BCrypt)
3. Crear entidades `User` y `Role` en el modelo de datos
4. Configurar `UserDetailsService` con Spring Data JPA
5. Proteger endpoints:
   - `/owners/**` → `ROLE_ADMIN, ROLE_OWNER`
   - `/vets/**` → `ROLE_ADMIN, ROLE_VET`
   - `/` → pública
6. Para categoría MEDIA: Añadir MFA (TOTP) con biblioteca como `dev.samstevens.totp`
7. Migración SQL con Flyway para tablas `users`, `authorities`

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring-framework.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring-framework.version}</version>
</dependency>
```

#### 5.1.2 Configurar TLS/HTTPS obligatorio
**Medidas ENS:** mp.com.2, mp.com.3  
**Estado actual:** Sin cifrado en tránsito  
**Estado requerido:** HTTPS obligatorio con TLS 1.2+  
**Complejidad:** Media  
**Pasos:**
1. Configurar Tomcat/Jetty con certificado SSL
2. Añadir conector HTTPS en la configuración del servidor
3. Redirigir todo tráfico HTTP → HTTPS
4. Añadir cabecera HSTS (Strict-Transport-Security)

#### 5.1.3 Protección CSRF y cabeceras de seguridad HTTP
**Medidas ENS:** mp.s.2, op.exp.2  
**Estado actual:** Sin protección CSRF ni cabeceras de seguridad  
**Estado requerido:** CSRF tokens en formularios, CSP, X-Frame-Options, X-Content-Type-Options  
**Complejidad:** Media  
**Pasos:**
1. Spring Security habilita CSRF por defecto — activarlo
2. Añadir filtro de cabeceras de seguridad:
   ```
   Content-Security-Policy: default-src 'self'
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   Referrer-Policy: strict-origin-when-cross-origin
   ```
3. Actualizar JSPs para incluir CSRF tokens en formularios: `<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>`

#### 5.1.4 Protección de datos personales (RGPD/LOPDGDD)
**Medidas ENS:** mp.info.1, mp.info.2, mp.info.3  
**Estado actual:** Datos personales (nombre, dirección, teléfono) almacenados en texto plano sin protección  
**Estado requerido:** Cifrado en reposo, clasificación de datos, consentimiento  
**Complejidad:** Alta  
**Pasos:**
1. Clasificar campos sensibles en entidades (`Owner.address`, `Owner.telephone`)
2. Implementar cifrado a nivel de columna con Hibernate `@ColumnTransformer` o JPA AttributeConverter
3. Crear política de retención y borrado de datos
4. Añadir endpoint de exportación/borrado de datos (derecho al olvido)

---

### 🟠 Prioridad ALTA — Resolver en próximo sprint

#### 5.2.1 Implementar logging de auditoría con trazabilidad
**Medidas ENS:** op.exp.8, T (Trazabilidad)  
**Estado actual:** Logging básico por consola: `%-5level %logger{0} - %msg%n` — sin timestamp, sin traceId  
**Estado requerido:** Audit trail completo con traceId, spanId, usuario, acción, timestamp  
**Complejidad:** Media  
**Pasos:**
1. Actualizar `logback.xml` con timestamp y MDC:
   ```xml
   <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [traceId=%X{traceId}] [user=%X{user}] %-5level %logger{36} - %msg%n</pattern>
   ```
2. Añadir Micrometer Tracing para traceId/spanId automáticos
3. Crear interceptor que inserte el usuario autenticado en MDC
4. Implementar log de auditoría en operaciones CRUD (crear, modificar, eliminar Owner/Pet/Visit)
5. Configurar appender de fichero rotativo además de consola
6. Para MEDIA: Centralizar logs con ELK o similar

#### 5.2.2 Crear política de seguridad (SECURITY.md)
**Medidas ENS:** org.1, org.2  
**Estado actual:** No existe documentación de seguridad  
**Estado requerido:** Política de seguridad documentada y accesible  
**Complejidad:** Baja  
**Pasos:**
1. Crear `SECURITY.md` en la raíz del proyecto con:
   - Política de divulgación responsable de vulnerabilidades
   - Contacto de seguridad
   - Alcance (qué sistemas cubre)
   - Roles y responsabilidades (responsable de seguridad, del sistema, de la información)
   - Versiones soportadas
2. Crear `docs/security-policy.md` con política ENS completa

#### 5.2.3 Añadir SAST y security gates en CI/CD
**Medidas ENS:** op.exp.6, mp.sw.1, mp.sw.2  
**Estado actual:** Solo SonarQube (calidad) y Dependabot (dependencias)  
**Estado requerido:** SAST dedicado, DAST, security gates que bloqueen merge  
**Complejidad:** Media  
**Pasos:**
1. Añadir SpotBugs + Find Security Bugs al `pom.xml`:
   ```xml
   <plugin>
       <groupId>com.github.spotbugs</groupId>
       <artifactId>spotbugs-maven-plugin</artifactId>
       <version>4.8.4.0</version>
       <configuration>
           <plugins>
               <plugin>
                   <groupId>com.h3xstream.findsecbugs</groupId>
                   <artifactId>findsecbugs-plugin</artifactId>
                   <version>1.13.0</version>
               </plugin>
           </plugins>
       </configuration>
   </plugin>
   ```
2. Añadir OWASP Dependency-Check al pipeline:
   ```yaml
   - name: OWASP Dependency Check
     run: ./mvnw org.owasp:dependency-check-maven:check
   ```
3. Configurar quality gates en SonarQube que bloqueen si hay vulnerabilidades críticas
4. Añadir step de security check en `maven-build-pull-request.yml`

#### 5.2.4 Deshabilitar jpa.showSql y hardening de configuración
**Medidas ENS:** op.exp.2  
**Estado actual:** `jpa.showSql=true` — expone consultas SQL en logs  
**Estado requerido:** SQL logging deshabilitado en producción  
**Complejidad:** Baja  
**Pasos:**
1. Establecer `jpa.showSql=false` en `data-access.properties` (o perfil de producción)
2. Externalizar credenciales JDBC a variables de entorno o vault
3. Configurar perfiles Spring separados para dev/staging/producción

#### 5.2.5 Implementar gestión de sesiones segura
**Medidas ENS:** op.acc.5, op.acc.6  
**Estado actual:** Sin gestión de sesiones  
**Estado requerido:** Sesiones con timeout, invalidación, protección contra fixation  
**Complejidad:** Media  
**Pasos:**
1. Configurar en Spring Security:
   - Session fixation protection: `migrateSession`
   - Timeout de sesión: 30 minutos
   - Máximo de sesiones concurrentes por usuario
   - Cookie segura: `Secure`, `HttpOnly`, `SameSite=Strict`

---

### 🟡 Prioridad MEDIA — Planificar a medio plazo

#### 5.3.1 Implementar sistema de métricas y monitorización
**Medidas ENS:** op.mon.2, op.ext.2  
**Estado actual:** Solo `CallMonitoringAspect` con contadores JMX básicos  
**Estado requerido:** Métricas de salud, rendimiento y seguridad con dashboards  
**Complejidad:** Media  
**Pasos:**
1. Añadir dependencia Micrometer + Prometheus
2. Exponer métricas: latencia de endpoints, errores, autenticaciones fallidas
3. Crear dashboards de Grafana para visualización
4. Configurar alertas para anomalías (picos de errores 401/403, latencia alta)

#### 5.3.2 Implementar rate limiting y protección DoS
**Medidas ENS:** mp.s.4  
**Estado actual:** Sin protección contra denegación de servicio  
**Estado requerido:** Rate limiting por IP/usuario, circuit breakers  
**Complejidad:** Media  
**Pasos:**
1. Implementar filtro de rate limiting (bucket4j o Spring Cloud Gateway)
2. Configurar límites: 100 req/min por IP para endpoints públicos
3. Añadir circuit breaker con Resilience4j para servicios externos

#### 5.3.3 Generar SBOM (Software Bill of Materials)
**Medidas ENS:** op.exp.1  
**Estado actual:** Sin inventario formal de componentes software  
**Estado requerido:** SBOM en formato CycloneDX o SPDX  
**Complejidad:** Baja  
**Pasos:**
1. Añadir plugin CycloneDX Maven:
   ```xml
   <plugin>
       <groupId>org.cyclonedx</groupId>
       <artifactId>cyclonedx-maven-plugin</artifactId>
       <version>2.7.11</version>
   </plugin>
   ```
2. Generar SBOM en cada build y almacenar como artefacto de CI

#### 5.3.4 Implementar copias de seguridad automatizadas
**Medidas ENS:** mp.info.7  
**Estado actual:** Sin estrategia de backup  
**Estado requerido:** Backups automatizados con política de retención y pruebas de restauración  
**Complejidad:** Media  
**Pasos:**
1. Documentar estrategia de backup (RPO, RTO)
2. Configurar backups automatizados de base de datos (pg_dump/mysqldump con cron o servicio cloud)
3. Definir política de retención (diario: 7 días, semanal: 4 semanas, mensual: 12 meses)
4. Automatizar pruebas de restauración periódicas

#### 5.3.5 Crear procedimiento de gestión de incidentes
**Medidas ENS:** op.exp.7, op.exp.9  
**Estado actual:** Sin procedimiento de respuesta a incidentes  
**Estado requerido:** Playbook documentado, templates de incidentes, canal de comunicación  
**Complejidad:** Baja  
**Pasos:**
1. Crear `.github/ISSUE_TEMPLATE/security-incident.md` con campos requeridos
2. Documentar procedimiento de respuesta en `docs/incident-response.md`:
   - Clasificación del incidente (crítico, alto, medio, bajo)
   - Cadena de comunicación
   - Pasos de contención, erradicación, recuperación
   - Lecciones aprendidas (post-mortem)
3. Configurar alertas en GitHub Security Advisories

---

### 🟢 Prioridad BAJA — Mejora continua

#### 5.4.1 Documentar arquitectura de seguridad
**Medidas ENS:** op.pl.2  
**Pasos:** Crear diagrama de arquitectura con capas de seguridad, flujos de datos y puntos de cifrado.

#### 5.4.2 Configurar detección de intrusión (para MEDIA/ALTA)
**Medidas ENS:** op.mon.1, op.mon.3  
**Pasos:** Integrar WAF (ModSecurity, AWS WAF) y SIEM para vigilancia continua.

#### 5.4.3 Implementar plan de continuidad (para MEDIA/ALTA)
**Medidas ENS:** op.cont.1, op.cont.2, op.cont.3, op.cont.4  
**Pasos:** Crear BIA, definir RTO/RPO, configurar despliegue multi-región con failover automático.

#### 5.4.4 Firma electrónica y sellos de tiempo cualificados (para MEDIA/ALTA)
**Medidas ENS:** mp.info.4, mp.info.5  
**Pasos:** Integrar proveedor de firma electrónica cualificada y servicio TSA (Time Stamping Authority).

#### 5.4.5 Verificación de cadena de suministro (para MEDIA/ALTA)
**Medidas ENS:** op.ext.3  
**Pasos:** Implementar signed commits (GPG), verificación de firmas de artefactos Maven, SLSA framework.

---

## 6. Resumen de Medidas — Conteo Global

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ CUMPLE | 1 | 1.4% |
| ⚠️ PARCIAL | 12 | 16.4% |
| ❌ NO CUMPLE | 42 | 57.5% |
| ℹ️ NO APLICA (código) | 18 | 24.7% |
| **Total** | **73** | **100%** |

---

## 7. Roadmap Visual por Categoría

### Para alcanzar categoría BÁSICA (objetivo mínimo):
```
Sprint 1 (Crítico):
  ├── 🔴 Implementar Spring Security (autenticación básica + CSRF)
  ├── 🔴 Configurar HTTPS/TLS
  └── 🔴 Cabeceras de seguridad HTTP

Sprint 2 (Alto):
  ├── 🟠 Logging de auditoría con timestamps
  ├── 🟠 SECURITY.md + política de seguridad
  ├── 🟠 SAST en CI/CD (SpotBugs + Find Security Bugs)
  └── 🟠 Deshabilitar jpa.showSql en producción

Sprint 3 (Medio):
  ├── 🟡 Rate limiting básico
  ├── 🟡 SBOM con CycloneDX
  └── 🟡 Procedimiento de incidentes
```

### Para alcanzar categoría MEDIA (adicional a BÁSICA):
```
Sprint 4-5:
  ├── Análisis de riesgos formal (MAGERIT/PILAR) [op.pl.1 +R1]
  ├── MFA para usuarios [op.acc.5/6 +R5]
  ├── Segregación de funciones y roles [op.acc.3]
  ├── Logging centralizado (ELK) con traceId [op.exp.8 +R1+R2]
  ├── Detección de intrusión (WAF) [op.mon.1]
  ├── Plan de continuidad [op.cont.2]
  └── Cifrado en reposo [mp.info.3 +R1]
```

### Para alcanzar categoría ALTA (adicional a MEDIA):
```
Sprint 6-8:
  ├── Análisis de riesgos cuantitativo [op.pl.1 +R2]
  ├── Arquitectura de seguridad documentada + SGSI [op.pl.2 +R1+R2+R3]
  ├── Componentes criptográficos certificados [op.pl.5]
  ├── Respuesta automatizada a incidentes [op.exp.7 +R3]
  ├── SIEM + vigilancia 24/7 [op.mon.3 +R1]
  ├── Medios alternativos / failover [op.cont.4]
  ├── Cifrado con módulos certificados [mp.info.3 +R2]
  └── Firma electrónica cualificada [mp.info.4 +R2+R3]
```

---

## 8. Referencias

- [Real Decreto 311/2022 — ENS](https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191)
- [Guías CCN-STIC](https://www.ccn-cert.cni.es/guias/guias-series-ccn-stic.html)
- [MAGERIT v3 — Metodología de Análisis de Riesgos](https://administracionelectronica.gob.es/pae_Home/pae_Documentacion/pae_Metodolog/pae_Magerit.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)

---

> ⚠️ **Nota importante:** Este análisis evalúa exclusivamente lo verificable desde el código fuente y la configuración del repositorio. Las medidas de protección física (mp.if.*), gestión del personal (mp.per.*), protección de equipos (mp.eq.*) y aspectos organizacionales requieren una auditoría presencial complementaria. La puntuación final de cumplimiento ENS solo puede determinarse combinando este análisis técnico con la auditoría organizacional y física.

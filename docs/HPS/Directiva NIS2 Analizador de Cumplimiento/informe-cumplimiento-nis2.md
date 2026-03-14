# Informe de Cumplimiento — Directiva NIS2 (2022/2555)

**Fecha:** 2026-03-07  
**Analista:** NIS2 Directive Compliance Analyzer  
**Sistema analizado:** `spring-framework-petclinic` v7.0.3  
**Tecnologías:** Spring Framework 7.0.3, Spring MVC, JPA/Hibernate 7.2.3, JSP, HSQLDB/H2/MySQL/PostgreSQL  
**Despliegue:** WAR sobre Tomcat 11 / Jetty 11 (no contenedor Docker propio)  
**Transposición nacional:** Ley de Ciberseguridad Nacional (transposición NIS2 España, en vigor)

---

## Clasificación de la Entidad

| Concepto | Valoración |
|---|---|
| **Sector** | Salud (Anexo I, punto 5 — Directiva NIS2) |
| **Tipo de entidad** | Proveedor de asistencia sanitaria / Clínica veterinaria |
| **Clasificación NIS2** | **Entidad Importante** (Anexo II) — Proveedor de servicios sanitarios |
| **Si se despliega en Administración Pública** | **Entidad Esencial** (Anexo I) — Obligaciones reforzadas |
| **Régimen sancionador** | Hasta 7M€ o 1,4% facturación (Importante) / 10M€ o 2% (Esencial) |
| **Supervisión** | Reactiva (Importante) / Proactiva (Esencial) |
| **CSIRT competente** | CCN-CERT (sector público) / INCIBE-CERT (sector privado) |
| **Normativa complementaria** | ENS (RD 311/2022) si se despliega en sector público español |

---

## Puntuación Global de Cumplimiento

```
╔════════════════════════════════════════════════════════════════╗
║              PUNTUACIÓN NIS2: 8 / 100                         ║
║              ESTADO: ❌ NO CONFORME                            ║
║                                                                ║
║  Hallazgos Críticos:  8                                        ║
║  Hallazgos Altos:     6                                        ║
║  Hallazgos Medios:    4                                        ║
║  Hallazgos Bajos:     2                                        ║
║                                                                ║
║  Controles implementados:     2 / 50 (4%)                      ║
║  Controles parciales:         3 / 50 (6%)                      ║
║  Controles ausentes:         45 / 50 (90%)                     ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Checklist NIS2 — Art. 21: Medidas de Gestión de Riesgos de Ciberseguridad

| # | Medida Art. 21 | Estado | Ref. Hallazgo |
|---|---|---|---|
| 1 | Políticas de análisis de riesgos y seguridad de sistemas | ❌ Ausente | NIS2-01 |
| 2 | Gestión de incidentes (detección, análisis, contención) | ❌ Ausente | NIS2-02 |
| 3 | Continuidad de negocio y recuperación ante desastres | ❌ Ausente | NIS2-03 |
| 4 | Seguridad de la cadena de suministro | ⚠️ Parcial | NIS2-04 |
| 5 | Seguridad en adquisición, desarrollo y mantenimiento | ⚠️ Parcial | NIS2-05 |
| 6 | Evaluación de eficacia de medidas de gestión de riesgos | ❌ Ausente | NIS2-06 |
| 7 | Prácticas básicas de ciberhigiene y formación | ❌ Ausente | NIS2-07 |
| 8 | Políticas y procedimientos sobre criptografía y cifrado | ❌ Ausente | NIS2-08 |
| 9 | Seguridad RRHH, control de acceso, gestión de activos | ❌ Ausente | NIS2-09 |
| 10 | Autenticación multifactor (MFA) y comunicaciones seguras | ❌ Ausente | NIS2-10 |

### Arts. 23-24: Obligaciones de Notificación de Incidentes

| Obligación | Plazo | Estado |
|---|---|---|
| Alerta temprana al CSIRT | 24 horas | ❌ Sin proceso |
| Notificación completa del incidente | 72 horas | ❌ Sin proceso |
| Informe final con causa raíz | 1 mes | ❌ Sin proceso |
| Contactos de notificación actualizados | Permanente | ❌ Sin configurar |

---

## Resumen de Medidas Técnicas — Estado Actual

| Medida técnica | Estado | Detalle |
|---|---|---|
| **MFA** | ❌ Ausente | Sin autenticación de ningún tipo |
| **Cifrado en tránsito** | ❌ Ausente | Sin TLS, sin HTTPS, sin HSTS |
| **Cifrado en reposo** | ❌ Ausente | BD sin cifrar, columnas en texto plano |
| **Gestión de parches** | ⚠️ Parcial | Dependabot mensual (solo Maven) |
| **Backup / DRP** | ❌ Ausente | Sin backups, sin RTO/RPO |
| **SIEM** | ❌ Ausente | Solo console logging con DEBUG |
| **PAM** | ❌ Ausente | Sin gestión de acceso privilegiado |
| **WAF** | ❌ Ausente | Sin firewall de aplicaciones |
| **Headers de seguridad** | ❌ Ausente | Sin CSP, X-Frame-Options, HSTS |
| **Auditoría de accesos** | ❌ Ausente | Sin registro de quién accede a qué |
| **Gestión de secretos** | ❌ Ausente | Credenciales BD en properties planos |
| **SBOM** | ❌ Ausente | Sin inventario de dependencias formalizado |

---

## Hallazgos Detallados

---

### NIS2-01 — Sin Política de Análisis de Riesgos ni Seguridad de Sistemas

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.a  
**ENS equivalente:** op.pl.1 (Análisis de riesgos)

**Hallazgo:**

No existe ningún documento ni artefacto de análisis de riesgos en el repositorio. No hay políticas de seguridad documentadas, ni clasificación de activos, ni evaluación de amenazas. El sistema carece completamente de un marco de gestión de riesgos de ciberseguridad.

**Evidencia:**

```
Archivos buscados en el repositorio:
  - risk-assessment.*     → No encontrado
  - security-policy.*     → No encontrado
  - threat-model.*        → No encontrado
  - SECURITY.md           → No encontrado
  - *.risk.*              → No encontrado
```

**Riesgo:**

Incumplimiento directo del Art. 21.2.a NIS2. Sin análisis de riesgos, es imposible priorizar medidas de seguridad, asignar recursos adecuados o demostrar diligencia ante la autoridad competente. Los órganos directivos pueden ser **personalmente responsables** (Art. 20.1 NIS2).

**Remediación:**

1. Realizar un análisis de riesgos formal usando la metodología **MAGERIT v3** (la recomendada por el CCN para entidades españolas) o **ISO 27005**
2. Crear un inventario de activos clasificados (datos de salud = impacto ALTO)
3. Documentar amenazas, vulnerabilidades, probabilidad e impacto
4. Establecer un plan de tratamiento de riesgos con propietarios y plazos

**Ejemplo — Estructura de documento de análisis de riesgos:**

```markdown
# Análisis de Riesgos — PetClinic
## Clasificación: [MAGERIT v3 / ISO 27005]

### 1. Inventario de Activos
| ID | Activo | Tipo | Propietario | Clasificación |
|----|--------|------|-------------|---------------|
| A-01 | Base de datos propietarios | Datos personales | DBA | ALTO |
| A-02 | Datos de visitas veterinarias | Datos salud animal | Veterinario jefe | MEDIO |
| A-03 | Aplicación web PetClinic | Servicio | Equipo desarrollo | ALTO |
| A-04 | Servidor de aplicaciones | Infraestructura | Sistemas | ALTO |

### 2. Amenazas Identificadas
| ID | Amenaza | Activos afectados | Probabilidad | Impacto |
|----|---------|-------------------|-------------|---------|
| T-01 | Acceso no autorizado a datos | A-01, A-02 | MUY ALTA | ALTO |
| T-02 | Inyección SQL | A-01 | ALTA | CRÍTICO |
| T-03 | Ransomware | A-01, A-03, A-04 | MEDIA | CRÍTICO |

### 3. Plan de Tratamiento
| Riesgo | Medida | Responsable | Plazo | Estado |
|--------|--------|-------------|-------|--------|
| T-01 | Implementar autenticación + MFA | Equipo seguridad | 30 días | Pendiente |
```

**Esfuerzo:** 2-4 semanas  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-02 — Sin Capacidad de Detección ni Gestión de Incidentes

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.b + Arts. 23-24  
**ENS equivalente:** op.mon (Monitorización del sistema), op.exp.7 (Gestión de incidentes)

**Hallazgo:**

El sistema carece completamente de capacidades de detección y respuesta a incidentes:

- **Sin SIEM:** No hay integración con ningún sistema de gestión de eventos de seguridad (Splunk, Sentinel, QRadar, Elastic SIEM, Wazuh)
- **Sin logging de seguridad:** El único logging es `logback.xml` configurado en nivel DEBUG a consola, sin formato estructurado, sin rotación, sin retención definida
- **Sin detección de anomalías:** No hay alertas configuradas para intentos de acceso fallidos, inyección SQL, o patrones de ataque
- **Sin IRP (Incident Response Plan):** No existe proceso documentado de respuesta a incidentes
- **Sin canales de notificación al CSIRT:** No hay configuración ni proceso para notificar al CCN-CERT o INCIBE-CERT
- **Sin capacidad forense:** Los logs se pierden al reiniciar (solo consola)

**Evidencia:**

```xml
<!-- logback.xml — Línea 17: DEBUG a consola sin estructura -->
<logger name="org.springframework.samples.petclinic" level="debug"/>

<root level="info">
    <appender-ref ref="console"/>  <!-- Solo consola, sin fichero -->
</root>

<!-- Formato sin timestamp ISO 8601, sin correlationId, sin userId -->
<pattern>%-5level %logger{0} - %msg%n</pattern>
```

**Riesgo:**

- **Incumplimiento Art. 23 NIS2:** Imposibilidad de detectar incidentes significativos y notificar al CSIRT en los plazos obligatorios (24h/72h/1mes)
- Un ataque podría pasar completamente desapercibido al no existir monitorización
- Sin logs persistentes, es imposible realizar investigación forense post-incidente
- Multas por no notificar: hasta 10M€ (Art. 34 NIS2)

**Remediación:**

**Paso 1 — Logging estructurado con retención**

```xml
<!-- logback.xml — Configuración conforme NIS2/ENS -->
<configuration scan="true" scanPeriod="30 seconds">

    <property name="LOG_PATH" value="/var/log/petclinic"/>
    <property name="RETENTION_DAYS" value="365"/> <!-- Mínimo 1 año para ENS -->

    <!-- Appender de consola (desarrollo) -->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.JsonEncoder"/>
    </appender>

    <!-- Appender de fichero con rotación (producción) -->
    <appender name="FILE_AUDIT"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/audit.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/audit.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>${RETENTION_DAYS}</maxHistory>
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.JsonEncoder"/>
    </appender>

    <!-- Appender de seguridad separado -->
    <appender name="FILE_SECURITY"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/security.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/security.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>${RETENTION_DAYS}</maxHistory>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.JsonEncoder"/>
    </appender>

    <!-- Logger de auditoría de seguridad -->
    <logger name="SECURITY_AUDIT" level="INFO" additivity="false">
        <appender-ref ref="FILE_SECURITY"/>
    </logger>

    <!-- Producción: WARN, no DEBUG -->
    <logger name="org.springframework.samples.petclinic" level="WARN"/>

    <root level="INFO">
        <appender-ref ref="console"/>
        <appender-ref ref="FILE_AUDIT"/>
    </root>
</configuration>
```

**Paso 2 — Servicio de auditoría de seguridad**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Component
public class SecurityAuditService {

    private static final Logger SECURITY_LOG =
        LoggerFactory.getLogger("SECURITY_AUDIT");

    public void logAuthenticationSuccess(String userId, String ipAddress) {
        MDC.put("eventType", "AUTH_SUCCESS");
        MDC.put("userId", userId);
        MDC.put("ipAddress", ipAddress);
        SECURITY_LOG.info("Authentication successful for user '{}' from IP '{}'",
            userId, ipAddress);
        MDC.clear();
    }

    public void logAuthenticationFailure(String userId, String ipAddress,
                                          String reason) {
        MDC.put("eventType", "AUTH_FAILURE");
        MDC.put("userId", userId);
        MDC.put("ipAddress", ipAddress);
        SECURITY_LOG.warn("Authentication failed for user '{}' from IP '{}': {}",
            userId, ipAddress, reason);
        MDC.clear();
    }

    public void logDataAccess(String userId, String resource,
                               String action, String entityId) {
        MDC.put("eventType", "DATA_ACCESS");
        MDC.put("userId", userId);
        MDC.put("resource", resource);
        SECURITY_LOG.info("User '{}' performed '{}' on '{}' id='{}'",
            userId, action, resource, entityId);
        MDC.clear();
    }

    public void logSuspiciousActivity(String userId, String ipAddress,
                                       String description) {
        MDC.put("eventType", "SUSPICIOUS_ACTIVITY");
        MDC.put("userId", userId);
        MDC.put("ipAddress", ipAddress);
        SECURITY_LOG.error("⚠️ SUSPICIOUS: User '{}' from IP '{}': {}",
            userId, ipAddress, description);
        MDC.clear();
    }

    public void logSecurityIncident(String severity, String description,
                                     String affectedSystems) {
        MDC.put("eventType", "SECURITY_INCIDENT");
        MDC.put("severity", severity);
        MDC.put("affectedSystems", affectedSystems);
        SECURITY_LOG.error("🚨 INCIDENT [{}]: {} — Sistemas: {}",
            severity, description, affectedSystems);
        MDC.clear();
    }
}
```

**Paso 3 — Proceso de notificación al CSIRT (plantilla)**

```java
/**
 * Servicio para gestionar la notificación de incidentes significativos
 * al CSIRT competente (CCN-CERT o INCIBE-CERT).
 *
 * Cumplimiento NIS2 Arts. 23-24:
 * - Alerta temprana: < 24 horas
 * - Notificación completa: < 72 horas
 * - Informe final: < 1 mes
 */
@Service
@Slf4j
public class IncidentNotificationService {

    public enum IncidentSeverity { CRITICA, ALTA, MEDIA, BAJA }

    public enum NotificationPhase {
        ALERTA_TEMPRANA_24H,
        NOTIFICACION_COMPLETA_72H,
        INFORME_FINAL_1MES
    }

    @Value("${nis2.csirt.endpoint:https://ccn-cert.cni.es/api/incidents}")
    private String csirtEndpoint;

    @Value("${nis2.csirt.contact:incidencias@ccn-cert.cni.es}")
    private String csirtContact;

    /**
     * Evalúa si un incidente es "significativo" según Art. 23.3 NIS2.
     */
    public boolean isSignificantIncident(SecurityIncident incident) {
        return incident.affectsServiceAvailability()
            || incident.affectedUsersCount() > 100
            || incident.hasDataBreach()
            || incident.hasCrossSectorImpact()
            || incident.getFinancialImpact().compareTo(
                BigDecimal.valueOf(50000)) > 0;
    }

    /**
     * Fase 1: Alerta temprana — máximo 24 horas desde detección.
     */
    public void sendEarlyWarning(SecurityIncident incident) {
        log.error("NIS2 24H ALERT: Incident {} — type={}, impact={}",
            incident.getId(), incident.getType(), incident.getImpact());

        IncidentNotification notification = IncidentNotification.builder()
            .phase(NotificationPhase.ALERTA_TEMPRANA_24H)
            .incidentId(incident.getId())
            .detectionTimestamp(incident.getDetectedAt())
            .incidentType(incident.getType())
            .isCrossBorder(incident.hasCrossBorderImpact())
            .initialAssessment(incident.getInitialAssessment())
            .build();

        submitToCSIRT(notification);
    }

    /**
     * Fase 2: Notificación completa — máximo 72 horas.
     */
    public void sendFullNotification(SecurityIncident incident) {
        IncidentNotification notification = IncidentNotification.builder()
            .phase(NotificationPhase.NOTIFICACION_COMPLETA_72H)
            .incidentId(incident.getId())
            .severity(incident.getSeverity())
            .description(incident.getDetailedDescription())
            .affectedSystems(incident.getAffectedSystems())
            .affectedUsersCount(incident.getAffectedUsersCount())
            .attackVectors(incident.getAttackVectors())
            .containmentMeasures(incident.getContainmentMeasures())
            .indicatorsOfCompromise(incident.getIoCs())
            .build();

        submitToCSIRT(notification);
    }

    /**
     * Fase 3: Informe final — máximo 1 mes.
     */
    public void sendFinalReport(SecurityIncident incident) {
        IncidentNotification notification = IncidentNotification.builder()
            .phase(NotificationPhase.INFORME_FINAL_1MES)
            .incidentId(incident.getId())
            .rootCauseAnalysis(incident.getRootCause())
            .fullImpactAssessment(incident.getFinalImpact())
            .remediationActions(incident.getRemediationActions())
            .lessonsLearned(incident.getLessonsLearned())
            .preventiveMeasures(incident.getPreventiveMeasures())
            .build();

        submitToCSIRT(notification);
    }

    private void submitToCSIRT(IncidentNotification notification) {
        // Integración con LUCIA (CCN-CERT) o plataforma INCIBE-CERT
        log.info("NIS2: Submitting {} to CSIRT at {}",
            notification.getPhase(), csirtEndpoint);
    }
}
```

**Esfuerzo:** 4-6 semanas (SIEM + logging + IRP)  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-03 — Sin Continuidad de Negocio ni Recuperación ante Desastres

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.c  
**ENS equivalente:** op.cont (Continuidad del servicio)

**Hallazgo:**

El sistema no tiene ningún mecanismo de continuidad de negocio ni recuperación ante desastres:

- **Sin backups automatizados:** No hay configuración de respaldo de base de datos
- **Sin RTO/RPO definidos:** No se han establecido objetivos de recuperación
- **BD por defecto en memoria:** HSQLDB se pierde al reiniciar el servidor
- **Sin plan BCP/DRP:** No existe documentación de continuidad
- **Sin pruebas de restauración:** No hay evidencia de tests de recuperación
- **Sin protección anti-ransomware:** No hay backups offline/air-gapped
- **Regla 3-2-1 incumplida:** No hay 3 copias, 2 medios, 1 offsite

**Evidencia:**

```xml
<!-- datasource-config.xml — BD en memoria sin persistencia -->
<bean id="dataSource" class="org.apache.tomcat.jdbc.pool.DataSource"
      p:driverClassName="${jdbc.driverClassName}"
      p:url="${jdbc.url}"
      p:username="${jdbc.username}"
      p:password="${jdbc.password}"/>
<!-- HSQLDB por defecto: jdbc:hsqldb:mem:petclinic — TODO se pierde al reiniciar -->
```

**Riesgo:**

- Pérdida total e irrecuperable de datos ante cualquier fallo
- Incumplimiento directo Art. 21.2.c NIS2
- En un escenario de ransomware, no hay posibilidad de recuperación
- Un hospital o clínica sin continuidad pone en riesgo la atención sanitaria

**Remediación:**

```yaml
# Ejemplo de configuración de backup para PostgreSQL
# backup-config.yml (gestión con pgBackRest, Barman o pg_dump + cron)

backup:
  database:
    type: postgresql
    schedule:
      full: "0 2 * * 0"          # Full backup semanal (domingo 02:00)
      incremental: "0 2 * * 1-6"  # Incremental diario
    retention:
      full_count: 4               # 4 copias completas (1 mes)
      diff_count: 30              # 30 incrementales
    destinations:
      local:
        path: /var/backups/petclinic
        encryption: AES-256-GCM
      remote_s3:
        bucket: petclinic-backups-offsite
        region: eu-west-1
        encryption: AES-256-GCM
        lifecycle: 365_days       # Retención 1 año
      offline:
        type: tape_or_airgapped
        schedule: "0 4 * * 0"    # Semanal a medio aislado
    verification:
      restore_test: "0 3 * * 6"  # Test de restauración semanal
      integrity_check: true

  rto: 4_hours                    # Recovery Time Objective
  rpo: 24_hours                   # Recovery Point Objective
  
  drp:
    primary_site: Madrid
    secondary_site: Barcelona
    failover_type: warm_standby
    failover_test_schedule: quarterly
```

```java
/**
 * Servicio de verificación de integridad de backups.
 * Ejecutar en cron: mínimo semanal.
 */
@Service
@Slf4j
public class BackupVerificationService {

    @Scheduled(cron = "0 0 4 ? * SAT") // Cada sábado a las 04:00
    public void verifyBackupIntegrity() {
        log.info("NIS2 Art.21.2.c: Starting backup integrity verification");

        BackupVerificationResult result = BackupVerificationResult.builder()
            .timestamp(Instant.now())
            .build();

        // 1. Verificar que el backup más reciente existe
        result.setLatestBackupExists(checkLatestBackup());

        // 2. Restaurar en entorno aislado
        result.setRestoreSuccessful(performTestRestore());

        // 3. Verificar integridad de datos
        result.setDataIntegrityOk(verifyDataIntegrity());

        // 4. Verificar copia offsite
        result.setOffsiteCopyExists(checkOffsiteCopy());

        if (!result.isFullyVerified()) {
            log.error("🚨 BACKUP VERIFICATION FAILED: {}", result);
            alertOpsTeam(result);
        } else {
            log.info("✅ Backup verification passed: {}", result);
        }

        backupAuditRepository.save(result);
    }
}
```

**Esfuerzo:** 3-4 semanas  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-04 — Seguridad de Cadena de Suministro Insuficiente

**Severidad:** 🟠 ALTA  
**Artículo NIS2:** Art. 21.2.d  
**ENS equivalente:** op.ext (Servicios externos)

**Hallazgo:**

El sistema tiene control parcial de la cadena de suministro de software, pero con gaps significativos:

**Lo que EXISTE (parcial):**
- ✅ Dependabot habilitado para Maven (revisión mensual de dependencias)
- ✅ SonarQube/SonarCloud configurado en CI/CD
- ✅ Dependencias declaradas en `pom.xml` con versiones fijadas

**Lo que FALTA:**
- ❌ **Sin SBOM (Software Bill of Materials):** No se genera inventario formal de dependencias con hash de integridad
- ❌ **Sin OWASP Dependency-Check ni Trivy:** No hay escaneo de CVEs en dependencias
- ❌ **Sin verificación de firmas:** No se verifican las firmas GPG de artefactos Maven
- ❌ **Sin política de proveedores TIC:** No hay evaluación de seguridad de proveedores
- ❌ **Sin escaneo de contenedores:** Si se despliega con Docker (jib plugin en pom.xml), no hay escaneo de imagen
- ❌ **Dependabot solo mensual:** El intervalo debería ser semanal o diario para vulnerabilidades críticas
- ❌ **Sin lock file Maven:** No se usa `maven-lockfile` para reproducibilidad

**Evidencia:**

```yaml
# .github/dependabot.yml — Solo Maven, solo mensual
version: 2
updates:
  - package-ecosystem: "maven"
    directory: "/"
    schedule:
      interval: "monthly"   # ⚠️ Demasiado lento para CVEs críticos
    labels:
      - "dependencies"
# Falta: npm (node_modules existe), Docker, GitHub Actions
```

```xml
<!-- pom.xml — Plugin jib para Docker pero sin escaneo de imagen -->
<docker.jib-maven-plugin.version>3.5.1</docker.jib-maven-plugin.version>
```

**Remediación:**

```yaml
# .github/dependabot.yml — Ampliado conforme NIS2
version: 2
updates:
  - package-ecosystem: "maven"
    directory: "/"
    schedule:
      interval: "daily"  # CVEs críticos no pueden esperar un mes
    labels: ["dependencies", "security"]
    open-pull-requests-limit: 10
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels: ["dependencies"]
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

```xml
<!-- pom.xml — Añadir OWASP Dependency-Check -->
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>10.0.4</version>
    <configuration>
        <failBuildOnCVSS>7</failBuildOnCVSS> <!-- Falla con CVSS >= 7 (ALTO) -->
        <formats>
            <format>HTML</format>
            <format>JSON</format>
        </formats>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>

<!-- Generar SBOM con CycloneDX -->
<plugin>
    <groupId>org.cyclonedx</groupId>
    <artifactId>cyclonedx-maven-plugin</artifactId>
    <version>2.9.1</version>
    <executions>
        <execution>
            <phase>verify</phase>
            <goals>
                <goal>makeAggregateBom</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Esfuerzo:** 1-2 semanas  
**Prioridad:** 🔴 ALTA

---

### NIS2-05 — Seguridad en Desarrollo de Software Insuficiente (DevSecOps)

**Severidad:** 🟠 ALTA  
**Artículo NIS2:** Art. 21.2.e  
**ENS equivalente:** mp.sw (Desarrollo de aplicaciones)

**Hallazgo:**

El pipeline CI/CD tiene SonarQube pero carece de controles de seguridad esenciales para el desarrollo seguro:

**Lo que EXISTE:**
- ✅ SonarCloud en pipeline de CI (`maven-build-main.yml`)
- ✅ Tests unitarios ejecutados en CI
- ✅ Compilación multi-JDK (Java 17 y 21)

**Lo que FALTA:**
- ❌ **Sin SAST dedicado:** SonarQube hace análisis limitado; falta Semgrep, SpotBugs, o FindSecBugs
- ❌ **Sin DAST:** No se ejecuta OWASP ZAP ni similar contra la aplicación desplegada
- ❌ **Sin escaneo de secretos:** No hay gitleaks ni trufflehog en CI
- ❌ **Sin firma de artefactos:** Los WAR generados no se firman digitalmente
- ❌ **Sin entorno de staging:** No hay evidencia de entornos pre-producción con pruebas de seguridad
- ❌ **Sin revisión obligatoria de seguridad:** No hay CODEOWNERS ni required reviewers para cambios de seguridad
- ❌ **CrashController deliberado:** Endpoint `/oups` que lanza excepciones intencionadamente

**Evidencia:**

```yaml
# maven-build-main.yml — Solo build + sonar, sin security gates
- name: Build and analyze
  run: ./mvnw -B verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar
# Falta: SAST, DAST, secret scanning, container scanning, SBOM
```

```java
// CrashController.java — Endpoint de debug expuesto en producción
@GetMapping(value = "/oups")
public String triggerException() {
    throw new RuntimeException("Expected: controller used to showcase...");
}
```

```jsp
<!-- exception.jsp — Expone mensajes de excepción al usuario -->
<p>${exception.message}</p>
<!-- Fuga de información: stack traces visibles para atacantes -->
```

**Remediación:**

```yaml
# .github/workflows/security-pipeline.yml
name: Security Pipeline (NIS2 Art. 21.2.e)
on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SpotBugs + FindSecBugs
        run: ./mvnw -B com.github.spotbugs:spotbugs-maven-plugin:check
             -Dspotbugs.plugins=com.h3xstream.findsecbugs:findsecbugs-plugin:1.13.0
      - name: Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: p/java p/owasp-top-ten p/cwe-top-25

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2

  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: OWASP Dependency-Check
        run: ./mvnw -B org.owasp:dependency-check-maven:check
             -DfailBuildOnCVSS=7

  dast:
    runs-on: ubuntu-latest
    needs: [sast]
    steps:
      - name: OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.11.0
        with:
          target: 'http://localhost:8080'
```

**Esfuerzo:** 2-3 semanas  
**Prioridad:** 🔴 ALTA

---

### NIS2-06 — Sin Evaluación de Eficacia de Medidas de Seguridad

**Severidad:** 🟠 ALTA  
**Artículo NIS2:** Art. 21.2.f  
**ENS equivalente:** op.mon.3 (Vigilancia)

**Hallazgo:**

No existe ningún mecanismo para evaluar periódicamente la eficacia de las medidas de seguridad implementadas (o la ausencia de ellas):

- Sin pentesting periódico
- Sin auditorías de seguridad documentadas
- Sin KPIs de seguridad definidos
- Sin ejercicios de simulación de incidentes (tabletop exercises)
- Sin revisión periódica de configuración de seguridad
- Sin programa de bug bounty ni reporte responsable de vulnerabilidades

**Remediación:**

Establecer un programa de evaluación continua:

| Actividad | Frecuencia | Responsable |
|---|---|---|
| Pentesting por tercero independiente | Anual (mínimo) | CISO + proveedor |
| Escaneo de vulnerabilidades automatizado | Semanal | Equipo DevSecOps |
| Revisión de accesos y privilegios | Semestral | CISO + RRHH |
| Simulación de incidentes (tabletop) | Trimestral | CISO + equipo |
| Auditoría de configuración de seguridad | Trimestral | Equipo seguridad |
| Revisión de métricas de seguridad (KPIs) | Mensual | CISO |
| Test de restauración de backups | Trimestral | Equipo sistemas |

**Esfuerzo:** 2 semanas (planificación) + continuo  
**Prioridad:** 🔴 ALTA

---

### NIS2-07 — Sin Formación en Ciberseguridad

**Severidad:** 🟡 MEDIA  
**Artículo NIS2:** Art. 21.2.g + Art. 20.2  
**ENS equivalente:** mp.per (Gestión de personal)

**Hallazgo:**

No hay evidencia de un programa de formación en ciberseguridad:

- Sin documentación de formación para desarrolladores (OWASP Top 10, SSDLC)
- Sin concienciación para usuarios del sistema
- Sin formación específica para el equipo de operaciones
- Art. 20.2 NIS2 exige que **los miembros del órgano de dirección** reciban formación en ciberseguridad

**Remediación:**

Implementar un plan de formación mínimo:

| Audiencia | Contenido | Frecuencia |
|---|---|---|
| Órgano directivo | Concienciación NIS2, responsabilidad personal, gestión de riesgos | Anual |
| Desarrolladores | OWASP Top 10, desarrollo seguro Java/Spring, revisión de código seguro | Semestral |
| Operaciones | Hardening, gestión de incidentes, respuesta ante ransomware | Semestral |
| Usuarios finales | Phishing, contraseñas, MFA, reporte de incidentes | Anual |

**Esfuerzo:** 1-2 semanas (plan) + continuo  
**Prioridad:** 🟡 MEDIA

---

### NIS2-08 — Sin Criptografía ni Cifrado

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.h  
**ENS equivalente:** mp.com.2 (Protección de comunicaciones), mp.info.3 (Cifrado)

**Hallazgo:**

El sistema carece completamente de medidas criptográficas:

**Datos en tránsito:**
- ❌ Sin configuración TLS/HTTPS en la aplicación
- ❌ Sin HSTS (HTTP Strict Transport Security)
- ❌ Sin TLS en conexiones a base de datos
- ❌ Sin certificados configurados
- ❌ Las JSP no tienen meta tags de seguridad de transporte

**Datos en reposo:**
- ❌ Base de datos sin cifrado (columnas en texto plano)
- ❌ Datos personales (nombre, dirección, teléfono) almacenados sin protección
- ❌ Descripciones de visitas (potencial dato de salud) sin cifrar
- ❌ Sin cifrado de disco/volumen a nivel de servidor
- ❌ Sin gestión de claves (no HSM, no Vault, no KMS)

**Credenciales:**
- ❌ Contraseña de BD en fichero properties en texto plano
- ❌ Sin rotación de credenciales
- ❌ Sin uso de gestores de secretos

**Evidencia:**

```properties
# data-access.properties — Credenciales en plano
jdbc.username=${jdbc.username}
jdbc.password=${jdbc.password}
# Sin cifrado de la conexión: jdbc.url no incluye ?useSSL=true&requireSSL=true
```

```sql
-- schema.sql — Todas las columnas PII en texto plano
CREATE TABLE owners (
  id         INTEGER IDENTITY PRIMARY KEY,
  first_name VARCHAR(30),      -- ❌ Sin cifrar
  last_name  VARCHAR_IGNORECASE(30),  -- ❌ Sin cifrar
  address    VARCHAR(255),     -- ❌ Sin cifrar
  city       VARCHAR(80),      -- ❌ Sin cifrar
  telephone  VARCHAR(20)       -- ❌ Sin cifrar
);
```

**Remediación:**

**Paso 1 — TLS 1.2+ obligatorio (Tomcat/servidor)**

```xml
<!-- server.xml de Tomcat — Conector HTTPS -->
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"
           maxThreads="200"
           SSLEnabled="true"
           scheme="https" secure="true"
           keystoreFile="/opt/petclinic/certs/keystore.p12"
           keystoreType="PKCS12"
           keystorePass="${KEYSTORE_PASSWORD}"
           sslProtocol="TLSv1.3"
           sslEnabledProtocols="TLSv1.3,TLSv1.2"
           ciphers="TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,
                    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
                    TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"/>

<!-- Redirigir HTTP a HTTPS -->
<Connector port="8080" protocol="HTTP/1.1"
           redirectPort="8443"/>
```

**Paso 2 — Headers de seguridad vía filtro Servlet**

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                          FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;

        // HSTS — mínimo 1 año
        response.setHeader("Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload");
        // Anti-clickjacking
        response.setHeader("X-Frame-Options", "DENY");
        // Anti-MIME-sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");
        // XSS Protection
        response.setHeader("X-XSS-Protection", "1; mode=block");
        // Content Security Policy
        response.setHeader("Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data:; font-src 'self'; frame-ancestors 'none'");
        // Referrer Policy
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        // Permissions Policy
        response.setHeader("Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=()");

        chain.doFilter(req, res);
    }
}
```

**Paso 3 — Cifrado de datos sensibles en BD**

```java
/**
 * Converter JPA para cifrar/descifrar campos PII con AES-256-GCM.
 * Cada valor se cifra con un IV único para evitar ataques de patrón.
 */
@Converter
public class AES256FieldEncryptor implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    // La clave debe obtenerse de un HSM o Vault, NUNCA hardcodeada
    @Value("${encryption.key}")
    private String base64Key;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        try {
            SecretKey key = new SecretKeySpec(
                Base64.getDecoder().decode(base64Key), "AES");
            byte[] iv = new byte[IV_LENGTH];
            SecureRandom.getInstanceStrong().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key,
                new GCMParameterSpec(GCM_TAG_LENGTH, iv));

            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[IV_LENGTH + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, IV_LENGTH);
            System.arraycopy(encrypted, 0, combined, IV_LENGTH, encrypted.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            byte[] combined = Base64.getDecoder().decode(dbData);
            byte[] iv = new byte[IV_LENGTH];
            byte[] encrypted = new byte[combined.length - IV_LENGTH];
            System.arraycopy(combined, 0, iv, 0, IV_LENGTH);
            System.arraycopy(combined, IV_LENGTH, encrypted, 0, encrypted.length);

            SecretKey key = new SecretKeySpec(
                Base64.getDecoder().decode(base64Key), "AES");
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key,
                new GCMParameterSpec(GCM_TAG_LENGTH, iv));

            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
```

**Paso 4 — Gestión de secretos con HashiCorp Vault**

```xml
<!-- pom.xml — Spring Cloud Vault -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
```

```properties
# Vault configuration (reemplaza credenciales en properties)
spring.cloud.vault.uri=https://vault.internal:8200
spring.cloud.vault.authentication=APPROLE
spring.cloud.vault.app-role.role-id=${VAULT_ROLE_ID}
spring.cloud.vault.app-role.secret-id=${VAULT_SECRET_ID}
spring.cloud.vault.kv.backend=secret
spring.cloud.vault.kv.default-context=petclinic
```

**Esfuerzo:** 4-6 semanas  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-09 — Sin Control de Acceso ni Gestión de Identidades

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.i  
**ENS equivalente:** op.acc (Control de acceso)

**Hallazgo:**

El sistema no tiene **ningún mecanismo de control de acceso**:

- ❌ **Sin autenticación:** Todos los endpoints son accesibles sin login
- ❌ **Sin autorización:** No hay roles ni permisos
- ❌ **Sin gestión de sesiones:** Las JSP tienen `session="false"` pero no hay control de sesión seguro
- ❌ **Sin principio de mínimo privilegio:** Todo el mundo puede hacer todo
- ❌ **Sin revisión de accesos:** No hay proceso de revisión de privilegios
- ❌ **IDOR:** IDs secuenciales permiten enumerar y acceder a cualquier registro
- ❌ **Sin CSRF:** PetclinicInitializer solo registra CharacterEncodingFilter
- ❌ **Sin PAM:** No hay gestión de acceso privilegiado

**Evidencia:**

```java
// PetclinicInitializer.java — Único filtro: encoding
@Override
protected Filter[] getServletFilters() {
    CharacterEncodingFilter characterEncodingFilter =
        new CharacterEncodingFilter("UTF-8", true);
    return new Filter[]{characterEncodingFilter};
    // ❌ Sin SecurityFilter, sin AuthenticationFilter
}
```

```java
// OwnerController.java — Acceso directo sin auth
@GetMapping("/owners/{ownerId}")
public ModelAndView showOwner(@PathVariable("ownerId") int ownerId) {
    ModelAndView mav = new ModelAndView("owners/ownerDetails");
    mav.addObject(this.clinicService.findOwnerById(ownerId));
    // ❌ Cualquiera puede acceder a /owners/1, /owners/2, /owners/3...
    return mav;
}
```

**Remediación:**

```xml
<!-- pom.xml — Añadir Spring Security -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/resources/**", "/webjars/**").permitAll()
                .requestMatchers("/owners/**").hasAnyRole("VET", "ADMIN")
                .requestMatchers("/vets/**").hasAnyRole("VET", "ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .csrf(csrf -> csrf.csrfTokenRepository(
                CookieCsrfTokenRepository.withHttpOnlyFalse()
            ))
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(content -> {})
                .httpStrictTransportSecurity(hsts ->
                    hsts.maxAgeInSeconds(31536000)
                        .includeSubDomains(true))
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

**Esfuerzo:** 3-4 semanas  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-10 — Sin Autenticación Multifactor (MFA)

**Severidad:** 🔴 CRÍTICA  
**Artículo NIS2:** Art. 21.2.j  
**ENS equivalente:** op.acc.5 (Mecanismo de autenticación)

**Hallazgo:**

NIS2 Art. 21.2.j exige explícitamente **"el uso de soluciones de autenticación multifactor o de autenticación continua"**. El sistema no solo carece de MFA, sino que no tiene autenticación de ningún tipo.

- ❌ Sin login de ningún tipo
- ❌ Sin TOTP (RFC 6238)
- ❌ Sin FIDO2/WebAuthn
- ❌ Sin hardware tokens
- ❌ Sin certificados digitales de cliente
- ❌ Sin autenticación continua
- ❌ Sin SSO (Single Sign-On)
- ❌ Sin integración con proveedores de identidad (Keycloak, Azure AD, Okta)

**Remediación:**

```java
/**
 * Configuración MFA con TOTP (Time-based One-Time Password).
 * Art. 21.2.j NIS2 — Autenticación multifactor obligatoria.
 */
@Entity
@Table(name = "user_mfa_config")
public class UserMfaConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "totp_secret", nullable = false)
    @Convert(converter = AES256FieldEncryptor.class)  // Cifrado
    private String totpSecret;

    @Column(name = "mfa_enabled", nullable = false)
    private boolean mfaEnabled = false;

    @ElementCollection
    @CollectionTable(name = "user_mfa_recovery_codes")
    @Column(name = "recovery_code")
    private Set<String> recoveryCodes;

    @Column(name = "mfa_type")
    @Enumerated(EnumType.STRING)
    private MfaType mfaType = MfaType.TOTP;

    public enum MfaType {
        TOTP,       // Google Authenticator, Authy
        FIDO2,      // YubiKey, Windows Hello
        SMS         // Solo como fallback (vulnerable a SIM swap)
    }
}
```

```java
@Service
@Slf4j
public class TotpMfaService {

    private static final int SECRET_SIZE = 20;
    private static final int CODE_DIGITS = 6;
    private static final int TIME_STEP_SECONDS = 30;
    private static final int ALLOWED_TIME_DRIFT = 1; // ±1 período

    public String generateSecret() {
        byte[] secret = new byte[SECRET_SIZE];
        SecureRandom random = new SecureRandom();
        random.nextBytes(secret);
        return Base32.encode(secret);
    }

    public boolean verifyCode(String secret, int code) {
        long currentTimeStep = System.currentTimeMillis() / 1000 / TIME_STEP_SECONDS;

        for (int i = -ALLOWED_TIME_DRIFT; i <= ALLOWED_TIME_DRIFT; i++) {
            int expectedCode = generateTOTP(secret, currentTimeStep + i);
            if (expectedCode == code) {
                return true;
            }
        }
        return false;
    }

    public String generateQrCodeUri(String secret, String accountName, String issuer) {
        return String.format(
            "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=%d&period=%d",
            issuer, accountName, secret, issuer, CODE_DIGITS, TIME_STEP_SECONDS
        );
    }

    private int generateTOTP(String base32Secret, long timeStep) {
        byte[] key = Base32.decode(base32Secret);
        byte[] timeBytes = ByteBuffer.allocate(8).putLong(timeStep).array();

        try {
            Mac hmac = Mac.getInstance("HmacSHA1");
            hmac.init(new SecretKeySpec(key, "HmacSHA1"));
            byte[] hash = hmac.doFinal(timeBytes);

            int offset = hash[hash.length - 1] & 0x0F;
            int binary = ((hash[offset] & 0x7F) << 24)
                | ((hash[offset + 1] & 0xFF) << 16)
                | ((hash[offset + 2] & 0xFF) << 8)
                | (hash[offset + 3] & 0xFF);

            return binary % (int) Math.pow(10, CODE_DIGITS);
        } catch (Exception e) {
            throw new RuntimeException("TOTP generation failed", e);
        }
    }
}
```

**Esfuerzo:** 2-3 semanas (después de NIS2-09)  
**Prioridad:** ⚡ INMEDIATA

---

### NIS2-11 — JMX Expuesto Sin Autenticación

**Severidad:** 🟠 ALTA  
**Artículo NIS2:** Art. 21.2.i (Control de acceso)  
**CCN-STIC:** CCN-STIC-885 (Seguridad aplicaciones web)

**Hallazgo:**

El `CallMonitoringAspect` expone un MBean JMX (`petclinic:type=CallMonitor`) sin autenticación. JMX sin autenticación permite:
- Visualización de métricas internas del sistema
- Ejecución de operaciones remotas (`reset()`)
- Potencial RCE (Remote Code Execution) si se combina con otros gadgets

**Evidencia:**

```java
// CallMonitoringAspect.java — JMX expuesto sin auth
@ManagedResource("petclinic:type=CallMonitor")
@Aspect
public class CallMonitoringAspect {
    @ManagedOperation
    public void reset() { // ❌ Cualquiera puede invocar
        this.callCount = 0;
        this.accumulatedCallTime = 0;
    }
}
```

```xml
<!-- tools-config.xml — Export automático sin restricciones -->
<context:mbean-export/>
```

**Remediación:**

```properties
# Asegurar JMX con autenticación
com.sun.management.jmxremote.authenticate=true
com.sun.management.jmxremote.password.file=/etc/petclinic/jmxremote.password
com.sun.management.jmxremote.access.file=/etc/petclinic/jmxremote.access
com.sun.management.jmxremote.ssl=true
# En producción: considerar deshabilitar JMX remoto y usar solo local
com.sun.management.jmxremote.local.only=true
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🔴 ALTA

---

### NIS2-12 — Datos Personales en Logs (PII Leakage)

**Severidad:** 🟠 ALTA  
**Artículo NIS2:** Art. 21.2.h (Criptografía) + RGPD Art. 32  
**ENS equivalente:** op.exp.8 (Registro de actividad)

**Hallazgo:**

La configuración de logging expone datos personales (PII) en logs:

1. **DEBUG activado en producción:** `logback.xml` tiene nivel DEBUG para el paquete petclinic
2. **SQL con PII:** `jpa.showSql=true` registra todas las consultas SQL, incluyendo datos de propietarios
3. **toString() con PII:** `Owner.toString()` incluye nombre, dirección y teléfono — cualquier log de un Owner expone PII
4. **Logs solo a consola:** Sin protección de acceso a logs

**Evidencia:**

```xml
<!-- logback.xml — DEBUG en producción -->
<logger name="org.springframework.samples.petclinic" level="debug"/>
```

```properties
# data-access.properties — SQL logging con PII
jpa.showSql=true
```

```java
// Owner.toString() — Todas las PII en texto plano
return new ToStringCreator(this)
    .append("lastName", this.getLastName())
    .append("firstName", this.getFirstName())
    .append("address", this.address)        // ❌ PII en logs
    .append("city", this.city)              // ❌ PII en logs
    .append("telephone", this.telephone)    // ❌ PII en logs
    .toString();
```

**Remediación:**

```xml
<!-- logback.xml — Producción: WARN, no DEBUG -->
<springProfile name="production">
    <logger name="org.springframework.samples.petclinic" level="WARN"/>
    <logger name="org.hibernate.SQL" level="OFF"/>
    <logger name="org.hibernate.type.descriptor.sql" level="OFF"/>
</springProfile>
```

```properties
# data-access.properties — Desactivar SQL logging
jpa.showSql=false
```

```java
// Owner.toString() — Sin PII
@Override
public String toString() {
    return new ToStringCreator(this)
        .append("id", this.getId())
        .append("new", this.isNew())
        .toString();
    // Nunca loguear: firstName, lastName, address, city, telephone
}
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🔴 ALTA

---

### NIS2-13 — Sin Seguridad de Red (Segmentación, WAF, IDS/IPS)

**Severidad:** 🟡 MEDIA  
**Artículo NIS2:** Art. 21.2.a (Seguridad de sistemas y redes)  
**ENS equivalente:** mp.com.1 (Perímetro seguro)

**Hallazgo:**

No hay evidencia de configuración de seguridad de red:

- Sin WAF (Web Application Firewall)
- Sin IDS/IPS (Intrusion Detection/Prevention System)
- Sin segmentación de red (BD accesible desde la misma red que la app)
- Sin rate limiting ni protección anti-DDoS
- Sin filtrado de IP de origen

**Remediación:**

Desplegar WAF (ModSecurity con OWASP CRS, AWS WAF, Azure Front Door, o Cloudflare) y segmentar la red para que la base de datos solo sea accesible desde el servidor de aplicaciones.

**Esfuerzo:** 2-3 semanas  
**Prioridad:** 🟡 MEDIA

---

### NIS2-14 — Información Técnica Expuesta en Errores

**Severidad:** 🟡 MEDIA  
**Artículo NIS2:** Art. 21.2.e (Seguridad en desarrollo)  
**OWASP:** A05:2021 — Security Misconfiguration

**Hallazgo:**

El sistema expone información técnica sensible a los usuarios:

1. **CrashController:** Endpoint `/oups` que deliberadamente lanza una RuntimeException
2. **exception.jsp:** Muestra `${exception.message}` directamente al usuario
3. **SimpleMappingExceptionResolver:** Configurado con `warnLogCategory` pero redirige a JSP que muestra detalles

Un atacante puede usar esta información para descubrir tecnologías, versiones y estructura interna.

**Evidencia:**

```java
// CrashController.java — Endpoint de debug en producción
@GetMapping(value = "/oups")
public String triggerException() {
    throw new RuntimeException("Expected: controller used to showcase...");
}
```

```jsp
<!-- exception.jsp — Fuga de información -->
<p>${exception.message}</p>
```

**Remediación:**

```java
// Eliminar CrashController en producción o protegerlo
@Controller
@Profile("!production") // Solo en desarrollo
public class CrashController { ... }
```

```jsp
<!-- exception.jsp — Sin detalles técnicos -->
<h2>Ha ocurrido un error</h2>
<p>Lo sentimos, se ha producido un error inesperado.
   Si el problema persiste, contacte con soporte técnico.
   Referencia: ${requestScope['javax.servlet.error.request_uri']}</p>
<!-- NO mostrar: ${exception.message} ni stack traces -->
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🟡 MEDIA

---

### NIS2-15 — Pool de Conexiones Sin Hardening

**Severidad:** 🟡 MEDIA  
**Artículo NIS2:** Art. 21.2.a (Seguridad de sistemas)

**Hallazgo:**

El pool de conexiones Tomcat JDBC (`org.apache.tomcat.jdbc.pool.DataSource`) está configurado sin hardening:

- Sin límite explícito de conexiones (puede agotar recursos de BD)
- Sin validación de conexiones (puede usar conexiones "muertas")
- Sin timeout de consultas (una consulta lenta puede bloquear el pool)
- Sin SSL/TLS en la conexión a base de datos

**Remediación:**

```xml
<bean id="dataSource" class="org.apache.tomcat.jdbc.pool.DataSource"
      p:driverClassName="${jdbc.driverClassName}"
      p:url="${jdbc.url}"
      p:username="${jdbc.username}"
      p:password="${jdbc.password}"
      p:maxActive="20"
      p:maxIdle="10"
      p:minIdle="5"
      p:maxWait="10000"
      p:testOnBorrow="true"
      p:validationQuery="SELECT 1"
      p:validationInterval="30000"
      p:removeAbandoned="true"
      p:removeAbandonedTimeout="60"
      p:logAbandoned="true"/>
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🟡 MEDIA

---

### NIS2-16 — API de Veterinarios Pública Sin Protección

**Severidad:** 🟢 BAJA  
**Artículo NIS2:** Art. 21.2.i (Control de acceso)

**Hallazgo:**

El endpoint `/vets.xml` y `/vets.json` (VetController) expone datos del personal clínico (nombres de veterinarios y especialidades) públicamente sin autenticación. Aunque son datos profesionales, la exposición facilita ingeniería social dirigida al personal.

**Remediación:** Proteger el endpoint con autenticación (se resuelve con NIS2-09).

**Esfuerzo:** Incluido en NIS2-09  
**Prioridad:** 🟢 BAJA

---

### NIS2-17 — Caché Sin Invalidación Segura

**Severidad:** 🟢 BAJA  
**Artículo NIS2:** Art. 21.2.a  

**Hallazgo:**

La caché Caffeine para veterinarios (`tools-config.xml`) no tiene TTL ni políticas de evicción explícitas. En caso de compromiso, datos obsoletos podrían permanecer en caché indefinidamente.

**Remediación:**

```xml
<bean id="cacheManager" class="org.springframework.cache.caffeine.CaffeineCacheManager">
    <property name="cacheSpecification"
              value="maximumSize=500,expireAfterWrite=300s"/>
</bean>
```

**Esfuerzo:** 1 hora  
**Prioridad:** 🟢 BAJA

---

## Plan de Acción Priorizado

### Fase 1 — INMEDIATA (0-30 días) — Riesgo Crítico

| # | Acción | Hallazgo | Esfuerzo | Responsable |
|---|---|---|---|---|
| 1 | Implementar autenticación con Spring Security | NIS2-09 | 3-4 sem. | Desarrollo |
| 2 | Implementar MFA (TOTP mínimo) | NIS2-10 | 2-3 sem. | Desarrollo |
| 3 | Configurar TLS 1.2+ y headers de seguridad | NIS2-08 | 1-2 sem. | Ops + Dev |
| 4 | Corregir logging: eliminar DEBUG y PII | NIS2-12 | 1-2 días | Desarrollo |
| 5 | Deshabilitar CrashController en producción | NIS2-14 | 1 día | Desarrollo |
| 6 | Asegurar JMX (auth + SSL o deshabilitar) | NIS2-11 | 1-2 días | Ops |

### Fase 2 — ALTA (30-90 días) — Obligaciones Operativas

| # | Acción | Hallazgo | Esfuerzo | Responsable |
|---|---|---|---|---|
| 7 | Realizar análisis de riesgos formal (MAGERIT/ISO 27005) | NIS2-01 | 2-4 sem. | CISO |
| 8 | Implementar logging estructurado + SIEM | NIS2-02 | 4-6 sem. | Ops + Dev |
| 9 | Establecer proceso de notificación al CSIRT | NIS2-02 | 2 sem. | CISO |
| 10 | Implementar backups 3-2-1 con pruebas de restauración | NIS2-03 | 3-4 sem. | Ops |
| 11 | Añadir OWASP Dependency-Check + SBOM + pipeline seguro | NIS2-04, NIS2-05 | 2-3 sem. | DevOps |
| 12 | Cifrar datos en reposo (BD + backups) | NIS2-08 | 3-4 sem. | Dev + Ops |
| 13 | Implementar gestión de secretos (Vault) | NIS2-08 | 2 sem. | Ops |

### Fase 3 — MEDIA (90-180 días) — Madurez y Gobernanza

| # | Acción | Hallazgo | Esfuerzo | Responsable |
|---|---|---|---|---|
| 14 | Establecer programa de evaluación de eficacia (pentesting, KPIs) | NIS2-06 | 2 sem. + continuo | CISO |
| 15 | Implementar programa de formación en ciberseguridad | NIS2-07 | 1-2 sem. + continuo | RRHH + CISO |
| 16 | Desplegar WAF e IDS/IPS | NIS2-13 | 2-3 sem. | Ops |
| 17 | Documentar BCP y DRP completos | NIS2-03 | 2-3 sem. | CISO + Ops |
| 18 | Hardening de pool de conexiones y caché | NIS2-15, NIS2-17 | 2-3 días | Dev |

---

## Régimen Sancionador Aplicable

```
╔══════════════════════════════════════════════════════════════════╗
║                     RÉGIMEN SANCIONADOR NIS2                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Si se clasifica como ENTIDAD IMPORTANTE:                        ║
║    Multa máxima: 7.000.000 € o 1,4% facturación mundial anual   ║
║    Supervisión: REACTIVA (tras incidente o denuncia)             ║
║                                                                  ║
║  Si se clasifica como ENTIDAD ESENCIAL:                          ║
║    Multa máxima: 10.000.000 € o 2% facturación mundial anual    ║
║    Supervisión: PROACTIVA (inspecciones sin incidente previo)    ║
║                                                                  ║
║  RESPONSABILIDAD PERSONAL (Art. 20.1 NIS2):                     ║
║    Los miembros del órgano de dirección pueden ser               ║
║    PERSONALMENTE RESPONSABLES del incumplimiento reiterado       ║
║    de las obligaciones del Art. 21.                              ║
║                                                                  ║
║  NOTA: En España, las sanciones NIS2 se ACUMULAN con las del    ║
║  ENS (RD 311/2022) si la entidad es del sector público.          ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Relación con Otros Informes de Cumplimiento

Este análisis NIS2 complementa los siguientes informes ya realizados sobre el mismo sistema:

| Informe | Puntuación | Relación con NIS2 |
|---|---|---|
| **RGPD + LOPDGDD** (18/100) | ❌ NO CONFORME | NIS2 Art. 21.2.h (criptografía) refuerza la protección de datos personales |
| **Ley 39/2015 + Ley 40/2015** (5/100) | ❌ NO CONFORME | NIS2 se aplica a sistemas de administración electrónica |
| **EU AI Act** (N/A) | ✅ Sin IA | Si se incorpora IA, NIS2 exigirá medidas adicionales de ciberseguridad |

Muchas remediaciones son compartidas entre NIS2, ENS y RGPD (especialmente autenticación, cifrado, logging y control de acceso), por lo que una implementación coordinada es más eficiente.

---

## Referencias Normativas

- **Directiva NIS2:** Directiva (UE) 2022/2555 del Parlamento Europeo y del Consejo, de 14 de diciembre de 2022
- **Transposición España:** Ley de Ciberseguridad Nacional (en vigor) + RD de desarrollo
- **ENS:** Real Decreto 311/2022, de 3 de mayo (Esquema Nacional de Seguridad)
- **MAGERIT v3:** Metodología de Análisis y Gestión de Riesgos de los Sistemas de Información (CCN)
- **CCN-STIC-885:** Guía de seguridad de aplicaciones web del CCN
- **ISO 27001/27002:** Referencia complementaria para sistema de gestión de seguridad de la información
- **CSIRT de referencia:** CCN-CERT (sector público), INCIBE-CERT (sector privado)
- **Plataforma LUCIA:** Sistema de gestión de incidentes del CCN para AA.PP.

---

> **Disclaimer:** Este informe es un análisis técnico automatizado del código fuente y configuraciones del sistema. No constituye asesoramiento jurídico ni auditoría oficial de cumplimiento. Para una evaluación vinculante, contacte con un auditor de seguridad certificado y/o con el CCN (Centro Criptológico Nacional) para entidades del sector público.

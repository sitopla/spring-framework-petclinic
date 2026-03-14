# Informe de Cumplimiento RGPD/LOPDGDD — Spring Framework PetClinic

**Fecha:** 2026-03-07  
**Analista:** RGPD + LOPDGDD Compliance Analyzer  
**Sistema analizado:** `spring-framework-petclinic` v7.0.3  
**Tecnologías:** Spring Framework 7.0.3, Spring MVC, JPA/Hibernate 7.2.3, JSP, HSQLDB/H2/MySQL/PostgreSQL

---

## Puntuación Global: 18/100

**Estado: ❌ NO CONFORME**

---

## Resumen Ejecutivo

| Concepto | Resultado |
|---|---|
| Datos personales identificados | 5 categorías (nombre, apellido, dirección, ciudad, teléfono) |
| Datos de categorías especiales (salud) | **Sí** — Datos de visitas veterinarias con descripciones clínicas |
| Base jurídica documentada | **No** — Ninguna base jurídica definida en el código ni en la configuración |
| DPIA requerida | A evaluar — depende del volumen de datos tratados en producción |
| Brechas críticas encontradas | **9** |
| Brechas altas encontradas | **7** |
| Brechas medias encontradas | **5** |

> **Nota importante sobre el contexto:** Aunque PetClinic es una clínica veterinaria y los datos de salud se refieren a animales (no a personas), la aplicación **sí trata datos personales de los propietarios** (personas físicas identificadas). Además, las visitas veterinarias y sus descripciones pueden contener información indirecta sobre los hábitos y la situación personal del propietario, constituyendo datos personales bajo el Art. 4.1 RGPD.

---

## Inventario de Datos Personales

### Datos identificados en el modelo de dominio

| Entidad | Campo | Tipo de Dato Personal | Archivo Fuente |
|---|---|---|---|
| `Owner` (extends `Person`) | `firstName` | Nombre de pila — **dato personal** | `model/Person.java:31` |
| `Owner` (extends `Person`) | `lastName` | Apellido — **dato personal** | `model/Person.java:35` |
| `Owner` | `address` | Dirección postal — **dato personal** | `model/Owner.java:47` |
| `Owner` | `city` | Ciudad — **dato personal** | `model/Owner.java:51` |
| `Owner` | `telephone` | Teléfono — **dato personal** | `model/Owner.java:55` |
| `Vet` (extends `Person`) | `firstName` | Nombre del veterinario — **dato personal (trabajador)** | `model/Person.java:31` |
| `Vet` (extends `Person`) | `lastName` | Apellido del veterinario — **dato personal (trabajador)** | `model/Person.java:35` |
| `Visit` | `description` | Descripción de visita clínica — **potencial dato sensible** | `model/Visit.java:49` |

### Datos de semillas (data.sql) con datos personales en claro

```sql
-- Datos personales reales expuestos en scripts de inicialización
INSERT INTO owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023');
INSERT INTO owners VALUES (2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sun Prairie', '6085551749');
-- ... 10 registros con nombres, direcciones y teléfonos completos
```

**Archivo:** `src/main/resources/db/hsqldb/data.sql` (y equivalentes en `h2/`, `mysql/`, `postgresql/`)

---

## Hallazgos por Área

---

### 🔴 [CRÍTICO] H-01: Ausencia total de autenticación y autorización

**Artículo incumplido:** Art. 5.1(f) RGPD (integridad y confidencialidad), Art. 32 RGPD (medidas de seguridad)

**Descripción:**  
La aplicación no implementa ningún mecanismo de autenticación ni autorización. Todos los endpoints están expuestos públicamente sin restricción alguna:

- `GET /owners` — Lista todos los propietarios con datos personales completos
- `GET /owners/{id}` — Muestra datos personales de cualquier propietario
- `GET /owners/{id}/edit` — Permite editar datos personales de cualquier persona
- `POST /owners/new` — Permite crear registros sin autenticación
- `GET /vets.json` y `GET /vets.xml` — Exportan datos personales de veterinarios en formato estructurado

No existe Spring Security ni ningún filtro de seguridad en `PetclinicInitializer.java`. No hay `web.xml` con restricciones de seguridad.

**Riesgo:** Cualquier usuario anónimo puede acceder, modificar y crear registros con datos personales. Violación directa del principio de confidencialidad.

**Remediación:**

- **Acción inmediata:** Añadir Spring Security con autenticación obligatoria para todos los endpoints que manejen datos personales.

```xml
<!-- pom.xml — Añadir dependencia -->
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
// Ejemplo de configuración de seguridad mínima
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/resources/**", "/webjars/**").permitAll()
                .requestMatchers("/owners/**").hasRole("STAFF")
                .requestMatchers("/vets/**").hasRole("STAFF")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.loginPage("/login").permitAll())
            .csrf(csrf -> csrf.csrfTokenRepository(
                CookieCsrfTokenRepository.withHttpOnlyFalse()));
        return http.build();
    }
}
```

**Plazo recomendado:** Inmediato (0-15 días)

---

### 🔴 [CRÍTICO] H-02: Ausencia de protección CSRF

**Artículo incumplido:** Art. 32.1(b) RGPD (integridad de datos), Art. 5.1(f) RGPD

**Descripción:**  
Los formularios JSP (`createOrUpdateOwnerForm.jsp`, `createOrUpdatePetForm.jsp`, `createOrUpdateVisitForm.jsp`) utilizan `<form:form>` de Spring MVC pero **no hay protección CSRF** configurada. Sin Spring Security, no existe token CSRF, permitiendo ataques Cross-Site Request Forgery que podrían:

- Crear/modificar registros de propietarios sin su consentimiento
- Modificar datos de visitas veterinarias
- Suplantar la identidad del usuario legítimo

**Riesgo:** Un atacante puede manipular datos personales mediante peticiones forjadas desde sitios maliciosos.

**Remediación:**  
Se resuelve con la implementación de Spring Security (H-01), que incluye protección CSRF por defecto.

**Plazo recomendado:** Inmediato (0-15 días)

---

### 🔴 [CRÍTICO] H-03: Datos personales almacenados sin cifrado en base de datos

**Artículo incumplido:** Art. 32.1(a) RGPD (seudonimización y cifrado), Art. 5.1(f) RGPD

**Descripción:**  
El esquema de base de datos almacena todos los datos personales en texto plano sin ningún tipo de cifrado:

```sql
-- src/main/resources/db/hsqldb/schema.sql (líneas 36-43)
CREATE TABLE owners (
  id         INTEGER IDENTITY PRIMARY KEY,
  first_name VARCHAR(30),        -- Sin cifrar
  last_name  VARCHAR_IGNORECASE(30),  -- Sin cifrar
  address    VARCHAR(255),        -- Sin cifrar
  city       VARCHAR(80),         -- Sin cifrar
  telephone  VARCHAR(20)          -- Sin cifrar
);
```

- No existe cifrado a nivel de columna (TDE/column-level encryption)
- No hay seudonimización de identificadores directos
- Las descripciones de visitas clínicas (`visits.description`) también están en texto plano
- No se detecta configuración de cifrado en tránsito (TLS) en `datasource-config.xml`

**Riesgo:** En caso de brecha de seguridad o acceso no autorizado a la base de datos, todos los datos personales quedarían expuestos.

**Remediación:**

```java
// Opción 1: Cifrado a nivel de atributo con JPA AttributeConverter
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    // La clave debe provenir de un KMS externo, nunca hardcoded
    
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        return encrypt(attribute);
    }

    @Override
    public String convertToEntity(String dbData) {
        if (dbData == null) return null;
        return decrypt(dbData);
    }
}

// Uso en la entidad Owner
@Column(name = "telephone")
@Convert(converter = EncryptedStringConverter.class)
private String telephone;
```

```yaml
# Opción 2: Conexión cifrada a BD (application.properties o equivalente)
jdbc.url=jdbc:postgresql://host:5432/petclinic?ssl=true&sslmode=verify-full
```

**Plazo recomendado:** Inmediato (0-30 días)

---

### 🔴 [CRÍTICO] H-04: Ausencia de base jurídica documentada para el tratamiento

**Artículo incumplido:** Art. 6 RGPD (licitud del tratamiento), Art. 5.1(a) RGPD (licitud, lealtad y transparencia)

**Descripción:**  
No existe ninguna documentación ni implementación en el código que defina la base jurídica para el tratamiento de datos personales. Se recopilan datos de propietarios (nombre, apellido, dirección, teléfono) sin:

- Solicitar consentimiento explícito (Art. 6.1.a)
- Documentar si se basa en ejecución de contrato (Art. 6.1.b)
- Referenciar ninguna base jurídica en la interfaz de usuario

Los formularios de creación de propietarios (`createOrUpdateOwnerForm.jsp`) no incluyen:
- Casilla de consentimiento informado
- Enlace a política de privacidad
- Información sobre finalidad del tratamiento

**Riesgo:** Todo tratamiento de datos sin base jurídica es ilícito. Sanción potencial de hasta 20M€ o 4% del volumen de negocio anual (Art. 83.5 RGPD).

**Remediación:**

```jsp
<%-- En createOrUpdateOwnerForm.jsp — Añadir antes del botón de envío --%>
<div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="consentimiento" 
                   name="consentimiento" required>
            <label class="form-check-label" for="consentimiento">
                He leído y acepto la 
                <a href="/politica-privacidad" target="_blank">Política de Privacidad</a>. 
                Consiento el tratamiento de mis datos personales para la gestión de 
                la atención veterinaria de mis mascotas.
            </label>
        </div>
        <small class="form-text text-muted">
            Responsable: [Nombre Clínica]. Finalidad: gestión de citas y 
            atención veterinaria. Base jurídica: consentimiento (Art. 6.1.a RGPD) 
            y ejecución de contrato (Art. 6.1.b RGPD). 
            Puede ejercer sus derechos en: [email DPO].
        </small>
    </div>
</div>
```

```java
// En el modelo Owner, añadir campo de consentimiento
@Column(name = "consent_given")
private Boolean consentGiven;

@Column(name = "consent_date")
private LocalDateTime consentDate;

@Column(name = "consent_version")
private String consentVersion;
```

**Plazo recomendado:** Inmediato (0-15 días)

---

### 🔴 [CRÍTICO] H-05: Ausencia total de derechos del interesado (Arts. 15-22 RGPD)

**Artículo incumplido:** Arts. 15, 16, 17, 18, 20, 21 RGPD

**Descripción:**  
No existe implementación de ninguno de los derechos del interesado exigidos por el RGPD:

| Derecho | Artículo | ¿Implementado? | Observaciones |
|---|---|---|---|
| Acceso | Art. 15 | ❌ **No** | No hay endpoint para que un usuario exporte todos sus datos |
| Rectificación | Art. 16 | ⚠️ **Parcial** | Existe edición (`/owners/{id}/edit`) pero sin control de acceso — cualquiera puede editar datos de otro |
| Supresión | Art. 17 | ❌ **No** | No existe funcionalidad de eliminación de datos |
| Limitación | Art. 18 | ❌ **No** | No implementado |
| Portabilidad | Art. 20 | ❌ **No** | No hay exportación en formato estructurado para el interesado |
| Oposición | Art. 21 | ❌ **No** | No implementado |

**Riesgo:** Incumplimiento directo de derechos fundamentales. Sanción potencial Art. 83.5 RGPD (hasta 20M€).

**Remediación:**

```java
// Nuevo controlador para derechos ARCO-POL
@Controller
@RequestMapping("/mis-datos")
public class DataSubjectRightsController {

    private final ClinicService clinicService;

    // Derecho de ACCESO (Art. 15) — Exportar todos los datos del interesado
    @GetMapping("/exportar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> exportarDatos(
            @AuthenticationPrincipal UserDetails user) {
        Owner owner = clinicService.findOwnerByUsername(user.getUsername());
        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("datos_personales", Map.of(
            "nombre", owner.getFirstName(),
            "apellido", owner.getLastName(),
            "direccion", owner.getAddress(),
            "ciudad", owner.getCity(),
            "telefono", owner.getTelephone()
        ));
        datos.put("mascotas", owner.getPets().stream().map(pet -> Map.of(
            "nombre", pet.getName(),
            "fechaNacimiento", pet.getBirthDate(),
            "tipo", pet.getType().getName(),
            "visitas", pet.getVisits().stream().map(v -> Map.of(
                "fecha", v.getDate(),
                "descripcion", v.getDescription()
            )).toList()
        )).toList());
        datos.put("fecha_exportacion", LocalDateTime.now());
        datos.put("responsable_tratamiento", "Nombre de la Clínica Veterinaria");
        
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=mis-datos.json")
            .body(datos);
    }

    // Derecho de SUPRESIÓN (Art. 17)
    @PostMapping("/eliminar")
    public String solicitarEliminacion(@AuthenticationPrincipal UserDetails user) {
        Owner owner = clinicService.findOwnerByUsername(user.getUsername());
        clinicService.anonimizarOwner(owner.getId());
        // Registrar la solicitud en log de auditoría
        auditLog.registrar("GDPR_ERASURE", owner.getId());
        return "redirect:/logout?datosEliminados=true";
    }

    // Derecho de PORTABILIDAD (Art. 20)
    @GetMapping("/portabilidad")
    @ResponseBody
    public ResponseEntity<byte[]> portabilidad(@AuthenticationPrincipal UserDetails user) {
        Owner owner = clinicService.findOwnerByUsername(user.getUsername());
        byte[] csv = generarCSV(owner);
        return ResponseEntity.ok()
            .header("Content-Type", "text/csv; charset=UTF-8")
            .header("Content-Disposition", "attachment; filename=mis-datos-portabilidad.csv")
            .body(csv);
    }
}
```

**Plazo recomendado:** 0-30 días

---

### 🔴 [CRÍTICO] H-06: Método `toString()` de Owner expone todos los datos personales

**Artículo incumplido:** Art. 5.1(f) RGPD (confidencialidad), Art. 32.1(b) RGPD

**Descripción:**  
El método `toString()` de la clase `Owner` (`model/Owner.java:140-151`) serializa todos los datos personales del propietario en texto plano:

```java
@Override
public String toString() {
    return new ToStringCreator(this)
        .append("id", this.getId())
        .append("new", this.isNew())
        .append("lastName", this.getLastName())    // Dato personal
        .append("firstName", this.getFirstName())  // Dato personal
        .append("address", this.address)            // Dato personal
        .append("city", this.city)                  // Dato personal
        .append("telephone", this.telephone)        // Dato personal
        .toString();
}
```

Este método será invocado implícitamente por frameworks de logging, debuggers, y stacktraces, exponiendo datos personales en logs de forma no controlada.

**Riesgo:** Fuga de datos personales en logs, stacktraces, y herramientas de diagnóstico. Especialmente peligroso combinado con el nivel de log `DEBUG` configurado en `logback.xml`.

**Remediación:**

```java
// DESPUÉS: toString() sin datos personales
@Override
public String toString() {
    return new ToStringCreator(this)
        .append("id", this.getId())
        .append("new", this.isNew())
        .append("lastName", maskString(this.getLastName()))
        .append("city", this.city)
        .toString();
}

private static String maskString(String value) {
    if (value == null || value.length() <= 2) return "***";
    return value.charAt(0) + "***" + value.charAt(value.length() - 1);
}
```

**Plazo recomendado:** Inmediato (0-7 días)

---

### 🔴 [CRÍTICO] H-07: Nivel de log DEBUG en producción con datos personales potenciales

**Artículo incumplido:** Art. 5.1(c) RGPD (minimización), Art. 32 RGPD

**Descripción:**  
La configuración de logging (`logback.xml:17`) establece nivel `DEBUG` para el paquete de la aplicación:

```xml
<logger name="org.springframework.samples.petclinic" level="debug"/>
```

Combinado con:
- `jpa.showSql=true` en `data-access.properties:11` — que muestra todas las consultas SQL incluyendo datos personales en parámetros
- El método `toString()` de `Owner` que expone datos completos (H-06)
- La ausencia de filtros de datos sensibles en el appender de consola

Esto provoca que las consultas SQL con datos personales aparezcan en los logs:
```
SELECT id, first_name, last_name, address, city, telephone FROM owners WHERE last_name like 'Davis%'
```

**Riesgo:** Los datos personales (nombres, direcciones, teléfonos) aparecerán en los logs de la aplicación, accesibles para administradores de sistemas, herramientas de monitorización, y potencialmente almacenados indefinidamente.

**Remediación:**

```xml
<!-- logback.xml — Configuración segura -->
<configuration scan="true" scanPeriod="30 seconds">
    <contextListener class="ch.qos.logback.classic.jul.LevelChangePropagator">
        <resetJUL>true</resetJUL>
    </contextListener>
    
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- Incluir traceId/spanId para trazabilidad sin datos personales -->
            <pattern>%d{ISO8601} %-5level [%thread] [%X{traceId}/%X{spanId}] %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- NUNCA debug en producción -->
    <logger name="org.springframework.samples.petclinic" level="WARN"/>
    <logger name="org.hibernate.SQL" level="WARN"/>
    <logger name="org.hibernate.type.descriptor.sql" level="WARN"/>

    <root level="WARN">
        <appender-ref ref="console"/>
    </root>
</configuration>
```

```properties
# data-access.properties — Desactivar SQL en logs
jpa.showSql=false
```

**Plazo recomendado:** Inmediato (0-7 días)

---

### 🔴 [CRÍTICO] H-08: Acceso directo a datos mediante IDOR (Insecure Direct Object Reference)

**Artículo incumplido:** Art. 5.1(f) RGPD (confidencialidad), Art. 32 RGPD

**Descripción:**  
Los controladores exponen datos personales mediante IDs secuenciales predecibles sin verificación de autorización:

```java
// OwnerController.java:126 — Cualquier usuario accede a cualquier propietario
@GetMapping("/owners/{ownerId}")
public ModelAndView showOwner(@PathVariable("ownerId") int ownerId) {
    ModelAndView mav = new ModelAndView("owners/ownerDetails");
    mav.addObject(this.clinicService.findOwnerById(ownerId));
    return mav;
}

// OwnerController.java:101 — Cualquier usuario edita datos de otro
@GetMapping(value = "/owners/{ownerId}/edit")
public String initUpdateOwnerForm(@PathVariable("ownerId") int ownerId, Model model) {
    Owner owner = this.clinicService.findOwnerById(ownerId);
    model.addAttribute(owner);
    return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
}
```

Un atacante puede iterar secuencialmente (`/owners/1`, `/owners/2`, ..., `/owners/N`) para extraer todos los datos personales del sistema.

**Riesgo:** Enumeración completa de datos personales de todos los propietarios del sistema.

**Remediación:**  
Implementar Spring Security (H-01) con verificación de que el usuario autenticado solo accede a sus propios datos o tiene rol de administrador.

```java
@GetMapping("/owners/{ownerId}")
@PreAuthorize("@ownerSecurity.isOwnerOrAdmin(#ownerId, authentication)")
public ModelAndView showOwner(@PathVariable("ownerId") int ownerId) {
    // ...
}
```

**Plazo recomendado:** Inmediato (0-15 días)

---

### 🔴 [CRÍTICO] H-09: Exposición de datos de veterinarios via API pública sin autenticación

**Artículo incumplido:** Art. 5.1(c) RGPD (minimización), Art. 6 RGPD

**Descripción:**  
Los endpoints de veterinarios exponen datos personales de trabajadores (nombre y apellido) en formato JSON y XML accesibles públicamente:

```java
// VetController.java:51-56
@GetMapping(value = "/vets.json", produces = MediaType.APPLICATION_JSON_VALUE)
@ResponseBody
public Vets showJsonVetList() {
    return getVets();  // Devuelve firstName, lastName de todos los vets
}

@GetMapping(value = "/vets.xml", produces = MediaType.APPLICATION_XML_VALUE)
@ResponseBody
public Vets showXmlVetList() {
    return getVets();  // Devuelve firstName, lastName de todos los vets
}
```

Estos endpoints devuelven datos personales de trabajadores en formatos fácilmente consumibles por scrapers.

**Riesgo:** Extracción masiva de datos personales de empleados. Posible uso para ingeniería social.

**Remediación:**  
Proteger con autenticación (H-01) y aplicar minimización — mostrar solo nombre y primera inicial del apellido públicamente, datos completos solo para personal autorizado.

**Plazo recomendado:** Inmediato (0-15 días)

---

### 🟠 [ALTO] H-10: Ausencia de política de privacidad y cláusulas informativas

**Artículo incumplido:** Art. 13 RGPD (información al interesado), Art. 11 LOPDGDD

**Descripción:**  
La aplicación no incluye:
- Página de política de privacidad
- Cláusulas informativas en formularios de recogida de datos
- Información sobre el responsable del tratamiento
- Información sobre finalidades, bases jurídicas, plazos de conservación, derechos

Los formularios (`createOrUpdateOwnerForm.jsp`) recogen datos personales sin informar al usuario de ninguno de estos aspectos.

**Riesgo:** Incumplimiento del deber de información. Sanción potencial Art. 83.5 RGPD.

**Remediación:**  
Crear una página `/politica-privacidad` accesible desde todos los formularios y el footer del layout, que incluya toda la información requerida por el Art. 13 RGPD.

**Plazo recomendado:** 0-15 días

---

### 🟠 [ALTO] H-11: Ausencia de registro de actividades de tratamiento (Art. 30 RGPD)

**Artículo incumplido:** Art. 30 RGPD

**Descripción:**  
No existe documentación del registro de actividades de tratamiento. Según el Art. 30 RGPD, todo responsable debe mantener un registro que incluya:
- Nombre y datos del responsable
- Finalidades del tratamiento
- Categorías de interesados y datos
- Categorías de destinatarios
- Transferencias internacionales
- Plazos de supresión
- Medidas de seguridad

**Remediación:**  
Crear y mantener el documento `RAT` (Registro de Actividades de Tratamiento) como parte de la documentación del proyecto.

**Plazo recomendado:** 0-30 días

---

### 🟠 [ALTO] H-12: Ausencia de política de retención y purga de datos

**Artículo incumplido:** Art. 5.1(e) RGPD (limitación del plazo de conservación)

**Descripción:**  
No existe ningún mecanismo de retención o purga de datos en el código:
- No hay campos `created_at`, `updated_at`, `deleted_at` en las tablas
- No hay jobs de limpieza programados
- No hay configuración de plazos de conservación
- Los datos se almacenan indefinidamente

**Remediación:**

```sql
-- Añadir campos de auditoría temporal al esquema
ALTER TABLE owners ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE owners ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE owners ADD COLUMN retention_expires_at TIMESTAMP;

ALTER TABLE visits ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

```java
// Job de purga programado
@Component
public class DataRetentionJob {

    @Scheduled(cron = "0 0 2 * * ?") // Cada día a las 2:00 AM
    @Transactional
    public void purgarDatosExpirados() {
        LocalDateTime limite = LocalDateTime.now().minusYears(5);
        // Anonimizar propietarios inactivos después de 5 años
        ownerRepository.anonimizarInactivos(limite);
        log.info("Purga de datos completada: propietarios inactivos anonimizados");
    }
}
```

**Plazo recomendado:** 30-60 días

---

### 🟠 [ALTO] H-13: Ausencia de registro de auditoría de accesos

**Artículo incumplido:** Art. 5.2 RGPD (responsabilidad proactiva), Art. 32 RGPD

**Descripción:**  
No existe registro de auditoría para:
- Accesos a datos personales (`GET /owners/{id}`)
- Modificaciones de datos (`POST /owners/{id}/edit`)
- Creación de registros (`POST /owners/new`)
- Búsquedas por apellido (`GET /owners?lastName=...`)

El `CallMonitoringAspect` (`util/CallMonitoringAspect.java`) solo monitoriza rendimiento (conteo de llamadas y tiempos), pero no registra quién accedió a qué datos ni cuándo.

**Remediación:**

```java
@Aspect
@Component
@Slf4j
public class DataAccessAuditAspect {

    @AfterReturning(
        pointcut = "execution(* org.springframework.samples.petclinic.service.ClinicService.findOwnerById(..))",
        returning = "owner")
    public void auditOwnerAccess(JoinPoint jp, Owner owner) {
        String usuario = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        log.info("AUDIT: Usuario={} accedió a Owner id={}", 
            usuario, owner.getId());
    }

    @AfterReturning(
        pointcut = "execution(* org.springframework.samples.petclinic.service.ClinicService.saveOwner(..))")
    public void auditOwnerModification(JoinPoint jp) {
        Owner owner = (Owner) jp.getArgs()[0];
        String usuario = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        log.info("AUDIT: Usuario={} modificó Owner id={}", 
            usuario, owner.getId());
    }
}
```

**Plazo recomendado:** 0-30 días

---

### 🟠 [ALTO] H-14: Datos personales en scripts de inicialización de base de datos

**Artículo incumplido:** Art. 5.1(f) RGPD, Art. 32 RGPD

**Descripción:**  
Los archivos `data.sql` en las cuatro carpetas de BD (`hsqldb/`, `h2/`, `mysql/`, `postgresql/`) contienen datos personales completos (nombres reales, direcciones, teléfonos) que se cargan automáticamente al iniciar la aplicación. Si estos scripts llegan a entornos de producción, se estarían cargando datos potencialmente reales.

**Remediación:**  
Usar datos claramente ficticios y documentar que estos scripts son solo para desarrollo:

```sql
-- Datos FICTICIOS solo para entorno de desarrollo
INSERT INTO owners VALUES (1, 'TestNombre1', 'TestApellido1', 'Calle Test 1', 'Ciudad Test', '0000000001');
```

**Plazo recomendado:** 0-15 días

---

### 🟠 [ALTO] H-15: Ausencia de cifrado en tránsito (HTTPS/TLS)

**Artículo incumplido:** Art. 32.1(a) RGPD

**Descripción:**  
No existe configuración de HTTPS/TLS en la aplicación. La clase `PetclinicInitializer` no configura conectores SSL. No hay referencia a certificados SSL/TLS en ninguna configuración. Los datos personales se transmiten en texto plano entre el navegador y el servidor.

**Remediación:**  
Configurar TLS 1.2+ obligatorio en el servidor de aplicaciones (Tomcat).

**Plazo recomendado:** Inmediato (0-7 días)

---

### 🟠 [ALTO] H-16: Página de error expone información interna

**Artículo incumplido:** Art. 32 RGPD (seguridad del tratamiento)

**Descripción:**  
La página de error (`exception.jsp:12`) muestra directamente el mensaje de la excepción al usuario:

```jsp
<p>${exception.message}</p>
```

Esto puede filtrar información sobre la estructura interna del sistema, consultas SQL, nombres de tablas, e incluso datos personales contenidos en mensajes de error de JPA/Hibernate.

**Remediación:**

```jsp
<%-- DESPUÉS: Página de error genérica sin filtrar información interna --%>
<h2>Se ha producido un error</h2>
<p>Lo sentimos, se ha producido un error inesperado. 
   Por favor, contacte con soporte técnico indicando el código: 
   <strong>${requestScope['jakarta.servlet.error.request_uri']}</strong>
</p>
```

**Plazo recomendado:** 0-7 días

---

### 🟡 [MEDIO] H-17: Ausencia de validación contra inyección en búsqueda por apellido

**Artículo incumplido:** Art. 32 RGPD, Art. 5.1(f) RGPD

**Descripción:**  
El endpoint `GET /owners` acepta un parámetro `lastName` que se usa en consulta LIKE. Aunque se usan consultas parametrizadas (protegidas contra SQL injection básica), la búsqueda con `lastName + "%"` permite búsquedas masivas con cadena vacía, devolviendo todos los registros:

```java
// OwnerController.java:80-81
if (owner.getLastName() == null) {
    owner.setLastName(""); // Devuelve TODOS los owners
}
```

**Riesgo:** Permite la enumeración completa de la base de datos con una sola petición.

**Remediación:**  
Limitar los resultados de búsqueda y requerir un mínimo de caracteres.

```java
if (owner.getLastName() == null || owner.getLastName().length() < 2) {
    result.rejectValue("lastName", "minLength", "Introduzca al menos 2 caracteres");
    return "owners/findOwners";
}
```

**Plazo recomendado:** 0-30 días

---

### 🟡 [MEDIO] H-18: Ausencia de consentimiento para uso de cookies

**Artículo incumplido:** Art. 22.2 LOPDGDD, Directiva ePrivacy 2002/58/CE, Guía AEPD sobre cookies

**Descripción:**  
Aunque la aplicación establece `session="false"` en las páginas JSP, el servidor de aplicaciones puede generar cookies de sesión. No existe banner de cookies ni mecanismo de consentimiento para cookies no esenciales.

**Remediación:**  
Implementar banner de cookies conforme a la guía AEPD si se utilizan cookies no estrictamente necesarias.

**Plazo recomendado:** 30-60 días

---

### 🟡 [MEDIO] H-19: Credenciales de BD en archivos de configuración

**Artículo incumplido:** Art. 32 RGPD

**Descripción:**  
El archivo `datasource-config.xml` referencia credenciales de BD a través de placeholders (`${jdbc.username}`, `${jdbc.password}`), pero `data-access.properties` también las define como placeholders que esperan resolución del entorno. Si en producción se configuran contraseñas directamente en archivos de propiedades, se viola el principio de seguridad.

**Remediación:**  
Usar variables de entorno o un gestor de secretos (Vault, AWS Secrets Manager) en vez de archivos de propiedades.

**Plazo recomendado:** 30-60 días

---

### 🟡 [MEDIO] H-20: Ausencia de protocolo de notificación de brechas

**Artículo incumplido:** Arts. 33-34 RGPD

**Descripción:**  
No existe documentación ni implementación de un protocolo de notificación de brechas de seguridad. El RGPD exige notificar a la AEPD en un máximo de 72 horas y al interesado sin dilación indebida cuando haya alto riesgo.

**Remediación:**  
Documentar e implementar un procedimiento de respuesta a incidentes con los siguientes pasos:
1. Detección y evaluación de la brecha
2. Contención
3. Notificación a la AEPD (72h)
4. Comunicación al interesado si alto riesgo
5. Registro en el libro de violaciones

**Plazo recomendado:** 30-60 días

---

### 🟡 [MEDIO] H-21: Falta de designación de DPO

**Artículo incumplido:** Art. 37 RGPD, Art. 34 LOPDGDD

**Descripción:**  
No se evidencia la designación de un Delegado de Protección de Datos. Según la LOPDGDD (Art. 34), los centros sanitarios obligados al mantenimiento de historias clínicas deben designar un DPO. Aunque se trata de una clínica veterinaria (no cubierta directamente por esta obligación), es una buena práctica recomendada.

**Remediación:**  
Evaluar si la organización está obligada a designar DPO y, en caso afirmativo, proceder a su designación y comunicación a la AEPD.

**Plazo recomendado:** 30-90 días

---

## Checklist de Cumplimiento

| # | Requisito | Estado |
|---|---|---|
| 1 | Base jurídica documentada para cada tratamiento | ❌ No implementado |
| 2 | Política de privacidad actualizada y accesible | ❌ No implementado |
| 3 | Registro de actividades de tratamiento (Art. 30) | ❌ No implementado |
| 4 | Derechos del interesado implementados (Arts. 15-22) | ❌ No implementado |
| 5 | Consentimiento explícito cuando es base jurídica | ❌ No implementado |
| 6 | Cifrado de datos en reposo | ❌ No implementado |
| 7 | Cifrado de datos en tránsito (TLS) | ❌ No implementado |
| 8 | Política de retención y purga automática | ❌ No implementado |
| 9 | Registro de auditoría de accesos a datos | ❌ No implementado |
| 10 | Autenticación y autorización | ❌ No implementado |
| 11 | Protección CSRF | ❌ No implementado |
| 12 | DPO designado (si obligatorio) | ⚠️ A evaluar |
| 13 | DPIA realizada (si requerida) | ⚠️ A evaluar |
| 14 | Contratos con encargados del tratamiento (Art. 28) | ⚠️ No evaluable en código |
| 15 | Protocolo de notificación de brechas (72h AEPD) | ❌ No implementado |
| 16 | Datos de test/desarrollo anonimizados | ❌ No implementado |
| 17 | `toString()` sin datos personales | ❌ No implementado |
| 18 | Logs sin datos personales | ❌ No implementado |
| 19 | Protección contra IDOR | ❌ No implementado |
| 20 | Página de error segura | ❌ No implementado |

---

## Plan de Remediación

### PRIORIDAD 1 — Inmediato (0-15 días)

| # | Acción | Hallazgo |
|---|---|---|
| 1 | Implementar Spring Security (autenticación + autorización + CSRF) | H-01, H-02, H-08 |
| 2 | Configurar HTTPS/TLS obligatorio | H-15 |
| 3 | Añadir cláusulas informativas y consentimiento en formularios | H-04, H-10 |
| 4 | Corregir `toString()` de `Owner` para no exponer datos personales | H-06 |
| 5 | Cambiar nivel de log a WARN y desactivar `showSql` | H-07 |
| 6 | Corregir página de error para no filtrar excepciones internas | H-16 |
| 7 | Proteger endpoints de veterinarios (`/vets.json`, `/vets.xml`) | H-09 |

### PRIORIDAD 2 — Corto plazo (15-60 días)

| # | Acción | Hallazgo |
|---|---|---|
| 8 | Implementar derechos del interesado (acceso, supresión, portabilidad) | H-05 |
| 9 | Implementar cifrado a nivel de columna para datos sensibles | H-03 |
| 10 | Crear registro de actividades de tratamiento (RAT) | H-11 |
| 11 | Implementar registro de auditoría de accesos a datos personales | H-13 |
| 12 | Anonimizar datos en scripts de inicialización | H-14 |
| 13 | Limitar búsqueda masiva por apellido | H-17 |

### PRIORIDAD 3 — Medio plazo (60-180 días)

| # | Acción | Hallazgo |
|---|---|---|
| 14 | Implementar política de retención y jobs de purga | H-12 |
| 15 | Implementar banner de consentimiento de cookies | H-18 |
| 16 | Migrar credenciales a gestor de secretos | H-19 |
| 17 | Documentar protocolo de notificación de brechas | H-20 |
| 18 | Evaluar designación de DPO | H-21 |
| 19 | Realizar DPIA si aplica | — |

---

## Referencias Normativas

- **RGPD:** Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo
- **LOPDGDD:** Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales
- **Guía AEPD:** Gestión del riesgo y evaluación de impacto en los tratamientos de datos personales
- **Guía AEPD Cookies:** Guía sobre el uso de las cookies (actualización 2023)
- **Directiva ePrivacy:** Directiva 2002/58/CE sobre la privacidad y las comunicaciones electrónicas

---

> **Disclaimer:** Este informe es un análisis técnico del código fuente y la configuración de la aplicación. No constituye asesoramiento jurídico. Se recomienda consultar con un profesional legal especializado en protección de datos para la interpretación y aplicación de las normativas mencionadas.

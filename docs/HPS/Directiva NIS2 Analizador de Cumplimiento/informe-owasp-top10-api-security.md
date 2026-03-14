# 🛡️ Informe OWASP Top 10 Web (2021) + API Security Top 10 (2023)

## Spring Framework PetClinic v7.0.3

| Campo | Valor |
|-------|-------|
| **Sistema analizado** | Spring Framework PetClinic 7.0.3 |
| **Fecha del análisis** | 2026-03-07 |
| **Analista** | OWASP Web + API Security Analyzer |
| **Tecnologías** | Spring MVC 7.0.3, Hibernate 7.2.3, JSP/JSTL, Jackson 3.0.4 |
| **Servidor** | Jetty 11.0 (dev) / Tomcat 11.0.18 (producción) |
| **Base de datos** | H2 (defecto), HSQLDB, MySQL 8.1, PostgreSQL 42.7 |
| **Empaquetado** | WAR (Servlet 6.1 / Jakarta EE) |

---

## 📊 Resumen Ejecutivo

```
╔═══════════════════════════════════════════════════════════════════╗
║                   CRITICIDAD GLOBAL: CRÍTICA                      ║
║                   PUNTUACIÓN OWASP: 9 / 100                       ║
╠═══════════════════════════════════════════════════════════════════╣
║  Vulnerabilidades CRÍTICAS:  11                                   ║
║  Vulnerabilidades ALTAS:      8                                   ║
║  Vulnerabilidades MEDIAS:     6                                   ║
║  Vulnerabilidades BAJAS:      3                                   ║
║  ─────────────────────────────────────────────────────────────    ║
║  Total hallazgos:            28                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  Endpoints analizados:       18                                   ║
║  Con control de acceso:       0  (0%)                             ║
║  Con rate limiting:           0  (0%)                             ║
║  Con auditoría:               0  (0%)                             ║
║  Con protección CSRF:         0  (0%)                             ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Veredicto

> ⛔ **NO APTO PARA PRODUCCIÓN** — El sistema carece de autenticación, autorización, protección CSRF, cabeceras de seguridad, rate limiting y auditoría. Cualquier despliegue en entorno sanitario o de administración pública constituiría un riesgo crítico de seguridad y un incumplimiento del ENS (RD 311/2022).

---

## 📋 Mapa de Superficie de Ataque

### Inventario Completo de Endpoints

| # | Método | URL | Controller | Línea | Auth | CSRF | Rate Limit |
|---|--------|-----|------------|-------|------|------|------------|
| 1 | GET | `/` | mvc-core-config.xml | L35 | ❌ | — | ❌ |
| 2 | GET | `/owners/new` | OwnerController | L53 | ❌ | — | ❌ |
| 3 | POST | `/owners/new` | OwnerController | L60 | ❌ | ❌ | ❌ |
| 4 | GET | `/owners/find` | OwnerController | L70 | ❌ | — | ❌ |
| 5 | GET | `/owners` | OwnerController | L76 | ❌ | — | ❌ |
| 6 | GET | `/owners/{ownerId}` | OwnerController | L125 | ❌ | — | ❌ |
| 7 | GET | `/owners/{ownerId}/edit` | OwnerController | L101 | ❌ | — | ❌ |
| 8 | POST | `/owners/{ownerId}/edit` | OwnerController | L108 | ❌ | ❌ | ❌ |
| 9 | GET | `/owners/{ownerId}/pets/new` | PetController | L69 | ❌ | — | ❌ |
| 10 | POST | `/owners/{ownerId}/pets/new` | PetController | L77 | ❌ | ❌ | ❌ |
| 11 | GET | `/owners/{ownerId}/pets/{petId}/edit` | PetController | L92 | ❌ | — | ❌ |
| 12 | POST | `/owners/{ownerId}/pets/{petId}/edit` | PetController | L99 | ❌ | ❌ | ❌ |
| 13 | GET | `/owners/*/pets/{petId}/visits/new` | VisitController | L69 | ❌ | — | ❌ |
| 14 | POST | `/owners/{ownerId}/pets/{petId}/visits/new` | VisitController | L75 | ❌ | ❌ | ❌ |
| 15 | GET | `/owners/*/pets/{petId}/visits` | VisitController | L85 | ❌ | — | ❌ |
| 16 | GET | `/vets` | VetController | L42 | ❌ | — | ❌ |
| 17 | GET | `/vets.json` | VetController | L51 | ❌ | — | ❌ |
| 18 | GET | `/vets.xml` | VetController | L58 | ❌ | — | ❌ |
| 19 | GET | `/oups` | CrashController | L32 | ❌ | — | ❌ |

### Datos Personales Gestionados

| Entidad | Campo | Tipo | Sensibilidad HPS |
|---------|-------|------|-------------------|
| Owner (Person) | firstName | VARCHAR(30) | PII — Nombre |
| Owner (Person) | lastName | VARCHAR(30) | PII — Apellido |
| Owner | address | VARCHAR(255) | PII — Domicilio |
| Owner | city | VARCHAR(80) | PII — Localidad |
| Owner | telephone | VARCHAR(20) | PII — Teléfono |
| Visit | description | VARCHAR(255) | **Potencial dato de salud** (Art. 9 RGPD) |
| Vet (Person) | firstName, lastName | VARCHAR(30) | PII — Dato profesional |

---

## 🔴 VULNERABILIDADES OWASP TOP 10 WEB (2021)

---

### OW-01 · A01:2021 — Broken Access Control

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 9.8** (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H) | **CWE-284**

#### Descripción

**No existe NINGÚN mecanismo de autenticación ni autorización.** Todos los 18 endpoints son públicos. Cualquier usuario anónimo puede crear, leer, editar y eliminar registros de cualquier propietario sin restricciones.

#### Evidencia — IDOR en endpoints de Owner

**Archivo:** `src/main/java/org/springframework/samples/petclinic/web/OwnerController.java`, líneas 101-106 y 125-130

```java
// VULNERABLE: Acceso directo por ID secuencial sin verificación de propiedad
@GetMapping(value = "/owners/{ownerId}/edit")
public String initUpdateOwnerForm(@PathVariable("ownerId") int ownerId, Model model) {
    Owner owner = this.clinicService.findOwnerById(ownerId); // ← Sin auth check
    model.addAttribute(owner);
    return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
}

@GetMapping("/owners/{ownerId}")
public ModelAndView showOwner(@PathVariable("ownerId") int ownerId) {
    ModelAndView mav = new ModelAndView("owners/ownerDetails");
    mav.addObject(this.clinicService.findOwnerById(ownerId)); // ← Sin auth check
    return mav;
}
```

**Vectores de ataque:**
- `GET /owners/1` → datos del owner 1 (nombre, dirección, teléfono)
- `GET /owners/2` → datos del owner 2
- Enumeración trivial: IDs secuenciales `Integer` (`GenerationType.IDENTITY` en `BaseEntity.java:32`)
- `POST /owners/1/edit` → modificar datos de cualquier propietario

#### Evidencia — Wildcard Path Bypass

**Archivo:** `src/main/java/org/springframework/samples/petclinic/web/VisitController.java`, líneas 69 y 85

```java
// VULNERABLE: Wildcard '*' en la URL permite ignorar el ownerId
@GetMapping(value = "/owners/*/pets/{petId}/visits/new")
public String initNewVisitForm(@PathVariable("petId") int petId, ...) { ... }

@GetMapping(value = "/owners/*/pets/{petId}/visits")
public String showVisits(@PathVariable int petId, ...) { ... }
```

**Impacto:** Cualquier valor en el segmento `*` es aceptado. `GET /owners/XXXXX/pets/3/visits` devuelve visitas sin verificar relación owner↔pet.

#### Código Corregido

```java
// ══════════════════════════════════════════════════════
// PASO 1: Implementar Spring Security
// ══════════════════════════════════════════════════════
// pom.xml — Agregar dependencia
// <dependency>
//     <groupId>org.springframework.security</groupId>
//     <artifactId>spring-security-web</artifactId>
//     <version>${spring-framework.version}</version>
// </dependency>
// <dependency>
//     <groupId>org.springframework.security</groupId>
//     <artifactId>spring-security-config</artifactId>
//     <version>${spring-framework.version}</version>
// </dependency>

// ══════════════════════════════════════════════════════
// PASO 2: Servicio de autorización a nivel de objeto
// ══════════════════════════════════════════════════════
@Service
public class OwnerAuthorizationService {

    private final ClinicService clinicService;

    public OwnerAuthorizationService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    /**
     * Verifica que el usuario autenticado tiene acceso al owner solicitado.
     * En contexto HPS: PACIENTE solo accede a sus datos,
     * MÉDICO solo a pacientes asignados, ADMIN acceso total.
     */
    public void verifyOwnerAccess(int ownerId, Authentication auth) {
        UserDetails user = (UserDetails) auth.getPrincipal();

        if (user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return; // Administrador: acceso total
        }

        // Propietario: solo sus propios datos
        Owner owner = clinicService.findOwnerById(ownerId);
        if (owner == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // Comparar con el ID del usuario autenticado (no con el ID del path)
        if (!user.getUsername().equals(owner.getTelephone())) {
            throw new AccessDeniedException(
                "No tiene permisos para acceder a este recurso");
        }
    }
}

// ══════════════════════════════════════════════════════
// PASO 3: Controlador protegido
// ══════════════════════════════════════════════════════
@GetMapping("/owners/{ownerId}")
public ModelAndView showOwner(
        @PathVariable("ownerId") int ownerId,
        Authentication authentication) {

    ownerAuthorizationService.verifyOwnerAccess(ownerId, authentication);

    ModelAndView mav = new ModelAndView("owners/ownerDetails");
    mav.addObject(this.clinicService.findOwnerById(ownerId));
    return mav;
}
```

---

### OW-02 · A01:2021 — Enumeración de Registros (Búsqueda sin límites)

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 7.5** (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) | **CWE-200**

#### Descripción

El endpoint `GET /owners` con `lastName` vacío devuelve **TODOS** los registros de la base de datos sin paginación ni límite.

#### Evidencia

**Archivo:** `src/main/java/org/springframework/samples/petclinic/web/OwnerController.java`, líneas 76-98

```java
@GetMapping(value = "/owners")
public String processFindForm(Owner owner, BindingResult result, ...) {
    // ⚠️ Sin lastName → busca TODOS los registros
    if (owner.getLastName() == null) {
        owner.setLastName(""); // empty string = búsqueda masiva
    }

    Collection<Owner> results = this.clinicService.findOwnerByLastName(
        owner.getLastName()); // ← Sin paginación, devuelve TODO

    if (results.size() == 1) {
        owner = results.iterator().next();
        return "redirect:/owners/" + owner.getId();
    } else {
        model.put("selections", results); // ← TODOS los owners al JSP
        return "owners/ownersList";
    }
}
```

**Archivo:** `SpringDataOwnerRepository.java`, línea 35 — Query sin LIMIT:
```java
@Query("SELECT DISTINCT owner FROM Owner owner left join fetch owner.pets "
     + "WHERE owner.lastName LIKE :lastName%")
Collection<Owner> findByLastName(@Param("lastName") String lastName);
// ← LIKE '%' devuelve todos los registros
```

#### Código Corregido

```java
@GetMapping(value = "/owners")
public String processFindForm(
        Owner owner,
        BindingResult result,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Map<String, Object> model) {

    // Limitar tamaño de página
    size = Math.min(size, 50);

    if (owner.getLastName() == null || owner.getLastName().isBlank()) {
        result.rejectValue("lastName", "required",
            "Debe introducir al menos un carácter");
        return "owners/findOwners";
    }

    Page<Owner> results = this.clinicService.findOwnerByLastName(
        owner.getLastName(), PageRequest.of(page, size));

    model.put("selections", results.getContent());
    model.put("currentPage", page);
    model.put("totalPages", results.getTotalPages());
    return "owners/ownersList";
}
```

---

### OW-03 · A02:2021 — Cryptographic Failures

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 9.1** (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N) | **CWE-311**

#### Descripción

No existe cifrado en tránsito (TLS) ni en reposo para datos personales. Las credenciales de BD están hardcodeadas en el `pom.xml`. La base de datos almacena todos los datos PII en texto plano.

#### Evidencia 1 — Sin TLS / HTTPS

**Archivo:** `PetclinicInitializer.java` — Ninguna configuración TLS.
**Archivo:** `jetty-web.xml` — Solo configura classloader, sin conectores HTTPS.
**Archivo:** `datasource-config.xml`, línea 30 — Conexión BD sin SSL:

```xml
<bean id="dataSource" class="org.apache.tomcat.jdbc.pool.DataSource"
      p:url="${jdbc.url}"/> <!-- jdbc:h2:mem:petclinic — Sin cifrado -->
```

#### Evidencia 2 — Credenciales Hardcodeadas

**Archivo:** `pom.xml`, líneas 568-570 y 587-589:

```xml
<!-- MySQL Profile -->
<jdbc.username>petclinic</jdbc.username>
<jdbc.password>petclinic</jdbc.password>  <!-- ⚠️ CREDENTIAL HARDCODED -->

<!-- PostgreSQL Profile -->
<jdbc.username>postgres</jdbc.username>
<jdbc.password>petclinic</jdbc.password>  <!-- ⚠️ CREDENTIAL HARDCODED -->
```

#### Evidencia 3 — Datos PII en Claro en BD

**Archivo:** `src/main/resources/db/hsqldb/schema.sql`, líneas 36-43:

```sql
CREATE TABLE owners (
  id         INTEGER IDENTITY PRIMARY KEY,
  first_name VARCHAR(30),      -- Sin cifrado
  last_name  VARCHAR_IGNORECASE(30),  -- Sin cifrado
  address    VARCHAR(255),     -- Sin cifrado
  city       VARCHAR(80),      -- Sin cifrado
  telephone  VARCHAR(20)       -- Sin cifrado
);
```

**Archivo:** `src/main/resources/db/hsqldb/data.sql`, líneas 25-34:

```sql
-- PII realista almacenada en texto plano
INSERT INTO owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023');
INSERT INTO owners VALUES (2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sun Prairie', '6085551749');
```

#### Código Corregido

```java
// ══════════════════════════════════════════════════════
// Cifrado AES-256-GCM para campos PII en reposo
// ══════════════════════════════════════════════════════
@Converter
public class PiiEncryptionConverter implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    // Clave obtenida de HashiCorp Vault / AWS KMS
    private final SecretKey key;

    public PiiEncryptionConverter() {
        String encodedKey = System.getenv("PII_ENCRYPTION_KEY");
        if (encodedKey == null) {
            throw new IllegalStateException("PII_ENCRYPTION_KEY no configurada");
        }
        this.key = new SecretKeySpec(Base64.getDecoder().decode(encodedKey), "AES");
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        try {
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
            throw new RuntimeException("Error cifrando PII", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            byte[] combined = Base64.getDecoder().decode(dbData);
            byte[] iv = Arrays.copyOfRange(combined, 0, IV_LENGTH);
            byte[] encrypted = Arrays.copyOfRange(combined, IV_LENGTH, combined.length);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key,
                new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error descifrando PII", e);
        }
    }
}

// Uso en entidad Owner:
@Column(name = "telephone")
@Convert(converter = PiiEncryptionConverter.class)
private String telephone;
```

---

### OW-04 · A03:2021 — Injection (Riesgo Bajo — Mitigado)

**Severidad: 🟢 BAJA** | **CVSS 3.1: 2.0** | **CWE-89**

#### Descripción

Las consultas SQL utilizan **parámetros nombrados** en las tres implementaciones (JDBC, JPA, Spring Data JPA), lo que mitiga el riesgo de inyección SQL clásica. Sin embargo, existe una concatenación de cadena previa a la parametrización.

#### Evidencia — Concatenación Previa (Riesgo Residual)

**Archivo:** `repository/jpa/JpaOwnerRepositoryImpl.java`, líneas 56-58:

```java
Query query = this.em.createQuery(
    "SELECT DISTINCT owner FROM Owner owner left join fetch owner.pets "
  + "WHERE owner.lastName LIKE :lastName");
query.setParameter("lastName", lastName + "%"); // Concatenación antes de bind
```

**Archivo:** `repository/jdbc/JdbcOwnerRepositoryImpl.java`, líneas 72-79:

```java
.param("lastName", lastName + "%") // Concatenación antes de bind — SAFE
```

**Evaluación:** La concatenación `lastName + "%"` ocurre ANTES de pasar el valor al parámetro nombrado. El motor de base de datos recibe el valor completo como un único parámetro. **El riesgo es bajo** pero la práctica no es ideal — es mejor utilizar funciones CONCAT del motor o criterias de JPA.

#### Código Mejorado

```java
// Mejor práctica: CONCAT en JPQL en vez de concatenación Java
@Query("SELECT DISTINCT owner FROM Owner owner "
     + "left join fetch owner.pets "
     + "WHERE owner.lastName LIKE CONCAT(:lastName, '%')")
Collection<Owner> findByLastName(@Param("lastName") String lastName);
```

---

### OW-05 · A04:2021 — Insecure Design

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 8.0** | **CWE-602**

#### Descripción

La arquitectura del sistema carece de un modelo de amenazas. No implementa el principio de defensa en profundidad, no separa datos públicos de sensibles, y no utiliza DTOs para controlar la exposición de datos.

#### Evidencias

| Hallazgo | Archivo | Línea | Impacto |
|----------|---------|-------|---------|
| Sin modelo de amenazas | — | — | No se identificaron riesgos antes del desarrollo |
| Entidades JPA expuestas directamente como respuesta | VetController.java | L51-62 | Todos los campos internos expuestos |
| IDs secuenciales (auto-increment INTEGER) | BaseEntity.java | L32 | Enumeración trivial de registros |
| Sin separación de capas (Controller → Service → Repository sin DTOs) | ClinicServiceImpl.java | L60-64 | Datos internos expuestos al cliente |
| CrashController en producción | CrashController.java | L32-36 | Endpoint que lanza RuntimeException deliberada |
| Wildcard `*` en rutas | VisitController.java | L69, L85 | Bypass de validación de relación owner↔pet |

#### Código Corregido — DTO Pattern

```java
// ══════════════════════════════════════════════════════
// DTO para Owner (solo campos necesarios para la vista)
// ══════════════════════════════════════════════════════
public record OwnerSummaryDto(
    String id,        // UUID opaco, NO el Integer secuencial
    String firstName,
    String lastName,
    String city,
    int petCount
) {
    public static OwnerSummaryDto from(Owner owner) {
        return new OwnerSummaryDto(
            UuidMapper.encode(owner.getId()), // Ofuscar ID secuencial
            owner.getFirstName(),
            owner.getLastName(),
            owner.getCity(),
            owner.getPets().size()
        );
    }
}

// ══════════════════════════════════════════════════════
// Eliminar CrashController de producción
// ══════════════════════════════════════════════════════
@Profile("dev") // Solo disponible en perfil de desarrollo
@Controller
public class CrashController {
    @GetMapping(value = "/oups")
    public String triggerException() {
        throw new RuntimeException("Demo exception");
    }
}
```

---

### OW-06 · A05:2021 — Security Misconfiguration

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 8.6** | **CWE-16**

#### Descripción

La aplicación carece de toda configuración de seguridad. Se detectan 9 problemas de configuración incorrecta o ausente.

#### Evidencias Detalladas

**6a. Sin cabeceras HTTP de seguridad (0/9 cabeceras)**

**Archivo:** `PetclinicInitializer.java`, líneas 75-79 — Único filtro es `CharacterEncodingFilter`:

```java
@Override
protected Filter[] getServletFilters() {
    CharacterEncodingFilter characterEncodingFilter =
        new CharacterEncodingFilter("UTF-8", true);
    return new Filter[]{characterEncodingFilter};
    // ❌ Sin SecurityHeadersFilter
    // ❌ Sin CsrfFilter
    // ❌ Sin CorsFilter
}
```

| Cabecera | Estado | Riesgo |
|----------|--------|--------|
| `Content-Security-Policy` | ❌ Ausente | XSS |
| `Strict-Transport-Security` | ❌ Ausente | MitM |
| `X-Content-Type-Options` | ❌ Ausente | MIME sniffing |
| `X-Frame-Options` | ❌ Ausente | Clickjacking |
| `X-XSS-Protection` | ❌ Ausente | XSS |
| `Referrer-Policy` | ❌ Ausente | Fuga de URLs |
| `Permissions-Policy` | ❌ Ausente | APIs del navegador |
| `Cache-Control` | ❌ Ausente | Datos PII cacheados |
| `Cross-Origin-Opener-Policy` | ❌ Ausente | Cross-origin leaks |

**6b. jpa.showSql=true en configuración base**

**Archivo:** `src/main/resources/spring/data-access.properties`, línea 11:

```properties
jpa.showSql=true  # ⚠️ SQL con PII volcado a logs
```

**Archivo:** `src/main/resources/spring/business-config.xml`, línea 41:

```xml
<bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"
      p:showSql="${jpa.showSql}"/>  <!-- Propaga showSql=true -->
```

**6c. Logging en nivel DEBUG**

**Archivo:** `src/main/resources/logback.xml`, línea 17:

```xml
<logger name="org.springframework.samples.petclinic" level="debug"/>
<!-- DEBUG + showSql + Owner.toString() = PII completa en logs -->
```

**6d. JMX sin autenticación**

**Archivo:** `src/main/java/org/springframework/samples/petclinic/util/CallMonitoringAspect.java`, líneas 37-58:

```java
@ManagedResource("petclinic:type=CallMonitor")
@Aspect
public class CallMonitoringAspect {
    @ManagedAttribute
    public void setEnabled(boolean enabled) { ... } // ← Sin auth

    @ManagedOperation
    public void reset() { ... } // ← Sin auth, puede desactivar monitoreo
}
```

**Archivo:** `src/main/resources/spring/tools-config.xml`, línea 35:

```xml
<context:mbean-export/>  <!-- Exporta MBeans sin restricciones -->
```

**6e. Scripts externos sin SRI**

**Archivo:** `src/main/webapp/WEB-INF/tags/htmlHeader.tag`, líneas 24-27:

```html
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<!-- ❌ Sin atributo integrity="" → vulnerable a CDN compromise -->
```

#### Código Corregido — Filtro de Cabeceras de Seguridad

```java
/**
 * Filtro conforme a OWASP Secure Headers Project.
 * Registrar en PetclinicInitializer.getServletFilters().
 */
public class OwaspSecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;

        // A05 — Security Misconfiguration: Cabeceras obligatorias
        response.setHeader("Content-Security-Policy",
            "default-src 'self'; "
          + "script-src 'self' https://cdn.jsdelivr.net; "
          + "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
          + "img-src 'self' data:; "
          + "font-src 'self' https://cdn.jsdelivr.net; "
          + "frame-ancestors 'none'; "
          + "base-uri 'self'; "
          + "form-action 'self'");
        response.setHeader("Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload");
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=()");
        response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
        response.setHeader("Cache-Control",
            "no-store, no-cache, must-revalidate, max-age=0");
        response.setHeader("Pragma", "no-cache");

        chain.doFilter(req, response);
    }
}
```

---

### OW-07 · A07:2021 — Identification and Authentication Failures

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 9.8** | **CWE-287**

#### Descripción

**No existe ningún mecanismo de autenticación.** Ni login, ni sesiones protegidas, ni tokens, ni integración con sistemas de identidad (Cl@ve, LDAP, OAuth2). Tampoco hay gestión de sesiones segura.

#### Evidencia

**Archivo:** `pom.xml` — Sin dependencia `spring-security-*`:

```xml
<!-- NO EXISTE:
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
</dependency>
-->
```

**Archivo:** `PetclinicInitializer.java` — Sin `DelegatingFilterProxy` para Spring Security.

**Archivo:** JSPs con `session="false"`:

```jsp
<!-- createOrUpdateOwnerForm.jsp, línea 1 -->
<%@ page session="false" trimDirectiveWhitespaces="true" %>
<!-- Las sesiones están explícitamente desactivadas en JSPs -->
```

#### Hallazgos Específicos

| Control | Estado | Referencia |
|---------|--------|------------|
| Login / Password | ❌ No existe | — |
| MFA / 2FA | ❌ No existe | — |
| JWT / Tokens | ❌ No existe | — |
| Sesiones HttpOnly + Secure | ❌ No existe | — |
| Timeout de sesión | ❌ No existe | OWASP recomienda 15-30 min para HPS |
| Regeneración de ID de sesión | ❌ No existe | — |
| Protección contra brute force | ❌ No existe | — |
| Invalidación de sesión en logout | ❌ No existe | — |

---

### OW-08 · A08:2021 — Software and Data Integrity Failures

**Severidad: 🟠 ALTA** | **CVSS 3.1: 7.4** | **CWE-829**

#### Descripción

Scripts cargados desde CDN externo sin verificación de integridad (SRI). No hay firma ni verificación de las dependencias Maven más allá de checksums implícitos.

#### Evidencia

**Archivo:** `src/main/webapp/WEB-INF/tags/htmlHeader.tag`, líneas 25-26:

```html
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<!-- Si el CDN es comprometido, JS malicioso se ejecuta en el navegador del usuario -->
```

**Archivo:** JSPs con JavaScript inline (bloquea CSP strict):

```jsp
<!-- createOrUpdatePetForm.jsp, líneas 11-13 -->
<script src="/webjars/flatpickr/4.6.13/dist/flatpickr.js"></script>
<script>
    flatpickr("#birthDate", {}); // ← Inline JS impide CSP nonce/hash
</script>
```

#### Código Corregido

```html
<!-- Reemplazar CDN externo con WebJars locales + SRI -->
<!--[if lt IE 9]>
<script src="${pageContext.request.contextPath}/webjars/html5shiv/3.7.3/html5shiv.min.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
<![endif]-->

<!-- Mover JS inline a fichero externo para permitir CSP estricto -->
<!-- petclinic-forms.js -->
<script src="${pageContext.request.contextPath}/resources/js/petclinic-forms.js"
        nonce="${cspNonce}"></script>
```

---

### OW-09 · A09:2021 — Security Logging and Monitoring Failures

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 7.5** | **CWE-778**

#### Descripción

No existe ningún log de auditoría de seguridad. Ningún acceso a datos se registra, ningún intento de acceso fallido se detecta, y los logs contienen PII vía `toString()` y `showSql`.

#### Evidencia 1 — PII en logs vía toString()

**Archivo:** `src/main/java/org/springframework/samples/petclinic/model/Owner.java`, líneas 140-151:

```java
@Override
public String toString() {
    return new ToStringCreator(this)
        .append("id", this.getId())
        .append("lastName", this.getLastName())     // ← PII en log
        .append("firstName", this.getFirstName())   // ← PII en log
        .append("address", this.address)             // ← PII en log
        .append("city", this.city)                   // ← PII en log
        .append("telephone", this.telephone)         // ← PII en log
        .toString();
}
```

#### Evidencia 2 — Sin log de auditoría

```
Ausentes:
- Log de acceso a datos de propietario (quién, qué, cuándo)
- Log de creación/modificación de registros
- Log de intentos de acceso no autorizados
- Log de búsquedas masivas (exfiltración)
- Alertas por acceso a IDs fuera de rango
- Correlación de eventos (traceId/spanId)
```

#### Evidencia 3 — Logback sin rotación ni fichero

**Archivo:** `src/main/resources/logback.xml`:

```xml
<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%-5level %logger{0} - %msg%n</pattern>
    </encoder>
</appender>
<!-- ❌ Solo consola, sin fichero, sin rotación, sin formato JSON, sin traceId -->
```

#### Código Corregido — Sistema de Auditoría

```java
// ══════════════════════════════════════════════════════
// Aspecto de auditoría para acceso a datos
// ══════════════════════════════════════════════════════
@Aspect
@Component
@Slf4j
public class DataAccessAuditAspect {

    @Around("execution(* org.springframework.samples.petclinic.service.ClinicService.find*(..))")
    public Object auditDataAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        String method = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        // Log de auditoría SIN PII — solo IDs y metadatos
        log.info("AUDIT|DATA_ACCESS|method={}|args={}|principal={}|timestamp={}",
            method,
            sanitizeArgs(args),
            getCurrentPrincipal(),
            Instant.now());

        Object result = joinPoint.proceed();

        log.info("AUDIT|DATA_ACCESS_OK|method={}|resultCount={}",
            method,
            result instanceof Collection<?> c ? c.size() : 1);

        return result;
    }

    private String sanitizeArgs(Object[] args) {
        return Arrays.stream(args)
            .map(arg -> arg instanceof String ? "***" : String.valueOf(arg))
            .collect(Collectors.joining(","));
    }
}
```

```xml
<!-- logback.xml corregido -->
<configuration>
    <appender name="AUDIT" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/audit.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/audit.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>365</maxHistory>
        </rollingPolicy>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
        </encoder>
    </appender>

    <logger name="org.springframework.samples.petclinic" level="INFO"/>
    <!-- NUNCA debug en producción -->

    <root level="WARN">
        <appender-ref ref="AUDIT"/>
    </root>
</configuration>
```

---

### OW-10 · A05:2021 — Exposición de Información de Error

**Severidad: 🟠 ALTA** | **CVSS 3.1: 5.3** | **CWE-209**

#### Descripción

La página de error expone el mensaje completo de la excepción al usuario, incluyendo potencialmente rutas internas, nombres de tablas y detalles de la pila.

#### Evidencia

**Archivo:** `src/main/webapp/WEB-INF/jsp/exception.jsp`, línea 12:

```jsp
<p>${exception.message}</p>  <!-- ⚠️ Excepción expuesta al usuario -->
```

**Archivo:** `src/main/java/org/springframework/samples/petclinic/web/CrashController.java`, líneas 32-36:

```java
@GetMapping(value = "/oups")
public String triggerException() {
    throw new RuntimeException(
        "Expected: controller used to showcase what happens when an exception is thrown");
}
// ⚠️ Endpoint de debug presente en producción
```

**Archivo:** `src/main/resources/spring/mvc-core-config.xml`, líneas 60-66:

```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
    <property name="defaultErrorView" value="exception"/>
    <property name="warnLogCategory" value="warn"/>
    <!-- Sin filtrado de mensaje, sin ProblemDetail (RFC 9457) -->
</bean>
```

#### Código Corregido

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex, HttpServletRequest request) {
        String traceId = MDC.get("traceId");

        // Log completo internamente
        log.error("Unhandled exception traceId={} path={}",
            traceId, request.getRequestURI(), ex);

        // Respuesta genérica al usuario
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setTitle("Error interno del servidor");
        problem.setDetail("Se ha producido un error inesperado. "
            + "Ref: " + traceId);
        problem.setProperty("traceId", traceId);
        return problem;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problem.setTitle("Acceso denegado");
        problem.setDetail("No tiene permisos para acceder a este recurso.");
        return problem;
    }
}
```

---

## 🔴 VULNERABILIDADES OWASP API SECURITY TOP 10 (2023)

---

### API-01 · API1:2023 — Broken Object Level Authorization (BOLA)

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 9.8** | **CWE-284**

#### Descripción

Todos los endpoints que aceptan un ID como parámetro son vulnerables a BOLA/IDOR. No se verifica la relación entre el usuario autenticado y el recurso solicitado.

#### Endpoints Vulnerables

| Endpoint | Recurso Accesible | Vector |
|----------|-------------------|--------|
| `GET /owners/{ownerId}` | Datos completos del owner + mascotas + visitas | Incrementar ownerId: 1, 2, 3... |
| `GET /owners/{ownerId}/edit` | Formulario edición con PII | Idem |
| `POST /owners/{ownerId}/edit` | Modificar datos de cualquier owner | Cambiar ownerId en URL |
| `GET /owners/{ownerId}/pets/{petId}/edit` | Datos de mascota de otro owner | Combinar ownerId/petId |
| `GET /owners/*/pets/{petId}/visits` | Historial de visitas de otro owner | Wildcard bypass |
| `GET /vets.json` | Listado completo de veterinarios | Sin restricción |
| `GET /vets.xml` | Listado completo (XML con JAXB) | Sin restricción |

#### Demostración del Ataque

```bash
# Atacante enumera todos los owners (IDs 1-10)
for i in $(seq 1 10); do
  curl -s http://target/owners/$i | grep -E "firstName|lastName|telephone|address"
done

# Resultado: PII de TODOS los propietarios expuesta
# George Franklin, 110 W. Liberty St., 6085551023
# Betty Davis, 638 Cardinal Ave., 6085551749
# Eduardo Rodriquez, 2693 Commerce St., 6085558763
# ...
```

#### Código Corregido — Verificación de Propiedad Centralizada

```java
/**
 * Servicio de autorización a nivel de objeto (prevención BOLA).
 * Verificación centralizada antes de cada acceso a datos.
 */
@Service
public class ObjectLevelAuthorizationService {

    private final ClinicService clinicService;

    public ObjectLevelAuthorizationService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    public Owner authorizeOwnerAccess(int ownerId, Authentication auth) {
        Owner owner = clinicService.findOwnerById(ownerId);
        if (owner == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        ClinicUser user = (ClinicUser) auth.getPrincipal();

        return switch (user.getRole()) {
            case OWNER -> {
                if (user.getOwnerId() != ownerId) {
                    throw new AccessDeniedException("BOLA blocked: " + ownerId);
                }
                yield owner;
            }
            case VET -> {
                if (!clinicService.isAssignedVet(ownerId, user.getVetId())) {
                    throw new AccessDeniedException("Not assigned vet");
                }
                yield owner;
            }
            case ADMIN -> owner;
        };
    }

    public Pet authorizePetAccess(int ownerId, int petId, Authentication auth) {
        Owner owner = authorizeOwnerAccess(ownerId, auth);
        return owner.getPets().stream()
            .filter(p -> p.getId() == petId)
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Pet does not belong to owner"));
    }
}
```

---

### API-02 · API2:2023 — Broken Authentication

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 9.8** | **CWE-287**

_(Cubierto en OW-07 — Sin autenticación de ningún tipo)_

---

### API-03 · API3:2023 — Broken Object Property Level Authorization

**Severidad: 🟠 ALTA** | **CVSS 3.1: 7.5** | **CWE-213**

#### Descripción

Las entidades JPA se exponen directamente como respuesta sin DTOs, revelando todos los campos internos. La API JSON/XML de veterinarios expone la entidad completa con relaciones.

#### Evidencia

**Archivo:** `src/main/java/org/springframework/samples/petclinic/web/VetController.java`, líneas 51-63:

```java
@GetMapping(value = "/vets.json", produces = MediaType.APPLICATION_JSON_VALUE)
@ResponseBody
public Vets showJsonVetList() {
    return getVets(); // ← Retorna entidad completa sin filtrar campos
}

@GetMapping(value = "/vets.xml", produces = MediaType.APPLICATION_XML_VALUE)
@ResponseBody
public Vets showXmlVetList() {
    return getVets(); // ← Idem con serialización JAXB
}
```

**Archivo:** `src/main/java/org/springframework/samples/petclinic/model/Vet.java`:

```java
@Entity
public class Vet extends Person {
    // Expone: id, firstName, lastName (heredados)
    // + specialties con todos sus campos
    // Sin @JsonIgnore, sin DTO, sin filtro de campos
}
```

#### Código Corregido

```java
// DTO para exposición segura de datos de veterinarios
public record VetDto(
    String id,
    String fullName,
    List<String> specialties
) {
    public static VetDto from(Vet vet) {
        return new VetDto(
            UuidMapper.encode(vet.getId()),
            vet.getFirstName() + " " + vet.getLastName(),
            vet.getSpecialties().stream()
                .map(Specialty::getName)
                .toList()
        );
    }
}

// Controlador actualizado
@GetMapping(value = "/vets.json", produces = MediaType.APPLICATION_JSON_VALUE)
@ResponseBody
public List<VetDto> showJsonVetList() {
    return clinicService.findVets().stream()
        .map(VetDto::from)
        .toList();
}
```

---

### API-04 · API4:2023 — Unrestricted Resource Consumption

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 7.5** | **CWE-770**

#### Descripción

No existe rate limiting en ningún endpoint. La búsqueda de owners sin paginación permite exfiltración masiva. Los formularios POST no tienen protección contra flood.

#### Evidencia

```
Endpoints sin rate limiting:
- GET  /owners         → Búsqueda masiva (devuelve todos los registros)
- GET  /owners/{id}    → Enumeración sin límite
- POST /owners/new     → Creación masiva de registros
- POST /owners/{id}/edit → Modificación masiva
- GET  /vets.json      → Dump completo de veterinarios
- POST /owners/{ownerId}/pets/{petId}/visits/new → Flood de visitas

Sin implementar:
- X-RateLimit-Limit header
- X-RateLimit-Remaining header
- HTTP 429 Too Many Requests
- Backoff / throttling
```

#### Código Corregido — Rate Limiting con Bucket4j

```java
/**
 * Filtro de rate limiting por IP y endpoint.
 * Previene exfiltración masiva y DoS.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        String key = getClientIp(request) + ":" + request.getRequestURI();
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket(request));

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.setHeader("X-RateLimit-Remaining",
                String.valueOf(probe.getRemainingTokens()));
            chain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setHeader("Retry-After",
                String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            response.getWriter().write(
                "{\"error\":\"Too Many Requests\",\"retryAfter\":\""
              + probe.getNanosToWaitForRefill() / 1_000_000_000 + "s\"}");
        }
    }

    private Bucket createBucket(HttpServletRequest request) {
        if (request.getRequestURI().startsWith("/owners") &&
            "GET".equals(request.getMethod())) {
            // Búsquedas: 30 por minuto
            return Bucket.builder()
                .addLimit(Bandwidth.classic(30, Refill.greedy(30, Duration.ofMinutes(1))))
                .build();
        }
        // Otros endpoints: 60 por minuto
        return Bucket.builder()
            .addLimit(Bandwidth.classic(60, Refill.greedy(60, Duration.ofMinutes(1))))
            .build();
    }
}
```

---

### API-05 · API5:2023 — Broken Function Level Authorization (BFLA)

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 8.6** | **CWE-285**

#### Descripción

No existe control de acceso a nivel funcional. Cualquier usuario puede ejecutar cualquier operación: crear owners, editar datos ajenos, registrar visitas médicas, consultar listado completo de veterinarios.

#### Evidencia — Operaciones de Escritura sin Rol

| Operación | Endpoint | Rol Necesario | Rol Actual |
|-----------|----------|---------------|------------|
| Crear owner | POST `/owners/new` | ADMIN o SELF_REGISTER | ❌ Anónimo |
| Editar owner | POST `/owners/{id}/edit` | ADMIN o PROPIETARIO | ❌ Anónimo |
| Crear mascota | POST `/owners/{id}/pets/new` | ADMIN o PROPIETARIO | ❌ Anónimo |
| Editar mascota | POST `/owners/{id}/pets/{petId}/edit` | ADMIN o PROPIETARIO | ❌ Anónimo |
| Registrar visita | POST `/owners/{id}/pets/{petId}/visits/new` | VET o ADMIN | ❌ Anónimo |
| Listar veterinarios | GET `/vets.json` | AUTHENTICATED | ❌ Anónimo |

#### Código Corregido — RBAC con Spring Security

```java
// ══════════════════════════════════════════════════════
// Configuración Spring Security con RBAC
// ══════════════════════════════════════════════════════
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos
                .requestMatchers("/", "/resources/**", "/webjars/**").permitAll()
                .requestMatchers("/login", "/error").permitAll()

                // Owners: solo propietarios autenticados + admin
                .requestMatchers(HttpMethod.GET, "/owners/find").authenticated()
                .requestMatchers(HttpMethod.GET, "/owners").authenticated()
                .requestMatchers(HttpMethod.GET, "/owners/{id}").authenticated()
                .requestMatchers(HttpMethod.POST, "/owners/new").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/owners/{id}/edit")
                    .hasAnyRole("ADMIN", "OWNER")

                // Visitas: solo veterinarios y admin
                .requestMatchers(HttpMethod.POST, "/owners/*/pets/*/visits/new")
                    .hasAnyRole("VET", "ADMIN")

                // API de vets: solo usuarios autenticados
                .requestMatchers("/vets", "/vets.json", "/vets.xml").authenticated()

                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/owners/find")
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .sessionManagement(session -> session
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true)
            )
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            );

        return http.build();
    }
}
```

---

### API-06 · API6:2023 — Unrestricted Access to Sensitive Business Flows

**Severidad: 🟠 ALTA** | **CVSS 3.1: 6.5** | **CWE-799**

#### Descripción

Flujos de negocio sensibles (registrar visitas médicas, crear propietarios) no tienen controles anti-automatización ni validación de lógica de negocio.

#### Evidencia

**Archivo:** `VisitController.java`, líneas 75-83 — Creación de visitas sin control:

```java
@PostMapping(value = "/owners/{ownerId}/pets/{petId}/visits/new")
public String processNewVisitForm(@Valid Visit visit, BindingResult result) {
    if (result.hasErrors()) {
        return "pets/createOrUpdateVisitForm";
    }
    this.clinicService.saveVisit(visit); // ← Sin verificar:
    // - ¿Existe límite de visitas por día?
    // - ¿El pet pertenece al owner del path?
    // - ¿El usuario tiene permiso para registrar visitas?
    return "redirect:/owners/{ownerId}";
}
```

#### Código Corregido

```java
@PostMapping(value = "/owners/{ownerId}/pets/{petId}/visits/new")
public String processNewVisitForm(
        @Valid Visit visit,
        BindingResult result,
        @PathVariable("ownerId") int ownerId,
        @PathVariable("petId") int petId,
        Authentication auth) {

    // Verificar que pet pertenece al owner
    Pet pet = authorizationService.authorizePetAccess(ownerId, petId, auth);

    // Límite de negocio: máximo 3 visitas por día por mascota
    long todayVisits = pet.getVisits().stream()
        .filter(v -> v.getDate().equals(LocalDate.now()))
        .count();
    if (todayVisits >= 3) {
        result.rejectValue("date", "limit.exceeded",
            "Máximo 3 visitas por día");
    }

    if (result.hasErrors()) {
        return "pets/createOrUpdateVisitForm";
    }

    visit.setPet(pet);
    this.clinicService.saveVisit(visit);
    return "redirect:/owners/{ownerId}";
}
```

---

### API-07 · API7:2023 — Server Side Request Forgery (SSRF)

**Severidad: 🟢 BAJA** | **CVSS 3.1: 2.0** | **CWE-918**

**Estado:** No aplica directamente. La aplicación no realiza llamadas HTTP a URLs proporcionadas por el usuario ni procesa URLs externas. Riesgo residual bajo.

---

### API-08 · API8:2023 — Security Misconfiguration

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 8.6** | **CWE-16**

_(Cubierto en OW-06 — Múltiples problemas de configuración)_

Hallazgos adicionales específicos de API:

| Hallazgo | Evidencia | Impacto |
|----------|-----------|---------|
| API `/vets.xml` expone JAXB marshalling sin Content-Type negotiation restrictiva | VetController.java:58 | Información completa de entidades |
| Sin versionado de API | No existe `/api/v1/` | Cambios rompen clientes |
| Sin documentación OpenAPI/Swagger | No existe spec | Superficie de ataque desconocida |
| Sin CORS configurado (ni restrictivo ni presente) | No existe config CORS | En contexto SPA sería problemático |

---

### API-09 · API9:2023 — Improper Inventory Management

**Severidad: 🟡 MEDIA** | **CVSS 3.1: 5.3** | **CWE-1059**

#### Descripción

El endpoint `/oups` (CrashController) es un endpoint de debug que no debería existir en producción. No existe documentación API ni inventario de endpoints.

#### Evidencia

**Archivo:** `CrashController.java`, líneas 32-36:

```java
@GetMapping(value = "/oups")
public String triggerException() {
    throw new RuntimeException(
        "Expected: controller used to showcase what happens when an exception is thrown");
}
```

---

### API-10 · API10:2023 — Unsafe Consumption of APIs

**Severidad: 🟢 BAJA** | **CVSS 3.1: 2.0** | **CWE-20**

**Estado:** La aplicación no consume APIs de terceros. Riesgo bajo. El único consumo externo es la carga de scripts CDN (cubierto en OW-08).

---

## 🟠 VULNERABILIDADES ADICIONALES

---

### ADD-01 · Mass Assignment / Over-Posting

**Severidad: 🟠 ALTA** | **CVSS 3.1: 6.5** | **CWE-915**

#### Descripción

Los formularios vinculan `@ModelAttribute` directamente a entidades JPA usando blacklist (`setDisallowedFields("id")`) en lugar de whitelist.

#### Evidencia

**Archivo:** `OwnerController.java`, líneas 49-51:

```java
@InitBinder
public void setAllowedFields(WebDataBinder dataBinder) {
    dataBinder.setDisallowedFields("id"); // Solo bloquea 'id'
    // Todos los demás campos son vinculables, incluidos potenciales
    // campos internos si se añaden en el futuro
}
```

**Archivo:** `createOrUpdateOwnerForm.jsp`, línea 13 — El formulario usa `form:form modelAttribute="owner"`:

```jsp
<form:form modelAttribute="owner" class="form-horizontal" id="add-owner-form">
    <!-- Un atacante puede añadir campos hidden adicionales -->
```

#### Código Corregido

```java
@InitBinder
public void setAllowedFields(WebDataBinder dataBinder) {
    // WHITELIST: solo permitir campos explícitos del formulario
    dataBinder.setAllowedFields(
        "firstName", "lastName", "address", "city", "telephone");
}
```

---

### ADD-02 · Validación de Input Insuficiente

**Severidad: 🟡 MEDIA** | **CVSS 3.1: 5.3** | **CWE-20**

#### Evidencia

| Entidad | Campo | Validación Actual | Falta |
|---------|-------|-------------------|-------|
| Owner | firstName | `@NotEmpty` | `@Size(max=30)`, `@Pattern` anti-XSS |
| Owner | lastName | `@NotEmpty` | `@Size(max=30)`, `@Pattern` anti-XSS |
| Owner | address | `@NotEmpty` | `@Size(max=255)`, `@Pattern` |
| Owner | city | `@NotEmpty` | `@Size(max=80)`, `@Pattern` |
| Owner | telephone | `@NotEmpty`, `@Digits(integer=10)` | `@Pattern(regexp="\\d{9,15}")` |
| Visit | description | `@NotEmpty` | `@Size(max=255)` — DoS sin límite |
| Visit | date | Ninguna | `@NotNull`, `@PastOrPresent` |
| Pet | name | Validador custom | `@Size(max=30)` |
| Pet | birthDate | Validador custom | `@PastOrPresent` |

#### Código Corregido

```java
@Entity
@Table(name = "owners")
public class Owner extends Person {

    @Column(name = "address")
    @NotEmpty
    @Size(max = 255, message = "Dirección demasiado larga")
    @Pattern(regexp = "^[\\p{L}\\d\\s.,#/-]+$",
             message = "Caracteres no permitidos en dirección")
    private String address;

    @Column(name = "city")
    @NotEmpty
    @Size(max = 80, message = "Ciudad demasiado larga")
    @Pattern(regexp = "^[\\p{L}\\s.-]+$",
             message = "Caracteres no permitidos en ciudad")
    private String city;

    @Column(name = "telephone")
    @NotEmpty
    @Pattern(regexp = "^\\d{9,15}$",
             message = "Teléfono debe tener entre 9 y 15 dígitos")
    private String telephone;
}
```

---

### ADD-03 · CSRF Ausente en Formularios POST

**Severidad: 🔴 CRÍTICA** | **CVSS 3.1: 8.8** | **CWE-352**

#### Descripción

Ninguno de los 5 formularios POST tiene protección CSRF.

#### Evidencia

| Formulario | Archivo | Token CSRF |
|------------|---------|------------|
| Crear Owner | createOrUpdateOwnerForm.jsp:13 | ❌ |
| Crear Pet | createOrUpdatePetForm.jsp:19 | ❌ |
| Crear Visit | createOrUpdateVisitForm.jsp:37 | ❌ |
| Buscar Owner | findOwners.jsp:13 | ❌ (GET) |

**Archivo:** `createOrUpdateOwnerForm.jsp`, línea 13:

```jsp
<form:form modelAttribute="owner" class="form-horizontal" id="add-owner-form">
    <!-- Sin <input type="hidden" name="_csrf" value="..."/> -->
```

#### Demostración del Ataque

```html
<!-- Página maliciosa que modifica datos del owner 1 -->
<html>
<body onload="document.forms[0].submit()">
<form action="http://target/owners/1/edit" method="POST">
    <input type="hidden" name="firstName" value="HACKED"/>
    <input type="hidden" name="lastName" value="HACKED"/>
    <input type="hidden" name="address" value="Attacker Address"/>
    <input type="hidden" name="city" value="Malicious"/>
    <input type="hidden" name="telephone" value="0000000000"/>
</form>
</body>
</html>
```

---

### ADD-04 · Contenedorización Insegura (Jib)

**Severidad: 🟡 MEDIA** | **CVSS 3.1: 5.5** | **CWE-250**

#### Evidencia

**Archivo:** `pom.xml`, líneas 471-491:

```xml
<configuration>
    <from>
        <image>jetty:11.0-jdk17</image>
        <!-- ❌ Sin digest hash (mutable tag) -->
        <!-- ❌ Sin usuario non-root -->
    </from>
    <to>
        <tags>
            <tag>latest</tag>  <!-- ❌ Tag mutable -->
        </tags>
    </to>
</configuration>
```

---

### ADD-05 · Pipeline CI/CD sin Escaneo de Seguridad Completo

**Severidad: 🟡 MEDIA** | **CVSS 3.1: 4.0** | **CWE-693**

#### Evidencia

| Escaneo | Estado |
|---------|--------|
| SAST (SonarCloud) | ✅ Configurado |
| Dependency Scanning (OWASP/Snyk) | ❌ Ausente |
| Container Image Scanning | ❌ Ausente |
| DAST (ZAP/Nuclei) | ❌ Ausente |
| Secret Detection (gitleaks) | ❌ Ausente |
| SBOM Generation | ❌ Ausente |
| License Compliance | ❌ Ausente |

---

## 📊 Resumen de Hallazgos por Categoría OWASP

### OWASP Top 10 Web (2021)

| ID | Categoría | Hallazgos | Severidad Máxima |
|----|-----------|-----------|------------------|
| A01 | Broken Access Control | OW-01, OW-02 | 🔴 CRÍTICA (9.8) |
| A02 | Cryptographic Failures | OW-03 | 🔴 CRÍTICA (9.1) |
| A03 | Injection | OW-04 | 🟢 BAJA (2.0) |
| A04 | Insecure Design | OW-05 | 🔴 CRÍTICA (8.0) |
| A05 | Security Misconfiguration | OW-06, OW-10 | 🔴 CRÍTICA (8.6) |
| A06 | Vulnerable Components | — | ✅ NO ENCONTRADO |
| A07 | Auth/Session Failures | OW-07 | 🔴 CRÍTICA (9.8) |
| A08 | Software/Data Integrity | OW-08 | 🟠 ALTA (7.4) |
| A09 | Logging/Monitoring Failures | OW-09 | 🔴 CRÍTICA (7.5) |
| A10 | SSRF | — | ✅ NO APLICA |

### OWASP API Security Top 10 (2023)

| ID | Categoría | Hallazgos | Severidad Máxima |
|----|-----------|-----------|------------------|
| API1 | BOLA | API-01 | 🔴 CRÍTICA (9.8) |
| API2 | Broken Authentication | API-02 | 🔴 CRÍTICA (9.8) |
| API3 | Broken Object Property Auth | API-03 | 🟠 ALTA (7.5) |
| API4 | Unrestricted Resource Consumption | API-04 | 🔴 CRÍTICA (7.5) |
| API5 | BFLA | API-05 | 🔴 CRÍTICA (8.6) |
| API6 | Sensitive Business Flows | API-06 | 🟠 ALTA (6.5) |
| API7 | SSRF | API-07 | 🟢 BAJA (2.0) |
| API8 | Security Misconfiguration | API-08 | 🔴 CRÍTICA (8.6) |
| API9 | Improper Inventory Mgmt | API-09 | 🟡 MEDIA (5.3) |
| API10 | Unsafe API Consumption | API-10 | 🟢 BAJA (2.0) |

### Hallazgos Adicionales

| ID | Categoría | Severidad |
|----|-----------|-----------|
| ADD-01 | Mass Assignment | 🟠 ALTA (6.5) |
| ADD-02 | Input Validation | 🟡 MEDIA (5.3) |
| ADD-03 | CSRF Ausente | 🔴 CRÍTICA (8.8) |
| ADD-04 | Container Security | 🟡 MEDIA (5.5) |
| ADD-05 | CI/CD Security | 🟡 MEDIA (4.0) |

---

## 🎯 Plan de Acción Priorizado

### 🔴 Fase 1 — EMERGENCIA (0-7 días)

| # | Acción | Hallazgos | Esfuerzo |
|---|--------|-----------|----------|
| 1 | **Implementar Spring Security** con autenticación obligatoria | OW-07, API-02, ADD-03 | Alto |
| 2 | **CSRF tokens** en todos los formularios POST | ADD-03 | Medio |
| 3 | **Filtro de cabeceras de seguridad** (CSP, HSTS, X-Frame-Options) | OW-06 | Bajo |
| 4 | **Desactivar `jpa.showSql=true`** y cambiar log a INFO | OW-06, OW-09 | Bajo |
| 5 | **Eliminar CrashController** de producción (`@Profile("dev")`) | OW-10, API-09 | Bajo |
| 6 | **Eliminar `exception.message`** del JSP de error | OW-10 | Bajo |

### 🟠 Fase 2 — ALTA PRIORIDAD (7-30 días)

| # | Acción | Hallazgos | Esfuerzo |
|---|--------|-----------|----------|
| 7 | **RBAC (roles ADMIN/OWNER/VET)** con verificación a nivel de endpoint | API-05 | Alto |
| 8 | **Verificación BOLA/IDOR** en todos los endpoints con ID | OW-01, API-01 | Alto |
| 9 | **Rate limiting** (Bucket4j o equivalente) | API-04 | Medio |
| 10 | **DTOs** para APIs JSON/XML (no exponer entidades JPA) | API-03 | Medio |
| 11 | **Paginación obligatoria** en búsqueda de owners | OW-02 | Medio |
| 12 | **Externalizar credenciales BD** (Vault / env vars) | OW-03 | Medio |
| 13 | **Whitelist en `@InitBinder`** (`setAllowedFields`) | ADD-01 | Bajo |
| 14 | **Validación completa** (`@Size`, `@Pattern`, `@PastOrPresent`) | ADD-02 | Bajo |
| 15 | **Sanitizar `Owner.toString()`** (eliminar PII de logs) | OW-09 | Bajo |

### 🟡 Fase 3 — PRIORIDAD MEDIA (30-60 días)

| # | Acción | Hallazgos | Esfuerzo |
|---|--------|-----------|----------|
| 16 | **Cifrado TLS 1.2+** en todos los conectores | OW-03 | Medio |
| 17 | **Cifrado AES-256-GCM** para campos PII en BD | OW-03 | Alto |
| 18 | **Sistema de auditoría** (aspecto AOP + log estructurado JSON) | OW-09 | Alto |
| 19 | **Reemplazar CDN externo** por WebJars locales con SRI | OW-08 | Bajo |
| 20 | **Mover JS inline a ficheros externos** para CSP estricto | OW-08 | Medio |
| 21 | **JMX con autenticación** o desactivar en producción | OW-06 | Bajo |
| 22 | **Hardening Jib** (digest, non-root, SecurityContext K8s) | ADD-04 | Medio |
| 23 | **Pipeline seguro** (OWASP Dependency-Check, gitleaks, Trivy) | ADD-05 | Medio |
| 24 | **IDs opacos (UUID v4)** en vez de Integer secuencial | OW-01 | Alto |

---

## 📚 Referencias

| Referencia | URL |
|-----------|-----|
| OWASP Top 10 Web 2021 | https://owasp.org/Top10/ |
| OWASP API Security Top 10 2023 | https://owasp.org/API-Security/editions/2023/en/0x11-t10/ |
| OWASP Secure Headers Project | https://owasp.org/www-project-secure-headers/ |
| CWE/SANS Top 25 | https://cwe.mitre.org/top25/ |
| CVSS 3.1 Calculator | https://www.first.org/cvss/calculator/3.1 |
| Spring Security Reference | https://docs.spring.io/spring-security/reference/ |
| Bucket4j Rate Limiting | https://github.com/bucket4j/bucket4j |
| RFC 9457 Problem Details | https://www.rfc-editor.org/rfc/rfc9457 |
| ENS RD 311/2022 (España) | https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191 |
| NIST SP 800-53 Rev. 5 | https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final |

---

> **Nota:** Este informe se ha generado mediante análisis estático del código fuente. Se recomienda complementar con pruebas DAST (OWASP ZAP, Burp Suite) y pentesting manual para validar los hallazgos y detectar vulnerabilidades adicionales en tiempo de ejecución.

---

*Documento generado el 2026-03-07 por OWASP Web + API Security Analyzer*

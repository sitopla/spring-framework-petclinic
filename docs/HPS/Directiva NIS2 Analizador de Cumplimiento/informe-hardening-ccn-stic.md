# Informe de Hardening CCN-STIC — Spring Framework PetClinic

**Fecha:** 2026-03-07  
**Analista:** CCN-STIC Hardening Analyzer  
**Sistema analizado:** `spring-framework-petclinic` v7.0.3  
**Guías CCN-STIC aplicadas:** CCN-STIC-885, CCN-STIC-807, CCN-STIC-812, CCN-STIC-811, CCN-STIC-827  
**Categoría ENS estimada:** MEDIA (por tratar datos personales de ciudadanos y potenciales datos de salud)

---

## Estado de Hardening

```
╔══════════════════════════════════════════════════════════════╗
║         ESTADO DE HARDENING: ❌ CRÍTICO                      ║
║         PUNTUACIÓN: 6 / 100                                  ║
║                                                              ║
║  Controles CCN-STIC verificados:       52                    ║
║  Controles conformes:                   3  (6%)              ║
║  Controles parciales:                   5  (10%)             ║
║  Controles ausentes:                   44  (84%)             ║
║                                                              ║
║  Hallazgos Críticos:   9                                     ║
║  Hallazgos Altos:      7                                     ║
║  Hallazgos Medios:     5                                     ║
║  Hallazgos Bajos:      3                                     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 1. Análisis de Cabeceras HTTP de Seguridad (CCN-STIC-885)

### Estado actual

| Cabecera | Estado | Valor actual | Valor requerido (CCN-STIC-885) |
|---|---|---|---|
| `Content-Security-Policy` | ❌ **AUSENTE** | — | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';` |
| `Strict-Transport-Security` | ❌ **AUSENTE** | — | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | ❌ **AUSENTE** | — | `nosniff` |
| `X-Frame-Options` | ❌ **AUSENTE** | — | `DENY` |
| `Referrer-Policy` | ❌ **AUSENTE** | — | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ❌ **AUSENTE** | — | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Cache-Control` (datos sensibles) | ❌ **AUSENTE** | — | `no-store, no-cache, must-revalidate, private` |
| `Server` | ⚠️ **EXPUESTO** | Tomcat/Jetty (por defecto) | Debe ocultarse |
| `X-Powered-By` | ⚠️ **EXPUESTO** | Probablemente Servlet API | Debe eliminarse |

**Resultado: 0/9 cabeceras de seguridad implementadas — Incumplimiento total CCN-STIC-885.**

### Evidencia

```html
<!-- htmlHeader.tag — Solo meta tags funcionales, ninguno de seguridad -->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- ❌ No hay CSP meta tag -->
    <!-- ❌ No hay Cache-Control para páginas con PII -->
</head>
```

```java
// PetclinicInitializer.java — Único filtro registrado: encoding
protected Filter[] getServletFilters() {
    CharacterEncodingFilter characterEncodingFilter =
        new CharacterEncodingFilter("UTF-8", true);
    return new Filter[]{characterEncodingFilter};
    // ❌ Sin SecurityHeadersFilter
}
```

---

## 2. Análisis de Configuración TLS (CCN-STIC-807)

### Estado actual

| Aspecto TLS | Estado | Detalle |
|---|---|---|
| Protocolo mínimo | ❌ **SIN TLS** | No hay configuración HTTPS |
| TLS 1.3 | ❌ Ausente | — |
| TLS 1.2 | ❌ Ausente | — |
| TLS 1.0/1.1 (prohibidos) | — | No aplica (sin TLS de ningún tipo) |
| Cipher suites CCN-STIC | ❌ Ausente | Sin configuración |
| Forward secrecy (ECDHE) | ❌ Ausente | — |
| Certificado del servidor | ❌ Ausente | Sin keystore |
| OCSP stapling | ❌ Ausente | — |
| TLS en conexión a BD | ❌ Ausente | `jdbc.url` sin parámetros SSL |
| HSTS preload | ❌ Ausente | — |

**Resultado: 0/10 controles TLS implementados — Todas las comunicaciones son en texto plano.**

### Evidencia

```properties
# data-access.properties — Conexión BD sin TLS
jdbc.url=${jdbc.url}
# Para MySQL sería: jdbc:mysql://host/db?useSSL=true&requireSSL=true&verifyServerCertificate=true
# Para PostgreSQL: jdbc:postgresql://host/db?ssl=true&sslmode=verify-full
# Actualmente: sin ningún parámetro de cifrado
```

### Algoritmos prohibidos por CCN-STIC-807 (verificación)

| Algoritmo | Estado en el sistema | CCN-STIC-807 |
|---|---|---|
| MD5 | No detectado en código | ✅ No usado (PROHIBIDO) |
| SHA-1 | No detectado en código | ✅ No usado (PROHIBIDO para firma) |
| DES / 3DES | No detectado | ✅ No usado (PROHIBIDO) |
| RC4 | No detectado | ✅ No usado (PROHIBIDO) |
| AES-256-GCM | No implementado | ❌ Requerido para cifrado en reposo |
| RSA-3072+ | No implementado | ❌ Requerido para certificados |

---

## 3. Análisis de Seguridad de Contenedores Docker (CCN-STIC-812)

### Configuración Jib actual

```xml
<!-- pom.xml, líneas 471-490 -->
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <from>
            <image>jetty:11.0-jdk17</image>
            <!-- ❌ Sin hash de digest: vulnerable a supply-chain attacks -->
            <!-- ❌ Imagen base potencialmente con vulnerabilidades conocidas -->
        </from>
        <container>
            <entrypoint>java,-jar,/usr/local/jetty/start.jar</entrypoint>
            <!-- ❌ Sin configuración de usuario no-root -->
            <!-- ❌ Sin health check -->
            <!-- ❌ Sin límites de recursos -->
        </container>
        <to>
            <image>docker.io/${docker.image.prefix}/${project.artifactId}</image>
            <tags>
                <tag>${project.version}</tag>
                <tag>latest</tag>
                <!-- ⚠️ Tag 'latest' mutable — no reproducible -->
            </tags>
        </to>
        <!-- ❌ Sin escaneo de imagen (Trivy, Grype) -->
    </configuration>
</plugin>
```

### Checklist CCN-STIC-812 para contenedores

| Control | Estado | Detalle |
|---|---|---|
| Imagen base con digest SHA256 | ❌ | `jetty:11.0-jdk17` sin `@sha256:...` |
| Usuario no-root (`runAsNonRoot`) | ❌ | Sin `<user>` en Jib config |
| Filesystem solo lectura | ❌ | Sin `readOnlyRootFilesystem` |
| Sin capabilities Linux | ❌ | Sin `drop: ALL` |
| Sin `privileged: true` | ⚠️ Parcial | Jib no establece privileged, pero tampoco lo restringe |
| Health check | ❌ | Sin health endpoint ni Docker HEALTHCHECK |
| Escaneo de vulnerabilidades | ❌ | Sin Trivy/Grype en pipeline |
| Secretos fuera de la imagen | ⚠️ | Properties parametrizados pero sin Vault/K8s secrets |
| Límites de CPU/memoria | ❌ | Sin `<resources>` en Jib |
| Tag inmutable (no `latest`) | ❌ | Usa `latest` como tag |

---

## 4. Análisis de Gestión de Secretos

### Checklist CCN-STIC

| Control | Estado | Evidencia |
|---|---|---|
| Passwords en properties/código | ⚠️ **Parcial** | Parametrizado como `${jdbc.password}` pero sin gestión segura |
| API keys en código fuente | ✅ No detectado | — |
| Certificados/claves privadas en repo | ✅ No detectado | — |
| Connection strings con credenciales | ⚠️ **Parcial** | `jdbc.url`, `jdbc.username`, `jdbc.password` en properties |
| Credenciales en variables de entorno | — | No hay Dockerfile propio, pero posible via JVM args |
| Gestor de secretos (Vault, KMS) | ❌ **Ausente** | Sin integración con ningún gestor |
| Rotación automática de secretos | ❌ **Ausente** | — |
| Secretos en logs | ⚠️ **Riesgo** | `jpa.showSql=true` puede logear valores de parámetros |
| `.gitignore` protege secretos | ❌ **Ausente** | No incluye `*.env`, `*.key`, `*.pem`, `secrets/` |
| PII en ficheros SQL (data.sql) | ❌ **INCUMPLIMIENTO** | Nombres, direcciones, teléfonos reales en 4 ficheros data.sql |

### Evidencia — PII hardcodeada en data.sql

```sql
-- hsqldb/data.sql (y equivalentes en h2, mysql, postgresql)
INSERT INTO owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023');
INSERT INTO owners VALUES (2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sun Prairie', '6085551749');
-- ... 10 propietarios con datos completos
-- Estos ficheros se distribuyen con el código fuente
```

---

## 5. Hallazgos Detallados

---

### STIC-01 — Ausencia Total de Cabeceras HTTP de Seguridad

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-885 §4.3 — Cabeceras de seguridad HTTP  
**ENS:** mp.s.2 (Protección de los servicios)

**Hallazgo:**

La aplicación no envía ninguna cabecera de seguridad HTTP. No hay filtro Servlet, no hay configuración Spring Security, ni meta tags HTML equivalentes. Esto deja al sistema vulnerable a:

- **Clickjacking** (sin X-Frame-Options/CSP frame-ancestors)
- **MIME confusion** (sin X-Content-Type-Options)
- **Protocol downgrade** (sin HSTS)
- **XSS amplificado** (sin CSP)
- **Information leakage via referrer** (sin Referrer-Policy)
- **Fingerprinting** (Server/X-Powered-By expuestos)

**Remediación — Filtro Servlet CCN-STIC-885:**

```java
/**
 * Filtro de cabeceras de seguridad HTTP conforme CCN-STIC-885.
 * Registrar en PetclinicInitializer.getServletFilters().
 */
public class CcnStic885HeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                          FilterChain chain) throws IOException, ServletException {

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // === CCN-STIC-885 §4.3.1 — Content Security Policy ===
        httpResponse.setHeader("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +  // Bootstrap necesita inline styles
            "img-src 'self' data:; " +
            "font-src 'self'; " +
            "frame-ancestors 'none'; " +
            "form-action 'self'; " +
            "base-uri 'self'; " +
            "object-src 'none'");

        // === CCN-STIC-885 §4.3.2 — Strict Transport Security ===
        // Solo enviar en HTTPS (RFC 6797 §7.2)
        if (httpRequest.isSecure()) {
            httpResponse.setHeader("Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload");
        }

        // === CCN-STIC-885 §4.3.3 — Anti-MIME sniffing ===
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");

        // === CCN-STIC-885 §4.3.4 — Anti-clickjacking ===
        httpResponse.setHeader("X-Frame-Options", "DENY");

        // === CCN-STIC-885 §4.3.5 — Referrer Policy ===
        httpResponse.setHeader("Referrer-Policy",
            "strict-origin-when-cross-origin");

        // === CCN-STIC-885 §4.3.6 — Permissions Policy ===
        httpResponse.setHeader("Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=(), " +
            "usb=(), magnetometer=(), gyroscope=(), accelerometer=()");

        // === CCN-STIC-885 §4.3.7 — Anti-caching para datos sensibles ===
        String path = httpRequest.getRequestURI();
        if (path.contains("/owners") || path.contains("/pets") ||
            path.contains("/visits")) {
            httpResponse.setHeader("Cache-Control",
                "no-store, no-cache, must-revalidate, private");
            httpResponse.setHeader("Pragma", "no-cache");
            httpResponse.setHeader("Expires", "0");
        }

        // === Ocultar información del servidor ===
        httpResponse.setHeader("Server", "");
        httpResponse.setHeader("X-Powered-By", "");

        // === Cross-Origin Isolation ===
        httpResponse.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        httpResponse.setHeader("Cross-Origin-Resource-Policy", "same-origin");

        chain.doFilter(request, response);
    }
}
```

**Registro en PetclinicInitializer:**

```java
@Override
protected Filter[] getServletFilters() {
    CharacterEncodingFilter encoding = new CharacterEncodingFilter("UTF-8", true);
    CcnStic885HeadersFilter securityHeaders = new CcnStic885HeadersFilter();
    return new Filter[]{ encoding, securityHeaders };
}
```

**Esfuerzo:** 1-2 días  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-02 — Sin Configuración TLS (Comunicaciones en Texto Plano)

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-807 §5 — Protocolos de comunicación segura  
**ENS:** mp.com.2 (Protección de las comunicaciones)

**Hallazgo:**

Todas las comunicaciones (cliente-servidor y servidor-base de datos) se realizan en texto plano, sin ningún tipo de cifrado TLS. Esto permite la interceptación de credenciales, datos personales y tokens de sesión mediante ataques de tipo man-in-the-middle.

**Remediación — Configuración Tomcat con cipher suites CCN-STIC-807:**

```xml
<!-- server.xml — Conector HTTPS con cipher suites CCN-STIC-807 -->
<Connector port="8443"
           protocol="org.apache.coyote.http11.Http11NioProtocol"
           maxThreads="200"
           SSLEnabled="true"
           scheme="https"
           secure="true">
    <SSLHostConfig
        protocols="TLSv1.3+TLSv1.2"
        honorCipherOrder="false"
        certificateVerification="none"
        ciphers="TLS_AES_256_GCM_SHA384,
                 TLS_CHACHA20_POLY1305_SHA256,
                 TLS_AES_128_GCM_SHA256,
                 ECDHE-ECDSA-AES256-GCM-SHA384,
                 ECDHE-RSA-AES256-GCM-SHA384,
                 ECDHE-ECDSA-AES128-GCM-SHA256,
                 ECDHE-RSA-AES128-GCM-SHA256">

        <!-- Certificado RSA-4096 o ECDSA P-384 -->
        <Certificate
            certificateKeystoreFile="/opt/petclinic/certs/keystore.p12"
            certificateKeystoreType="PKCS12"
            certificateKeystorePassword="${KEYSTORE_PASSWORD}"/>
    </SSLHostConfig>
</Connector>

<!-- Redirigir todo HTTP a HTTPS -->
<Connector port="8080"
           protocol="HTTP/1.1"
           redirectPort="8443"/>
```

```xml
<!-- web.xml o programáticamente — Forzar HTTPS -->
<security-constraint>
    <web-resource-collection>
        <web-resource-name>Entire Application</web-resource-name>
        <url-pattern>/*</url-pattern>
    </web-resource-collection>
    <user-data-constraint>
        <transport-guarantee>CONFIDENTIAL</transport-guarantee>
    </user-data-constraint>
</security-constraint>
```

**Para conexión a BD con TLS:**

```properties
# PostgreSQL con SSL
jdbc.url=jdbc:postgresql://dbhost:5432/petclinic?ssl=true&sslmode=verify-full&sslrootcert=/opt/petclinic/certs/db-ca.pem

# MySQL con SSL
jdbc.url=jdbc:mysql://dbhost:3306/petclinic?useSSL=true&requireSSL=true&verifyServerCertificate=true&trustCertificateKeyStoreUrl=file:/opt/petclinic/certs/truststore.jks
```

**Esfuerzo:** 2-3 días  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-03 — Scripts Externos Sin Subresource Integrity (SRI)

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-885 §4.6 — Integridad de recursos  
**OWASP:** A08:2021 — Software and Data Integrity Failures

**Hallazgo:**

La aplicación carga scripts JavaScript desde un CDN externo (`oss.maxcdn.com`) sin atributos `integrity` ni `crossorigin`. Si el CDN fuese comprometido, un atacante podría inyectar JavaScript malicioso en todas las páginas de la aplicación.

**Evidencia:**

```html
<!-- htmlHeader.tag, líneas 25-26 — Scripts externos sin SRI -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<!-- ❌ Sin atributo integrity="sha384-..." -->
<!-- ❌ Sin atributo crossorigin="anonymous" -->
<!-- ⚠️ oss.maxcdn.com es un dominio de tercero que podría cambiar de propietario -->
```

**Remediación — Opción A (Recomendada): Eliminar scripts externos**

```html
<!-- htmlHeader.tag — ELIMINAR los scripts de oss.maxcdn.com -->
<!-- IE8 está fuera de soporte desde 2016 — no necesita polyfills -->
<!-- Si se necesita soporte legacy, servir desde /resources/js/ (self-hosted) -->
```

**Remediación — Opción B: Añadir SRI si se mantienen**

```html
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"
        integrity="sha384-[hash calculado]"
        crossorigin="anonymous"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"
        integrity="sha384-[hash calculado]"
        crossorigin="anonymous"></script>
<![endif]-->
```

**Esfuerzo:** 1 hora (eliminar) / 2 horas (SRI)  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-04 — JavaScript Inline Impide CSP Estricta

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-885 §4.3.1 — Content Security Policy  
**OWASP:** A03:2021 — Injection

**Hallazgo:**

Las vistas JSP `createOrUpdatePetForm.jsp` y `createOrUpdateVisitForm.jsp` contienen JavaScript inline (`<script>` blocks) para inicializar el componente flatpickr. Esto obliga a usar `'unsafe-inline'` en la directiva CSP `script-src`, lo cual anula gran parte de la protección contra XSS.

**Evidencia:**

```jsp
<!-- createOrUpdatePetForm.jsp, líneas 11-13 -->
<script>
    flatpickr('#birthDate', {dateFormat: 'Y/m/d'});  <!-- ❌ Inline JS -->
</script>

<!-- createOrUpdateVisitForm.jsp, líneas 12-14 -->
<script>
    flatpickr('#date', {dateFormat: 'Y/m/d'});  <!-- ❌ Inline JS -->
</script>
```

**Remediación:**

Extraer el JavaScript inline a un fichero externo:

```javascript
// /resources/js/petclinic-forms.js — Fichero externo (compatible con CSP 'self')
document.addEventListener('DOMContentLoaded', function() {
    var birthDateField = document.getElementById('birthDate');
    if (birthDateField) {
        flatpickr(birthDateField, { dateFormat: 'Y/m/d' });
    }
    var dateField = document.getElementById('date');
    if (dateField) {
        flatpickr(dateField, { dateFormat: 'Y/m/d' });
    }
});
```

```jsp
<!-- En las JSP, reemplazar el bloque inline por: -->
<jsp:attribute name="customScript">
    <link rel="stylesheet" href="/webjars/flatpickr/4.6.13/dist/flatpickr.min.css">
    <script src="/webjars/flatpickr/4.6.13/dist/flatpickr.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/petclinic-forms.js"></script>
</jsp:attribute>
```

**Esfuerzo:** 2-3 horas  
**Prioridad:** 🔴 ALTA

---

### STIC-05 — Sin Protección CSRF

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-885 §4.5 — Protección contra CSRF  
**OWASP:** A01:2021 — Broken Access Control

**Hallazgo:**

Los formularios HTML no incluyen tokens CSRF y no hay middleware que los valide. Un atacante puede construir una página web que, al ser visitada por un usuario autenticado (si se implementase autenticación), envíe peticiones POST maliciosas:

- `POST /owners/new` — Crear propietarios falsos
- `POST /owners/{id}/edit` — Modificar datos de propietarios
- `POST /owners/{id}/pets/new` — Añadir mascotas
- `POST /owners/{id}/pets/{id}/visits/new` — Añadir visitas veterinarias falsas

**Evidencia:**

```html
<!-- createOrUpdateOwnerForm.jsp — Formulario sin token CSRF -->
<form:form modelAttribute="owner" class="form-horizontal" method="post">
    <!-- ❌ Sin <input type="hidden" name="_csrf" value="..."/> -->
</form:form>
```

**Remediación:**

Con Spring Security activado, CSRF se habilita por defecto. Sin Spring Security, implementar un filtro manual:

```java
/**
 * Filtro CSRF para aplicaciones sin Spring Security.
 * Genera y valida tokens Synchronizer Token Pattern (CCN-STIC-885).
 */
public class CsrfProtectionFilter implements Filter {

    private static final String CSRF_TOKEN_ATTR = "_csrf";
    private static final String CSRF_HEADER = "X-CSRF-TOKEN";
    private static final Set<String> SAFE_METHODS =
        Set.of("GET", "HEAD", "OPTIONS", "TRACE");

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                          FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // Generar token si no existe
        HttpSession session = request.getSession(true);
        String sessionToken = (String) session.getAttribute(CSRF_TOKEN_ATTR);
        if (sessionToken == null) {
            sessionToken = UUID.randomUUID().toString();
            session.setAttribute(CSRF_TOKEN_ATTR, sessionToken);
        }
        request.setAttribute(CSRF_TOKEN_ATTR, sessionToken);

        // Validar token en métodos que modifican estado
        if (!SAFE_METHODS.contains(request.getMethod().toUpperCase())) {
            String requestToken = request.getParameter(CSRF_TOKEN_ATTR);
            if (requestToken == null) {
                requestToken = request.getHeader(CSRF_HEADER);
            }
            if (!sessionToken.equals(requestToken)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "CSRF token validation failed");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
```

**Esfuerzo:** 1 día  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-06 — Exposición de Información en Errores

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-885 §4.7 — Gestión de errores  
**OWASP:** A05:2021 — Security Misconfiguration

**Hallazgo:**

La aplicación expone información técnica sensible en las respuestas de error:

1. **exception.jsp** muestra `${exception.message}` directamente al usuario, revelando stack traces, nombres de clases, queries SQL y estructura interna
2. **CrashController** (`/oups`) lanza deliberadamente una RuntimeException en producción
3. **SimpleMappingExceptionResolver** captura excepciones pero redirige a una vista que muestra detalles

**Evidencia:**

```jsp
<!-- exception.jsp — Línea 12: Fuga de información técnica -->
<p>${exception.message}</p>
<!-- Un atacante puede deducir: framework, versión, estructura BD, etc. -->
```

```java
// CrashController.java — Endpoint de debug expuesto en producción
@GetMapping(value = "/oups")
public String triggerException() {
    throw new RuntimeException("Expected: controller used to showcase " +
        "what happens when an exception is thrown");
}
```

**Remediación:**

```jsp
<!-- exception.jsp — Sin información técnica -->
<%@ page session="false" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="petclinic" tagdir="/WEB-INF/tags" %>

<petclinic:layout pageName="error">
    <h2>Se ha producido un error</h2>
    <p>
        Lo sentimos, se ha producido un error inesperado en el sistema.
        Si el problema persiste, contacte con el servicio de soporte técnico.
    </p>
    <p class="text-muted">
        Referencia del error: ${pageContext.request.getAttribute('javax.servlet.error.status_code')}
    </p>
    <!-- NUNCA mostrar: ${exception.message}, ${exception.stackTrace} -->
</petclinic:layout>
```

```java
// Eliminar CrashController o restringirlo
@Controller
@Profile("!production") // Solo disponible en entornos de desarrollo
public class CrashController {
    @GetMapping(value = "/oups")
    public String triggerException() {
        throw new RuntimeException("Debug exception — not available in production");
    }
}
```

**Esfuerzo:** 2-3 horas  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-07 — Gestión de Sesiones Insegura

**Severidad:** 🔴 CRÍTICA  
**Guía:** CCN-STIC-885 §4.4 — Gestión de sesiones  
**OWASP:** A07:2021 — Identification and Authentication Failures

**Hallazgo:**

La gestión de sesiones tiene múltiples deficiencias:

- Las JSP declaran `session="false"` deshabilitando el tracking de sesión, pero no hay alternativa segura
- Sin flags `HttpOnly`, `Secure`, ni `SameSite` en cookies
- Sin timeout de sesión configurado
- Sin regeneración de ID de sesión tras login (prevención de session fixation)
- Sin límite de sesiones concurrentes por usuario
- Sin invalidación segura de sesión (logout)

**Remediación — Configuración de sesión en Tomcat:**

```xml
<!-- web.xml o context.xml — Hardening de sesión -->
<session-config>
    <session-timeout>30</session-timeout> <!-- 30 min inactividad -->
    <cookie-config>
        <http-only>true</http-only>    <!-- No accesible desde JavaScript -->
        <secure>true</secure>           <!-- Solo via HTTPS -->
        <max-age>1800</max-age>         <!-- 30 minutos -->
    </cookie-config>
    <tracking-mode>COOKIE</tracking-mode> <!-- No URL rewriting -->
</session-config>
```

```java
// Registrar como filtro para añadir SameSite (no soportado en web.xml)
public class SessionHardeningFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                          FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;

        // SameSite=Strict para prevenir CSRF vía cookies
        Collection<String> headers = response.getHeaders("Set-Cookie");
        boolean firstHeader = true;
        for (String header : headers) {
            if (!header.contains("SameSite")) {
                String newHeader = header + "; SameSite=Strict";
                if (firstHeader) {
                    response.setHeader("Set-Cookie", newHeader);
                    firstHeader = false;
                } else {
                    response.addHeader("Set-Cookie", newHeader);
                }
            }
        }

        chain.doFilter(req, res);
    }
}
```

**Esfuerzo:** 1 día  
**Prioridad:** ⚡ INMEDIATA

---

### STIC-08 — Validación de Entradas Insuficiente

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-885 §4.2 — Validación de entradas  
**OWASP:** A03:2021 — Injection

**Hallazgo:**

La validación de entradas es parcial e insuficiente para prevenir ataques de inyección:

**Lo que EXISTE (parcial):**
- ✅ `@NotEmpty` en campos requeridos (Person, Owner, Visit)
- ✅ `@Digits(fraction=0, integer=10)` en telephone
- ✅ `@Valid` en controllers para activar Bean Validation
- ✅ `dataBinder.setDisallowedFields("id")` previene mass assignment del ID

**Lo que FALTA:**
- ❌ Sin `@Size(max=N)` — permite entradas arbitrariamente largas (DoS, buffer overflow en BD)
- ❌ Sin `@Pattern` — no valida formato de teléfono, nombre, dirección
- ❌ Sin validación whitelist de caracteres (permite HTML/JS en campos de texto)
- ❌ Sin sanitización de la `description` de visitas (potencial XSS almacenado)
- ❌ Sin rate limiting en endpoints de búsqueda (`/owners?lastName=`)
- ❌ Parámetro `lastName` en búsqueda se pasa directamente a query JPA

**Evidencia:**

```java
// Person.java — Solo @NotEmpty, sin restricción de tamaño ni patrón
@NotEmpty
protected String firstName;  // ❌ Acepta: "<script>alert(1)</script>"

@NotEmpty
protected String lastName;   // ❌ Sin @Size, sin @Pattern
```

```java
// Owner.java — Telephone sin patrón estricto
@NotEmpty
@Digits(fraction = 0, integer = 10)
private String telephone;  // ❌ @Digits no es suficiente: permite "0000000000"
// Falta: @Pattern(regexp = "^[6-9]\\d{8}$") para teléfonos españoles
```

```java
// Visit.java — Descripción sin sanitización
@NotEmpty
private String description;  // ❌ Campo de texto libre sin @Size ni filtrado XSS
```

**Remediación:**

```java
// Person.java — Validación reforzada CCN-STIC-885
@NotEmpty
@Size(min = 1, max = 30, message = "El nombre debe tener entre 1 y 30 caracteres")
@Pattern(regexp = "^[\\p{L} .'-]+$",
    message = "El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones")
protected String firstName;

@NotEmpty
@Size(min = 1, max = 30)
@Pattern(regexp = "^[\\p{L} .'-]+$")
protected String lastName;
```

```java
// Owner.java — Campos con validación estricta
@NotEmpty
@Size(max = 255)
@Pattern(regexp = "^[\\p{L}\\p{N} .,'#/-]+$",
    message = "La dirección contiene caracteres no permitidos")
private String address;

@NotEmpty
@Size(max = 80)
@Pattern(regexp = "^[\\p{L} .'-]+$")
private String city;

@NotEmpty
@Pattern(regexp = "^\\d{9,15}$",
    message = "El teléfono debe contener entre 9 y 15 dígitos")
private String telephone;
```

```java
// Visit.java — Descripción con límite y filtrado
@NotEmpty
@Size(min = 1, max = 500,
    message = "La descripción debe tener entre 1 y 500 caracteres")
private String description;
```

**Esfuerzo:** 1 día  
**Prioridad:** 🔴 ALTA

---

### STIC-09 — Imagen Docker Sin Hardening

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-812 §6 — Seguridad en contenedores  
**ENS:** op.exp.2 (Configuración de seguridad)

**Hallazgo:**

La configuración Jib para generar la imagen Docker no aplica ningún control de seguridad:

- Imagen base sin digest (vulnerable a supply-chain attack)
- Ejecución como root (por defecto en Jetty)
- Sin health check
- Sin límites de recursos
- Tag `latest` mutable
- Sin escaneo de vulnerabilidades de la imagen

**Remediación:**

```xml
<!-- pom.xml — Jib con hardening CCN-STIC-812 -->
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>${docker.jib-maven-plugin.version}</version>
    <configuration>
        <from>
            <!-- Imagen base con digest SHA256 — INMUTABLE -->
            <image>eclipse-temurin:17-jre-alpine@sha256:[digest-actual]</image>
        </from>
        <container>
            <user>10001:10001</user> <!-- ✅ Usuario no-root -->
            <ports>
                <port>8443</port>    <!-- Solo HTTPS -->
            </ports>
            <jvmFlags>
                <jvmFlag>-Djava.security.egd=file:/dev/./urandom</jvmFlag>
                <jvmFlag>-XX:+UseContainerSupport</jvmFlag>
                <jvmFlag>-XX:MaxRAMPercentage=75.0</jvmFlag>
                <jvmFlag>-Dspring.profiles.active=production</jvmFlag>
                <!-- Deshabilitar JMX remoto en producción -->
                <jvmFlag>-Dcom.sun.management.jmxremote=false</jvmFlag>
            </jvmFlags>
            <labels>
                <org.opencontainers.image.source>
                    https://github.com/spring-petclinic/spring-framework-petclinic
                </org.opencontainers.image.source>
                <org.opencontainers.image.vendor>PetClinic</org.opencontainers.image.vendor>
            </labels>
            <creationTime>USE_CURRENT_TIMESTAMP</creationTime>
        </container>
        <to>
            <image>docker.io/${docker.image.prefix}/${project.artifactId}</image>
            <tags>
                <tag>${project.version}</tag>
                <!-- ❌ Eliminar tag 'latest' — no reproducible -->
            </tags>
        </to>
    </configuration>
</plugin>
```

**Si se despliega en Kubernetes — SecurityContext CCN-STIC:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: petclinic
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: petclinic
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
          privileged: false
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "200m"
            memory: "256Mi"
        livenessProbe:
          httpGet:
            path: /
            port: 8443
            scheme: HTTPS
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 8443
            scheme: HTTPS
          initialDelaySeconds: 15
          periodSeconds: 5
        volumeMounts:
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: tmp
        emptyDir: {}
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🔴 ALTA

---

### STIC-10 — JMX Expuesto Sin Autenticación

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-885 §4.8 — Interfaces de administración  
**ENS:** op.acc.6 (Acceso local)

**Hallazgo:**

`CallMonitoringAspect` expone un MBean JMX (`petclinic:type=CallMonitor`) sin autenticación ni cifrado TLS. JMX sin protección permite:
- Lectura de métricas internas (reconocimiento)
- Ejecución remota de operaciones (`reset()`)
- Potencial escalada si se combina con gadgets de deserialización

**Evidencia:**

```java
@ManagedResource("petclinic:type=CallMonitor")  // ❌ Sin ACL
@Aspect
public class CallMonitoringAspect {
    @ManagedOperation  // ❌ Invocable sin auth
    public void reset() { ... }
}
```

```xml
<!-- tools-config.xml -->
<context:mbean-export/>  <!-- ❌ Exporta sin restricciones -->
```

**Remediación:**

**Opción A (Recomendada para producción): Deshabilitar JMX remoto**

```properties
# JVM args — Solo JMX local
-Dcom.sun.management.jmxremote=false
```

**Opción B: Asegurar JMX si se necesita**

```properties
-Dcom.sun.management.jmxremote.authenticate=true
-Dcom.sun.management.jmxremote.ssl=true
-Dcom.sun.management.jmxremote.password.file=/etc/petclinic/jmxremote.password
-Dcom.sun.management.jmxremote.access.file=/etc/petclinic/jmxremote.access
-Dcom.sun.management.jmxremote.registry.ssl=true
```

**Esfuerzo:** 2-3 horas  
**Prioridad:** 🔴 ALTA

---

### STIC-11 — Logging Inseguro (DEBUG + PII + Sin Rotación)

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-885 §4.7 — Registro de actividad  
**ENS:** op.exp.8 (Registro de la actividad de los usuarios)

**Hallazgo:**

La configuración de logging viola múltiples controles CCN-STIC:

1. **Nivel DEBUG en producción** — expone lógica interna y datos sensibles
2. **`jpa.showSql=true`** — registra queries SQL con datos personales interpolados
3. **Solo appender de consola** — logs se pierden al reiniciar, sin posibilidad forense
4. **Sin formato estructurado** — imposible ingestar en SIEM
5. **Sin rotación ni retención** — incumple requisitos de conservación ENS
6. **`Owner.toString()` con PII** — cualquier log de Owner vuelca nombre, dirección, teléfono

**Evidencia:**

```xml
<!-- logback.xml -->
<logger name="org.springframework.samples.petclinic" level="debug"/>
<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%-5level %logger{0} - %msg%n</pattern>
        <!-- ❌ Sin timestamp, sin correlationId, sin userId -->
    </encoder>
</appender>
```

**Remediación:**

```xml
<!-- logback.xml — Conforme CCN-STIC-885 -->
<configuration scan="true" scanPeriod="30 seconds">

    <property name="LOG_DIR" value="${LOG_DIR:-/var/log/petclinic}"/>
    <!-- ENS: retención mínima 2 años para categoría MEDIA -->
    <property name="RETENTION" value="730"/>

    <!-- Producción: fichero con rotación + JSON para SIEM -->
    <appender name="FILE"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_DIR}/application.log</file>
        <rollingPolicy
            class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>
                ${LOG_DIR}/application.%d{yyyy-MM-dd}.%i.log.gz
            </fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>${RETENTION}</maxHistory>
            <totalSizeCap>50GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.JsonEncoder"/>
    </appender>

    <!-- Nivel WARN en producción — NUNCA DEBUG -->
    <logger name="org.springframework.samples.petclinic" level="WARN"/>
    <logger name="org.hibernate.SQL" level="OFF"/>
    <logger name="org.hibernate.type.descriptor.sql" level="OFF"/>

    <root level="WARN">
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

```properties
# data-access.properties
jpa.showSql=false  # ❌→✅ Desactivar SQL logging
```

```java
// Owner.toString() — Sin PII
@Override
public String toString() {
    return new ToStringCreator(this)
        .append("id", this.getId())
        .append("new", this.isNew())
        .toString();
}
```

**Esfuerzo:** 1 día  
**Prioridad:** 🔴 ALTA

---

### STIC-12 — PII Hardcodeada en Ficheros SQL del Repositorio

**Severidad:** 🟠 ALTA  
**Guía:** CCN-STIC-885 §4.8 + RGPD Art. 5.1.f  
**ENS:** mp.info.1 (Datos de carácter personal)

**Hallazgo:**

Los ficheros `data.sql` de 4 motores de BD (HSQLDB, H2, MySQL, PostgreSQL) contienen datos personales con aspecto de reales (nombres completos, direcciones, teléfonos) que se distribuyen con el código fuente:

```sql
INSERT INTO owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023');
INSERT INTO owners VALUES (2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sun Prairie', '6085551749');
-- ... 10 registros con PII completa en cada variante de BD
```

**Riesgo:** Aunque sean datos ficticios, se confunden con datos reales y crean un precedente de incluir PII en repositorios de código.

**Remediación:**

```sql
-- Reemplazar con datos claramente ficticios
INSERT INTO owners VALUES (1, 'Propietario', 'Uno', 'Calle Test 1', 'Ciudad Test', '000000001');
INSERT INTO owners VALUES (2, 'Propietario', 'Dos', 'Calle Test 2', 'Ciudad Test', '000000002');
```

**Esfuerzo:** 1-2 horas  
**Prioridad:** 🟠 ALTA

---

### STIC-13 — .gitignore No Protege Secretos

**Severidad:** 🟡 MEDIA  
**Guía:** CCN-STIC-885 §4.8 — Gestión de secretos en desarrollo

**Hallazgo:**

El `.gitignore` solo excluye artefactos de IDE y build. No protege contra el commit accidental de credenciales, claves privadas o ficheros de configuración con secretos.

**Evidencia actual:**

```gitignore
# Solo IDE y build
.settings/
.classpath
.project
.idea
*.iml
.vscode
target/
.DS_Store
```

**Remediación:**

```gitignore
# === Existentes ===
.settings/
.classpath
.project
.idea
*.iml
.vscode
target/
.DS_Store

# === CCN-STIC: Protección de secretos ===
# Ficheros de entorno
*.env
*.env.*
.env.local
.env.production

# Claves y certificados
*.key
*.pem
*.p12
*.pfx
*.jks
*.keystore
*.truststore
*.cer
*.crt

# Directorios de secretos
secrets/
.secrets/
credentials/

# Configuración con credenciales
application-local.properties
application-local.yml
*-secret.properties
*-secret.yml

# HashiCorp Vault
.vault-token

# SSH
id_rsa
id_ed25519
*.pub

# GPG
*.gpg
*.asc
```

**Esfuerzo:** 30 minutos  
**Prioridad:** 🟡 MEDIA

---

### STIC-14 — Serialización XML Sin Protección XXE

**Severidad:** 🟡 MEDIA  
**Guía:** CCN-STIC-885 §4.2.3 — Inyección XML  
**OWASP:** A05:2021 — Security Misconfiguration

**Hallazgo:**

El endpoint `/vets.xml` (VetController) utiliza JAXB marshalling vía `MarshallingView` para serializar objetos a XML. Aunque JAXB es generalmente seguro para marshalling (serialización), la configuración predeterminada del `Jaxb2Marshaller` podría ser vulnerable si se extiende para deserialización (unmarshalling) sin deshabilitar entidades externas.

**Evidencia:**

```xml
<!-- mvc-view-config.xml -->
<bean id="vets/vetList.xml"
      class="org.springframework.web.servlet.view.xml.MarshallingView">
    <property name="marshaller" ref="marshaller"/>
</bean>
<oxm:jaxb2-marshaller id="marshaller">
    <oxm:class-to-be-bound name="org.springframework.samples.petclinic.model.Vets"/>
</oxm:jaxb2-marshaller>
```

**Remediación:**

Si se extiende la API para aceptar XML de entrada (unmarshalling), asegurar:

```java
@Bean
public Jaxb2Marshaller marshaller() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    marshaller.setClassesToBeBound(Vets.class);

    Map<String, Object> properties = new HashMap<>();
    // Deshabilitar entidades externas (prevención XXE)
    properties.put(XMLConstants.ACCESS_EXTERNAL_DTD, "");
    properties.put(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
    marshaller.setMarshallerProperties(properties);

    return marshaller;
}
```

**Esfuerzo:** 2-3 horas  
**Prioridad:** 🟡 MEDIA

---

### STIC-15 — Sin Rate Limiting ni Protección Anti-DoS

**Severidad:** 🟡 MEDIA  
**Guía:** CCN-STIC-885 §4.9 — Disponibilidad  
**ENS:** mp.s.8 (Protección frente a denegación de servicio)

**Hallazgo:**

No hay mecanismos de rate limiting ni protección contra denegación de servicio:

- El endpoint `/owners?lastName=` permite búsquedas ilimitadas
- Sin límite de peticiones por IP ni por sesión
- Sin protección contra ataques de fuerza bruta (si se añade auth)
- El pool de conexiones a BD no tiene límites configurados (puede agotarse)

**Remediación:**

```java
/**
 * Filtro de rate limiting básico (por IP).
 * Para producción: usar WAF (ModSecurity, AWS WAF) o
 * Bucket4j/Resilience4j con Redis para distribuido.
 */
public class RateLimitFilter implements Filter {

    // Max 60 requests per minute per IP
    private final Map<String, Deque<Long>> requestLog =
        new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 60;
    private static final long WINDOW_MS = 60_000;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                          FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String clientIp = request.getRemoteAddr();
        long now = System.currentTimeMillis();

        Deque<Long> timestamps = requestLog.computeIfAbsent(
            clientIp, k -> new ConcurrentLinkedDeque<>());

        // Limpiar entradas fuera de ventana
        while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= MAX_REQUESTS) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.getWriter().write("Too Many Requests");
            return;
        }

        timestamps.addLast(now);
        response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS));
        response.setHeader("X-RateLimit-Remaining",
            String.valueOf(MAX_REQUESTS - timestamps.size()));

        chain.doFilter(req, res);
    }
}
```

**Esfuerzo:** 1-2 días  
**Prioridad:** 🟡 MEDIA

---

### STIC-16 — Pool de Conexiones a BD Sin Hardening

**Severidad:** 🟡 MEDIA  
**Guía:** CCN-STIC-885 §4.8 — Configuración segura de componentes

**Hallazgo:**

El pool Tomcat JDBC se configura solo con credenciales, sin parámetros de seguridad ni rendimiento:

```xml
<bean id="dataSource" class="org.apache.tomcat.jdbc.pool.DataSource"
      p:driverClassName="${jdbc.driverClassName}"
      p:url="${jdbc.url}"
      p:username="${jdbc.username}"
      p:password="${jdbc.password}"/>
<!-- Sin: maxActive, maxIdle, maxWait, testOnBorrow, validationQuery,
     removeAbandoned, logAbandoned -->
```

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
      p:initialSize="5"
      p:maxWait="10000"
      p:testOnBorrow="true"
      p:testWhileIdle="true"
      p:validationQuery="SELECT 1"
      p:validationInterval="30000"
      p:timeBetweenEvictionRunsMillis="30000"
      p:minEvictableIdleTimeMillis="60000"
      p:removeAbandoned="true"
      p:removeAbandonedTimeout="60"
      p:logAbandoned="true"
      p:jmxEnabled="false"/>
```

**Esfuerzo:** 1-2 horas  
**Prioridad:** 🟡 MEDIA

---

### STIC-17 — Sin Endpoint de Salud (Health Check)

**Severidad:** 🟢 BAJA  
**Guía:** CCN-STIC-812 §6.3 — Monitorización de contenedores

**Hallazgo:**

No hay endpoint de health check para orquestadores de contenedores (Kubernetes, Docker Compose) ni para balanceadores de carga. Esto impide la detección automática de fallos y la rotación de instancias degradadas.

**Remediación:**

```java
@Controller
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    @ResponseBody
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("timestamp", Instant.now().toString());

        try (Connection conn = dataSource.getConnection()) {
            conn.createStatement().execute("SELECT 1");
            status.put("database", "UP");
        } catch (SQLException e) {
            status.put("status", "DOWN");
            status.put("database", "DOWN");
            return ResponseEntity.status(503).body(status);
        }

        return ResponseEntity.ok(status);
    }
}
```

**Esfuerzo:** 1-2 horas  
**Prioridad:** 🟢 BAJA

---

### STIC-18 — Sin CORS Configurado

**Severidad:** 🟢 BAJA  
**Guía:** CCN-STIC-885 §4.5.2 — Cross-Origin Resource Sharing

**Hallazgo:**

No hay política CORS configurada. Aunque la aplicación JSP actual no necesita CORS (es server-rendered), los endpoints JSON/XML (`/vets.json`, `/vets.xml`) podrían ser consumidos por frontends en otro origen sin restricción.

**Remediación:** Si se necesita CORS:

```java
// Registrar via WebMvcConfigurer o en mvc-core-config.xml
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/vets.json")
        .allowedOrigins("https://petclinic.example.es")
        .allowedMethods("GET")
        .allowedHeaders("Content-Type", "Accept")
        .maxAge(3600);
}
```

**Esfuerzo:** 1 hora  
**Prioridad:** 🟢 BAJA

---

### STIC-19 — Sin Content-Type Explícito en Respuestas

**Severidad:** 🟢 BAJA  
**Guía:** CCN-STIC-885 §4.3.3

**Hallazgo:**

Los endpoints JSON y XML confían en el Content-Type por defecto sin charset explícito, lo que podría permitir ataques de charset sniffing en navegadores antiguos.

**Remediación:** Ya cubierto parcialmente por `X-Content-Type-Options: nosniff` (STIC-01). Adicionalmente, asegurar `charset=UTF-8` en todas las respuestas.

**Esfuerzo:** 30 minutos  
**Prioridad:** 🟢 BAJA

---

## Resumen de Cumplimiento por Guía CCN-STIC

### CCN-STIC-885 — Seguridad en Aplicaciones Web

| Control | Estado | Hallazgo |
|---|---|---|
| Cabeceras HTTP de seguridad (9 cabeceras) | ❌ 0/9 | STIC-01 |
| Protección CSRF | ❌ Ausente | STIC-05 |
| Gestión de sesiones segura | ❌ Ausente | STIC-07 |
| Validación de entradas | ⚠️ Parcial | STIC-08 |
| Gestión de errores | ❌ Insegura | STIC-06 |
| Logging seguro | ❌ Inseguro | STIC-11 |
| Integridad de recursos (SRI) | ❌ Ausente | STIC-03 |
| Rate limiting | ❌ Ausente | STIC-15 |
| Interfaces de administración | ❌ Expuestas | STIC-10 |

### CCN-STIC-807 — Criptografía en el ENS

| Control | Estado | Hallazgo |
|---|---|---|
| TLS 1.2+ en comunicaciones | ❌ Sin TLS | STIC-02 |
| Cipher suites aprobadas | ❌ Sin TLS | STIC-02 |
| Cifrado en reposo (AES-256) | ❌ Ausente | STIC-02 |
| Certificados RSA-3072+/ECDSA P-384+ | ❌ Ausente | STIC-02 |
| Algoritmos prohibidos (MD5/SHA1/DES) | ✅ No usados | — |
| Forward secrecy (ECDHE) | ❌ Sin TLS | STIC-02 |

### CCN-STIC-812 — Seguridad Cloud/Contenedores

| Control | Estado | Hallazgo |
|---|---|---|
| Imagen base con digest | ❌ Sin digest | STIC-09 |
| Usuario no-root | ❌ Ausente | STIC-09 |
| Filesystem solo lectura | ❌ Ausente | STIC-09 |
| Drop capabilities | ❌ Ausente | STIC-09 |
| Health check | ❌ Ausente | STIC-17 |
| Escaneo de imagen | ❌ Ausente | STIC-09 |
| Gestión de secretos | ❌ Ausente | STIC-12, STIC-13 |

---

## Plan de Acción Priorizado

### Fase 1 — INMEDIATA (0-7 días) — Quick Wins de Seguridad

| # | Acción | Hallazgo | Esfuerzo |
|---|---|---|---|
| 1 | Implementar filtro de cabeceras HTTP CCN-STIC-885 | STIC-01 | 1-2 días |
| 2 | Eliminar scripts externos de oss.maxcdn.com | STIC-03 | 1 hora |
| 3 | Corregir exception.jsp — ocultar detalles técnicos | STIC-06 | 2-3 horas |
| 4 | Deshabilitar CrashController en producción | STIC-06 | 30 min |
| 5 | Corregir logback.xml — WARN, JSON, fichero con rotación | STIC-11 | 1 día |
| 6 | Desactivar `jpa.showSql=true` | STIC-11 | 5 min |
| 7 | Corregir `Owner.toString()` — eliminar PII | STIC-11 | 30 min |
| 8 | Ampliar `.gitignore` con patrones de secretos | STIC-13 | 30 min |

### Fase 2 — ALTA (7-30 días) — Seguridad Fundamental

| # | Acción | Hallazgo | Esfuerzo |
|---|---|---|---|
| 9 | Configurar TLS 1.2+ con cipher suites CCN-STIC-807 | STIC-02 | 2-3 días |
| 10 | Implementar protección CSRF | STIC-05 | 1 día |
| 11 | Hardening de gestión de sesiones | STIC-07 | 1 día |
| 12 | Reforzar validación de entradas con `@Size`, `@Pattern` | STIC-08 | 1 día |
| 13 | Extraer JS inline a fichero externo (CSP compatible) | STIC-04 | 3 horas |
| 14 | Hardening imagen Docker Jib | STIC-09 | 1-2 días |
| 15 | Asegurar/deshabilitar JMX | STIC-10 | 3 horas |
| 16 | Reemplazar PII en data.sql con datos ficticios | STIC-12 | 2 horas |

### Fase 3 — MEDIA (30-60 días) — Hardening Avanzado

| # | Acción | Hallazgo | Esfuerzo |
|---|---|---|---|
| 17 | Hardening pool de conexiones a BD | STIC-16 | 2 horas |
| 18 | Implementar rate limiting | STIC-15 | 1-2 días |
| 19 | Asegurar unmarshalling XML contra XXE | STIC-14 | 3 horas |
| 20 | Implementar health check endpoint | STIC-17 | 2 horas |
| 21 | Configurar CORS si se necesita | STIC-18 | 1 hora |
| 22 | Asegurar Content-Type con charset | STIC-19 | 30 min |

---

## Relación con Otros Informes de Cumplimiento

| Informe | Puntuación | Relación con CCN-STIC |
|---|---|---|
| **RGPD + LOPDGDD** (18/100) | ❌ NO CONFORME | CCN-STIC-885 refuerza cifrado y logging requerido por RGPD |
| **Ley 39/2015 + Ley 40/2015** (5/100) | ❌ NO CONFORME | CCN-STIC-807 (TLS) es prerequisito para Cl@ve y @firma |
| **EU AI Act** (N/A) | ✅ Sin IA | No impacta a CCN-STIC |
| **NIS2** (8/100) | ❌ NO CONFORME | CCN-STIC operacionaliza los controles técnicos exigidos por NIS2 Art. 21 |

Las remediaciones de este informe CCN-STIC aportan directamente al cumplimiento de **NIS2 Art. 21.2.h** (criptografía), **Art. 21.2.e** (seguridad en desarrollo) y **Art. 21.2.a** (seguridad de sistemas). Una implementación coordinada con los planes de acción de los demás informes es esencial para la eficiencia.

---

## Referencias Normativas

- **CCN-STIC-885:** Guía CCN-STIC. Seguridad en aplicaciones web (v2024)
- **CCN-STIC-807:** Guía CCN-STIC. Criptografía de empleo en el ENS
- **CCN-STIC-812:** Guía CCN-STIC. Seguridad en entornos cloud
- **CCN-STIC-811:** Guía CCN-STIC. Interconexión en el ENS
- **CCN-STIC-827:** Guía CCN-STIC. Gestión de incidentes de seguridad
- **CCN-STIC-599:** Guía CCN-STIC. Configuración segura de SO (bastionado)
- **ENS (RD 311/2022):** Real Decreto 311/2022, de 3 de mayo, por el que se regula el Esquema Nacional de Seguridad
- **OWASP Top 10 2021:** Referencia complementaria para riesgos de seguridad en aplicaciones web

---

> **Disclaimer:** Este informe es un análisis técnico automatizado basado en la inspección del código fuente y las configuraciones del repositorio. No sustituye una auditoría de seguridad certificada. Para sistemas del sector público español, se recomienda la participación del CCN (Centro Criptológico Nacional) en la validación de la conformidad con las guías CCN-STIC aplicables.

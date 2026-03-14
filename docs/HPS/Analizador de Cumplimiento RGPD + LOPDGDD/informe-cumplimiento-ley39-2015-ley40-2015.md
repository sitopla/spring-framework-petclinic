# Informe Ley 39/2015 + Ley 40/2015 — Spring Framework PetClinic

**Fecha:** 2026-03-07  
**Analista:** Ley 39/2015 Administrative Procedure Analyzer  
**Sistema analizado:** `spring-framework-petclinic` v7.0.3  
**Tecnologías:** Spring Framework 7.0.3, Spring MVC, JPA/Hibernate 7.2.3, JSP, HSQLDB/H2/MySQL/PostgreSQL

---

## Puntuación de Cumplimiento: 5/100

**Estado: ❌ NO CONFORME**

---

## Nota Preliminar sobre el Ámbito del Sistema

El sistema analizado es una aplicación de gestión de clínica veterinaria (PetClinic) basada en Spring Framework. **No se trata de un sistema de administración pública** diseñado para tramitación electrónica. Sin embargo, si este sistema fuera adoptado o adaptado para un organismo público veterinario (ej. servicio veterinario de una Comunidad Autónoma, gestión de licencias de animales por un Ayuntamiento, o registro de identificación animal), **estaría sujeto íntegramente a la Ley 39/2015 y Ley 40/2015**.

Este informe analiza las **carencias estructurales** del sistema respecto al marco normativo administrativo español e identifica las acciones necesarias para su posible adaptación al sector público.

---

## Checklist Ejecutivo

### SEDE ELECTRÓNICA

| Requisito | Estado | Referencia |
|---|---|---|
| Certificado de sede válido (FNMT/prestador cualificado) | ❌ No existe | RD 203/2021 Art. 10 |
| URL en dominio `.gob.es` o institucional | ❌ No configurado | RD 203/2021 Art. 10.2 |
| Disponibilidad 24/7 declarada con SLA | ❌ No existe | Art. 38.2 Ley 40/2015 |
| Política de firma electrónica publicada | ❌ No existe | RD 203/2021 Art. 10.1.c |
| Tablón de anuncios electrónico | ❌ No existe | Art. 12 RD 203/2021 |
| Acceso a Carpeta Ciudadana integrado | ❌ No existe | RD 203/2021 Art. 6 |
| Punto de Acceso General (PAGe) enlazado | ❌ No existe | RD 203/2021 Art. 5 |

### IDENTIFICACIÓN Y FIRMA (Arts. 9-10 Ley 39/2015)

| Requisito | Estado | Referencia |
|---|---|---|
| Cl@ve PIN integrado (SAML2/OIDC) | ❌ No existe | Art. 9.2.c Ley 39/2015 |
| Cl@ve Permanente soportado | ❌ No existe | Art. 9.2.c Ley 39/2015 |
| Certificado electrónico X.509 soportado | ❌ No existe | Art. 9.2.a Ley 39/2015 |
| DNIe soportado (lector / NFC) | ❌ No existe | Art. 9.2.b Ley 39/2015 |
| Firma electrónica cualificada (XAdES/PAdES/CAdES) | ❌ No existe | Art. 10.2 Ley 39/2015 |
| Sello electrónico de órgano | ❌ No existe | Art. 42.1 Ley 40/2015 |
| CSV (Código Seguro de Verificación) | ❌ No existe | Art. 27.3.b Ley 39/2015 |
| Validación con @firma / VALIDe | ❌ No existe | Art. 10 Ley 39/2015 |

### REGISTRO ELECTRÓNICO (Art. 16 Ley 39/2015)

| Requisito | Estado | Referencia |
|---|---|---|
| Acuse de recibo con sellado de tiempo TSA (RFC 3161) | ❌ No existe | Art. 16.3 Ley 39/2015 |
| Número de registro secuencial e irrepetible | ❌ No existe | Art. 16.1 Ley 39/2015 |
| Disponibilidad 365 días, 24 horas | ❌ No existe | Art. 16.5 Ley 39/2015 |
| Integración SIR (Sistema de Interconexión de Registros) | ❌ No existe | Art. 16.4 Ley 39/2015 |
| Asiento registral inmutable y auditable | ❌ No existe | Art. 16.1 Ley 39/2015 |
| Confirmación inmediata al ciudadano | ❌ No existe | Art. 16.3 Ley 39/2015 |

### NOTIFICACIONES ELECTRÓNICAS (Arts. 40-44 Ley 39/2015)

| Requisito | Estado | Referencia |
|---|---|---|
| Integración DEHU / Notific@ | ❌ No existe | Art. 43.1 Ley 39/2015 |
| Máquina de estados (PENDIENTE → LEÍDA / RECHAZADA / EXPIRADA) | ❌ No existe | Art. 43.2 Ley 39/2015 |
| Aviso multicanal (email + SMS) | ❌ No existe | Art. 41.6 Ley 39/2015 |
| Plazo 10 días naturales gestionado | ❌ No existe | Art. 43.2 Ley 39/2015 |
| Fallback notificación postal | ❌ No existe | Art. 41.1 Ley 39/2015 |
| CSV en notificaciones para verificación | ❌ No existe | Art. 27.3 Ley 39/2015 |

### EXPEDIENTE ELECTRÓNICO (Art. 70 Ley 39/2015)

| Requisito | Estado | Referencia |
|---|---|---|
| Índice electrónico firmado | ❌ No existe | Art. 70.3 Ley 39/2015 |
| Documentos en formato normalizado (PDF/A) | ❌ No existe | NTI Documento electrónico |
| Metadatos mínimos ENI por documento | ❌ No existe | RD 4/2010 (ENI) |
| Firma electrónica de cada documento | ❌ No existe | Art. 70.3 Ley 39/2015 |
| Integridad verificable (SHA-256+) | ❌ No existe | NTI Documento electrónico |
| Interoperabilidad INSIDE / ArchiVA | ❌ No existe | RD 203/2021 |

### INTEROPERABILIDAD (Art. 28 Ley 39/2015)

| Requisito | Estado | Referencia |
|---|---|---|
| Plataformas de intermediación (SVD, SVDR, AEAT...) | ❌ No existe | Art. 28.2 Ley 39/2015 |
| No re-solicitud de datos al ciudadano | ❌ No aplica actualmente | Art. 28.2 Ley 39/2015 |
| Consentimiento para consulta documentado | ❌ No existe | Art. 28.2 Ley 39/2015 |

---

## Hallazgos Críticos

---

### 🔴 [CRÍTICO] L39-01: Ausencia total de sistema de identificación electrónica (Art. 9)

**Artículo incumplido:** Art. 9 Ley 39/2015, Art. 14 Ley 39/2015

**Incumplimiento:**  
El sistema no implementa ningún mecanismo de identificación electrónica. No existe integración con Cl@ve (ni PIN, ni Permanente), no soporta certificado electrónico X.509, ni DNIe. El `PetclinicInitializer.java` solo configura un `CharacterEncodingFilter` — no hay ningún filtro de autenticación ni federación de identidad.

**Evidencia en código:**

```java
// PetclinicInitializer.java:75-78 — Único filtro registrado
@Override
protected Filter[] getServletFilters() {
    CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter("UTF-8", true);
    return new Filter[]{characterEncodingFilter};
    // No hay filtro de autenticación, SAML2, ni OAuth/OIDC
}
```

No se detectan dependencias de Spring Security, spring-security-saml2, ni opensaml en `pom.xml`.

**Impacto jurídico:**  
Los interesados no pueden acreditar su identidad ante la Administración por medios electrónicos. No es posible determinar quién realiza cada trámite, invalidando jurídicamente cualquier actuación administrativa.

**Remediación:**  
Implementar integración con Cl@ve mediante el protocolo SAML 2.0:

```xml
<!-- pom.xml — Dependencias necesarias -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-saml2-service-provider</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

```java
@Configuration
@EnableWebSecurity
public class ClaveSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/resources/**", "/webjars/**").permitAll()
                .anyRequest().authenticated()
            )
            .saml2Login(saml2 -> saml2
                .relyingPartyRegistrationRepository(claveRegistrationRepository())
            );
        return http.build();
    }

    @Bean
    public RelyingPartyRegistrationRepository claveRegistrationRepository() {
        RelyingPartyRegistration clave = RelyingPartyRegistrations
            // Pre-producción: https://se-pasarela.clave.gob.es/Proxy2/ServiceProvider
            // Producción: https://pasarela.clave.gob.es/Proxy2/ServiceProvider
            .fromMetadataLocation("https://se-pasarela.clave.gob.es/Proxy2/idpMetadata")
            .registrationId("clave")
            .entityId("https://sede.entidad.gob.es")
            .assertionConsumerServiceLocation(
                "https://sede.entidad.gob.es/login/saml2/sso/clave")
            .signingX509Credentials(c -> c.add(
                // Certificado de sede electrónica FNMT
                Saml2X509Credential.signing(privateKey(), certificate())
            ))
            .build();
        return new InMemoryRelyingPartyRegistrationRepository(clave);
    }
}
```

```xml
<!-- Metadata SP para registrar en la plataforma Cl@ve -->
<md:EntityDescriptor entityID="https://sede.entidad.gob.es"
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
  <md:SPSSODescriptor 
      AuthnRequestsSigned="true"
      WantAssertionsSigned="true"
      protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate><!-- Certificado sede FNMT --></ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService 
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
        Location="https://sede.entidad.gob.es/logout/saml2/slo"/>
    <md:AssertionConsumerService 
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="https://sede.entidad.gob.es/login/saml2/sso/clave"
        index="1" isDefault="true"/>
    <!-- Atributos solicitados: NIF, Nombre, Apellidos, email -->
    <md:AttributeConsumingService index="1">
      <md:ServiceName xml:lang="es">Servicio Veterinario Municipal</md:ServiceName>
      <md:RequestedAttribute 
          FriendlyName="NIF" 
          Name="http://es.minhap.clave/NIF" 
          isRequired="true"/>
      <md:RequestedAttribute 
          FriendlyName="Nombre" 
          Name="http://es.minhap.clave/givenName"/>
      <md:RequestedAttribute 
          FriendlyName="Apellidos" 
          Name="http://es.minhap.clave/surname"/>
    </md:AttributeConsumingService>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
```

**Pasos administrativos para alta en Cl@ve:**
1. Solicitar alta como SP (Service Provider) a la Secretaría General de Administración Digital (SGAD)
2. Obtener certificado de sede electrónica de la FNMT
3. Registrar metadatos SP en el entorno de pre-producción de Cl@ve
4. Realizar pruebas de integración con IdP de pre-producción
5. Solicitar paso a producción

**Plazo recomendado:** Inmediato (0-30 días para pre-producción)

---

### 🔴 [CRÍTICO] L39-02: Ausencia de registro electrónico con acuse de recibo (Art. 16)

**Artículo incumplido:** Art. 16 Ley 39/2015, Art. 38 Ley 40/2015

**Incumplimiento:**  
No existe ningún módulo de registro electrónico. Los datos se almacenan directamente en BD sin:

- Número de registro secuencial (formato `YYYY/NNNNNN`)
- Sellado de tiempo mediante TSA externa (RFC 3161)
- Acuse de recibo al interesado
- Inmutabilidad del asiento registral
- Integración con SIR

Los formularios de creación (`OwnerController.processCreationForm`) simplemente persisten en BD sin registro formal:

```java
// OwnerController.java:60-68 — Sin registro electrónico
@PostMapping(value = "/owners/new")
public String processCreationForm(@Valid Owner owner, BindingResult result) {
    if (result.hasErrors()) {
        return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
    }
    this.clinicService.saveOwner(owner);  // Guardado directo sin acuse
    return "redirect:/owners/" + owner.getId();
}
```

El esquema de BD (`schema.sql`) no contiene tablas de registro:

```sql
-- No existe tabla de registro electrónico
-- No existen campos: numero_registro, fecha_registro, sello_tiempo, hash_documento
```

**Impacto jurídico:**  
Sin registro electrónico con sellado de tiempo, no se puede acreditar la fecha y hora de presentación de documentos. Esto invalida los plazos administrativos (Art. 31 Ley 39/2015) y puede causar indefensión al ciudadano.

**Remediación:**

```java
// Modelo de datos para el Registro Electrónico
@Entity
@Table(name = "registro_electronico")
public class AsientoRegistral extends BaseEntity {

    @Column(name = "numero_registro", unique = true, nullable = false)
    private String numeroRegistro; // Formato: YYYY/NNNNNN

    @Column(name = "tipo_asiento", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento; // ENTRADA, SALIDA

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Lob
    @Column(name = "sello_tiempo_tsa")
    private byte[] selloTiempoTSA; // Token RFC 3161

    @Column(name = "hash_contenido", nullable = false)
    private String hashContenido; // SHA-256

    @Column(name = "remitente_nif")
    private String remitenteNif;

    @Column(name = "remitente_nombre")
    private String remitenteNombre;

    @Column(name = "organo_destino_dir3")
    private String organoDestinoDIR3; // Código DIR3 del órgano

    @Column(name = "asunto")
    private String asunto;

    @Column(name = "csv_acuse")
    private String csvAcuse; // Código Seguro de Verificación

    @Column(name = "estado")
    @Enumerated(EnumType.STRING)
    private EstadoAsiento estado; // REGISTRADO, TRASLADADO_SIR, ANULADO
}

public enum TipoAsiento { ENTRADA, SALIDA }
public enum EstadoAsiento { REGISTRADO, TRASLADADO_SIR, ANULADO }
```

```java
@Service
@Slf4j
public class RegistroElectronicoService {

    private final TSAClient tsaClient; // RFC 3161
    private final AsientoRegistralRepository registroRepo;
    private final SequenceGenerator seqGen;
    private final NotificacionService notificacionService;

    /**
     * Registra un documento de entrada con sellado de tiempo TSA externo.
     * Cumple Art. 16.3 Ley 39/2015.
     */
    @Transactional
    public AcuseRecibo registrarEntrada(DocumentoEntrada doc, Ciudadano remitente) {
        // 1. Calcular hash del contenido
        String hash = DigestUtils.sha256Hex(doc.getContenido());

        // 2. Obtener sello de tiempo TSA externo (FNMT, Camerfirma)
        byte[] selloTSA = tsaClient.getTimestamp(hash.getBytes(StandardCharsets.UTF_8));
        LocalDateTime fechaRegistro = tsaClient.extractDateTime(selloTSA);

        // 3. Generar número de registro secuencial
        String numRegistro = seqGen.siguiente("REG-E"); // Ej: 2026/000142

        // 4. Generar CSV para el acuse de recibo
        String csv = CSVGenerator.generar(numRegistro, hash, fechaRegistro);

        // 5. Crear asiento registral inmutable
        AsientoRegistral asiento = AsientoRegistral.builder()
            .numeroRegistro(numRegistro)
            .tipoAsiento(TipoAsiento.ENTRADA)
            .fechaRegistro(fechaRegistro)
            .selloTiempoTSA(selloTSA)
            .hashContenido(hash)
            .remitenteNif(remitente.getNif())
            .remitenteNombre(remitente.getNombreCompleto())
            .asunto(doc.getAsunto())
            .csvAcuse(csv)
            .estado(EstadoAsiento.REGISTRADO)
            .build();
        registroRepo.save(asiento);

        // 6. Confirmación inmediata al ciudadano
        AcuseRecibo acuse = AcuseRecibo.builder()
            .numeroRegistro(numRegistro)
            .fechaHora(fechaRegistro)
            .csv(csv)
            .hashDocumento(hash)
            .build();

        notificacionService.enviarConfirmacionRegistro(
            remitente.getEmail(), remitente.getTelefono(), acuse);

        log.info("REGISTRO: Asiento entrada {} creado para NIF=***{}",
            numRegistro, remitente.getNif().substring(5));

        return acuse;
    }
}
```

```sql
-- Schema del Registro Electrónico
CREATE TABLE registro_electronico (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero_registro  VARCHAR(20) NOT NULL UNIQUE,
    tipo_asiento     VARCHAR(10) NOT NULL CHECK (tipo_asiento IN ('ENTRADA', 'SALIDA')),
    fecha_registro   TIMESTAMP NOT NULL,
    sello_tiempo_tsa BYTEA,
    hash_contenido   VARCHAR(64) NOT NULL,
    remitente_nif    VARCHAR(15),
    remitente_nombre VARCHAR(200),
    organo_destino_dir3 VARCHAR(20),
    asunto           VARCHAR(500),
    csv_acuse        VARCHAR(100),
    estado           VARCHAR(20) NOT NULL DEFAULT 'REGISTRADO',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Inmutabilidad: sin UPDATE permitido (solo INSERT y cambio de estado)
    CONSTRAINT chk_estado CHECK (estado IN ('REGISTRADO', 'TRASLADADO_SIR', 'ANULADO'))
);
CREATE INDEX idx_registro_fecha ON registro_electronico(fecha_registro);
CREATE INDEX idx_registro_nif ON registro_electronico(remitente_nif);
```

**Plazo recomendado:** Inmediato (0-30 días)

---

### 🔴 [CRÍTICO] L39-03: Ausencia de notificaciones electrónicas con DEHU/Notific@ (Arts. 40-44)

**Artículo incumplido:** Arts. 40, 41, 42, 43, 44 Ley 39/2015

**Incumplimiento:**  
El sistema no implementa ningún mecanismo de notificación electrónica. No existe:

- Integración con DEHU (Dirección Electrónica Habilitada Única)
- Integración con Notific@ (plataforma de notificaciones)
- Máquina de estados de notificación (PENDIENTE → LEÍDA / RECHAZADA / EXPIRADA)
- Gestión del plazo de 10 días naturales (Art. 43.2)
- Aviso multicanal (email + SMS) al interesado (Art. 41.6)
- Fallback a notificación postal para no obligados electrónicos

**Impacto jurídico:**  
Sin notificación electrónica válida, los actos administrativos no producen efecto jurídico (Art. 40.1 Ley 39/2015). No se puede practicar la notificación por comparecencia en sede electrónica (Art. 43).

**Remediación — Modelo de datos con máquina de estados:**

```java
// Entidad: Notificación Electrónica
@Entity
@Table(name = "notificaciones")
public class Notificacion extends BaseEntity {

    @Column(name = "id_notifica", unique = true)
    private String idNotifica; // ID devuelto por Notific@

    @Column(name = "id_expediente")
    private String idExpediente;

    @Column(name = "destinatario_nif", nullable = false)
    private String destinatarioNif;

    @Column(name = "concepto", nullable = false)
    private String concepto;

    @Column(name = "csv_documento")
    private String csvDocumento;

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoNotificacion estado;

    @Column(name = "fecha_puesta_disposicion")
    private LocalDateTime fechaPuestaDisposicion;

    @Column(name = "fecha_acceso")
    private LocalDateTime fechaAcceso;

    @Column(name = "fecha_rechazo")
    private LocalDateTime fechaRechazo;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @Column(name = "requiere_notificacion_postal")
    private Boolean requiereNotificacionPostal;

    @Column(name = "email_aviso_enviado")
    private Boolean emailAvisoEnviado;

    @Column(name = "sms_aviso_enviado")
    private Boolean smsAvisoEnviado;
}

/**
 * Máquina de estados de notificación conforme a Art. 43 Ley 39/2015.
 *
 * Flujo:
 *   CREADA → PUESTA_DISPOSICION → LEIDA        (ciudadano accede)
 *                                → RECHAZADA    (ciudadano rechaza explícitamente)
 *                                → EXPIRADA     (10 días sin acceso → Art. 43.2)
 *   EXPIRADA → NOTIFICACION_POSTAL_ENVIADA      (si no es obligado electrónico)
 */
public enum EstadoNotificacion {
    CREADA,
    PUESTA_DISPOSICION,
    LEIDA,
    RECHAZADA,
    EXPIRADA,
    NOTIFICACION_POSTAL_ENVIADA
}
```

```java
@Service
@Slf4j
public class NotificacionElectronicaService {

    private final NotificaClient notificaClient;  // Cliente SOAP/REST de Notific@
    private final NotificacionRepository notificacionRepo;
    private final EmailService emailService;
    private final SmsService smsService;

    private static final int DIAS_EXPIRACION = 10; // Art. 43.2 Ley 39/2015

    /**
     * Envía notificación electrónica a través de DEHU/Notific@.
     * Art. 41 Ley 39/2015.
     */
    @Transactional
    public Notificacion enviarNotificacion(Expediente exp, Ciudadano dest, 
                                            byte[] documentoPdfA) {
        // 1. Crear registro de notificación
        Notificacion notif = new Notificacion();
        notif.setIdExpediente(exp.getNumero());
        notif.setDestinatarioNif(dest.getNif());
        notif.setConcepto("Resolución — " + exp.getAsunto());
        notif.setCsvDocumento(exp.getResolucion().getCsv());
        notif.setEstado(EstadoNotificacion.CREADA);

        // 2. Envío a Notific@/DEHU
        NotificaEnvioRequest request = NotificaEnvioRequest.builder()
            .nifDestinatario(dest.getNif())
            .concepto(notif.getConcepto())
            .documento(documentoPdfA)
            .csvDocumento(notif.getCsvDocumento())
            .organismoEmisorDIR3(exp.getOrganoDIR3())
            .build();

        NotificaEnvioResponse response = notificaClient.enviar(request);

        notif.setIdNotifica(response.getIdNotificacion());
        notif.setFechaPuestaDisposicion(LocalDateTime.now());
        notif.setEstado(EstadoNotificacion.PUESTA_DISPOSICION);

        // 3. Aviso multicanal — Art. 41.6 (no vinculante, pero obligatorio)
        try {
            emailService.enviar(dest.getEmail(),
                "Notificación electrónica disponible — " + notif.getConcepto(),
                "Tiene una notificación disponible en su DEHU. " +
                "Dispone de 10 días naturales para acceder. " +
                "Acceda en: https://dehu.redsara.es");
            notif.setEmailAvisoEnviado(true);
        } catch (Exception e) {
            log.warn("No se pudo enviar aviso email para notificación {}",
                notif.getIdNotifica());
            notif.setEmailAvisoEnviado(false);
        }

        try {
            smsService.enviar(dest.getTelefono(),
                "Tiene una notificación electrónica pendiente. " +
                "Acceda a su DEHU en 10 días.");
            notif.setSmsAvisoEnviado(true);
        } catch (Exception e) {
            log.warn("No se pudo enviar aviso SMS para notificación {}",
                notif.getIdNotifica());
            notif.setSmsAvisoEnviado(false);
        }

        notificacionRepo.save(notif);

        log.info("NOTIFICACION: {} puesta a disposición de NIF=***{} vía DEHU",
            notif.getIdNotifica(), dest.getNif().substring(5));

        return notif;
    }

    /**
     * Job programado que gestiona la expiración de notificaciones.
     * Art. 43.2 Ley 39/2015: transcurridos 10 días naturales sin acceso,
     * se entiende rechazada y produce efectos desde ese momento.
     */
    @Scheduled(cron = "0 0 1 * * ?") // Cada día a la 1:00 AM
    @Transactional
    public void procesarExpiraciones() {
        LocalDateTime limiteExpiracion = LocalDateTime.now()
            .minusDays(DIAS_EXPIRACION);

        List<Notificacion> pendientes = notificacionRepo
            .findByEstadoAndFechaPuestaDisposicionBefore(
                EstadoNotificacion.PUESTA_DISPOSICION, limiteExpiracion);

        for (Notificacion notif : pendientes) {
            notif.setEstado(EstadoNotificacion.EXPIRADA);
            notif.setFechaExpiracion(
                notif.getFechaPuestaDisposicion().plusDays(DIAS_EXPIRACION));

            // Si NO es obligado electrónico → fallback postal
            if (Boolean.TRUE.equals(notif.getRequiereNotificacionPostal())) {
                enviarNotificacionPostal(notif);
                notif.setEstado(EstadoNotificacion.NOTIFICACION_POSTAL_ENVIADA);
            }

            notificacionRepo.save(notif);
            log.info("NOTIFICACION: {} expirada tras {} días sin acceso",
                notif.getIdNotifica(), DIAS_EXPIRACION);
        }
    }

    /**
     * Callback cuando el ciudadano accede a la notificación en DEHU.
     * Puede invocarse por webhook de Notific@ o consulta periódica.
     */
    @Transactional
    public void marcarComoLeida(String idNotifica, LocalDateTime fechaAcceso) {
        Notificacion notif = notificacionRepo.findByIdNotifica(idNotifica)
            .orElseThrow(() -> new NotFoundException("Notificación no encontrada"));

        if (notif.getEstado() == EstadoNotificacion.PUESTA_DISPOSICION) {
            notif.setEstado(EstadoNotificacion.LEIDA);
            notif.setFechaAcceso(fechaAcceso);
            notificacionRepo.save(notif);
            log.info("NOTIFICACION: {} leída por el interesado en {}", 
                idNotifica, fechaAcceso);
        }
    }

    /**
     * Callback cuando el ciudadano rechaza la notificación en DEHU.
     */
    @Transactional
    public void marcarComoRechazada(String idNotifica, LocalDateTime fechaRechazo) {
        Notificacion notif = notificacionRepo.findByIdNotifica(idNotifica)
            .orElseThrow(() -> new NotFoundException("Notificación no encontrada"));

        if (notif.getEstado() == EstadoNotificacion.PUESTA_DISPOSICION) {
            notif.setEstado(EstadoNotificacion.RECHAZADA);
            notif.setFechaRechazo(fechaRechazo);
            notificacionRepo.save(notif);
            log.info("NOTIFICACION: {} rechazada por el interesado en {}",
                idNotifica, fechaRechazo);
        }
    }
}
```

```
Diagrama de estados (Art. 43 Ley 39/2015):

  ┌─────────┐     envío a DEHU      ┌───────────────────────┐
  │ CREADA  │ ─────────────────────► │ PUESTA_DISPOSICION    │
  └─────────┘                        └───────────┬───────────┘
                                           │     │     │
                              accede       │     │     │  10 días
                            ┌──────────────┘     │     └──────────────┐
                            ▼                    ▼                    ▼
                      ┌──────────┐        ┌────────────┐      ┌────────────┐
                      │  LEÍDA   │        │ RECHAZADA  │      │  EXPIRADA  │
                      └──────────┘        └────────────┘      └─────┬──────┘
                                                                    │
                                                     si no obligado │
                                                     electrónico    ▼
                                                    ┌───────────────────────────┐
                                                    │ NOTIFICACION_POSTAL_      │
                                                    │ ENVIADA                   │
                                                    └───────────────────────────┘
```

**Plazo recomendado:** 0-60 días

---

### 🔴 [CRÍTICO] L39-04: Ausencia de expediente electrónico conforme ENI (Art. 70)

**Artículo incumplido:** Art. 70 Ley 39/2015, RD 4/2010 (ENI), NTI Expediente Electrónico

**Incumplimiento:**  
El sistema no implementa el concepto de expediente electrónico administrativo. Las entidades del modelo (`Owner`, `Pet`, `Visit`) son registros de gestión sin estructura de expediente. No existe:

- Índice electrónico con firma del órgano competente
- Metadatos ENI obligatorios por documento (identificador, órgano, fecha captura, origen, estado elaboración, nombre formato, tipo documental, tipo firma, valor CSV, regulación)
- Documentos en formato normalizado (PDF/A-1a, PDF/A-2u)
- Hash de integridad SHA-256 por documento
- Exportación conforme NTI (ZIP con `indice.xml` + documentos)
- Integración con INSIDE para gestión de expedientes
- Integración con ArchiVA para archivo definitivo

**Impacto jurídico:**  
Sin expediente electrónico normalizado, no se cumple con la obligación de formar expediente de cada procedimiento (Art. 70.1) ni se garantiza su interoperabilidad con otras Administraciones.

**Remediación:**

```java
// Modelo de Expediente Electrónico conforme ENI
@Entity
@Table(name = "expedientes")
public class ExpedienteElectronico extends BaseEntity {

    @Column(name = "numero_expediente", unique = true, nullable = false)
    private String numeroExpediente; // Ej: EXP/2026/VET/000142

    @Column(name = "organo_dir3", nullable = false)
    private String organoDIR3; // Código DIR3 del órgano tramitador

    @Column(name = "fecha_apertura", nullable = false)
    private LocalDateTime fechaApertura;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(name = "estado")
    @Enumerated(EnumType.STRING)
    private EstadoExpediente estado; // ABIERTO, EN_TRAMITE, RESUELTO, ARCHIVADO

    @Column(name = "asunto", nullable = false)
    private String asunto;

    @Column(name = "interesado_nif")
    private String interesadoNif;

    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL)
    @OrderBy("fechaIncorporacion ASC")
    private List<DocumentoElectronico> documentos;

    @Column(name = "indice_electronico_firma")
    @Lob
    private byte[] indiceElectronicoFirma; // XAdES del índice
}

@Entity
@Table(name = "documentos_electronicos")
public class DocumentoElectronico extends BaseEntity {

    // --- Metadatos mínimos obligatorios ENI ---

    @Column(name = "eni_identificador", unique = true, nullable = false)
    private String eniIdentificador; // ES_[DIR3]_[YYYY]_[ID]

    @Column(name = "eni_organo", nullable = false)
    private String eniOrgano; // Código DIR3

    @Column(name = "eni_fecha_captura", nullable = false)
    private LocalDateTime eniFechaCaptura;

    @Column(name = "eni_origen")
    @Enumerated(EnumType.STRING)
    private OrigenDocumento eniOrigen; // CIUDADANO, ADMINISTRACION

    @Column(name = "eni_estado_elaboracion")
    @Enumerated(EnumType.STRING)
    private EstadoElaboracion eniEstadoElaboracion;
    // ORIGINAL, COPIA_ELECTRONICA_AUTENTICA, COPIA_ELECTRONICA_AUTENTICA_PARCIAL,
    // COPIA_PAPEL_DOCUMENTO_ELECTRONICO, OTROS

    @Column(name = "eni_nombre_formato")
    private String eniNombreFormato; // "PDF/A-1a", "XML", etc.

    @Column(name = "eni_tipo_documental")
    @Enumerated(EnumType.STRING)
    private TipoDocumental eniTipoDocumental;
    // SOLICITUD, COMUNICACION, RESOLUCION, ACTA, CERTIFICADO, DILIGENCIA, INFORME,
    // NOTIFICACION, PUBLICACION, ACUERDO, CONTRATO, CONVENIO, DECLARACION, RECURSO, OTROS

    @Column(name = "eni_tipo_firma")
    private String eniTipoFirma; // "XAdES", "PAdES", "CAdES", "Sello_Organo"

    @Column(name = "eni_csv")
    private String eniCSV; // Código Seguro de Verificación

    // --- Contenido y firma ---

    @Column(name = "hash_sha256", nullable = false)
    private String hashSHA256;

    @Lob
    @Column(name = "contenido")
    private byte[] contenido;

    @Lob
    @Column(name = "firma_electronica")
    private byte[] firmaElectronica;

    @ManyToOne
    @JoinColumn(name = "expediente_id")
    private ExpedienteElectronico expediente;

    @Column(name = "fecha_incorporacion")
    private LocalDateTime fechaIncorporacion;

    @Column(name = "orden_indice")
    private Integer ordenIndice;
}
```

```java
@Service
public class ExpedienteENIExportService {

    /**
     * Exporta el expediente en formato ZIP conforme NTI Expediente Electrónico.
     * Estructura:
     *   expediente_EXP2026VET000142.zip
     *   ├── indice.xml         (índice electrónico firmado)
     *   ├── indice.xml.xsig    (firma XAdES del índice)
     *   ├── DOC_001.pdf        (documento 1 en PDF/A)
     *   ├── DOC_001.pdf.xsig   (firma del documento 1)
     *   ├── DOC_002.pdf
     *   └── ...
     */
    public byte[] exportarExpedienteENI(ExpedienteElectronico exp) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // 1. Generar índice electrónico XML
            String indiceXml = generarIndiceXML(exp);
            zos.putNextEntry(new ZipEntry("indice.xml"));
            zos.write(indiceXml.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 2. Firmar índice con sello de órgano
            byte[] firmaIndice = firmaService.sellarOrgano(indiceXml.getBytes());
            zos.putNextEntry(new ZipEntry("indice.xml.xsig"));
            zos.write(firmaIndice);
            zos.closeEntry();

            // 3. Incluir cada documento con su firma
            for (DocumentoElectronico doc : exp.getDocumentos()) {
                String nombreDoc = String.format("DOC_%03d.%s",
                    doc.getOrdenIndice(), doc.getExtension());
                zos.putNextEntry(new ZipEntry(nombreDoc));
                zos.write(doc.getContenido());
                zos.closeEntry();

                if (doc.getFirmaElectronica() != null) {
                    zos.putNextEntry(new ZipEntry(nombreDoc + ".xsig"));
                    zos.write(doc.getFirmaElectronica());
                    zos.closeEntry();
                }
            }
        }
        return baos.toByteArray();
    }
}
```

**Plazo recomendado:** 30-90 días

---

### 🔴 [CRÍTICO] L39-05: Ausencia de firma electrónica y validación con @firma (Arts. 10, 27)

**Artículo incumplido:** Art. 10 Ley 39/2015, Art. 42 Ley 40/2015

**Incumplimiento:**  
No existe ninguna integración con servicios de firma electrónica:

- No se genera firma electrónica cualificada (XAdES/PAdES/CAdES) en ningún acto
- No existe sello electrónico de órgano para actuaciones automatizadas (Art. 42.1 Ley 40/2015)
- No se validan firmas mediante @firma o VALIDe
- No se generan Códigos Seguros de Verificación (CSV) para copias auténticas
- No se integra con AutoFirma para firma del ciudadano en el navegador

**Impacto jurídico:**  
Los actos administrativos electrónicos requieren firma electrónica (Art. 36.4 Ley 40/2015). Sin ella, las resoluciones, notificaciones y certificados no tienen validez jurídica.

**Remediación:**

```java
@Service
public class FirmaElectronicaService {

    private final AfirmaClient afirmaClient; // Cliente @firma v6

    /**
     * Firma un documento con sello de órgano (actuación administrativa automatizada).
     * Art. 42.1 Ley 40/2015.
     */
    public byte[] sellarOrgano(byte[] documento, String algoritmo) {
        // Formato XAdES-BES para documentos XML, PAdES-BES para PDF
        return afirmaClient.firmar(
            documento,
            "SELLO_ORGANO",
            algoritmo,  // "SHA256withRSA"
            getCertificadoSello()
        );
    }

    /**
     * Valida una firma electrónica mediante @firma/VALIDe.
     * Art. 10.4 Ley 39/2015.
     */
    public ResultadoValidacion validarFirma(byte[] firma, byte[] documento) {
        ValidacionResponse response = afirmaClient.validar(firma, documento);
        return ResultadoValidacion.builder()
            .valida(response.isValida())
            .certificadoEmisor(response.getEmisor())
            .fechaFirma(response.getFechaFirma())
            .nivelFirma(response.getNivel()) // BES, T, C, X, XL, A
            .build();
    }

    /**
     * Genera Código Seguro de Verificación (CSV).
     * Art. 27.3.b Ley 39/2015.
     */
    public String generarCSV(String numRegistro, String hashDoc, 
                              LocalDateTime fecha) {
        String semilla = numRegistro + "|" + hashDoc + "|" + 
                          fecha.toString() + "|" + SECRET_KEY;
        String hash = DigestUtils.sha256Hex(semilla);
        // Formato CSV: XXXX-XXXX-XXXX-XXXX (16 caracteres alfanuméricos)
        return formatCSV(hash.substring(0, 16).toUpperCase());
    }
}
```

**Plazo recomendado:** 0-60 días

---

### 🔴 [CRÍTICO] L39-06: Ausencia de sede electrónica (Art. 38 Ley 40/2015, RD 203/2021)

**Artículo incumplido:** Art. 38 Ley 40/2015, Arts. 10-13 RD 203/2021

**Incumplimiento:**  
El sistema no implementa una sede electrónica. No existe:

- Certificado de sede electrónica (FNMT o prestador cualificado)
- Dominio institucional `.gob.es`
- Tablón de anuncios electrónico (Art. 12 RD 203/2021)
- Perfil de contratante
- Verificación de certificados y firmas (enlace a VALIDe)
- Catálogo de procedimientos y servicios
- Formularios normalizados descargables
- Enlace a Carpeta Ciudadana
- Declaración de disponibilidad 24/7

La interfaz actual (`layout.tag`, JSPs) es una aplicación web convencional sin los componentes obligatorios de una sede electrónica.

**Impacto jurídico:**  
Sin sede electrónica, la Administración no cumple su obligación de proporcionar un punto de acceso electrónico para los ciudadanos (Art. 38.1 Ley 40/2015).

**Remediación:**  
Diseñar e implementar la sede electrónica con todos los componentes obligatorios. Se recomienda evaluar la reutilización de la plataforma del PAe (Portal de Administración Electrónica).

**Plazo recomendado:** 0-90 días (proyecto completo)

---

### 🟠 [ALTO] L39-07: Ausencia de integración SIR para interconexión de registros (Art. 16.4)

**Artículo incumplido:** Art. 16.4 Ley 39/2015

**Incumplimiento:**  
No existe integración con el Sistema de Interconexión de Registros (SIR) para el traslado de asientos registrales entre Administraciones. Un ciudadano debería poder presentar documentos en cualquier registro de cualquier Administración y que se trasladen electrónicamente.

**Remediación:**  
Integrar con SIR mediante los Web Services SCSP proporcionados por la SGAD:

```java
@Service
public class SIRIntegrationService {

    private final SIRClient sirClient; // Web Service SCSP

    /**
     * Traslada un asiento registral a otro organismo vía SIR.
     */
    @Transactional
    public void trasladarAsiento(AsientoRegistral asiento, String organismoDestinoDIR3) {
        SIREnvioRequest req = SIREnvioRequest.builder()
            .codigoOrigenDIR3(asiento.getOrganoDIR3())
            .codigoDestinoDIR3(organismoDestinoDIR3)
            .numeroRegistro(asiento.getNumeroRegistro())
            .fechaRegistro(asiento.getFechaRegistro())
            .tipoAsiento(asiento.getTipoAsiento())
            .documentos(asiento.getDocumentosAdjuntos())
            .build();

        SIREnvioResponse resp = sirClient.enviar(req);
        asiento.setEstado(EstadoAsiento.TRASLADADO_SIR);
        asiento.setIdSIR(resp.getIdentificadorIntercambio());
    }
}
```

**Plazo recomendado:** 30-90 días

---

### 🟠 [ALTO] L39-08: Ausencia de interoperabilidad — no re-solicitud de datos (Art. 28)

**Artículo incumplido:** Art. 28 Ley 39/2015

**Incumplimiento:**  
El sistema solicita manualmente todos los datos al ciudadano (nombre, apellido, dirección, teléfono) a través de formularios sin verificar si esos datos ya están en poder de otras Administraciones. No existe integración con plataformas de intermediación de datos:

- SVD (Servicio de Verificación de Datos de Identidad — DGP)
- SVDR (Servicio de Verificación de Datos de Residencia — INE)
- Plataformas de AEAT, TGSS, Catastro, DGT

```java
// Situación actual: todos los datos se solicitan manualmente
// OwnerController.java — formulario pide todos los datos
// createOrUpdateOwnerForm.jsp — campos manuales para nombre, dirección, teléfono
```

**Impacto jurídico:**  
Art. 28.2: "Los interesados no estarán obligados a aportar documentos que hayan sido elaborados por cualquier Administración". Solicitar datos que ya obran en poder de la Administración vulnera el derecho del ciudadano.

**Remediación:**

```java
@Service
public class IntermediacionDatosService {

    private final SVDClient svdClient; // Verificación de identidad
    private final SVDRClient svdrClient; // Verificación de residencia

    /**
     * Consulta datos de identidad del ciudadano en la DGP.
     * Art. 28 Ley 39/2015 — El ciudadano NO debe aportar su DNI.
     */
    public DatosIdentidad verificarIdentidad(String nif, boolean consentimiento) {
        if (!consentimiento) {
            throw new ConsentimientoRequeridoException(
                "Se requiere consentimiento del interesado para la consulta " +
                "de sus datos (Art. 28.2 Ley 39/2015)");
        }
        return svdClient.consultarDatosIdentidad(nif);
    }

    /**
     * Consulta datos de residencia (padrón) del ciudadano.
     */
    public DatosResidencia verificarResidencia(String nif, boolean consentimiento) {
        if (!consentimiento) {
            throw new ConsentimientoRequeridoException(
                "Se requiere consentimiento para consulta de residencia");
        }
        return svdrClient.consultarDatosResidencia(nif);
    }
}
```

**Plazo recomendado:** 60-120 días

---

### 🟠 [ALTO] L39-09: Ausencia de derechos del interesado en el procedimiento (Art. 53)

**Artículo incumplido:** Art. 53 Ley 39/2015

**Incumplimiento:**  
El sistema no implementa los derechos del interesado en el procedimiento administrativo:

| Derecho (Art. 53) | Implementado |
|---|---|
| a) Conocer el estado de tramitación | ❌ No — sin tracking de expediente |
| b) Identificar las autoridades y personal | ❌ No — sin datos del instructor |
| c) No presentar documentos ya en poder de AA.PP. | ❌ No — ver L39-08 |
| d) Obtener copia de documentos del expediente | ❌ No — sin acceso a expediente |
| e) Formular alegaciones y aportar documentos | ❌ No — sin fase de alegaciones |
| f) Obtener información sobre requisitos | ❌ No — sin catálogo de procedimientos |

**Plazo recomendado:** 30-90 días

---

### 🟠 [ALTO] L39-10: Ausencia de gestión de plazos y cómputo (Arts. 29-33)

**Artículo incumplido:** Arts. 29-33 Ley 39/2015

**Incumplimiento:**  
No existe gestión de plazos administrativos:

- No se computan plazos en días hábiles (Art. 30.2) ni naturales
- No se consideran días inhábiles (sábados, domingos, festivos locales/autonómicos/nacionales)
- No se calcula silencio administrativo positivo/negativo
- No existe alarma de caducidad del procedimiento (Art. 25.1.b — 3 meses máximo para resolver salvo norma especial)

**Remediación:**

```java
@Service
public class ComputoPlazoService {

    private final CalendarioInhabilesClient calendarioClient;

    /**
     * Calcula la fecha de vencimiento de un plazo en días hábiles.
     * Art. 30.2 Ley 39/2015: "Siempre que por Ley o en el Derecho de la UE
     * no se exprese otro cómputo, cuando los plazos se señalen por días,
     * se entiende que estos son hábiles."
     */
    public LocalDate calcularVencimiento(LocalDate inicio, int diasHabiles,
                                          String codigoCCAA) {
        LocalDate fecha = inicio;
        int diasContados = 0;

        while (diasContados < diasHabiles) {
            fecha = fecha.plusDays(1);
            if (esDiaHabil(fecha, codigoCCAA)) {
                diasContados++;
            }
        }
        return fecha;
    }

    private boolean esDiaHabil(LocalDate fecha, String codigoCCAA) {
        // Sábados y domingos: inhábiles (Art. 30.2)
        if (fecha.getDayOfWeek() == DayOfWeek.SATURDAY ||
            fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return false;
        }
        // Festivos nacionales, autonómicos y locales
        return !calendarioClient.esInhabil(fecha, codigoCCAA);
    }
}
```

**Plazo recomendado:** 30-60 días

---

### 🟡 [MEDIO] L39-11: Ausencia de soporte multilingüe conforme Art. 36

**Artículo incumplido:** Art. 36 Ley 39/2015

**Incumplimiento:**  
Aunque el sistema incluye archivos de mensajes i18n (`messages_es.properties`, `messages_en.properties`, `messages_de.properties`), no soporta las lenguas cooficiales españolas obligatorias:

```
Archivos existentes:
  ✅ messages.properties (default)
  ✅ messages_en.properties
  ✅ messages_es.properties
  ✅ messages_de.properties

Faltan (si el organismo opera en CCAA bilingüe):
  ❌ messages_ca.properties (catalán)
  ❌ messages_gl.properties (gallego)
  ❌ messages_eu.properties (euskera)
  ❌ messages_va.properties (valenciano)
```

Art. 36.1: "La lengua de los procedimientos tramitados por la Administración General del Estado será el castellano. No obstante, los interesados que se dirijan a órganos que radiquen en el territorio de una Comunidad Autónoma podrán utilizar también la lengua que sea cooficial."

**Plazo recomendado:** 60-120 días

---

### 🟡 [MEDIO] L39-12: Ausencia de formularios normalizados (Art. 66.6)

**Artículo incumplido:** Art. 66.6 Ley 39/2015

**Incumplimiento:**  
Los formularios JSP actuales no cumplen con los requisitos de modelos normalizados de solicitud:

```jsp
<!-- createOrUpdateOwnerForm.jsp — Formulario actual sin estructura normalizada -->
<petclinic:inputField label="First Name" name="firstName"/>
<petclinic:inputField label="Last Name" name="lastName"/>
<!-- Falta: NIF del interesado, datos de notificación, consentimiento,
     medio preferente de notificación, idioma preferido, etc. -->
```

Un formulario normalizado debe incluir (Art. 66.1):
- Nombre y apellidos del interesado
- NIF / NIE / documento identificativo
- Medio preferente de notificación electrónica
- Hechos, razones y petición
- Lugar, fecha y firma
- Órgano al que se dirige

**Plazo recomendado:** 30-60 días

---

### 🟡 [MEDIO] L39-13: Ausencia de subsanación y mejora de solicitudes (Art. 68)

**Artículo incumplido:** Art. 68 Ley 39/2015

**Incumplimiento:**  
Los controladores validan formularios (`@Valid`, `BindingResult`) pero no implementan el mecanismo de subsanación del Art. 68: cuando una solicitud tiene defectos, se debe requerir al interesado para que subsane en un plazo de 10 días hábiles, con apercibimiento de desistimiento.

**Situación actual:**
```java
// OwnerController.java:61-64 — Error inmediato sin oportunidad de subsanación
if (result.hasErrors()) {
    return VIEWS_OWNER_CREATE_OR_UPDATE_FORM; // Re-renderiza sin registro formal
}
```

**Remediación:**  
Implementar flujo de subsanación con requerimiento formal, plazo y seguimiento.

**Plazo recomendado:** 60-120 días

---

### 🟡 [MEDIO] L39-14: Ausencia de archivo electrónico (Art. 17)

**Artículo incumplido:** Art. 17 Ley 39/2015

**Incumplimiento:**  
No existe sistema de archivo electrónico para la conservación de documentos y expedientes una vez finalizados. No se integra con ArchiVA ni con ninguna solución de archivo a largo plazo conforme a las NTI.

**Plazo recomendado:** 90-180 días

---

### 🟡 [MEDIO] L39-15: Ausencia de recursos administrativos electrónicos (Arts. 112-126)

**Artículo incumplido:** Arts. 112-126 Ley 39/2015

**Incumplimiento:**  
No existe funcionalidad para la presentación telemática de recursos administrativos (alzada, reposición, extraordinario de revisión), ni para su tramitación electrónica.

**Plazo recomendado:** 90-180 días

---

## Plan de Acción Priorizado

### PRIORIDAD 1 — Inmediato (0-30 días): Infraestructura base

| # | Acción | Hallazgo | Dependencia |
|---|---|---|---|
| 1 | Obtener certificado de sede electrónica (FNMT) | L39-06 | Ninguna |
| 2 | Implementar integración Cl@ve (SAML2) con Spring Security | L39-01 | Certificado |
| 3 | Diseñar modelo de datos: registro electrónico, expediente, notificaciones | L39-02, L39-03, L39-04 | Ninguna |
| 4 | Implementar registro electrónico con sellado TSA (RFC 3161) | L39-02 | Modelo datos |
| 5 | Implementar generación de CSV (Código Seguro de Verificación) | L39-05 | Ninguna |

### PRIORIDAD 2 — Corto plazo (30-90 días): Funcionalidad administrativa

| # | Acción | Hallazgo | Dependencia |
|---|---|---|---|
| 6 | Integrar con @firma para firma y validación electrónica | L39-05 | Certificado |
| 7 | Integrar con Notific@/DEHU — envío y callback de notificaciones | L39-03 | Registro, @firma |
| 8 | Implementar máquina de estados de notificación con job de expiración | L39-03 | Notific@ |
| 9 | Implementar expediente electrónico con metadatos ENI | L39-04 | @firma |
| 10 | Implementar formularios normalizados (Art. 66) | L39-12 | Cl@ve |
| 11 | Implementar derechos del interesado y consulta de expediente (Art. 53) | L39-09 | Expediente |
| 12 | Implementar cómputo de plazos con calendario de inhábiles | L39-10 | Ninguna |
| 13 | Implementar integración SIR | L39-07 | Registro |

### PRIORIDAD 3 — Medio plazo (90-180 días): Interoperabilidad y completitud

| # | Acción | Hallazgo | Dependencia |
|---|---|---|---|
| 14 | Integrar con plataformas de intermediación (SVD, SVDR, AEAT...) | L39-08 | Cl@ve |
| 15 | Implementar exportación ZIP ENI de expedientes | L39-04 | Expediente |
| 16 | Integrar con INSIDE para gestión de expedientes | L39-04 | ENI export |
| 17 | Integrar con ArchiVA para archivo electrónico | L39-14 | Expediente |
| 18 | Implementar flujo de subsanación (Art. 68) | L39-13 | Formularios |
| 19 | Implementar recursos administrativos electrónicos | L39-15 | Expediente, Notific@ |
| 20 | Implementar soporte lenguas cooficiales | L39-11 | Ninguna |
| 21 | Desplegar sede electrónica completa con todos los componentes | L39-06 | Todos |

---

## Arquitectura Objetivo Propuesta

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SEDE ELECTRÓNICA (.gob.es)                       │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────────┐  │
│  │ Catálogo │ │  Tablón  │ │ Carpeta   │ │ Verificación CSV      │  │
│  │ Proced.  │ │ Anuncios │ │ Ciudadana │ │ (VALIDe enlace)       │  │
│  └──────────┘ └──────────┘ └───────────┘ └───────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                     CAPA DE IDENTIFICACIÓN                           │
│  ┌──────────────────────┐  ┌───────────────┐  ┌────────────────┐    │
│  │ Cl@ve (SAML2/OIDC)  │  │ Certificado   │  │ DNIe (lector/  │    │
│  │ PIN + Permanente     │  │ X.509         │  │ NFC)           │    │
│  └──────────────────────┘  └───────────────┘  └────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                     CAPA DE TRAMITACIÓN                              │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Registro   │  │ Expediente │  │ Notificación │  │ Firma      │  │
│  │ Electr.    │  │ Electr.    │  │ Electr.      │  │ Electr.    │  │
│  │ (TSA+SIR)  │  │ (ENI)      │  │ (Notific@)   │  │ (@firma)   │  │
│  └────────────┘  └────────────┘  └──────────────┘  └────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                     CAPA DE INTEROPERABILIDAD                        │
│  ┌───────┐ ┌───────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐  │
│  │  SVD  │ │ SVDR  │ │ AEAT │ │ TGSS │ │ DGT  │ │  Catastro    │  │
│  └───────┘ └───────┘ └──────┘ └──────┘ └──────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                     CAPA DE ARCHIVO                                  │
│  ┌──────────────┐  ┌───────────────┐                                │
│  │   INSIDE     │  │   ArchiVA     │                                │
│  └──────────────┘  └───────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Resumen de Inversión Estimada

| Componente | Complejidad | Dependencias externas |
|---|---|---|
| Integración Cl@ve (SAML2) | Media | Alta en plataforma Cl@ve (SGAD) |
| Registro electrónico + TSA | Media | Proveedor TSA (FNMT/Camerfirma) |
| Integración @firma | Alta | Alta en plataforma @firma (SGAD) |
| Integración Notific@ | Alta | Alta en plataforma Notific@ (SGAD) |
| Expediente electrónico ENI | Alta | Estándar ENI (documentación PAe) |
| Integración SIR | Media | Alta en SIR (SGAD) |
| Intermediación datos | Alta | Alta en plataformas de intermediación |
| Sede electrónica completa | Muy alta | Certificado sede + todos los anteriores |

> **Nota:** Todas las integraciones con plataformas del MPTFP/SGAD requieren solicitud de alta previa y proceso de homologación. Los plazos indicados asumen la disponibilidad de los accesos a pre-producción.

---

## Referencias Normativas

- **Ley 39/2015:** Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas
- **Ley 40/2015:** Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público
- **RD 203/2021:** Real Decreto 203/2021, de 30 de marzo, por el que se aprueba el Reglamento de actuación y funcionamiento del sector público por medios electrónicos
- **RD 4/2010 (ENI):** Real Decreto 4/2010, de 8 de enero, por el que se regula el Esquema Nacional de Interoperabilidad
- **NTI Documento Electrónico:** Norma Técnica de Interoperabilidad de Documento Electrónico
- **NTI Expediente Electrónico:** Norma Técnica de Interoperabilidad de Expediente Electrónico
- **Portal PAe:** https://administracionelectronica.gob.es

---

> **Disclaimer:** Este informe es un análisis técnico del código fuente y la arquitectura del sistema. No constituye asesoramiento jurídico. La aplicación analizada (PetClinic) es un ejemplo didáctico no diseñado para administración pública. Este informe identifica las brechas que existirían si el sistema se adaptase para uso en el sector público. Se recomienda consultar con la Secretaría General de Administración Digital (SGAD) y un equipo jurídico especializado.

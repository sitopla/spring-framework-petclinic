# Informe de Validación de Terminología Clínica

## Spring Framework PetClinic v7.0.3

| Campo | Valor |
|-------|-------|
| **Fecha del análisis** | 2025 |
| **Analista** | Clinical Terminology Validator + Copilot CLI |
| **Versión de la aplicación** | Spring MVC 7.0.3 / Hibernate 7.2.3 / Java 17 / WAR |
| **Sistemas evaluados** | SNOMED CT, CIE-10-ES, ICD-11, LOINC, CIAP-2, ATC/CN AEMPS, UCUM |
| **Normativa de referencia** | RD 1093/2010 (HCDSNS), Ley 16/2003 (SNS), Reglamento UE EHDS |

---

## 1. Resumen Ejecutivo

La aplicación Spring Framework PetClinic es un sistema de gestión de clínica **veterinaria** utilizado como demostración del framework Spring. A pesar de su dominio clínico, la aplicación **no implementa NINGÚN sistema de terminología clínica estándar**.

Todos los datos clínicos se almacenan exclusivamente como **texto libre** (`VARCHAR`) sin códigos, sin URIs de sistema, sin validación de vocabulario controlado y sin posibilidad de interoperabilidad con otros sistemas de información sanitaria.

### Puntuación Global

```
╔══════════════════════════════════════════════════════════╗
║  CALIDAD TERMINOLÓGICA:  0 / 100  — CRÍTICA             ║
╠══════════════════════════════════════════════════════════╣
║  Campos con terminología estándar:   0 / 15   (0,0%)    ║
║  Campos solo con texto libre:        15                  ║
║  Bibliotecas clínicas en pom.xml:     0                  ║
║  Vocabularios controlados:            0                  ║
║  Sistemas de codificación:            0                  ║
╚══════════════════════════════════════════════════════════╝
```

### Sistemas de Terminología Analizados

| Sistema | Estado | Referencias en código |
|---------|--------|----------------------|
| SNOMED CT | ❌ **AUSENTE** | 0 |
| CIE-10-ES | ❌ **AUSENTE** | 0 |
| ICD-11 | ❌ **AUSENTE** | 0 |
| LOINC | ❌ **AUSENTE** | 0 |
| CIAP-2 | ❌ **AUSENTE** | 0 |
| ATC / CN AEMPS | ❌ **AUSENTE** | 0 |
| UCUM | ❌ **AUSENTE** | 0 |
| HL7 FHIR | ❌ **AUSENTE** | 0 bibliotecas, 0 recursos |

### Distribución de Hallazgos

| Severidad | Cantidad | Descripción |
|-----------|----------|-------------|
| 🔴 **CRÍTICO** | 3 | Procedimientos clínicos en `Visit.description` sin codificar |
| 🟠 **ALTO** | 3 | Especialidades médicas en `Specialty.name` sin codificar |
| 🟡 **MEDIO** | 6 | Clasificación de especies en `PetType.name` sin codificar |
| **Total** | **12** | |

---

## 2. Inventario Completo de Datos Clínicos

### 2.1 Mapa de Entidades y Campos

| Entidad Java | Tabla BD | Campo | Tipo BD | ¿Codificado? | Contenido |
|-------------|----------|-------|---------|---------------|-----------|
| `Visit` | `visits` | `description` | `VARCHAR(255)` | ❌ NO | Procedimientos, vacunaciones, notas clínicas |
| `Visit` | `visits` | `visit_date` | `DATE` | N/A | Fecha del encuentro clínico |
| `Specialty` | `specialties` | `name` | `VARCHAR(80)` | ❌ NO | Especialidades médicas veterinarias |
| `PetType` | `types` | `name` | `VARCHAR(80)` | ❌ NO | Taxonomía de especies animales |
| `Pet` | `pets` | `name` | `VARCHAR(30)` | N/A | Nombre del animal paciente |
| `Pet` | `pets` | `birth_date` | `DATE` | N/A | Fecha de nacimiento del paciente |
| `Vet` | `vets` | `first_name` | `VARCHAR(30)` | N/A | Nombre del profesional sanitario |
| `Vet` | `vets` | `last_name` | `VARCHAR(30)` | N/A | Apellido del profesional sanitario |
| `Owner` | `owners` | `first_name` | `VARCHAR(30)` | N/A | Nombre del propietario/responsable |
| `Owner` | `owners` | `last_name` | `VARCHAR(30)` | N/A | Apellido del propietario/responsable |
| `Owner` | `owners` | `address` | `VARCHAR(255)` | N/A | Dirección |
| `Owner` | `owners` | `city` | `VARCHAR(80)` | N/A | Ciudad |
| `Owner` | `owners` | `telephone` | `VARCHAR(20)` | N/A | Teléfono |

**Campos con contenido clínico que REQUIEREN codificación: 3**

1. **`Visit.description`** → Procedimientos / vacunaciones / notas clínicas
2. **`Specialty.name`** → Especialidades médicas veterinarias
3. **`PetType.name`** → Taxonomía de especies animales

### 2.2 Datos Semilla Encontrados (data.sql)

Los siguientes ficheros contienen datos idénticos de texto libre:

- `src/main/resources/db/h2/data.sql`
- `src/main/resources/db/hsqldb/data.sql`
- `src/main/resources/db/mysql/data.sql`
- `src/main/resources/db/postgresql/data.sql`

#### Visitas (Procedimientos Clínicos)

```sql
INSERT INTO visits VALUES (1, 7, '2013-01-01', 'rabies shot');   -- Vacunación antirrábica
INSERT INTO visits VALUES (2, 8, '2013-01-02', 'rabies shot');   -- Vacunación antirrábica
INSERT INTO visits VALUES (3, 8, '2013-01-03', 'neutered');      -- Castración
INSERT INTO visits VALUES (4, 7, '2013-01-04', 'spayed');        -- Ovariohisterectomía
```

#### Especialidades

```sql
INSERT INTO specialties VALUES (1, 'radiology');    -- Radiología diagnóstica
INSERT INTO specialties VALUES (2, 'surgery');       -- Cirugía general
INSERT INTO specialties VALUES (3, 'dentistry');     -- Odontología
```

#### Tipos de Animal (Especies)

```sql
INSERT INTO types VALUES (1, 'cat');       -- Gato doméstico
INSERT INTO types VALUES (2, 'dog');       -- Perro doméstico
INSERT INTO types VALUES (3, 'lizard');    -- Lagarto
INSERT INTO types VALUES (4, 'snake');     -- Serpiente
INSERT INTO types VALUES (5, 'bird');      -- Ave
INSERT INTO types VALUES (6, 'hamster');   -- Hámster
```

---

## 3. Hallazgos Detallados

### 3.1 🔴 CRÍTICO — Visit.description: Procedimientos sin codificar

---

#### V-001 — `Visit.description` = "rabies shot"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🔴 CRÍTICO |
| **Entidad Java** | `Visit.java` línea 49 |
| **Tabla/Columna** | `visits.description` `VARCHAR(255)` |
| **Valor actual** | `"rabies shot"` (texto libre) |
| **Validación actual** | Solo `@NotEmpty` — sin vocabulario controlado |
| **Entrada UI** | `<petclinic:inputField>` texto libre en `createOrUpdateVisitForm.jsp` línea 40 |
| **Exposición API** | Serializado en JSON/XML sin codificación |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **14189004** | Rabies vaccination (procedure) |
| Jerarquía | `Procedure` → `Immunization procedure` | |

**Código CIE-10-ES equivalente:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://hl7.org/fhir/sid/icd-10-cm` | **Z23** | Encounter for immunization |

**Código LOINC para documento de vacunación:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://loinc.org` | **11369-6** | History of Immunization |

**Ejemplo FHIR CodeableConcept correcto:**

```json
{
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "14189004",
        "display": "Rabies vaccination (procedure)"
      },
      {
        "system": "http://hl7.org/fhir/sid/icd-10-cm",
        "code": "Z23",
        "display": "Encounter for immunization"
      }
    ],
    "text": "rabies shot"
  }
}
```

---

#### V-002 — `Visit.description` = "neutered"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🔴 CRÍTICO |
| **Entidad Java** | `Visit.java` línea 49 |
| **Tabla/Columna** | `visits.description` `VARCHAR(255)` |
| **Valor actual** | `"neutered"` (texto libre) |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **22523008** | Castration of male (procedure) |
| Jerarquía | `Procedure` → `Surgical procedure on male genital structure` | |

**Ejemplo FHIR CodeableConcept correcto:**

```json
{
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "22523008",
        "display": "Castration of male (procedure)"
      }
    ],
    "text": "neutered"
  }
}
```

---

#### V-003 — `Visit.description` = "spayed"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🔴 CRÍTICO |
| **Entidad Java** | `Visit.java` línea 49 |
| **Tabla/Columna** | `visits.description` `VARCHAR(255)` |
| **Valor actual** | `"spayed"` (texto libre) |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **297281004** | Ovariohysterectomy (procedure) |
| Alternativo | **65200003** | Ovariectomy (más genérico) |
| Jerarquía | `Procedure` → `Surgical procedure on female genital structure` | |

**Ejemplo FHIR CodeableConcept correcto:**

```json
{
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "297281004",
        "display": "Ovariohysterectomy (procedure)"
      }
    ],
    "text": "spayed"
  }
}
```

---

### 3.2 🟠 ALTO — Specialty.name: Especialidades sin codificar

---

#### S-001 — `Specialty.name` = "radiology"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🟠 ALTO |
| **Entidad Java** | `Specialty.java` (hereda `NamedEntity.name`) |
| **Tabla/Columna** | `specialties.name` `VARCHAR(80)` |
| **Valor actual** | `"radiology"` (texto libre) |
| **Validación actual** | Ninguna — ni siquiera `@NotEmpty` |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **394914008** | Radiology - diagnostic imaging (qualifier value) |

---

#### S-002 — `Specialty.name` = "surgery"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🟠 ALTO |
| **Valor actual** | `"surgery"` (texto libre) |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **394609007** | General surgery (qualifier value) |

---

#### S-003 — `Specialty.name` = "dentistry"

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🟠 ALTO |
| **Valor actual** | `"dentistry"` (texto libre) |

**Código SNOMED CT recomendado:**

| Sistema | Código | Display |
|---------|--------|---------|
| `http://snomed.info/sct` | **722163006** | Dentistry (qualifier value) |
| Alternativo | **394812008** | Dental medicine (qualifier value) |

---

### 3.3 🟡 MEDIO — PetType.name: Especies sin codificar

---

#### T-001 a T-006 — Tipos de animal sin código SNOMED CT

| Atributo | Detalle |
|----------|---------|
| **Severidad** | 🟡 MEDIO |
| **Entidad Java** | `PetType.java` (hereda `NamedEntity.name`) |
| **Tabla/Columna** | `types.name` `VARCHAR(80)` |
| **Validación actual** | Ninguna |

**Códigos SNOMED CT recomendados (Jerarquía: Organism):**

| Valor actual | Código SNOMED CT | Display (FSN) |
|-------------|------------------|---------------|
| `cat` | **448169003** | Domestic cat (organism) |
| `dog` | **448771007** | Domestic dog (organism) |
| `lizard` | **2773008** | Lizard (organism) |
| `snake` | **107226004** | Snake (organism) |
| `bird` | **387972009** | Bird (organism) |
| `hamster` | **392005** | Hamster (organism) |

**URI del sistema:** `http://snomed.info/sct`

---

## 4. Análisis de Sistemas de Codificación Ausentes

### 4.1 SNOMED CT — Sistema Nacional de Salud (licencia SNS España)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | ❌ AUSENTE — 0 `conceptId`, 0 URIs `http://snomed.info/sct` en todo el código fuente |
| **Impacto** | Imposible codificar diagnósticos, procedimientos o hallazgos de forma estándar |
| **Campos afectados** | `Visit.description`, `Specialty.name`, `PetType.name` |
| **Licencia** | Disponible para el SNS mediante licencia IHTSDO gestionada por el MSSSI |
| **Acción requerida** | Implementar codificación SNOMED CT en los 3 campos clínicos principales |

### 4.2 CIE-10-ES (Clasificación Internacional de Enfermedades)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | ❌ AUSENTE — No hay códigos con formato `X##.#` ni URIs ICD-10 |
| **Impacto** | Sin posibilidad de generar CMBD (Conjunto Mínimo Básico de Datos) |
| **Aplicación** | Necesario para codificación al alta de visitas |
| **Acción requerida** | Añadir campo `diagnosis_code`/`diagnosis_system` en tabla `visits` |

### 4.3 ICD-11

| Aspecto | Análisis |
|---------|----------|
| **Estado** | ❌ AUSENTE — Sin adopción ni preparación |
| **Impacto** | Sin preparación para la transición futura de la OMS |
| **Acción requerida** | Considerar compatibilidad en el diseño del modelo de datos |

### 4.4 LOINC (Logical Observation Identifiers Names and Codes)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | ❌ AUSENTE — No hay códigos con formato `NNNNN-N` |
| **Impacto** | No existen resultados de laboratorio ni signos vitales en el modelo de datos |
| **Aplicación futura** | Si se añaden: peso del animal (`29463-7`), temperatura (`8310-5`), analíticas |
| **Acción requerida** | Implementar cuando se incorporen resultados de observaciones |

### 4.5 CIAP-2 (Clasificación Internacional de Atención Primaria)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | N/A parcial — No hay Atención Primaria modelada como tal |
| **Aplicación** | Si se modelaran motivos de consulta: capítulo A (General), L (Músculo-esquelético), etc. |
| **Acción requerida** | Implementar si se añade registro de motivos de consulta |

### 4.6 ATC / CN AEMPS (Código Nacional de Medicamentos)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | N/A — No hay medicamentos en el modelo de datos |
| **Impacto** | `Visit.description` podría incluir medicamentos como texto libre, pero no hay campo dedicado |
| **Acción requerida** | Crear entidad `Medication` con campos ATC code + dosis + unidad UCUM |

### 4.7 UCUM (Unified Code for Units of Measure)

| Aspecto | Análisis |
|---------|----------|
| **Estado** | ❌ AUSENTE — No hay unidades de medida en ningún campo del modelo |
| **Impacto** | Sin resultados cuantitativos en el sistema |
| **Acción requerida** | Implementar cuando se añadan signos vitales y resultados de laboratorio |

---

## 5. Análisis de Deficiencias del Modelo de Datos

### 5.1 Visit.description es VARCHAR puro sin estructura

**Código actual** (`Visit.java` línea 47-49):

```java
@NotEmpty
@Column(name = "description")
private String description;
```

**Esquema actual** (`schema.sql`):

```sql
CREATE TABLE visits (
    id          INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    pet_id      INTEGER NOT NULL,
    visit_date  DATE,
    description VARCHAR(255)  -- ← SOLO TEXTO LIBRE
);
```

**Entrada de usuario** (`createOrUpdateVisitForm.jsp` línea 40):

```jsp
<petclinic:inputField label="Description" name="description"/>
<!-- INPUT DE TEXTO LIBRE, sin dropdown, sin autocompletado, sin picker terminológico -->
```

> **Riesgo:** El campo más crítico del sistema (nota clínica de la visita) acepta cualquier texto sin validación terminológica. Valores reales: `"rabies shot"`, `"neutered"`, `"spayed"`.

### 5.2 Specialty y PetType heredan de NamedEntity sin código

**Código actual** (`NamedEntity.java`):

```java
@MappedSuperclass
public class NamedEntity extends BaseEntity {
    @Column(name = "name")
    private String name;  // ← SOLO UN CAMPO: texto libre
}
```

**Columnas ausentes:**
- `code` — código estándar del concepto
- `code_system` — URI del sistema de codificación
- `code_version` — versión del sistema

### 5.3 API JSON/XML expone texto libre sin codificación

**Respuesta actual** (`GET /vets.json`):

```json
{
  "vetList": [{
    "id": 2,
    "firstName": "Helen",
    "lastName": "Leary",
    "specialties": [{
      "id": 1,
      "name": "radiology"     // ← TEXTO LIBRE, no codificado
    }]
  }]
}
```

**Respuesta correcta con codificación FHIR:**

```json
{
  "specialty": [{
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "394914008",
      "display": "Radiology"
    }],
    "text": "radiology"
  }]
}
```

### 5.4 Sin validación de vocabulario en controladores

**Código actual** (`VisitController.java` línea 75-83):

```java
@PostMapping("/owners/{ownerId}/pets/{petId}/visits/new")
public String processNewVisitForm(@Valid Visit visit, BindingResult result) {
    if (result.hasErrors()) {
        return "pets/createOrUpdateVisitForm";
    }
    this.clinicService.saveVisit(visit);  // ← SE GUARDA SIN VALIDAR CÓDIGO
    return "redirect:/owners/{ownerId}";
}
```

---

## 6. Tabla de Mapeos Completa: Texto Libre → Estándar

| Texto libre | SNOMED CT | CIE-10-ES | LOINC | Display estándar |
|-------------|-----------|-----------|-------|------------------|
| `rabies shot` | **14189004** | Z23 | 11369-6 | Rabies vaccination (procedure) |
| `neutered` | **22523008** | — | — | Castration of male (procedure) |
| `spayed` | **297281004** | — | — | Ovariohysterectomy (procedure) |
| `radiology` | **394914008** | — | — | Radiology - diagnostic imaging |
| `surgery` | **394609007** | — | — | General surgery |
| `dentistry` | **722163006** | — | — | Dentistry |
| `cat` | **448169003** | — | — | Domestic cat (organism) |
| `dog` | **448771007** | — | — | Domestic dog (organism) |
| `lizard` | **2773008** | — | — | Lizard (organism) |
| `snake` | **107226004** | — | — | Snake (organism) |
| `bird` | **387972009** | — | — | Bird (organism) |
| `hamster` | **392005** | — | — | Hamster (organism) |

---

## 7. Plan de Remediación Priorizado

### Prioridad 1 — 🔴 CRÍTICA: Codificar Visit.description

**Impacto:** Campo principal de datos clínicos de toda la aplicación.

#### 7.1.1 Migración de esquema de base de datos

```sql
-- Fichero: V2__add_visit_terminology_columns.sql (Flyway)
-- Aplicar en todos los dialectos: H2, HSQLDB, MySQL, PostgreSQL

ALTER TABLE visits
    ADD COLUMN procedure_code    VARCHAR(18),
    ADD COLUMN procedure_system  VARCHAR(100) DEFAULT 'http://snomed.info/sct',
    ADD COLUMN procedure_display VARCHAR(255),
    ADD COLUMN diagnosis_code    VARCHAR(10),
    ADD COLUMN diagnosis_system  VARCHAR(100) DEFAULT 'http://hl7.org/fhir/sid/icd-10-cm';
-- Mantener 'description' como texto libre complementario (narrativa)
```

#### 7.1.2 Migración de datos existentes

```sql
-- Vacunación antirrábica
UPDATE visits SET
    procedure_code = '14189004',
    procedure_system = 'http://snomed.info/sct',
    procedure_display = 'Rabies vaccination (procedure)'
WHERE description = 'rabies shot';

-- Castración (macho)
UPDATE visits SET
    procedure_code = '22523008',
    procedure_system = 'http://snomed.info/sct',
    procedure_display = 'Castration of male (procedure)'
WHERE description = 'neutered';

-- Ovariohisterectomía (hembra)
UPDATE visits SET
    procedure_code = '297281004',
    procedure_system = 'http://snomed.info/sct',
    procedure_display = 'Ovariohysterectomy (procedure)'
WHERE description = 'spayed';
```

#### 7.1.3 Modificación de la entidad Java

```java
package org.springframework.samples.petclinic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@Entity
@Table(name = "visits")
public class Visit extends BaseEntity {

    @Column(name = "visit_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotEmpty
    @Column(name = "description")
    private String description;

    // ===== NUEVOS CAMPOS DE TERMINOLOGÍA =====

    @Column(name = "procedure_code")
    private String procedureCode;

    @Column(name = "procedure_system")
    private String procedureSystem = "http://snomed.info/sct";

    @Column(name = "procedure_display")
    private String procedureDisplay;

    @Column(name = "diagnosis_code")
    private String diagnosisCode;

    @Column(name = "diagnosis_system")
    private String diagnosisSystem;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    // Getters y setters para los nuevos campos...

    public String getProcedureCode() { return procedureCode; }
    public void setProcedureCode(String procedureCode) { this.procedureCode = procedureCode; }

    public String getProcedureSystem() { return procedureSystem; }
    public void setProcedureSystem(String procedureSystem) { this.procedureSystem = procedureSystem; }

    public String getProcedureDisplay() { return procedureDisplay; }
    public void setProcedureDisplay(String procedureDisplay) { this.procedureDisplay = procedureDisplay; }

    public String getDiagnosisCode() { return diagnosisCode; }
    public void setDiagnosisCode(String diagnosisCode) { this.diagnosisCode = diagnosisCode; }

    public String getDiagnosisSystem() { return diagnosisSystem; }
    public void setDiagnosisSystem(String diagnosisSystem) { this.diagnosisSystem = diagnosisSystem; }
}
```

#### 7.1.4 Servicio de validación terminológica

```java
package org.springframework.samples.petclinic.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ClinicalTerminologyService {

    private static final String SNOMED_SYSTEM = "http://snomed.info/sct";

    // ValueSet de procedimientos veterinarios comunes (SNOMED CT)
    private static final Map<String, ClinicalCode> PROCEDURE_VALUESET = Map.ofEntries(
        Map.entry("14189004", new ClinicalCode(SNOMED_SYSTEM, "14189004",
            "Rabies vaccination (procedure)")),
        Map.entry("22523008", new ClinicalCode(SNOMED_SYSTEM, "22523008",
            "Castration of male (procedure)")),
        Map.entry("297281004", new ClinicalCode(SNOMED_SYSTEM, "297281004",
            "Ovariohysterectomy (procedure)")),
        Map.entry("65200003", new ClinicalCode(SNOMED_SYSTEM, "65200003",
            "Ovariectomy (procedure)")),
        Map.entry("33879002", new ClinicalCode(SNOMED_SYSTEM, "33879002",
            "Vaccination (procedure)")),
        Map.entry("243120004", new ClinicalCode(SNOMED_SYSTEM, "243120004",
            "Regimen/therapy (procedure)")),
        Map.entry("53326007", new ClinicalCode(SNOMED_SYSTEM, "53326007",
            "Clinical examination (procedure)")),
        Map.entry("225413001", new ClinicalCode(SNOMED_SYSTEM, "225413001",
            "Administration of vaccine product (procedure)"))
    );

    // Mapeo de texto libre → código SNOMED CT
    private static final Map<String, String> FREE_TEXT_TO_SNOMED = Map.of(
        "rabies shot",   "14189004",
        "neutered",      "22523008",
        "spayed",        "297281004",
        "vaccination",   "33879002",
        "exam",          "53326007",
        "checkup",       "53326007"
    );

    /**
     * Valida si un código SNOMED CT pertenece al ValueSet de procedimientos.
     */
    public boolean isValidProcedureCode(String code) {
        return PROCEDURE_VALUESET.containsKey(code);
    }

    /**
     * Intenta resolver un texto libre a un código SNOMED CT.
     * Retorna Optional.empty() si no se encuentra mapeo.
     */
    public Optional<ClinicalCode> resolveFromFreeText(String freeText) {
        if (freeText == null) return Optional.empty();
        String normalized = freeText.trim().toLowerCase();
        String snomedCode = FREE_TEXT_TO_SNOMED.get(normalized);
        if (snomedCode != null) {
            return Optional.of(PROCEDURE_VALUESET.get(snomedCode));
        }
        return Optional.empty();
    }

    /**
     * Obtiene el ClinicalCode para un código SNOMED CT dado.
     */
    public Optional<ClinicalCode> lookupSnomedCode(String code) {
        return Optional.ofNullable(PROCEDURE_VALUESET.get(code));
    }

    /**
     * Devuelve todos los códigos del ValueSet para un selector en la UI.
     */
    public Collection<ClinicalCode> getAllProcedureCodes() {
        return Collections.unmodifiableCollection(PROCEDURE_VALUESET.values());
    }

    /**
     * Registro inmutable de un código clínico.
     */
    public record ClinicalCode(String system, String code, String display) {
        @Override
        public String toString() {
            return display + " [" + code + "]";
        }
    }
}
```

#### 7.1.5 Modificación del formulario JSP

```jsp
<%-- createOrUpdateVisitForm.jsp — Reemplazar input de texto libre por selector codificado --%>
<div class="form-group">
    <petclinic:inputField label="Date" name="date"/>

    <%-- Selector de procedimiento codificado (SNOMED CT) --%>
    <div class="control-group">
        <label class="col-sm-2 control-label">Procedure</label>
        <div class="col-sm-10">
            <select name="procedureCode" class="form-control" id="procedureCode"
                    onchange="updateProcedureFields(this)">
                <option value="">-- Select procedure --</option>
                <c:forEach items="${procedureCodes}" var="pc">
                    <option value="${pc.code()}"
                            data-system="${pc.system()}"
                            data-display="${pc.display()}">
                        ${pc.display()} [${pc.code()}]
                    </option>
                </c:forEach>
            </select>
            <input type="hidden" name="procedureSystem" id="procedureSystem"/>
            <input type="hidden" name="procedureDisplay" id="procedureDisplay"/>
        </div>
    </div>

    <%-- Campo de texto libre complementario (narrativa) --%>
    <petclinic:inputField label="Additional Notes" name="description"/>
</div>

<script>
function updateProcedureFields(select) {
    var option = select.options[select.selectedIndex];
    document.getElementById('procedureSystem').value = option.dataset.system || '';
    document.getElementById('procedureDisplay').value = option.dataset.display || '';
}
</script>
```

---

### Prioridad 2 — 🟠 ALTA: Codificar Specialty (especialidades médicas)

#### 7.2.1 Migración de esquema

```sql
-- V3__add_specialty_terminology_columns.sql
ALTER TABLE specialties
    ADD COLUMN snomed_code   VARCHAR(18),
    ADD COLUMN snomed_system VARCHAR(100) DEFAULT 'http://snomed.info/sct';
```

#### 7.2.2 Migración de datos

```sql
UPDATE specialties SET snomed_code = '394914008' WHERE name = 'radiology';
UPDATE specialties SET snomed_code = '394609007' WHERE name = 'surgery';
UPDATE specialties SET snomed_code = '722163006' WHERE name = 'dentistry';
```

#### 7.2.3 Nueva superclase CodedNamedEntity

```java
package org.springframework.samples.petclinic.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

/**
 * Extiende NamedEntity añadiendo campos de codificación estándar (SNOMED CT).
 * Base para cualquier entidad que represente un concepto clínico codificable.
 */
@MappedSuperclass
public class CodedNamedEntity extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "snomed_code")
    private String snomedCode;

    @Column(name = "snomed_system")
    private String snomedSystem = "http://snomed.info/sct";

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSnomedCode() { return snomedCode; }
    public void setSnomedCode(String snomedCode) { this.snomedCode = snomedCode; }

    public String getSnomedSystem() { return snomedSystem; }
    public void setSnomedSystem(String snomedSystem) { this.snomedSystem = snomedSystem; }

    /**
     * Genera un FHIR CodeableConcept JSON fragment.
     */
    public String toFhirCodeableConceptJson() {
        if (snomedCode == null) return "\"text\": \"" + name + "\"";
        return String.format("""
            "coding": [{"system": "%s", "code": "%s", "display": "%s"}],
            "text": "%s"
            """, snomedSystem, snomedCode, name, name);
    }
}
```

#### 7.2.4 Refactorizar Specialty

```java
// Cambiar: public class Specialty extends NamedEntity { }
// A:
@Entity
@Table(name = "specialties")
public class Specialty extends CodedNamedEntity {
    // Ahora hereda name + snomedCode + snomedSystem
}
```

---

### Prioridad 3 — 🟡 MEDIA: Codificar PetType (especies animales)

#### 7.3.1 Migración de esquema

```sql
-- V4__add_pettype_terminology_columns.sql
ALTER TABLE types
    ADD COLUMN snomed_code   VARCHAR(18),
    ADD COLUMN snomed_system VARCHAR(100) DEFAULT 'http://snomed.info/sct';
```

#### 7.3.2 Migración de datos

```sql
UPDATE types SET snomed_code = '448169003' WHERE name = 'cat';
UPDATE types SET snomed_code = '448771007' WHERE name = 'dog';
UPDATE types SET snomed_code = '2773008'   WHERE name = 'lizard';
UPDATE types SET snomed_code = '107226004' WHERE name = 'snake';
UPDATE types SET snomed_code = '387972009' WHERE name = 'bird';
UPDATE types SET snomed_code = '392005'    WHERE name = 'hamster';
```

#### 7.3.3 Refactorizar PetType

```java
// Cambiar: public class PetType extends NamedEntity { }
// A:
@Entity
@Table(name = "types")
public class PetType extends CodedNamedEntity {
    // Ahora hereda name + snomedCode + snomedSystem
}
```

---

### Prioridad 4 — FUTURA: Campos adicionales para un HIS completo

Si se extiende el modelo para un sistema de información sanitaria veterinario completo, se recomienda añadir:

| Campo | LOINC | UCUM | Descripción |
|-------|-------|------|-------------|
| Peso del animal | `29463-7` (Body weight) | `kg` | Peso corporal en kilogramos |
| Temperatura corporal | `8310-5` (Body temperature) | `Cel` | Temperatura en grados Celsius |
| Frecuencia cardíaca | `8867-4` (Heart rate) | `/min` | Latidos por minuto |
| Presión arterial sistólica | `8480-6` | `mm[Hg]` | Presión en mmHg |
| Glucosa en sangre | `2345-7` | `mg/dL` | Nivel de glucosa |

**Entidad FHIR Observation para signos vitales:**

```java
package org.springframework.samples.petclinic.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "observations")
public class Observation extends BaseEntity {

    @Column(name = "loinc_code", nullable = false)
    private String loincCode;

    @Column(name = "loinc_display")
    private String loincDisplay;

    @Column(name = "value_quantity")
    private BigDecimal valueQuantity;

    @Column(name = "value_unit")
    private String valueUnit; // UCUM code

    @Column(name = "value_system")
    private String valueSystem = "http://unitsofmeasure.org";

    @Column(name = "effective_date_time")
    private Instant effectiveDateTime;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Visit visit;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    // Getters y setters...
}
```

**Esquema SQL correspondiente:**

```sql
-- V5__create_observations_table.sql
CREATE TABLE observations (
    id                  INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    loinc_code          VARCHAR(10)    NOT NULL,
    loinc_display       VARCHAR(255),
    value_quantity      DECIMAL(10,4),
    value_unit          VARCHAR(20),   -- UCUM: "kg", "Cel", "/min"
    value_system        VARCHAR(100)   DEFAULT 'http://unitsofmeasure.org',
    effective_date_time TIMESTAMP,
    visit_id            INTEGER        REFERENCES visits(id),
    pet_id              INTEGER        NOT NULL REFERENCES pets(id)
);
```

**Entidad Medication con ATC/CN AEMPS:**

```java
package org.springframework.samples.petclinic.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "medications")
public class Medication extends BaseEntity {

    @Column(name = "atc_code")
    private String atcCode; // ATC: e.g., "J07BG01" (Rabies vaccine)

    @Column(name = "cn_aemps")
    private String cnAemps; // Código Nacional AEMPS

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "dose_value")
    private BigDecimal doseValue;

    @Column(name = "dose_unit")
    private String doseUnit; // UCUM: "mL", "mg", etc.

    @Column(name = "route_snomed_code")
    private String routeSnomedCode; // e.g., "34206005" (Subcutaneous route)

    @Column(name = "route_display")
    private String routeDisplay;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Visit visit;

    // Getters y setters...
}
```

---

## 8. Ejemplos FHIR R4 Completos

### 8.1 Visit actual → FHIR Encounter + Procedure

**Dato actual en base de datos:**

```json
{ "date": "2013-01-01", "description": "rabies shot", "pet_id": 7 }
```

**Representación FHIR correcta — Encounter:**

```json
{
  "resourceType": "Encounter",
  "id": "visit-1",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "period": {
    "start": "2013-01-01"
  },
  "subject": {
    "reference": "Patient/7",
    "display": "Samantha (cat)"
  },
  "participant": [{
    "individual": {
      "reference": "Practitioner/2",
      "display": "Helen Leary"
    }
  }]
}
```

**Representación FHIR correcta — Procedure:**

```json
{
  "resourceType": "Procedure",
  "id": "proc-1",
  "status": "completed",
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "14189004",
        "display": "Rabies vaccination (procedure)"
      }
    ],
    "text": "rabies shot"
  },
  "subject": {
    "reference": "Patient/7"
  },
  "performedDateTime": "2013-01-01",
  "encounter": {
    "reference": "Encounter/visit-1"
  }
}
```

### 8.2 Specialty actual → FHIR PractitionerRole

**Dato actual:**

```json
{ "id": 2, "firstName": "Helen", "lastName": "Leary", "specialties": [{"name": "radiology"}] }
```

**Representación FHIR correcta:**

```json
{
  "resourceType": "PractitionerRole",
  "id": "role-2",
  "practitioner": {
    "reference": "Practitioner/2",
    "display": "Dr. Helen Leary"
  },
  "specialty": [{
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "394914008",
      "display": "Radiology - diagnostic imaging"
    }],
    "text": "radiology"
  }]
}
```

### 8.3 PetType actual → FHIR Patient.species (extensión)

**Dato actual:**

```json
{ "name": "Samantha", "birthDate": "2012-09-04", "type": {"name": "cat"} }
```

**Representación FHIR correcta (con extensión para especie):**

```json
{
  "resourceType": "Patient",
  "id": "7",
  "name": [{"text": "Samantha"}],
  "birthDate": "2012-09-04",
  "extension": [{
    "url": "http://hl7.org/fhir/StructureDefinition/patient-animal",
    "extension": [{
      "url": "species",
      "valueCodeableConcept": {
        "coding": [{
          "system": "http://snomed.info/sct",
          "code": "448169003",
          "display": "Domestic cat (organism)"
        }],
        "text": "cat"
      }
    }]
  }]
}
```

### 8.4 Observation FHIR (ejemplo futuro — peso corporal)

```json
{
  "resourceType": "Observation",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs",
      "display": "Vital Signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "29463-7",
      "display": "Body weight"
    }]
  },
  "subject": {
    "reference": "Patient/7",
    "display": "Samantha"
  },
  "effectiveDateTime": "2013-01-01",
  "valueQuantity": {
    "value": 4.5,
    "unit": "kg",
    "system": "http://unitsofmeasure.org",
    "code": "kg"
  }
}
```

---

## 9. Formato de fecha incompatible

**Hallazgo adicional:** El formato de fecha utilizado en la aplicación es incompatible con los estándares clínicos:

| Aspecto | Estado actual | Estándar requerido |
|---------|--------------|-------------------|
| `@DateTimeFormat` en `Visit.java` | `"yyyy/MM/dd"` (con barras) | `"yyyy-MM-dd"` (ISO 8601 / FHIR) |
| `@DateTimeFormat` en `Pet.java` | `"yyyy/MM/dd"` (con barras) | `"yyyy-MM-dd"` (ISO 8601 / FHIR) |
| flatpickr en JSPs | Sin formato explícito | Debe configurarse con `dateFormat: "Y-m-d"` |

**Corrección recomendada:**

```java
// En Visit.java y Pet.java:
@DateTimeFormat(pattern = "yyyy-MM-dd")  // ISO 8601 — compatible con FHIR
private LocalDate date;
```

---

## 10. Conclusiones

1. **Estado actual:** La aplicación opera en un nivel de "**texto libre total**" — el nivel más bajo posible de estandarización terminológica clínica. **Ningún campo utiliza códigos estándar de ningún sistema reconocido.**

2. **Riesgo principal:** **Imposibilidad total de interoperabilidad.** Los datos clínicos no pueden:
   - Ser intercambiados con otros sistemas (HCDSNS, CMBD)
   - Ser consultados semánticamente (buscar "todas las vacunaciones" es imposible si el texto dice `"rabies shot"`)
   - Ser auditados ni agregados estadísticamente
   - Cumplir con ninguna normativa del SNS

3. **Contexto atenuante:** PetClinic es una aplicación de **demostración** del framework Spring, no un sistema de producción clínico. Sin embargo, si se usara como base para un HIS veterinario real, las deficiencias terminológicas serían **bloqueantes** para cualquier certificación o interoperabilidad.

4. **Puntuación global: 0/100** — No existe ninguna implementación de terminología clínica estándar en ningún nivel del sistema (modelo de datos, servicio, controlador, vista o API).

---

## 11. Plan de Acción Resumido

| # | Prioridad | Acción | Sistemas | Impacto |
|---|-----------|--------|----------|---------|
| 1 | 🔴 CRÍTICA | Añadir columnas de codificación a `visits` + migrar datos | SNOMED CT, CIE-10-ES | Procedimientos codificados |
| 2 | 🔴 CRÍTICA | Crear `ClinicalTerminologyService` con ValueSets | SNOMED CT | Validación de códigos |
| 3 | 🔴 CRÍTICA | Reemplazar input de texto libre por selector codificado en JSP | SNOMED CT | Captura estructurada |
| 4 | 🟠 ALTA | Crear `CodedNamedEntity` y refactorizar `Specialty` | SNOMED CT | Especialidades codificadas |
| 5 | 🟠 ALTA | Migrar datos de especialidades a códigos SNOMED CT | SNOMED CT | Datos históricos |
| 6 | 🟡 MEDIA | Refactorizar `PetType` a `CodedNamedEntity` + migrar datos | SNOMED CT | Especies codificadas |
| 7 | 🟡 MEDIA | Corregir formato de fecha a ISO 8601 (`yyyy-MM-dd`) | — | Compatibilidad FHIR |
| 8 | ⬜ FUTURA | Crear tabla `observations` para signos vitales | LOINC, UCUM | Observaciones cuantitativas |
| 9 | ⬜ FUTURA | Crear tabla `medications` para prescripciones | ATC, CN AEMPS, UCUM | Farmacología |
| 10 | ⬜ FUTURA | Implementar servicio de terminología externo (HAPI FHIR TS) | Todos | Validación remota |

---

## 12. Referencias Normativas

| Referencia | Descripción |
|-----------|-------------|
| **SNOMED CT** | [https://www.snomed.org/](https://www.snomed.org/) — Licencia SNS gestionada por IHTSDO/MSSSI |
| **CIE-10-ES** | Clasificación Internacional de Enfermedades, 10ª revisión, Modificación Clínica — edición española |
| **ICD-11** | [https://icd.who.int/](https://icd.who.int/) — Clasificación Internacional de Enfermedades, 11ª revisión |
| **LOINC** | [https://loinc.org/](https://loinc.org/) — Logical Observation Identifiers Names and Codes |
| **CIAP-2** | Clasificación Internacional de Atención Primaria, 2ª edición — WONCA |
| **ATC/DDD** | [https://www.whocc.no/](https://www.whocc.no/) — Anatomical Therapeutic Chemical Classification |
| **CN AEMPS** | Código Nacional de Medicamentos — Agencia Española de Medicamentos y Productos Sanitarios |
| **UCUM** | [https://ucum.org/](https://ucum.org/) — Unified Code for Units of Measure |
| **HL7 FHIR R4** | [https://hl7.org/fhir/R4/](https://hl7.org/fhir/R4/) — Fast Healthcare Interoperability Resources |
| **RD 1093/2010** | Conjunto mínimo de datos de informes clínicos en el SNS (HCDSNS) |
| **Ley 16/2003** | Ley de cohesión y calidad del Sistema Nacional de Salud |
| **Reglamento EHDS** | European Health Data Space — Espacio Europeo de Datos de Salud |

---

> **Nota:** Este informe analiza el estado de terminología clínica del código fuente tal como se encuentra. Las recomendaciones están diseñadas para ser implementadas de forma incremental, empezando por los campos de mayor impacto clínico (`Visit.description`) y progresando hacia un modelo de datos completamente codificado y compatible con los estándares del SNS y FHIR R4.

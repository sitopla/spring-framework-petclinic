# Informe de Cumplimiento HL7 FHIR R4 — Spring Framework PetClinic

| Campo | Valor |
|---|---|
| **Sistema analizado** | Spring Framework PetClinic v7.0.3 |
| **Fecha** | 2026-03-07 |
| **Analista** | HL7 FHIR Compliance Analyzer |
| **Versión FHIR implementada** | ❌ NINGUNA |
| **Estado** | 🔴 **NO CONFORME** |
| **Servidor FHIR** | N/A — No existe endpoint FHIR |
| **Puntuación global** | **2 / 100** |

---

## 1. Resumen Ejecutivo

El **Spring Framework PetClinic** es una aplicación de demostración para enseñar patrones Spring MVC/JPA. Presenta una **ausencia total de cumplimiento HL7 FHIR R4**. No implementa servidor FHIR, no utiliza recursos FHIR, no emplea terminología estandarizada (SNOMED CT, LOINC, CIE-10-ES), carece de identificadores sanitarios (TSI, CIP-SNS, número de colegiado), no tiene autenticación SMART on FHIR, y no es compatible con los perfiles HCDSNS del Sistema Nacional de Salud español ni con el Espacio Europeo de Datos de Salud (EHDS).

### Tecnología Analizada

| Componente | Versión |
|---|---|
| Spring Framework | 7.0.3 (MVC, XML config, WAR) |
| Hibernate / JPA | 7.2.3 / Spring Data JPA 2025.1.2 |
| Java | 17 (Jakarta EE) |
| Jackson (JSON) | 3.0.4 |
| JAXB (XML) | 4.0.4 |
| Vista | JSP + JSTL |
| Seguridad | ❌ Ninguna (sin Spring Security) |

### Puntuación por Área

| Área | Puntuación | Estado |
|---|---|---|
| 1. Servidor FHIR (Discovery) | 0% | 🔴 Inexistente |
| 2. Mapeo de Recursos FHIR | 0% | 🔴 No implementado |
| 3. Terminología Estandarizada | 0% | 🔴 Solo texto libre |
| 4. Identificadores Sanitarios | 0% | 🔴 Solo auto-increment |
| 5. SMART on FHIR | 0% | 🔴 Sin seguridad |
| 6. Compatibilidad HCDSNS | 0% | 🔴 Sin perfiles SNS |
| 7. Calidad de Datos | 15% | 🟠 Parcial (LocalDate, @NotEmpty) |
| 8. Operaciones FHIR RESTful | 0% | 🔴 No implementadas |
| 9. Seguridad y Auditoría | 0% | 🔴 Sin auth/audit/cifrado |
| 10. Interoperabilidad EHDS | 0% | 🔴 Sin intercambio posible |
| **MEDIA PONDERADA** | **2%** | 🔴 **NO CONFORME** |

### Distribución de Hallazgos

| Severidad | Cantidad | Impacto |
|---|---|---|
| 🔴 CRÍTICO | 13 | Ausencia total de FHIR, seguridad, terminología, identificadores, HCDSNS |
| 🟠 ALTO | 6 | Mapeos incorrectos, texto libre, sin cifrado, sin cabeceras HTTP |
| 🟡 MEDIO | 4 | ContactPoint/Address sin estructura, sin gender, formato fecha |
| 🟢 BAJO | 1 | PetType sin URI de sistema |
| **TOTAL** | **24** | |

---

## 2. Hallazgos Detallados

---

### 2.1 Servidor FHIR (FHIR Server Discovery)

#### FHIR-SRV-001: Ausencia total de servidor FHIR

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Área** | Servidor FHIR |
| **Requisito** | HL7 FHIR R4 §2.21 — CapabilityStatement |

**Evidencia — Dependencias FHIR ausentes en `pom.xml`:**

```
✗ ca.uhn.hapi.fhir:hapi-fhir-server         → NO ENCONTRADA
✗ ca.uhn.hapi.fhir:hapi-fhir-structures-r4   → NO ENCONTRADA
✗ ca.uhn.hapi.fhir:hapi-fhir-client          → NO ENCONTRADA
✗ ca.uhn.hapi.fhir:hapi-fhir-jpaserver       → NO ENCONTRADA
✗ ca.uhn.hapi.fhir:hapi-fhir-validation      → NO ENCONTRADA
✗ org.hl7.fhir:*                              → NO ENCONTRADA
```

**Checklist de descubrimiento:**

| Requisito | Estado |
|---|---|
| Endpoint `/metadata` (CapabilityStatement) | ❌ Ausente |
| `fhirVersion` declarada ("4.0.1") | ❌ Ausente |
| Formatos FHIR (`application/fhir+json`, `application/fhir+xml`) | ❌ Ausente |
| Perfil de seguridad SMART-on-FHIR | ❌ Ausente |
| Declaración de recursos soportados | ❌ Ausente |
| Perfiles de implementación declarados | ❌ Ausente |

**Endpoints REST existentes (NO FHIR):**

| Endpoint | Método | Formato | Tipo |
|---|---|---|---|
| `/owners/new` | GET/POST | HTML (JSP) | Formulario |
| `/owners` | GET | HTML (JSP) | Búsqueda |
| `/owners/{id}` | GET | HTML (JSP) | Detalle |
| `/owners/{id}/edit` | GET/POST | HTML (JSP) | Formulario |
| `/owners/{id}/pets/new` | GET/POST | HTML (JSP) | Formulario |
| `/owners/{id}/pets/{petId}/edit` | GET/POST | HTML (JSP) | Formulario |
| `/owners/*/pets/{petId}/visits/new` | GET/POST | HTML (JSP) | Formulario |
| `/vets` | GET | HTML (JSP) | Lista |
| `/vets.json` | GET | `application/json` | JSON (Jackson) |
| `/vets.xml` | GET | `application/xml` | XML (JAXB) |
| `/oups` | GET | HTML (JSP) | Error demo |

**Comparación formato actual vs FHIR requerido:**

<table>
<tr><th>Actual: <code>/vets.json</code></th><th>FHIR Requerido</th></tr>
<tr>
<td>

```json
{
  "vetList": [
    {
      "id": 1,
      "firstName": "James",
      "lastName": "Carter",
      "specialties": []
    }
  ]
}
```

</td>
<td>

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 6,
  "entry": [{
    "fullUrl": "http://petclinic/fhir/Practitioner/1",
    "resource": {
      "resourceType": "Practitioner",
      "id": "1",
      "meta": {
        "profile": [
          "https://fhir.hl7.es/StructureDefinition/PractitionerSNS"
        ]
      },
      "name": [{
        "family": "Carter",
        "given": ["James"]
      }],
      "qualification": [{
        "code": {
          "coding": [{
            "system": "http://snomed.info/sct",
            "code": "394914008",
            "display": "Radiology"
          }]
        }
      }]
    }
  }]
}
```

</td>
</tr>
</table>

**Remediación — Registrar HAPI FHIR Servlet:**

```java
package org.springframework.samples.petclinic.fhir;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.RestfulServer;
import ca.uhn.fhir.rest.server.interceptor.ResponseHighlighterInterceptor;
import ca.uhn.fhir.rest.server.interceptor.LoggingInterceptor;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/fhir/*"}, displayName = "FHIR Server")
public class PetClinicFhirServer extends RestfulServer {

    @Override
    protected void initialize() throws ServletException {
        // Usar FHIR R4
        setFhirContext(FhirContext.forR4());

        // Registrar Resource Providers
        registerProvider(new PatientResourceProvider());
        registerProvider(new PractitionerResourceProvider());
        registerProvider(new EncounterResourceProvider());

        // Interceptores
        registerInterceptor(new ResponseHighlighterInterceptor());
        registerInterceptor(new LoggingInterceptor());
        registerInterceptor(new SmartOnFhirAuthInterceptor());

        // Metadata del servidor
        setServerName("PetClinic FHIR Server");
        setServerVersion("1.0.0");
        setImplementationDescription("Spring PetClinic HL7 FHIR R4 Server");
    }
}
```

---

### 2.2 Mapeo de Recursos FHIR

#### FHIR-MAP-001: Owner → Patient (Mismatch completo)

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `src/main/java/.../model/Owner.java` |
| **Requisito** | HL7 FHIR R4 Patient Resource |

**Modelo actual:**

```java
// Owner.java — Modelo actual (NO FHIR)
@Entity @Table(name = "owners")
public class Owner extends Person {
    @NotEmpty String address;      // Texto libre
    @NotEmpty String city;         // Texto libre
    @NotEmpty @Digits(fraction=0, integer=10) String telephone;
    Set<Pet> pets;                 // Relación 1:N
}
// Person.java — Clase base
@MappedSuperclass
public class Person extends BaseEntity {
    @NotEmpty String firstName;
    @NotEmpty String lastName;
}
```

**Campos FHIR `Patient` ausentes:**

| Campo FHIR | Estado | Detalle |
|---|---|---|
| `identifier[]` (TSI, CIP-SNS, DNI/NIE) | ❌ Ausente | Solo Integer auto-increment |
| `birthDate` | ❌ Ausente | Existe en Pet, NO en Owner |
| `gender` | ❌ Ausente | No existe en Person |
| `telecom[]` (ContactPoint) | ⚠️ Parcial | telephone sin system/use |
| `address[]` (Address structured) | ⚠️ Parcial | Sin state/postalCode/country |
| `meta.profile` | ❌ Ausente | Sin referencia a perfil FHIR |
| `active` | ❌ Ausente | Sin flag de estado |
| `communication[]` | ❌ Ausente | Sin preferencia de idioma |
| `generalPractitioner` | ❌ Ausente | Sin referencia a Practitioner |
| `contact[]` | ❌ Ausente | Sin contacto de emergencia |

**Ejemplo de datos actuales vs FHIR esperado:**

```sql
-- Actual (data.sql)
INSERT INTO owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023');
```

```json
// FHIR Patient esperado (perfil SNS español)
{
  "resourceType": "Patient",
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "meta": {
    "profile": ["https://fhir.hl7.es/StructureDefinition/PatientSNS"],
    "lastUpdated": "2026-03-07T13:00:00+01:00",
    "versionId": "1"
  },
  "identifier": [
    {
      "system": "https://sns.es/tsi",
      "value": "AANN12345678",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "SS",
          "display": "Social Security Number"
        }]
      }
    },
    {
      "system": "urn:oid:2.16.840.1.113883.2.19.20.1",
      "value": "BBBB12345678",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "JHN",
          "display": "Jurisdictional health number"
        }]
      }
    }
  ],
  "active": true,
  "name": [{
    "use": "official",
    "family": "Franklin",
    "given": ["George"]
  }],
  "gender": "male",
  "birthDate": "1975-03-15",
  "telecom": [{
    "system": "phone",
    "value": "+34 608 555 1023",
    "use": "home"
  }],
  "address": [{
    "use": "home",
    "line": ["110 W. Liberty St."],
    "city": "Madison",
    "state": "WI",
    "postalCode": "53703",
    "country": "US"
  }],
  "communication": [{
    "language": {
      "coding": [{
        "system": "urn:ietf:bcp:47",
        "code": "es"
      }]
    },
    "preferred": true
  }]
}
```

**Remediación — PatientResourceProvider:**

```java
package org.springframework.samples.petclinic.fhir.provider;

import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.r4.model.*;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.List;

public class PatientResourceProvider implements IResourceProvider {

    private final ClinicService clinicService;
    private final PatientFhirMapper mapper;

    public PatientResourceProvider(ClinicService clinicService) {
        this.clinicService = clinicService;
        this.mapper = new PatientFhirMapper();
    }

    @Override
    public Class<Patient> getResourceType() {
        return Patient.class;
    }

    @Read
    public Patient read(@IdParam IdType theId) {
        Owner owner = clinicService.findOwnerById(theId.getIdPartAsLong().intValue());
        if (owner == null) {
            throw new ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException(theId);
        }
        return mapper.toFhirPatient(owner);
    }

    @Search
    public List<Patient> searchByName(
            @RequiredParam(name = Patient.SP_FAMILY) StringType familyName) {
        return clinicService.findOwnerByLastName(familyName.getValue())
            .stream()
            .map(mapper::toFhirPatient)
            .toList();
    }

    @Create
    public MethodOutcome create(@ResourceParam Patient patient) {
        Owner owner = mapper.toOwner(patient);
        clinicService.saveOwner(owner);
        return new MethodOutcome()
            .setId(new IdType("Patient", String.valueOf(owner.getId())))
            .setCreated(true);
    }
}
```

**Remediación — PatientFhirMapper:**

```java
package org.springframework.samples.petclinic.fhir.mapper;

import org.hl7.fhir.r4.model.*;
import org.springframework.samples.petclinic.model.Owner;

public class PatientFhirMapper {

    private static final String PROFILE_PATIENT_SNS =
        "https://fhir.hl7.es/StructureDefinition/PatientSNS";
    private static final String SYSTEM_TSI = "https://sns.es/tsi";
    private static final String SYSTEM_CIP_SNS =
        "urn:oid:2.16.840.1.113883.2.19.20.1";

    public Patient toFhirPatient(Owner owner) {
        Patient patient = new Patient();

        // Meta con perfil SNS
        patient.getMeta()
            .addProfile(PROFILE_PATIENT_SNS)
            .setVersionId("1");

        // ID
        patient.setId(String.valueOf(owner.getId()));

        // Identificador TSI (si existe en el modelo extendido)
        if (owner.getTsi() != null) {
            patient.addIdentifier()
                .setSystem(SYSTEM_TSI)
                .setValue(owner.getTsi())
                .setType(new CodeableConcept().addCoding(
                    new Coding("http://terminology.hl7.org/CodeSystem/v2-0203",
                               "SS", "Social Security Number")));
        }

        // Nombre
        patient.addName()
            .setUse(HumanName.NameUse.OFFICIAL)
            .setFamily(owner.getLastName())
            .addGiven(owner.getFirstName());

        // Teléfono como ContactPoint
        if (owner.getTelephone() != null) {
            patient.addTelecom()
                .setSystem(ContactPoint.ContactPointSystem.PHONE)
                .setValue(owner.getTelephone())
                .setUse(ContactPoint.ContactPointUse.HOME);
        }

        // Dirección estructurada
        Address address = new Address()
            .setUse(Address.AddressUse.HOME)
            .setCity(owner.getCity());
        if (owner.getAddress() != null) {
            address.addLine(owner.getAddress());
        }
        patient.addAddress(address);

        // Fecha nacimiento y género (si están en el modelo extendido)
        if (owner.getBirthDate() != null) {
            patient.setBirthDateElement(
                new DateType(owner.getBirthDate().toString()));
        }
        if (owner.getGender() != null) {
            patient.setGender(mapGender(owner.getGender()));
        }

        patient.setActive(true);
        return patient;
    }

    private Enumerations.AdministrativeGender mapGender(String gender) {
        return switch (gender.toLowerCase()) {
            case "male", "m" -> Enumerations.AdministrativeGender.MALE;
            case "female", "f" -> Enumerations.AdministrativeGender.FEMALE;
            case "other" -> Enumerations.AdministrativeGender.OTHER;
            default -> Enumerations.AdministrativeGender.UNKNOWN;
        };
    }

    public Owner toOwner(Patient patient) {
        Owner owner = new Owner();
        if (patient.hasName()) {
            HumanName name = patient.getNameFirstRep();
            owner.setFirstName(name.getGivenAsSingleString());
            owner.setLastName(name.getFamily());
        }
        if (patient.hasTelecom()) {
            owner.setTelephone(patient.getTelecomFirstRep().getValue());
        }
        if (patient.hasAddress()) {
            Address addr = patient.getAddressFirstRep();
            owner.setAddress(addr.hasLine() ? addr.getLine().get(0).getValue() : "");
            owner.setCity(addr.getCity());
        }
        return owner;
    }
}
```

---

#### FHIR-MAP-002: Vet → Practitioner (Mismatch severo)

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `src/main/java/.../model/Vet.java` |
| **Requisito** | HL7 FHIR R4 Practitioner + PractitionerRole |

**Modelo actual:**

```java
@Entity @Table(name = "vets")
public class Vet extends Person {
    @ManyToMany(fetch = FetchType.EAGER)
    Set<Specialty> specialties;  // Texto libre: "radiology", "surgery", "dentistry"
}
```

**Campos FHIR `Practitioner` ausentes:**

| Campo FHIR | Estado |
|---|---|
| `identifier[]` (nº colegiado CGCOM) | ❌ Ausente |
| `qualification[]` (con CodeableConcept) | ❌ Ausente |
| `telecom[]` | ❌ Ausente |
| `address[]` | ❌ Ausente |
| `gender` | ❌ Ausente |
| `birthDate` | ❌ Ausente |
| `active` | ❌ Ausente |

**Especialidades: texto libre vs codificación SNOMED CT requerida:**

| Actual (texto libre) | Sistema SNOMED CT | Código | Display |
|---|---|---|---|
| `"radiology"` | `http://snomed.info/sct` | `394914008` | Radiology |
| `"surgery"` | `http://snomed.info/sct` | `394609007` | General surgery |
| `"dentistry"` | `http://snomed.info/sct` | `394812008` | Dental medicine |

**Remediación — PractitionerResourceProvider:**

```java
package org.springframework.samples.petclinic.fhir.provider;

import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.r4.model.*;
import org.springframework.samples.petclinic.model.Specialty;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.List;
import java.util.Map;

public class PractitionerResourceProvider implements IResourceProvider {

    private static final String SYSTEM_CGCOM =
        "urn:oid:2.16.840.1.113883.2.19.2.2";
    private static final String PROFILE_PRACTITIONER_SNS =
        "https://fhir.hl7.es/StructureDefinition/PractitionerSNS";

    // Mapeo especialidades → SNOMED CT
    private static final Map<String, String[]> SPECIALTY_SNOMED = Map.of(
        "radiology",  new String[]{"394914008", "Radiology"},
        "surgery",    new String[]{"394609007", "General surgery"},
        "dentistry",  new String[]{"394812008", "Dental medicine"}
    );

    private final ClinicService clinicService;

    public PractitionerResourceProvider(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Override
    public Class<Practitioner> getResourceType() {
        return Practitioner.class;
    }

    @Search
    public List<Practitioner> searchAll() {
        return clinicService.findVets().stream()
            .map(this::toFhirPractitioner)
            .toList();
    }

    private Practitioner toFhirPractitioner(Vet vet) {
        Practitioner practitioner = new Practitioner();
        practitioner.getMeta().addProfile(PROFILE_PRACTITIONER_SNS);
        practitioner.setId(String.valueOf(vet.getId()));
        practitioner.setActive(true);

        // Nombre estructurado
        practitioner.addName()
            .setUse(HumanName.NameUse.OFFICIAL)
            .setFamily(vet.getLastName())
            .addGiven(vet.getFirstName());

        // Identificador — Número de colegiado (CGCOM)
        practitioner.addIdentifier()
            .setSystem(SYSTEM_CGCOM)
            .setValue("COL-" + vet.getId())  // Placeholder hasta migración real
            .setType(new CodeableConcept().addCoding(
                new Coding("http://terminology.hl7.org/CodeSystem/v2-0203",
                           "MD", "Medical License number")));

        // Especialidades codificadas con SNOMED CT
        for (Specialty specialty : vet.getSpecialties()) {
            String[] snomed = SPECIALTY_SNOMED.get(
                specialty.getName().toLowerCase());
            if (snomed != null) {
                practitioner.addQualification()
                    .setCode(new CodeableConcept().addCoding(
                        new Coding("http://snomed.info/sct",
                                   snomed[0], snomed[1])));
            }
        }

        return practitioner;
    }
}
```

---

#### FHIR-MAP-003: Visit → Encounter (Mismatch severo)

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `src/main/java/.../model/Visit.java` |
| **Requisito** | HL7 FHIR R4 Encounter + Condition/Procedure/Immunization |

**Modelo actual:**

```java
@Entity @Table(name = "visits")
public class Visit extends BaseEntity {
    @DateTimeFormat(pattern = "yyyy/MM/dd") LocalDate date;
    @NotEmpty String description;  // ¡TEXTO LIBRE! VARCHAR(255)
    Pet pet;
}
```

**Campos FHIR `Encounter` ausentes:**

| Campo FHIR | Estado | Detalle |
|---|---|---|
| `status` (required) | ❌ | No hay planned/arrived/in-progress/finished |
| `class` (required) | ❌ | No hay AMB/EMER/IMP/SS |
| `type[]` | ❌ | Sin clasificación de visita |
| `serviceType` | ❌ | Sin tipo de servicio |
| `participant[]` | ❌ | **No hay referencia al Vet que atendió** |
| `period.end` | ❌ | Solo `date`, falta hora inicio/fin |
| `reasonCode[]` | ⚠️ | `description` es texto libre, no codificado |
| `diagnosis[]` | ❌ | No existe |
| `serviceProvider` | ❌ | Sin referencia a Organization |

**Datos de visita: texto libre vs codificación requerida:**

| Actual (texto libre) | Recurso FHIR correcto | Código SNOMED CT |
|---|---|---|
| `"rabies shot"` | `Immunization` + código CVX "40" | `840539006` — Rabies vaccination |
| `"neutered"` | `Procedure` | `22523008` — Castration |
| `"spayed"` | `Procedure` | `65200003` — Ovariohysterectomy |

**Remediación — EncounterResourceProvider:**

```java
package org.springframework.samples.petclinic.fhir.provider;

import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.r4.model.*;
import org.springframework.samples.petclinic.model.Visit;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.List;

public class EncounterResourceProvider implements IResourceProvider {

    private final ClinicService clinicService;

    public EncounterResourceProvider(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Override
    public Class<Encounter> getResourceType() {
        return Encounter.class;
    }

    @Search
    public List<Encounter> searchByPatient(
            @RequiredParam(name = Encounter.SP_SUBJECT) ReferenceParam subject) {
        int petId = Integer.parseInt(subject.getIdPart());
        return clinicService.findVisitsByPetId(petId).stream()
            .map(this::toFhirEncounter)
            .toList();
    }

    private Encounter toFhirEncounter(Visit visit) {
        Encounter encounter = new Encounter();
        encounter.setId(String.valueOf(visit.getId()));

        // Status (required) — sin campo en Visit, asumir "finished"
        encounter.setStatus(Encounter.EncounterStatus.FINISHED);

        // Class (required) — ambulatory por defecto
        encounter.setClass_(new Coding()
            .setSystem("http://terminology.hl7.org/CodeSystem/v3-ActCode")
            .setCode("AMB")
            .setDisplay("ambulatory"));

        // Periodo
        Period period = new Period();
        if (visit.getDate() != null) {
            period.setStartElement(new DateTimeType(visit.getDate().toString()));
        }
        encounter.setPeriod(period);

        // Sujeto → Patient (Pet en este contexto)
        if (visit.getPet() != null) {
            encounter.setSubject(
                new Reference("Patient/" + visit.getPet().getId()));
        }

        // Motivo de consulta (texto libre → debería ser codificado)
        if (visit.getDescription() != null) {
            encounter.addReasonCode(new CodeableConcept()
                .setText(visit.getDescription()));
            // TODO: Implementar NLP o mapeo manual a SNOMED CT
        }

        return encounter;
    }
}
```

---

#### FHIR-MAP-004: Specialty → PractitionerRole sin CodeableConcept

| Campo | Valor |
|---|---|
| **Severidad** | 🟠 ALTO |
| **Archivo** | `src/main/java/.../model/Specialty.java` |
| **Requisito** | FHIR PractitionerRole.specialty con SNOMED CT |

**Modelo actual:**

```java
@Entity @Table(name = "specialties")
public class Specialty extends NamedEntity {
    // Solo hereda 'name' (String) — sin código, sin sistema, sin URI
}
```

**Remediación — Modelo extendido:**

```java
@Entity
@Table(name = "specialties")
public class Specialty extends NamedEntity {

    @Column(name = "snomed_code")
    private String snomedCode;

    @Column(name = "snomed_system")
    private String snomedSystem = "http://snomed.info/sct";

    @Column(name = "snomed_display")
    private String snomedDisplay;

    // getters/setters...
}
```

---

#### FHIR-MAP-005: Resumen de mapeo de recursos

| Entidad actual | Recurso FHIR | Estado |
|---|---|---|
| `Owner` | `Patient` | ❌ NO MAPEADO |
| `Vet` | `Practitioner` | ❌ NO MAPEADO |
| `Specialty` | `PractitionerRole` | ❌ NO MAPEADO |
| `Visit` | `Encounter` | ❌ NO MAPEADO |
| `Pet` | `Patient` (animal) / extensión | ❌ NO MAPEADO |
| `PetType` | `CodeSystem` / `ValueSet` | ❌ NO MAPEADO |
| *(no existe)* | `Organization` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `Condition` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `Observation` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `MedicationRequest` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `MedicationDispense` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `AllergyIntolerance` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `Immunization` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `Procedure` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `DiagnosticReport` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `DocumentReference` | ❌ NO IMPLEMENTADO |
| *(no existe)* | `Composition` (HCDSNS) | ❌ NO IMPLEMENTADO |

---

### 2.3 Terminología Estandarizada

#### FHIR-TERM-001: Ausencia total de terminología clínica

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Requisito** | HL7 FHIR R4 Terminology Module |

**Sistemas de terminología buscados:**

| Terminología | URI/OID esperado | Estado | Uso requerido |
|---|---|---|---|
| SNOMED CT | `http://snomed.info/sct` | ❌ AUSENTE | Diagnósticos, procedimientos, hallazgos |
| CIE-10-ES | `http://hl7.org/fhir/sid/icd-10-cm` | ❌ AUSENTE | Codificación al alta (CMBD) |
| LOINC | `http://loinc.org` | ❌ AUSENTE | Resultados laboratorio, signos vitales |
| CIAP-2 | `urn:oid:2.16.840.1.113883.6.139` | ❌ AUSENTE | Diagnósticos Atención Primaria |
| ATC | `http://www.whocc.no/atc` | ❌ AUSENTE | Clasificación de medicamentos |
| CN AEMPS | `https://www.aemps.gob.es/cima` | ❌ AUSENTE | Código Nacional medicamento |
| UCUM | `http://unitsofmeasure.org` | ❌ AUSENTE | Unidades de medida |
| CVX | `http://hl7.org/fhir/sid/cvx` | ❌ AUSENTE | Códigos de vacunas |

**Toda la codificación es texto libre:**

```sql
-- data.sql: Especialidades sin códigos SNOMED
INSERT INTO specialties VALUES (1, 'radiology');   -- ← texto libre
INSERT INTO specialties VALUES (2, 'surgery');      -- ← texto libre
INSERT INTO specialties VALUES (3, 'dentistry');    -- ← texto libre

-- Tipos de mascota sin SNOMED Organism
INSERT INTO types VALUES (1, 'cat');                -- ← texto libre
INSERT INTO types VALUES (2, 'dog');                -- ← texto libre

-- Visitas sin códigos CIE-10/SNOMED/CVX
INSERT INTO visits VALUES (1, 7, '2010-03-04', 'rabies shot');  -- ← texto libre
INSERT INTO visits VALUES (3, 8, '2009-06-04', 'neutered');     -- ← texto libre
```

**Impacto:** La interoperabilidad semántica es **IMPOSIBLE**. Los datos no pueden ser interpretados por otro sistema sin intervención humana.

**Remediación — Servicio de terminología:**

```java
package org.springframework.samples.petclinic.fhir.terminology;

import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;

import java.util.Map;

public class SnomedTerminologyService {

    private static final String SNOMED_SYSTEM = "http://snomed.info/sct";

    // Mapeo veterinario → SNOMED CT
    private static final Map<String, String[]> PROCEDURE_MAP = Map.of(
        "rabies shot", new String[]{"840539006", "Rabies vaccination"},
        "neutered",    new String[]{"22523008", "Castration"},
        "spayed",      new String[]{"65200003", "Ovariohysterectomy"},
        "checkup",     new String[]{"410620009", "Well animal visit"}
    );

    private static final Map<String, String[]> SPECIES_MAP = Map.of(
        "cat",     new String[]{"448169003", "Domestic cat"},
        "dog",     new String[]{"448771007", "Domestic dog"},
        "lizard",  new String[]{"2773008", "Reptile"},
        "snake",   new String[]{"79009004", "Snake"},
        "bird",    new String[]{"13028001", "Bird"},
        "hamster", new String[]{"392390001", "Hamster"}
    );

    public CodeableConcept mapProcedure(String freeText) {
        String[] snomed = PROCEDURE_MAP.get(freeText.toLowerCase().trim());
        CodeableConcept concept = new CodeableConcept();
        if (snomed != null) {
            concept.addCoding(new Coding(SNOMED_SYSTEM, snomed[0], snomed[1]));
        }
        concept.setText(freeText);
        return concept;
    }

    public CodeableConcept mapSpecies(String typeName) {
        String[] snomed = SPECIES_MAP.get(typeName.toLowerCase().trim());
        CodeableConcept concept = new CodeableConcept();
        if (snomed != null) {
            concept.addCoding(new Coding(SNOMED_SYSTEM, snomed[0], snomed[1]));
        }
        concept.setText(typeName);
        return concept;
    }
}
```

---

### 2.4 Identificadores Sanitarios

#### FHIR-ID-001: Ausencia de identificadores sanitarios

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `src/main/java/.../model/BaseEntity.java` |
| **Requisito** | HL7 FHIR R4 Identifier datatype + Perfiles SNS |

**Identificación actual — solo Integer auto-incremental:**

```java
// BaseEntity.java (líneas 31-33)
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
protected Integer id;
```

**Identificadores sanitarios ausentes:**

| Identificador | Sistema FHIR | Uso | Estado |
|---|---|---|---|
| **TSI** (Tarjeta Sanitaria Individual) | `https://sns.es/tsi` | Identificación del paciente | ❌ Ausente |
| **CIP-SNS** | `urn:oid:2.16.840.1.113883.2.19.20.1` | Código Identificación Paciente SNS | ❌ Ausente |
| **DNI/NIE** | `urn:oid:1.3.6.1.4.1.19126.3` | Documento de identidad | ❌ Ausente |
| **Nº Colegiado (CGCOM)** | `urn:oid:2.16.840.1.113883.2.19.2.2` | Identificación del profesional | ❌ Ausente |
| **CIAS** | `https://sns.es/cias` | Código centro sanitario | ❌ Ausente |
| **NHC** | *(por hospital)* | Número de Historia Clínica | ❌ Ausente |

**Problemas:**
- IDs internos (INTEGER) no son universalmente únicos (no UUID)
- No hay sistema de identificación federada
- No hay `Identifier.system` + `Identifier.value`
- No hay `Identifier.type` (códigos v2-0203)
- Imposible correlacionar con otros sistemas del SNS

**Remediación — Migración de esquema BD:**

```sql
-- Migración V2__add_fhir_identifiers.sql (Flyway)

ALTER TABLE owners ADD COLUMN tsi VARCHAR(20) UNIQUE;
ALTER TABLE owners ADD COLUMN cip_sns VARCHAR(20) UNIQUE;
ALTER TABLE owners ADD COLUMN dni_nie VARCHAR(15);
ALTER TABLE owners ADD COLUMN birth_date DATE;
ALTER TABLE owners ADD COLUMN gender VARCHAR(10);
ALTER TABLE owners ADD COLUMN postal_code VARCHAR(10);
ALTER TABLE owners ADD COLUMN country VARCHAR(3) DEFAULT 'ES';
ALTER TABLE owners ADD COLUMN email VARCHAR(100);
ALTER TABLE owners ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE owners ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE vets ADD COLUMN collegiate_number VARCHAR(20) UNIQUE;
ALTER TABLE vets ADD COLUMN gender VARCHAR(10);
ALTER TABLE vets ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vets ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE pets ADD COLUMN microchip_id VARCHAR(50) UNIQUE;
ALTER TABLE pets ADD COLUMN species_snomed_code VARCHAR(20);
ALTER TABLE pets ADD COLUMN gender VARCHAR(10);

ALTER TABLE visits ADD COLUMN status VARCHAR(20) DEFAULT 'finished';
ALTER TABLE visits ADD COLUMN practitioner_id INTEGER REFERENCES vets(id);
ALTER TABLE visits ADD COLUMN encounter_class VARCHAR(10) DEFAULT 'AMB';
ALTER TABLE visits ADD COLUMN reason_snomed_code VARCHAR(20);
ALTER TABLE visits ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE specialties ADD COLUMN snomed_code VARCHAR(20);
ALTER TABLE specialties ADD COLUMN snomed_system VARCHAR(100)
    DEFAULT 'http://snomed.info/sct';

CREATE TABLE audit_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100),
    action VARCHAR(20) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(50),
    outcome VARCHAR(10),
    detail TEXT
);

CREATE TABLE consent (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES owners(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    scope VARCHAR(50),
    category VARCHAR(50),
    date_from DATE,
    date_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.5 SMART on FHIR (Seguridad y Autenticación)

#### FHIR-SEC-001: Ausencia total de autenticación

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `src/main/java/.../PetclinicInitializer.java` |
| **Requisito** | SMART on FHIR (HL7 SMART App Launch Framework IG) |

**Evidencia — PetclinicInitializer.java:**

```java
@Override
protected Filter[] getServletFilters() {
    CharacterEncodingFilter characterEncodingFilter =
        new CharacterEncodingFilter("UTF-8", true);
    return new Filter[]{characterEncodingFilter};
    // ↑ ÚNICO filtro: codificación UTF-8. Sin seguridad.
}
```

**Componentes SMART on FHIR ausentes:**

| Componente | Estado |
|---|---|
| Spring Security | ❌ Ausente |
| OAuth2 Authorization Server | ❌ Ausente |
| OAuth2 Resource Server | ❌ Ausente |
| JWT Token Validation (firma, expiración, audience) | ❌ Ausente |
| SMART Launch Framework | ❌ Ausente |
| SMART Scopes (`patient/*.read`, `user/*.write`) | ❌ Ausente |
| PKCE (Proof Key for Code Exchange) | ❌ Ausente |
| OpenID Connect | ❌ Ausente |
| Cl@ve (identidad española) | ❌ Ausente |
| CORS configuration | ❌ Ausente |
| CSRF protection | ❌ Ausente |
| Rate limiting | ❌ Ausente |
| Cabeceras HTTP de seguridad | ❌ Ausente |

**Scopes SMART necesarios por rol:**

| Rol | Scopes SMART v2 |
|---|---|
| Paciente | `patient/Patient.read`, `patient/Encounter.read`, `patient/Observation.read` |
| Profesional | `user/Patient.read`, `user/Encounter.write`, `user/MedicationRequest.write` |
| Sistema (backend) | `system/Patient.read`, `system/Encounter.read` |
| EHR Launch | `launch`, `openid`, `profile`, `fhirUser` |

**Remediación — SMART on FHIR Interceptor para HAPI FHIR:**

```java
package org.springframework.samples.petclinic.fhir.security;

import ca.uhn.fhir.interceptor.api.Hook;
import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.interceptor.api.Pointcut;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.server.exceptions.AuthenticationException;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.JWTClaimsSet;

@Interceptor
public class SmartOnFhirAuthInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
    public void authenticate(RequestDetails requestDetails) {
        // Permitir /metadata sin autenticación
        if ("metadata".equals(requestDetails.getOperation())) {
            return;
        }

        String authHeader = requestDetails.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            throw new AuthenticationException(
                "Se requiere un token Bearer SMART on FHIR");
        }

        String token = authHeader.substring(BEARER_PREFIX.length());
        try {
            JWT jwt = JWTParser.parse(token);
            JWTClaimsSet claims = jwt.getJWTClaimsSet();

            // Validar issuer (debe coincidir con el authorization server)
            String issuer = claims.getIssuer();
            if (issuer == null || !issuer.equals(getExpectedIssuer())) {
                throw new AuthenticationException("Issuer JWT inválido");
            }

            // Validar expiración
            if (claims.getExpirationTime() != null &&
                claims.getExpirationTime().before(new java.util.Date())) {
                throw new AuthenticationException("Token JWT expirado");
            }

            // Validar scopes SMART
            String scope = (String) claims.getClaim("scope");
            validateSmartScopes(scope, requestDetails);

        } catch (java.text.ParseException e) {
            throw new AuthenticationException("Token JWT malformado");
        }
    }

    private void validateSmartScopes(String scope, RequestDetails details) {
        if (scope == null) {
            throw new AuthenticationException("Scopes SMART ausentes en token");
        }
        String resourceName = details.getResourceName();
        String method = details.getRequestType().name();

        String requiredScope = switch (method) {
            case "GET" -> "patient/" + resourceName + ".read";
            case "POST", "PUT" -> "user/" + resourceName + ".write";
            default -> "system/" + resourceName + ".read";
        };

        if (!scope.contains(requiredScope) &&
            !scope.contains("system/*.read")) {
            throw new AuthenticationException(
                "Scope insuficiente. Requerido: " + requiredScope);
        }
    }

    private String getExpectedIssuer() {
        return "https://auth.petclinic.example.com";
    }
}
```

**Remediación — `.well-known/smart-configuration`:**

```json
{
  "authorization_endpoint": "https://auth.petclinic.example.com/authorize",
  "token_endpoint": "https://auth.petclinic.example.com/token",
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "private_key_jwt"],
  "registration_endpoint": "https://auth.petclinic.example.com/register",
  "scopes_supported": [
    "openid", "profile", "launch", "launch/patient", "launch/encounter",
    "patient/Patient.read", "patient/Encounter.read", "patient/Observation.read",
    "user/Patient.read", "user/Patient.write", "user/Encounter.read",
    "user/Encounter.write", "user/MedicationRequest.write",
    "system/Patient.read", "system/Encounter.read"
  ],
  "response_types_supported": ["code"],
  "capabilities": [
    "launch-ehr", "launch-standalone",
    "client-public", "client-confidential-symmetric",
    "context-ehr-patient", "context-standalone-patient",
    "sso-openid-connect", "permission-patient", "permission-user"
  ],
  "code_challenge_methods_supported": ["S256"]
}
```

---

### 2.6 Compatibilidad HCDSNS (Historia Clínica Digital del SNS)

#### FHIR-HCDSNS-001: Sin soporte HCDSNS

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Requisito** | RD 1093/2010 (HCDSNS) + Perfiles HL7 España |

**Componentes HCDSNS ausentes:**

| Componente HCDSNS | Estado |
|---|---|
| Perfil PatientSNS (Patient con TSI) | ❌ Ausente |
| Perfil PractitionerSNS (con nº colegiado) | ❌ Ausente |
| Perfil OrganizationSNS (con CIAS) | ❌ Ausente |
| Informe de Alta Hospitalaria (Composition) | ❌ Ausente |
| Informe de Urgencias (Composition) | ❌ Ausente |
| Historia Farmacoterapéutica (MedicationRequest/Dispense) | ❌ Ausente |
| Informe de Consulta Externa | ❌ Ausente |
| Informe de Cuidados de Enfermería | ❌ Ausente |
| Bundle `document` HCDSNS | ❌ Ausente |
| IPS (International Patient Summary) | ❌ Ausente |
| Operación `$summary` | ❌ Ausente |
| HL7 CDA R2 export | ❌ Ausente |
| `meta.profile` en recursos | ❌ Ausente |
| Nodo de conexión HCDSNS | ❌ Ausente |

**Requisitos normativos no satisfechos:**
- **RD 1093/2010** (Conjunto mínimo de datos HCDSNS): NO CUMPLE
- **Codificación TSI/CIP-SNS** en Patient: NO EXISTE
- **Perfiles de implementación española**: NO DECLARADOS
- **Exportación IPS** conforme HL7 Europe: NO SOPORTADA

**Remediación — Composition HCDSNS (Informe de Alta):**

```java
package org.springframework.samples.petclinic.fhir.hcdsns;

import org.hl7.fhir.r4.model.*;
import java.util.Date;

public class HcdsnDischargeReportBuilder {

    private static final String PROFILE_ALTA_HCDSNS =
        "https://fhir.hl7.es/StructureDefinition/CompositionAltaHospitalaria";
    private static final String LOINC_SYSTEM = "http://loinc.org";

    public Bundle buildDischargeReport(
            Patient patient,
            Practitioner practitioner,
            Organization organization,
            List<Encounter> encounters,
            List<Condition> diagnoses,
            List<MedicationRequest> prescriptions) {

        // 1. Composition (documento estructurado)
        Composition composition = new Composition();
        composition.getMeta().addProfile(PROFILE_ALTA_HCDSNS);
        composition.setStatus(Composition.CompositionStatus.FINAL);
        composition.setType(new CodeableConcept().addCoding(
            new Coding(LOINC_SYSTEM, "18842-5", "Discharge summary")));
        composition.setSubject(new Reference(patient));
        composition.addAuthor(new Reference(practitioner));
        composition.setDate(new Date());
        composition.setTitle("Informe de Alta Hospitalaria");

        // Sección: Motivo de ingreso
        Composition.SectionComponent motivoIngreso = composition.addSection();
        motivoIngreso.setTitle("Motivo de ingreso");
        motivoIngreso.setCode(new CodeableConcept().addCoding(
            new Coding(LOINC_SYSTEM, "46241-6", "Hospital admission diagnosis")));

        // Sección: Diagnóstico principal
        Composition.SectionComponent diagnosticos = composition.addSection();
        diagnosticos.setTitle("Diagnósticos");
        diagnosticos.setCode(new CodeableConcept().addCoding(
            new Coding(LOINC_SYSTEM, "11535-2", "Hospital discharge Dx")));
        for (Condition dx : diagnoses) {
            diagnosticos.addEntry(new Reference(dx));
        }

        // Sección: Tratamiento al alta
        Composition.SectionComponent tratamiento = composition.addSection();
        tratamiento.setTitle("Plan terapéutico al alta");
        tratamiento.setCode(new CodeableConcept().addCoding(
            new Coding(LOINC_SYSTEM, "10183-2", "Hospital discharge medications")));
        for (MedicationRequest rx : prescriptions) {
            tratamiento.addEntry(new Reference(rx));
        }

        // 2. Bundle de tipo document
        Bundle bundle = new Bundle();
        bundle.setType(Bundle.BundleType.DOCUMENT);
        bundle.setTimestamp(new Date());
        bundle.addEntry().setResource(composition);
        bundle.addEntry().setResource(patient);
        bundle.addEntry().setResource(practitioner);
        bundle.addEntry().setResource(organization);
        for (Condition dx : diagnoses) {
            bundle.addEntry().setResource(dx);
        }
        for (MedicationRequest rx : prescriptions) {
            bundle.addEntry().setResource(rx);
        }

        return bundle;
    }
}
```

---

### 2.7 Calidad de Datos

#### FHIR-DQ-001: Formato de fecha no ISO 8601

| Campo | Valor |
|---|---|
| **Severidad** | 🟠 ALTO |
| **Archivos** | `Pet.java`, `Visit.java` |

**Evidencia:**

```java
// Pet.java y Visit.java
@DateTimeFormat(pattern = "yyyy/MM/dd")   // ← Formato con barras /
private LocalDate birthDate;
```

**FHIR requiere:** `YYYY-MM-DD` (con guiones, ISO 8601). La BD almacena como `DATE` (correcto), pero la capa de presentación usa barras.

**Remediación:**

```java
@DateTimeFormat(pattern = "yyyy-MM-dd")   // ← ISO 8601 con guiones
private LocalDate birthDate;
```

#### FHIR-DQ-002: Visit.description es texto libre no codificado

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `Visit.java` (línea 49) |

```java
@NotEmpty
@Column(name = "description")
private String description;  // VARCHAR(255), texto libre sin codificar
```

Datos clínicos no procesables por máquina → **no hay interoperabilidad posible**.

#### FHIR-DQ-003: Teléfono sin estructura ContactPoint

| Campo | Valor |
|---|---|
| **Severidad** | 🟡 MEDIO |
| **Archivo** | `Owner.java` (líneas 54-57) |

```java
@Digits(fraction = 0, integer = 10)
private String telephone;  // Falta system (phone/email) y use (home/work/mobile)
```

#### FHIR-DQ-004: Dirección sin estructura Address completa

| Campo | Valor |
|---|---|
| **Severidad** | 🟡 MEDIO |
| **Archivo** | `Owner.java` (líneas 46-52) |

```java
private String address;  // "110 W. Liberty St." — texto plano
private String city;     // "Madison"
// ❌ Falta: state, postalCode, country
```

#### FHIR-DQ-005: Ausencia de campo gender

| Campo | Valor |
|---|---|
| **Severidad** | 🟡 MEDIO |
| **Archivo** | `Person.java` |

FHIR requiere `gender` con valores: `male|female|other|unknown`. No existe en `Person` (clase base de Owner y Vet).

#### FHIR-DQ-006: PetType sin URI de sistema terminológico

| Campo | Valor |
|---|---|
| **Severidad** | 🟢 BAJO |
| **Archivo** | `PetType.java` |

PetType almacena solo String `name` ("cat", "dog"...) sin `system` URI → no interoperable con ValueSet FHIR.

---

### 2.8 Operaciones FHIR RESTful

#### FHIR-OPS-001: Sin operaciones RESTful FHIR

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Requisito** | HL7 FHIR R4 RESTful API |

**Operaciones FHIR ausentes:**

| Operación | Estado |
|---|---|
| `GET [base]/metadata` (CapabilityStatement) | ❌ Ausente |
| `GET [base]/Patient/[id]` (Read) | ❌ Ausente |
| `POST [base]/Patient` (Create) | ❌ Ausente |
| `PUT [base]/Patient/[id]` (Update) | ❌ Ausente |
| `PATCH [base]/Patient/[id]` (Partial Update) | ❌ Ausente |
| `DELETE [base]/Patient/[id]` (Delete) | ❌ Ausente |
| `GET [base]/Patient?name=...` (Search) | ❌ Ausente |
| `GET [base]/Patient/[id]/_history` (History) | ❌ Ausente |
| `POST [base]/` (Transaction Bundle) | ❌ Ausente |
| `$validate` | ❌ Ausente |
| `$everything` | ❌ Ausente |
| `$summary` (IPS) | ❌ Ausente |
| `$process-message` | ❌ Ausente |
| Subscription (rest-hook/websocket) | ❌ Ausente |
| `_include` / `_revinclude` | ❌ Ausente |
| `_count` / `_offset` (paginación) | ❌ Ausente |
| Search chaining | ❌ Ausente |

**Content types FHIR requeridos pero no soportados:**

| Content-Type | Estado |
|---|---|
| `application/fhir+json` | ❌ No soportado (solo `application/json`) |
| `application/fhir+xml` | ❌ No soportado (solo `application/xml`) |

---

### 2.9 Seguridad, Auditoría y Consentimiento

#### FHIR-AUD-001: Sin pista de auditoría

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Archivo** | `logback.xml` |

**Evidencia:**

```xml
<!-- logback.xml — Solo consola, sin persistencia -->
<appender name="console" class="ch.qos.logback.classic.encoder.ConsoleAppender">
    <encoder>
        <pattern>%-5level %logger{0} - %msg%n</pattern>
    </encoder>
</appender>
```

**Deficiencias:**
- Solo appender de consola (sin persistencia de logs)
- Sin campos de auditoría: who/what/when/where/why
- Sin correlation IDs para trazabilidad
- Sin structured logging (JSON)
- Sin recurso `AuditEvent` FHIR
- Sin registro de acceso a datos del paciente
- Sin columnas `created_by`, `created_at`, `modified_by`, `modified_at` en BD

**Remediación — FHIR AuditEvent Interceptor:**

```java
package org.springframework.samples.petclinic.fhir.audit;

import ca.uhn.fhir.interceptor.api.Hook;
import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.interceptor.api.Pointcut;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import org.hl7.fhir.r4.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

@Interceptor
public class FhirAuditInterceptor {

    private static final Logger auditLog =
        LoggerFactory.getLogger("FHIR_AUDIT");

    @Hook(Pointcut.SERVER_PROCESSING_COMPLETED_NORMALLY)
    public void auditSuccessfulRequest(RequestDetails details) {
        AuditEvent event = buildAuditEvent(details, "0", "Success");
        logAuditEvent(event);
    }

    @Hook(Pointcut.SERVER_HANDLE_EXCEPTION)
    public void auditFailedRequest(RequestDetails details) {
        AuditEvent event = buildAuditEvent(details, "8", "Serious failure");
        logAuditEvent(event);
    }

    private AuditEvent buildAuditEvent(
            RequestDetails details, String outcomeCode, String outcomeDesc) {
        AuditEvent event = new AuditEvent();
        event.setRecorded(new Date());

        // Tipo de evento
        event.setType(new Coding()
            .setSystem("http://dicom.nema.org/resources/ontology/DCM")
            .setCode("110112")
            .setDisplay("Query"));

        // Agente (usuario)
        AuditEvent.AuditEventAgentComponent agent = event.addAgent();
        agent.setRequestor(true);
        if (details.getHeader("Authorization") != null) {
            agent.setWho(new Reference()
                .setDisplay(extractUserFromToken(details)));
        }

        // Fuente
        event.getSource().setObserver(
            new Reference().setDisplay("PetClinic FHIR Server"));

        // Entidad (recurso accedido)
        if (details.getResourceName() != null) {
            AuditEvent.AuditEventEntityComponent entity = event.addEntity();
            entity.setWhat(new Reference(
                details.getResourceName() + "/" + details.getId()));
            entity.setType(new Coding()
                .setSystem("http://terminology.hl7.org/CodeSystem/audit-entity-type")
                .setCode("2")
                .setDisplay("System Object"));
        }

        // Resultado
        event.setOutcome(AuditEvent.AuditEventOutcome.fromCode(outcomeCode));
        event.setOutcomeDesc(outcomeDesc);

        return event;
    }

    private void logAuditEvent(AuditEvent event) {
        auditLog.info("FHIR_AUDIT action={} resource={} user={} outcome={}",
            event.getType().getCode(),
            event.hasEntity() ? event.getEntityFirstRep().getWhat().getReference() : "N/A",
            event.hasAgent() ? event.getAgentFirstRep().getWho().getDisplay() : "anonymous",
            event.getOutcomeDesc());
    }

    private String extractUserFromToken(RequestDetails details) {
        // Extraer claim 'sub' del JWT
        return "authenticated-user"; // Placeholder
    }
}
```

#### FHIR-AUD-002: Sin gestión de consentimiento

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Requisito** | FHIR Consent Resource + RGPD Art. 6/9 |

Sin tabla de consentimientos, sin flujo de consentimiento en UI, sin verificación antes del acceso a datos.

#### FHIR-AUD-003: Sin cifrado de datos en reposo

| Campo | Valor |
|---|---|
| **Severidad** | 🟠 ALTO |
| **Archivo** | `data-access.properties` |

Credenciales en texto plano, sin TDE, sin cifrado a nivel de columna, datos personales sin cifrar.

---

### 2.10 Interoperabilidad EHDS (Espacio Europeo de Datos de Salud)

#### FHIR-INTOP-001: Sin capacidad de intercambio transfronterizo

| Campo | Valor |
|---|---|
| **Severidad** | 🔴 CRÍTICO |
| **Requisito** | Reglamento EHDS (propuesta EU) + MyHealth@EU |

| Requisito EHDS | Estado |
|---|---|
| FHIR R4/R5 como formato de intercambio | ❌ Ausente |
| IPS (International Patient Summary) | ❌ Ausente |
| ePrescription cross-border | ❌ Ausente |
| eDispensation cross-border | ❌ Ausente |
| Laboratory Results exchange | ❌ Ausente |
| Medical Images/Reports exchange | ❌ Ausente |
| Hospital Discharge Reports exchange | ❌ Ausente |
| SNOMED CT / ICD-10 / LOINC terminología | ❌ Ausente |
| eIDAS cross-border identity | ❌ Ausente |
| Cl@ve federation | ❌ Ausente |
| MyHealth@EU conectividad | ❌ Ausente |
| HL7 CDA R2 document export | ❌ Ausente |
| DICOM integration (imágenes) | ❌ Ausente |

**La aplicación es una isla de datos completamente aislada.** No es posible ningún tipo de intercambio de información sanitaria con otros sistemas.

---

## 3. Dependencias Necesarias

### pom.xml — Dependencias FHIR requeridas

```xml
<!-- ================ HL7 FHIR R4 ================ -->
<dependency>
    <groupId>ca.uhn.hapi.fhir</groupId>
    <artifactId>hapi-fhir-server</artifactId>
    <version>7.4.0</version>
</dependency>
<dependency>
    <groupId>ca.uhn.hapi.fhir</groupId>
    <artifactId>hapi-fhir-structures-r4</artifactId>
    <version>7.4.0</version>
</dependency>
<dependency>
    <groupId>ca.uhn.hapi.fhir</groupId>
    <artifactId>hapi-fhir-validation-resources-r4</artifactId>
    <version>7.4.0</version>
</dependency>
<dependency>
    <groupId>ca.uhn.hapi.fhir</groupId>
    <artifactId>hapi-fhir-client</artifactId>
    <version>7.4.0</version>
</dependency>

<!-- ============== Spring Security =============== -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>

<!-- ============= JWT (Nimbus JOSE) ============== -->
<dependency>
    <groupId>com.nimbusds</groupId>
    <artifactId>nimbus-jose-jwt</artifactId>
    <version>9.37.3</version>
</dependency>

<!-- ============== Flyway (migraciones) =========== -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>10.10.0</version>
</dependency>
```

---

## 4. Plan de Remediación Priorizado

### Fase 1 — Fundamentos (Semanas 1-4) | Esfuerzo: ALTO

| # | Acción | Hallazgo | Prioridad |
|---|---|---|---|
| 1.1 | Añadir dependencias HAPI FHIR Server + Structures R4 al `pom.xml` | FHIR-SRV-001 | 🔴 Crítica |
| 1.2 | Registrar `PetClinicFhirServer` (RestfulServer) en `/fhir/*` | FHIR-SRV-001 | 🔴 Crítica |
| 1.3 | Implementar CapabilityStatement (`/fhir/metadata`) | FHIR-SRV-001 | 🔴 Crítica |
| 1.4 | Añadir Spring Security + OAuth2 Resource Server | FHIR-SEC-001 | 🔴 Crítica |
| 1.5 | Migración BD: añadir columnas TSI, CIP-SNS, gender, birthDate, postal_code | FHIR-ID-001, FHIR-MAP-001 | 🔴 Crítica |
| 1.6 | Migración BD: añadir `collegiate_number` a tabla `vets` | FHIR-ID-001, FHIR-MAP-002 | 🔴 Crítica |
| 1.7 | Migración BD: añadir `status`, `practitioner_id` a tabla `visits` | FHIR-MAP-003 | 🔴 Crítica |
| 1.8 | Migración BD: añadir `snomed_code` a tabla `specialties` | FHIR-TERM-001 | 🟠 Alta |
| 1.9 | Crear tabla `audit_events` y `consent` | FHIR-AUD-001, FHIR-AUD-002 | 🔴 Crítica |

### Fase 2 — Recursos FHIR y Terminología (Semanas 5-10) | Esfuerzo: MUY ALTO

| # | Acción | Hallazgo | Prioridad |
|---|---|---|---|
| 2.1 | Implementar `PatientResourceProvider` (Owner → Patient) | FHIR-MAP-001 | 🔴 Crítica |
| 2.2 | Implementar `PractitionerResourceProvider` (Vet → Practitioner) | FHIR-MAP-002 | 🔴 Crítica |
| 2.3 | Implementar `EncounterResourceProvider` (Visit → Encounter) | FHIR-MAP-003 | 🔴 Crítica |
| 2.4 | Implementar `PatientFhirMapper` con identificadores TSI/CIP-SNS | FHIR-ID-001 | 🔴 Crítica |
| 2.5 | Implementar `SnomedTerminologyService` (especialidades, procedimientos) | FHIR-TERM-001 | 🔴 Crítica |
| 2.6 | Migrar `Visit.description` a códigos SNOMED/CVX estructurados | FHIR-DQ-002 | 🔴 Crítica |
| 2.7 | Migrar `Specialty.name` a `CodeableConcept` con SNOMED codes | FHIR-DQ-003 | 🟠 Alta |
| 2.8 | Corregir formato fecha a ISO 8601 (`yyyy-MM-dd`) | FHIR-DQ-001 | 🟠 Alta |
| 2.9 | Reestructurar `Owner.telephone` → ContactPoint, `Owner.address` → Address | FHIR-DQ-003, FHIR-DQ-004 | 🟡 Media |

### Fase 3 — Seguridad SMART on FHIR (Semanas 11-16) | Esfuerzo: ALTO

| # | Acción | Hallazgo | Prioridad |
|---|---|---|---|
| 3.1 | Implementar `SmartOnFhirAuthInterceptor` con validación JWT | FHIR-SEC-001 | 🔴 Crítica |
| 3.2 | Configurar `.well-known/smart-configuration` | FHIR-SEC-001 | 🔴 Crítica |
| 3.3 | Implementar scopes SMART por rol (patient/user/system) | FHIR-SEC-001 | 🔴 Crítica |
| 3.4 | Implementar PKCE en Authorization Code flow | FHIR-SEC-001 | 🟠 Alta |
| 3.5 | Implementar `FhirAuditInterceptor` + `AuditEvent` resource | FHIR-AUD-001 | 🔴 Crítica |
| 3.6 | Implementar `Consent` resource + interceptor de verificación | FHIR-AUD-002 | 🔴 Crítica |
| 3.7 | Configurar structured logging (JSON) con rotation y correlation IDs | FHIR-AUD-001 | 🟠 Alta |
| 3.8 | Añadir cabeceras HTTP de seguridad | FHIR-SEC-001 | 🟠 Alta |

### Fase 4 — HCDSNS + EHDS (Semanas 17-24) | Esfuerzo: MUY ALTO

| # | Acción | Hallazgo | Prioridad |
|---|---|---|---|
| 4.1 | Implementar perfiles españoles HCDSNS (`PatientSNS`, `PractitionerSNS`) | FHIR-HCDSNS-001 | 🔴 Crítica |
| 4.2 | Implementar `HcdsnDischargeReportBuilder` (Informe de Alta) | FHIR-HCDSNS-001 | 🔴 Crítica |
| 4.3 | Implementar operación `$summary` (IPS - International Patient Summary) | FHIR-HCDSNS-001 | 🟠 Alta |
| 4.4 | Soporte HL7 CDA R2 para compatibilidad legacy con HCDSNS | FHIR-HCDSNS-001 | 🟡 Media |
| 4.5 | Testing de interoperabilidad con Touchstone/Inferno | FHIR-INTOP-001 | 🟠 Alta |
| 4.6 | Diseño de conectividad con nodo HCDSNS del SNS | FHIR-INTOP-001 | 🟡 Media |
| 4.7 | Integración con terminología SNOMED CT española (NRC AEMPS) | FHIR-TERM-001 | 🟡 Media |

---

## 5. Referencias Normativas

| Referencia | Descripción |
|---|---|
| **HL7 FHIR R4** | [https://hl7.org/fhir/R4/](https://hl7.org/fhir/R4/) |
| **SMART on FHIR** | [https://smarthealthit.org/](https://smarthealthit.org/) |
| **SMART App Launch IG** | [https://hl7.org/fhir/smart-app-launch/](https://hl7.org/fhir/smart-app-launch/) |
| **HL7 España** | [https://www.hl7.es/](https://www.hl7.es/) |
| **HCDSNS (RD 1093/2010)** | Historia Clínica Digital del SNS |
| **SNOMED CT España** | AEMPS como National Release Centre |
| **CIE-10-ES** | Ministerio de Sanidad — Codificación de diagnósticos |
| **LOINC** | [https://loinc.org/](https://loinc.org/) — Resultados laboratorio |
| **HAPI FHIR** | [https://hapifhir.io/](https://hapifhir.io/) — Librería Java de referencia |
| **IPS (International Patient Summary)** | [https://international-patient-summary.net/](https://international-patient-summary.net/) |
| **EHDS (Reglamento EU)** | Espacio Europeo de Datos de Salud |
| **UCUM** | [https://ucum.org/](https://ucum.org/) — Unidades de medida |
| **RGPD (Reglamento UE 2016/679)** | Protección de datos personales |
| **LOPDGDD (LO 3/2018)** | Protección de datos y derechos digitales |

---

## 6. Conclusión

El Spring Framework PetClinic es una **aplicación de demostración** diseñada para enseñar patrones Spring MVC/JPA. **No fue concebida como sistema sanitario** y, como tal, presenta una **ausencia total de cumplimiento HL7 FHIR R4**.

La única puntuación positiva (15% en calidad de datos) se debe a:
- ✅ Uso de `LocalDate` (Java 8+) para fechas
- ✅ Jakarta Bean Validation (`@NotEmpty`, `@Digits`)
- ✅ Almacenamiento de fechas como `DATE` en BD
- ✅ Uso de `<c:out>` para prevención XSS en JSPs

Para transformar esta aplicación en un sistema conforme a HL7 FHIR R4 compatible con el SNS español, se requiere una **reescritura sustancial** que constituiría esencialmente un nuevo proyecto, conservando solo la capa de persistencia JPA como base. El esfuerzo estimado es de **16-24 semanas** con un equipo de 2-3 desarrolladores con experiencia en HAPI FHIR y estándares sanitarios españoles.

---

*Informe generado por HL7 FHIR Compliance Analyzer — Análisis exhaustivo del código fuente, modelos de datos, APIs, configuraciones y esquemas de base de datos.*

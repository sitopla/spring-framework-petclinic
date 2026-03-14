# Conversión REST a Servidor MCP — Spring Framework Petclinic

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico Detectado](#stack-tecnológico-detectado)
3. [Estrategia de Conversión Recomendada](#estrategia-de-conversión-recomendada)
4. [Modelo de Dominio](#modelo-de-dominio)
5. [Inventario de Endpoints](#inventario-de-endpoints)
6. [Clasificación MCP: Tools vs Resources](#clasificación-mcp-tools-vs-resources)
7. [Diseño del Servidor MCP](#diseño-del-servidor-mcp)
8. [Código de Conversión — Spring AI @Tool](#código-de-conversión--spring-ai-tool)
9. [Configuración del Servidor MCP](#configuración-del-servidor-mcp)
10. [Configuración IDE (.mcp/settings.json)](#configuración-ide-mcpsettingsjson)
11. [Validación y Testing](#validación-y-testing)
12. [Notas de Seguridad](#notas-de-seguridad)
13. [Referencias](#referencias)

---

## Resumen Ejecutivo

Este documento detalla el proceso de conversión de la aplicación **Spring Framework Petclinic** a un servidor MCP (Model Context Protocol), permitiendo que agentes de IA (GitHub Copilot, Claude, ChatGPT, etc.) interactúen nativamente con la lógica de negocio de la clínica veterinaria.

**Hallazgos principales:**

| Métrica                  | Valor                                           |
|--------------------------|--------------------------------------------------|
| Controladores detectados | 5 (`Owner`, `Pet`, `Vet`, `Visit`, `Crash`)      |
| Endpoints totales        | 18                                               |
| Endpoints MVC (JSP)      | 16                                               |
| Endpoints REST (JSON/XML)| 2 (`/vets.json`, `/vets.xml`)                    |
| Entidades de dominio     | 6 (`Owner`, `Pet`, `Vet`, `Visit`, `PetType`, `Specialty`) |
| Métodos de servicio      | 9 (en `ClinicService`)                           |
| Herramientas MCP propuestas | 6 (Tools)                                     |
| Recursos MCP propuestos  | 8 (Resources)                                    |

> **Nota importante:** Esta es una aplicación MVC clásica con `@Controller` (no `@RestController`). La mayoría de endpoints devuelven nombres de vista JSP, no datos JSON. La conversión MCP se basará en la **capa de servicio** (`ClinicService`), no en los controladores MVC.

---

## Stack Tecnológico Detectado

| Componente       | Tecnología                              | Versión     |
|------------------|-----------------------------------------|-------------|
| Lenguaje         | Java                                   | 17          |
| Framework        | Spring Framework (MVC + Data JPA)      | 7.0.3       |
| Persistencia     | Hibernate ORM + Spring Data JPA        | 7.2.3.Final |
| Bases de datos   | HSQLDB (defecto), H2, PostgreSQL, MySQL | Múltiples  |
| Vista            | JSP + JSTL                             | Jakarta EE  |
| Build            | Maven                                  | 3.x         |
| Empaquetado      | WAR                                    | —           |
| Servidor         | Jetty / Tomcat                         | 11.x        |
| Testing          | JUnit 5 + Mockito                      | 6.0.2 / 5.21|

---

## Estrategia de Conversión Recomendada

### Árbol de decisión aplicado

```
¿Existe SDK nativo de MCP para el stack?
└── SÍ → Java/Spring AI
    └── Usar spring-ai-starter-mcp-server-webmvc con @Tool
        └── Modo dual: la app sirve JSP (MVC) y MCP simultáneamente
```

### Enfoque elegido: Spring AI MCP Server (nativo)

**Justificación:**
1. El proyecto ya es Spring Framework — integración natural con Spring AI.
2. La capa `ClinicService` ya encapsula toda la lógica de negocio.
3. Se puede añadir MCP **sin modificar** los controladores MVC existentes.
4. Los endpoints JSP siguen funcionando para usuarios humanos.

**Dependencia Maven requerida:**
```xml
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
  <version>1.0.0</version>
</dependency>
```

### Alternativa: Puente OpenAPI

Si no se desea modificar el código fuente, se puede:
1. Añadir Springdoc OpenAPI para generar `openapi.json`.
2. Usar `FastMCP.from_openapi()` (Python) como sidecar.

Esta alternativa es menos recomendable aquí porque los endpoints JSP no generan buenas especificaciones OpenAPI.

---

## Modelo de Dominio

```
┌─────────────────────────────────────────────────────────┐
│                     BaseEntity                          │
│                    ┌─────────┐                          │
│                    │ id: int │                          │
│                    └────┬────┘                          │
│           ┌─────────────┼─────────────┐                │
│     ┌─────┴─────┐               ┌─────┴──────┐        │
│     │  Person   │               │ NamedEntity │        │
│     │firstName  │               │  name       │        │
│     │lastName   │               └──┬──────┬───┘        │
│     └──┬─────┬──┘                  │      │            │
│   ┌────┴──┐ ┌┴────┐          ┌────┴──┐ ┌─┴────────┐   │
│   │ Owner │ │ Vet │          │PetType│ │Specialty  │   │
│   │address│ │     │          └───────┘ └──────────┘    │
│   │city   │ │specialties                               │
│   │phone  │ │ (M:N)                                    │
│   │       │ └───────┘                                  │
│   │pets   │                                            │
│   │(1:N)  │        ┌──────────┐                        │
│   └───┬───┘        │   Pet    │                        │
│       └───────────►│birthDate │                        │
│                    │type (M:1)│                         │
│                    │visits    │                         │
│                    │ (1:N)    │     ┌─────────┐         │
│                    └────┬─────┘     │  Visit  │         │
│                         └──────────►│date     │         │
│                                     │descript.│         │
│                                     └─────────┘         │
└─────────────────────────────────────────────────────────┘
```

### Detalle de entidades

#### Owner (Propietario)

| Campo       | Tipo       | Validación                    | Descripción                              |
|-------------|------------|-------------------------------|------------------------------------------|
| `id`        | `Integer`  | Auto-generado                 | Identificador único                      |
| `firstName` | `String`   | `@NotEmpty`                   | Nombre del propietario                   |
| `lastName`  | `String`   | `@NotEmpty`                   | Apellido del propietario                 |
| `address`   | `String`   | `@NotEmpty`                   | Dirección postal                         |
| `city`      | `String`   | `@NotEmpty`                   | Ciudad de residencia                     |
| `telephone` | `String`   | `@NotEmpty`, `@Digits(0, 10)` | Teléfono de contacto (máx. 10 dígitos)   |
| `pets`      | `Set<Pet>` | —                             | Mascotas registradas (relación 1:N)      |

#### Pet (Mascota)

| Campo       | Tipo        | Validación                 | Descripción                              |
|-------------|-------------|----------------------------|------------------------------------------|
| `id`        | `Integer`   | Auto-generado              | Identificador único                      |
| `name`      | `String`    | Heredado de `NamedEntity`  | Nombre de la mascota                     |
| `birthDate` | `LocalDate` | Formato `yyyy/MM/dd`       | Fecha de nacimiento                      |
| `type`      | `PetType`   | Relación M:1               | Tipo de mascota (perro, gato, etc.)      |
| `owner`     | `Owner`     | Relación M:1               | Propietario de la mascota                |
| `visits`    | `Set<Visit>`| —                          | Historial de visitas (relación 1:N)      |

#### Visit (Visita)

| Campo         | Tipo        | Validación           | Descripción                              |
|---------------|-------------|----------------------|------------------------------------------|
| `id`          | `Integer`   | Auto-generado        | Identificador único                      |
| `date`        | `LocalDate` | Formato `yyyy/MM/dd` | Fecha de la visita (por defecto: hoy)    |
| `description` | `String`    | `@NotEmpty`          | Motivo o descripción de la visita        |
| `pet`         | `Pet`       | Relación M:1         | Mascota atendida                         |

#### Vet (Veterinario)

| Campo          | Tipo              | Validación | Descripción                             |
|----------------|-------------------|------------|-----------------------------------------|
| `id`           | `Integer`         | Auto-generado | Identificador único                  |
| `firstName`    | `String`          | `@NotEmpty`   | Nombre del veterinario               |
| `lastName`     | `String`          | `@NotEmpty`   | Apellido del veterinario             |
| `specialties`  | `Set<Specialty>`  | —             | Especialidades (relación M:N)        |

#### PetType (Tipo de mascota)

| Campo  | Tipo     | Descripción                          |
|--------|----------|--------------------------------------|
| `id`   | `Integer`| Identificador único                  |
| `name` | `String` | Nombre del tipo (perro, gato, etc.)  |

#### Specialty (Especialidad)

| Campo  | Tipo     | Descripción                              |
|--------|----------|------------------------------------------|
| `id`   | `Integer`| Identificador único                      |
| `name` | `String` | Nombre de la especialidad (radiología, cirugía, etc.) |

---

## Inventario de Endpoints

### Controladores detectados

| Controlador        | Anotación     | Prefijo de ruta        | Endpoints |
|--------------------|---------------|------------------------|-----------|
| `CrashController`  | `@Controller` | —                      | 1         |
| `OwnerController`  | `@Controller` | —                      | 7         |
| `PetController`    | `@Controller` | `/owners/{ownerId}`    | 4         |
| `VetController`    | `@Controller` | —                      | 3         |
| `VisitController`  | `@Controller` | —                      | 3         |

### Inventario completo

| #  | Controlador      | HTTP   | Ruta                                     | Método Java               | Retorno           | Tipo     |
|----|------------------|--------|------------------------------------------|---------------------------|-------------------|----------|
| 1  | CrashController  | GET    | `/oups`                                  | `triggerException()`       | Vista JSP         | Error    |
| 2  | OwnerController  | GET    | `/owners/new`                            | `initCreationForm()`       | Vista JSP         | MVC      |
| 3  | OwnerController  | POST   | `/owners/new`                            | `processCreationForm()`    | Vista/Redirect    | MVC      |
| 4  | OwnerController  | GET    | `/owners/find`                           | `initFindForm()`           | Vista JSP         | MVC      |
| 5  | OwnerController  | GET    | `/owners`                                | `processFindForm()`        | Vista/Redirect    | MVC      |
| 6  | OwnerController  | GET    | `/owners/{ownerId}/edit`                 | `initUpdateOwnerForm()`    | Vista JSP         | MVC      |
| 7  | OwnerController  | POST   | `/owners/{ownerId}/edit`                 | `processUpdateOwnerForm()` | Redirect          | MVC      |
| 8  | OwnerController  | GET    | `/owners/{ownerId}`                      | `showOwner()`              | ModelAndView      | MVC      |
| 9  | PetController    | GET    | `/owners/{ownerId}/pets/new`             | `initCreationForm()`       | Vista JSP         | MVC      |
| 10 | PetController    | POST   | `/owners/{ownerId}/pets/new`             | `processCreationForm()`    | Vista/Redirect    | MVC      |
| 11 | PetController    | GET    | `/owners/{ownerId}/pets/{petId}/edit`    | `initUpdateForm()`         | Vista JSP         | MVC      |
| 12 | PetController    | POST   | `/owners/{ownerId}/pets/{petId}/edit`    | `processUpdateForm()`      | Redirect          | MVC      |
| 13 | VetController    | GET    | `/vets`                                  | `showVetList()`            | Vista JSP         | MVC      |
| 14 | VetController    | GET    | `/vets.json`                             | `showJsonVetList()`        | `@ResponseBody`   | **REST** |
| 15 | VetController    | GET    | `/vets.xml`                              | `showXmlVetList()`         | `@ResponseBody`   | **REST** |
| 16 | VisitController  | GET    | `/owners/*/pets/{petId}/visits/new`      | `initNewVisitForm()`       | Vista JSP         | MVC      |
| 17 | VisitController  | POST   | `/owners/{ownerId}/pets/{petId}/visits/new` | `processNewVisitForm()` | Vista/Redirect    | MVC      |
| 18 | VisitController  | GET    | `/owners/*/pets/{petId}/visits`          | `showVisits()`             | Vista JSP         | MVC      |

---

## Clasificación MCP: Tools vs Resources

### Criterio de clasificación

| Tipo MCP      | Criterio                                                     | Operaciones HTTP equivalentes |
|---------------|--------------------------------------------------------------|-------------------------------|
| **Resource**  | Lectura de datos sin efectos laterales                       | GET                           |
| **Tool**      | Acciones que crean, modifican o eliminan estado              | POST, PUT, DELETE             |

### Mapeo propuesto (basado en `ClinicService`)

> **Decisión de diseño:** Los MCP Tools/Resources se mapean a los métodos de `ClinicService`, no a los controladores MVC, porque la capa de servicio contiene la lógica de negocio pura sin dependencias de vista.

#### Resources (Lectura de datos)

| #  | Nombre MCP              | Método de servicio              | Descripción para LLM                                                              | Parámetros                                                              |
|----|-------------------------|---------------------------------|------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| R1 | `getOwnerById`          | `findOwnerById(int id)`         | Obtener el perfil completo de un propietario incluyendo nombre, dirección, teléfono y listado de mascotas registradas | `id` (int, obligatorio): Identificador único del propietario            |
| R2 | `searchOwnersByLastName`| `findOwnerByLastName(String)`   | Buscar propietarios por apellido. Devuelve todos los propietarios cuyo apellido comienza con el texto proporcionado | `lastName` (String, obligatorio): Texto de búsqueda (prefijo del apellido) |
| R3 | `getPetById`            | `findPetById(int id)`           | Obtener los datos de una mascota incluyendo nombre, fecha de nacimiento, tipo y propietario | `id` (int, obligatorio): Identificador único de la mascota             |
| R4 | `listPetTypes`          | `findPetTypes()`                | Obtener el catálogo completo de tipos de mascota disponibles (perro, gato, pájaro, hámster, serpiente, etc.) | Ninguno                                                                 |
| R5 | `listVets`              | `findVets()`                    | Obtener el listado completo de veterinarios de la clínica con sus especialidades    | Ninguno                                                                 |
| R6 | `getVisitsByPet`        | `findVisitsByPetId(int petId)`  | Obtener el historial completo de visitas veterinarias de una mascota ordenadas por fecha | `petId` (int, obligatorio): Identificador único de la mascota          |

#### Tools (Acciones de escritura)

| #  | Nombre MCP      | Método de servicio      | Descripción para LLM                                                                                  | Parámetros                                                                                                                                                                                    |
|----|-----------------|-------------------------|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| T1 | `createOwner`   | `saveOwner(Owner)`      | Registrar un nuevo propietario de mascota en el sistema de la clínica veterinaria                      | `firstName` (String, obligatorio): Nombre. `lastName` (String, obligatorio): Apellido. `address` (String, obligatorio): Dirección. `city` (String, obligatorio): Ciudad. `telephone` (String, obligatorio): Teléfono (máx. 10 dígitos) |
| T2 | `updateOwner`   | `saveOwner(Owner)`      | Actualizar los datos de un propietario existente (dirección, teléfono, etc.)                           | `id` (int, obligatorio): ID del propietario a actualizar. Campos opcionales: `firstName`, `lastName`, `address`, `city`, `telephone`                                                        |
| T3 | `addPet`        | `savePet(Pet)`          | Registrar una nueva mascota y asociarla a un propietario existente                                     | `name` (String, obligatorio): Nombre de la mascota. `birthDate` (String, obligatorio): Fecha de nacimiento (formato yyyy/MM/dd). `typeId` (int, obligatorio): ID del tipo de mascota. `ownerId` (int, obligatorio): ID del propietario |
| T4 | `updatePet`     | `savePet(Pet)`          | Actualizar los datos de una mascota existente (nombre, fecha de nacimiento, tipo)                      | `id` (int, obligatorio): ID de la mascota. Campos opcionales: `name`, `birthDate`, `typeId`                                                                                                 |
| T5 | `addVisit`      | `saveVisit(Visit)`      | Registrar una nueva visita veterinaria para una mascota existente                                      | `petId` (int, obligatorio): ID de la mascota. `date` (String, opcional): Fecha de la visita (formato yyyy/MM/dd, por defecto: hoy). `description` (String, obligatorio): Motivo de la visita |
| T6 | `listVetsAsJson`| `findVets()` + serializar | Obtener el listado de veterinarios en formato JSON estructurado para integración con otros sistemas   | Ninguno                                                                                                                                                                                       |

### Endpoints excluidos de MCP

| Endpoint | Motivo de exclusión                                                   |
|----------|-----------------------------------------------------------------------|
| `GET /oups` (CrashController) | Endpoint de prueba que lanza una excepción intencionada. No aporta valor como herramienta MCP. |
| Endpoints de formulario (`/owners/new`, `/owners/find`, `*/edit`) | Son endpoints MVC que renderizan formularios JSP. La lógica de negocio se expone a través de los Tools/Resources correspondientes. |

---

## Diseño del Servidor MCP

### Arquitectura propuesta

```
┌─────────────────────────────────────────────────┐
│              Spring Framework Petclinic           │
│                                                   │
│  ┌──────────────┐     ┌────────────────────────┐ │
│  │  Controllers │     │  MCP Tool Services     │ │
│  │  (@Controller)│     │  (@Service + @Tool)    │ │
│  │              │     │                        │ │
│  │ OwnerCtrl    │     │ OwnerMcpService        │ │
│  │ PetCtrl      │     │ PetMcpService          │ │
│  │ VetCtrl      │     │ VetMcpService          │ │
│  │ VisitCtrl    │     │ VisitMcpService        │ │
│  └──────┬───────┘     └───────────┬────────────┘ │
│         │                         │               │
│         └──────────┬──────────────┘               │
│                    │                               │
│           ┌────────▼─────────┐                    │
│           │   ClinicService  │                    │
│           │   (lógica de     │                    │
│           │    negocio)      │                    │
│           └────────┬─────────┘                    │
│                    │                               │
│           ┌────────▼─────────┐                    │
│           │   Repositories   │                    │
│           │  (Spring Data)   │                    │
│           └────────┬─────────┘                    │
│                    │                               │
│           ┌────────▼─────────┐                    │
│           │   Base de Datos  │                    │
│           │  (HSQLDB/PG/MySQL)│                   │
│           └──────────────────┘                    │
└─────────────────────────────────────────────────┘

Clientes humanos ──► Controllers (JSP)    ← Sin cambios
Agentes IA       ──► MCP Tool Services    ← NUEVO
```

---

## Código de Conversión — Spring AI @Tool

### OwnerMcpService.java

```java
package org.springframework.samples.petclinic.mcp;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class OwnerMcpService {

    private final ClinicService clinicService;

    public OwnerMcpService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Tool(description = "Obtener el perfil completo de un propietario de mascota incluyendo " +
        "nombre, apellido, dirección, teléfono y listado de mascotas registradas")
    public Owner getOwnerById(
            @ToolParam(description = "Identificador único del propietario en la base de datos") int id) {
        return clinicService.findOwnerById(id);
    }

    @Tool(description = "Buscar propietarios de mascota por apellido. Devuelve todos los " +
        "propietarios cuyo apellido comienza con el texto proporcionado. " +
        "Usar cadena vacía para obtener todos los propietarios")
    public Collection<Owner> searchOwnersByLastName(
            @ToolParam(description = "Texto de búsqueda: prefijo del apellido del propietario") String lastName) {
        return clinicService.findOwnerByLastName(lastName);
    }

    @Tool(description = "Registrar un nuevo propietario de mascota en la clínica veterinaria")
    public Owner createOwner(
            @ToolParam(description = "Nombre del propietario") String firstName,
            @ToolParam(description = "Apellido del propietario") String lastName,
            @ToolParam(description = "Dirección postal completa") String address,
            @ToolParam(description = "Ciudad de residencia") String city,
            @ToolParam(description = "Número de teléfono de contacto (máximo 10 dígitos numéricos)") String telephone) {
        Owner owner = new Owner();
        owner.setFirstName(firstName);
        owner.setLastName(lastName);
        owner.setAddress(address);
        owner.setCity(city);
        owner.setTelephone(telephone);
        clinicService.saveOwner(owner);
        return owner;
    }

    @Tool(description = "Actualizar los datos de un propietario existente. " +
        "Solo se actualizan los campos proporcionados")
    public Owner updateOwner(
            @ToolParam(description = "ID del propietario a actualizar") int id,
            @ToolParam(description = "Nuevo nombre (null para no cambiar)") String firstName,
            @ToolParam(description = "Nuevo apellido (null para no cambiar)") String lastName,
            @ToolParam(description = "Nueva dirección (null para no cambiar)") String address,
            @ToolParam(description = "Nueva ciudad (null para no cambiar)") String city,
            @ToolParam(description = "Nuevo teléfono (null para no cambiar)") String telephone) {
        Owner owner = clinicService.findOwnerById(id);
        if (firstName != null) owner.setFirstName(firstName);
        if (lastName != null) owner.setLastName(lastName);
        if (address != null) owner.setAddress(address);
        if (city != null) owner.setCity(city);
        if (telephone != null) owner.setTelephone(telephone);
        clinicService.saveOwner(owner);
        return owner;
    }
}
```

### PetMcpService.java

```java
package org.springframework.samples.petclinic.mcp;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.PetType;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;

@Service
public class PetMcpService {

    private final ClinicService clinicService;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public PetMcpService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Tool(description = "Obtener los datos de una mascota incluyendo nombre, fecha de nacimiento, " +
        "tipo de mascota y datos del propietario")
    public Pet getPetById(
            @ToolParam(description = "Identificador único de la mascota") int id) {
        return clinicService.findPetById(id);
    }

    @Tool(description = "Obtener el catálogo completo de tipos de mascota disponibles en la clínica " +
        "(por ejemplo: perro, gato, pájaro, hámster, serpiente)")
    public Collection<PetType> listPetTypes() {
        return clinicService.findPetTypes();
    }

    @Tool(description = "Registrar una nueva mascota y asociarla a un propietario existente")
    public Pet addPet(
            @ToolParam(description = "Nombre de la mascota") String name,
            @ToolParam(description = "Fecha de nacimiento en formato yyyy/MM/dd (ej: 2020/03/15)") String birthDate,
            @ToolParam(description = "ID del tipo de mascota (obtener con listPetTypes)") int typeId,
            @ToolParam(description = "ID del propietario al que se asocia la mascota") int ownerId) {
        Owner owner = clinicService.findOwnerById(ownerId);
        Pet pet = new Pet();
        pet.setName(name);
        pet.setBirthDate(LocalDate.parse(birthDate, DATE_FMT));

        PetType type = clinicService.findPetTypes().stream()
            .filter(t -> t.getId().equals(typeId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Tipo de mascota no encontrado: " + typeId));
        pet.setType(type);
        owner.addPet(pet);
        clinicService.savePet(pet);
        return pet;
    }

    @Tool(description = "Actualizar los datos de una mascota existente (nombre, fecha de nacimiento o tipo)")
    public Pet updatePet(
            @ToolParam(description = "ID de la mascota a actualizar") int id,
            @ToolParam(description = "Nuevo nombre (null para no cambiar)") String name,
            @ToolParam(description = "Nueva fecha de nacimiento yyyy/MM/dd (null para no cambiar)") String birthDate,
            @ToolParam(description = "Nuevo ID de tipo de mascota (0 para no cambiar)") int typeId) {
        Pet pet = clinicService.findPetById(id);
        if (name != null) pet.setName(name);
        if (birthDate != null) pet.setBirthDate(LocalDate.parse(birthDate, DATE_FMT));
        if (typeId > 0) {
            PetType type = clinicService.findPetTypes().stream()
                .filter(t -> t.getId().equals(typeId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de mascota no encontrado: " + typeId));
            pet.setType(type);
        }
        clinicService.savePet(pet);
        return pet;
    }
}
```

### VetMcpService.java

```java
package org.springframework.samples.petclinic.mcp;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class VetMcpService {

    private final ClinicService clinicService;

    public VetMcpService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Tool(description = "Obtener el listado completo de veterinarios de la clínica " +
        "con sus nombres y especialidades médicas")
    public Collection<Vet> listVets() {
        return clinicService.findVets();
    }
}
```

### VisitMcpService.java

```java
package org.springframework.samples.petclinic.mcp;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.Visit;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;

@Service
public class VisitMcpService {

    private final ClinicService clinicService;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public VisitMcpService(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Tool(description = "Obtener el historial completo de visitas veterinarias de una mascota, " +
        "ordenadas por fecha descendente. Incluye fecha y descripción de cada visita")
    public Collection<Visit> getVisitsByPet(
            @ToolParam(description = "Identificador único de la mascota") int petId) {
        return clinicService.findVisitsByPetId(petId);
    }

    @Tool(description = "Registrar una nueva visita veterinaria para una mascota existente. " +
        "La fecha por defecto es la fecha actual si no se especifica")
    public Visit addVisit(
            @ToolParam(description = "ID de la mascota que será atendida") int petId,
            @ToolParam(description = "Fecha de la visita en formato yyyy/MM/dd (dejar vacío para usar fecha actual)") String date,
            @ToolParam(description = "Motivo o descripción de la visita veterinaria") String description) {
        Pet pet = clinicService.findPetById(petId);
        Visit visit = new Visit();
        visit.setPet(pet);
        visit.setDescription(description);
        if (date != null && !date.isBlank()) {
            visit.setDate(LocalDate.parse(date, DATE_FMT));
        }
        clinicService.saveVisit(visit);
        return visit;
    }
}
```

---

## Configuración del Servidor MCP

### application-mcp.yml

```yaml
spring:
  ai:
    mcp:
      server:
        name: petclinic-mcp-server
        version: 1.0.0
        description: >
          Servidor MCP de la Clínica Veterinaria PetClinic.
          Permite a agentes de IA gestionar propietarios, mascotas,
          visitas y consultar veterinarios.
```

### Dependencia Maven

Añadir al `pom.xml` dentro de `<dependencies>`:

```xml
<!-- MCP Server via Spring AI -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
    <version>1.0.0</version>
</dependency>
```

Y el repositorio de Spring AI (si no está ya configurado):

```xml
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
    </repository>
</repositories>
```

---

## Configuración IDE (.mcp/settings.json)

```json
{
  "mcpServers": {
    "petclinic": {
      "command": "java",
      "args": [
        "-cp",
        "target/classes;target/dependency/*",
        "org.springframework.samples.petclinic.PetClinicApplication",
        "--spring.profiles.active=mcp"
      ],
      "env": {
        "SPRING_PROFILES_ACTIVE": "mcp"
      }
    }
  }
}
```

> **Nota:** Ajustar el separador de classpath a `:` en Linux/macOS o `;` en Windows.

---

## Validación y Testing

### 1. Compilar el proyecto

```bash
./mvnw clean package -DskipTests
```

### 2. Verificar inicialización MCP

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | \
  java -cp "target/classes:target/dependency/*" \
  org.springframework.samples.petclinic.PetClinicApplication \
  --spring.profiles.active=mcp
```

### 3. Listar herramientas disponibles

```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | \
  java -jar target/petclinic-mcp.jar
```

**Respuesta esperada:**
```json
{
  "tools": [
    { "name": "getOwnerById", "description": "Obtener el perfil completo de un propietario..." },
    { "name": "searchOwnersByLastName", "description": "Buscar propietarios por apellido..." },
    { "name": "createOwner", "description": "Registrar un nuevo propietario..." },
    { "name": "updateOwner", "description": "Actualizar los datos de un propietario..." },
    { "name": "getPetById", "description": "Obtener los datos de una mascota..." },
    { "name": "listPetTypes", "description": "Obtener el catálogo de tipos de mascota..." },
    { "name": "addPet", "description": "Registrar una nueva mascota..." },
    { "name": "updatePet", "description": "Actualizar los datos de una mascota..." },
    { "name": "listVets", "description": "Obtener el listado de veterinarios..." },
    { "name": "getVisitsByPet", "description": "Obtener el historial de visitas..." },
    { "name": "addVisit", "description": "Registrar una nueva visita veterinaria..." }
  ]
}
```

### 4. Invocar una herramienta de prueba

```bash
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"listPetTypes","arguments":{}}}' | \
  java -jar target/petclinic-mcp.jar
```

### 5. Ejemplos de interacción con un agente IA

Una vez configurado, un agente IA puede ejecutar flujos como:

```
Usuario: "Registra un nuevo propietario llamado Carlos García, 
          que vive en Calle Mayor 15, Madrid, teléfono 612345678"

Agente → invoca Tool createOwner:
  firstName: "Carlos"
  lastName: "García"
  address: "Calle Mayor 15"
  city: "Madrid"
  telephone: "612345678"

Usuario: "Ahora añádele un perro que se llama Rocky, nacido el 15 de marzo de 2020"

Agente → invoca Resource listPetTypes (para obtener el ID de "perro")
Agente → invoca Tool addPet:
  name: "Rocky"
  birthDate: "2020/03/15"
  typeId: 2  (perro)
  ownerId: <id devuelto por createOwner>

Usuario: "Agenda una visita para Rocky para vacunación"

Agente → invoca Tool addVisit:
  petId: <id de Rocky>
  description: "Vacunación anual"
```

---

## Notas de Seguridad

### Endpoints expuestos

| Nivel de riesgo | Tools afectados                        | Mitigación recomendada                        |
|-----------------|----------------------------------------|-----------------------------------------------|
| 🟡 Medio        | `createOwner`, `updateOwner`          | Validar datos de entrada (ya usa `@Valid`)     |
| 🟡 Medio        | `addPet`, `updatePet`                 | Verificar que el `ownerId` existe              |
| 🟢 Bajo          | `addVisit`                            | Verificar que el `petId` existe                |
| 🟢 Bajo          | Todos los Resources (solo lectura)    | Sin riesgo de modificación de datos            |

### Recomendaciones

1. **No exponer endpoints destructivos (DELETE)** — El proyecto no tiene endpoints de eliminación, lo cual es correcto para MCP.
2. **Validación de entrada** — Las entidades ya usan `@NotEmpty` y `@Digits`. Los MCP services deben propagar estas validaciones.
3. **Autorización** — Considerar añadir Spring Security si el MCP server será accesible en red. En modo local (stdio), el IDE controla el acceso.
4. **Auditoría** — Registrar mediante logs todas las invocaciones de Tools que modifiquen datos (crear, actualizar).
5. **Rate limiting** — Para despliegues en red, considerar limitar la frecuencia de invocaciones de tools de escritura.

---

## Referencias

- [Spring AI MCP Server — Documentación oficial](https://docs.spring.io/spring-ai/reference/guides/getting-started-mcp.html)
- [Especificación MCP — modelcontextprotocol.io](https://modelcontextprotocol.io/)
- [OpenRewrite Spring REST to MCP Converter](https://github.com/addozhang/spring-rest-to-mcp)
- [Artículo: "From REST API to MCP Server" — Gokhan A.](https://gokhana.medium.com/from-rest-api-to-mcp-server-convert-your-spring-apis-into-ai-tools-with-spring-ai-07b8f36b0212)
- [Artículo: "Using MCP with Spring AI" — Piotr Minkowski](https://piotrminkowski.com/2025/03/17/using-model-context-protocol-mcp-with-spring-ai/)

---

> **Última actualización:** Marzo 2026  
> **Generado por:** REST API to MCP Server Expert Agent

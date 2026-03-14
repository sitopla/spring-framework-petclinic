# Spring Framework Petclinic - Documentación de Endpoints API

**Versión del Documento:** 1.0  
**Última Actualización:** Febrero 2026  
**Tipo de API:** Spring MVC (Renderizado del Lado del Servidor + REST)  
**Framework:** Spring Framework 7.0.3

---

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Resumen de Endpoints](#resumen-de-endpoints)
3. [Endpoints de Propietario](#endpoints-de-propietario)
4. [Endpoints de Mascota](#endpoints-de-mascota)
5. [Endpoints de Visita](#endpoints-de-visita)
6. [Endpoints de Veterinario](#endpoints-de-veterinario)
7. [Endpoints Utilitarios](#endpoints-utilitarios)
8. [Recursos Estáticos](#recursos-estáticos)
9. [Modelos de Datos](#modelos-de-datos)
10. [Reglas de Validación](#reglas-de-validación)
11. [Manejo de Errores](#manejo-de-errores)
12. [Ejemplos de Solicitud/Respuesta](#ejemplos-de-solicitudrespuesta)

---

## Visión General

### Arquitectura de la API

Esta aplicación utiliza una **arquitectura híbrida** que combina:
- **Renderizado del Lado del Servidor (SSR)**: Vistas JSP para páginas HTML
- **API REST**: Endpoints JSON/XML para intercambio de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                        Capa del Cliente                         │
├─────────────────────────────────────────────────────────────────┤
│  Navegador (Formularios HTML)  │  Cliente REST (JSON/XML)      │
└───────────┬─────────────────────────────┬───────────────────────┘
            │                             │
            ▼                             ▼
┌───────────────────────┐   ┌─────────────────────────┐
│   Controladores de    │   │    Controladores REST   │
│      Vista (JSP)      │   │    (@ResponseBody)      │
├───────────────────────┴───┴─────────────────────────┤
│                 Spring MVC                           │
│              DispatcherServlet                       │
├──────────────────────────────────────────────────────┤
│                 ClinicService                        │
│              (Lógica de Negocio)                     │
├──────────────────────────────────────────────────────┤
│               Capa de Repositorio                    │
│        (JDBC / JPA / Spring Data JPA)               │
└──────────────────────────────────────────────────────┘
```

### Configuración Base

| Propiedad | Valor |
|-----------|-------|
| Context Path | `/petclinic` (configurable) |
| Mapeo de Servlet | `/` |
| Tecnología de Vistas | JSP (WEB-INF/jsp/) |
| Negociación de Contenido | HTML, JSON, XML |

---

## Resumen de Endpoints

### Tabla de Referencia Rápida

| Método | Ruta | Controlador | Descripción | Respuesta |
|--------|------|-------------|-------------|-----------|
| GET | `/` | View Controller | Página de bienvenida | HTML |
| GET | `/owners/new` | OwnerController | Formulario nuevo propietario | HTML |
| POST | `/owners/new` | OwnerController | Crear propietario | Redirección |
| GET | `/owners/find` | OwnerController | Formulario buscar propietario | HTML |
| GET | `/owners` | OwnerController | Buscar propietarios | HTML |
| GET | `/owners/{ownerId}` | OwnerController | Detalles del propietario | HTML |
| GET | `/owners/{ownerId}/edit` | OwnerController | Formulario editar propietario | HTML |
| POST | `/owners/{ownerId}/edit` | OwnerController | Actualizar propietario | Redirección |
| GET | `/owners/{ownerId}/pets/new` | PetController | Formulario nueva mascota | HTML |
| POST | `/owners/{ownerId}/pets/new` | PetController | Crear mascota | Redirección |
| GET | `/owners/{ownerId}/pets/{petId}/edit` | PetController | Formulario editar mascota | HTML |
| POST | `/owners/{ownerId}/pets/{petId}/edit` | PetController | Actualizar mascota | Redirección |
| GET | `/owners/*/pets/{petId}/visits/new` | VisitController | Formulario nueva visita | HTML |
| POST | `/owners/{ownerId}/pets/{petId}/visits/new` | VisitController | Crear visita | Redirección |
| GET | `/owners/*/pets/{petId}/visits` | VisitController | Listar visitas | HTML |
| GET | `/vets` | VetController | Lista de vets (HTML) | HTML |
| GET | `/vets.json` | VetController | Lista de vets (JSON) | JSON |
| GET | `/vets.xml` | VetController | Lista de vets (XML) | XML |
| GET | `/oups` | CrashController | Demo de error | Excepción |

**Total de Endpoints: 18**

---

## Endpoints de Propietario

### OwnerController

**Fuente:** `src/main/java/org/springframework/samples/petclinic/web/OwnerController.java`

---

#### GET /owners/new

**Mostrar Formulario de Nuevo Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/new` |
| Manejador | `OwnerController.initCreationForm()` |
| Autenticación | Ninguna |
| Tipo de Respuesta | `text/html` |
| Vista | `owners/createOrUpdateOwnerForm` |

**Solicitud:**
```http
GET /petclinic/owners/new HTTP/1.1
Host: localhost:8080
Accept: text/html
```

**Respuesta:**
- Devuelve formulario HTML para crear un nuevo propietario
- Pre-popula el modelo con objeto `Owner` vacío

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `owner` | `Owner` | Objeto propietario vacío para binding del formulario |

---

#### POST /owners/new

**Crear Nuevo Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `POST` |
| Ruta | `/owners/new` |
| Manejador | `OwnerController.processCreationForm()` |
| Content-Type | `application/x-www-form-urlencoded` |
| Validación | `@Valid` + Bean Validation |

**Parámetros de Solicitud:**

| Parámetro | Tipo | Requerido | Validación |
|-----------|------|-----------|------------|
| `firstName` | String | Sí | `@NotEmpty` |
| `lastName` | String | Sí | `@NotEmpty` |
| `address` | String | Sí | `@NotEmpty` |
| `city` | String | Sí | `@NotEmpty` |
| `telephone` | String | Sí | `@NotEmpty`, `@Digits(fraction=0, integer=10)` |

**Solicitud:**
```http
POST /petclinic/owners/new HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

firstName=Juan&lastName=Garcia&address=123+Calle+Principal&city=Madrid&telephone=1234567890
```

**Respuesta:**
- **Éxito:** `302 Redirect` a `/owners/{ownerId}`
- **Error de Validación:** Devuelve formulario con mensajes de error

**Campos Deshabilitados:**
- `id` (protegido por `@InitBinder`)

---

#### GET /owners/find

**Mostrar Formulario de Búsqueda de Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/find` |
| Manejador | `OwnerController.initFindForm()` |
| Tipo de Respuesta | `text/html` |
| Vista | `owners/findOwners` |

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `owner` | `Owner` | Propietario vacío para binding de búsqueda |

---

#### GET /owners

**Buscar Propietarios por Apellido**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners` |
| Manejador | `OwnerController.processFindForm()` |
| Tipo de Respuesta | `text/html` |

**Parámetros de Consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `lastName` | String | No | Filtrar por apellido (coincidencia parcial) |

**Solicitud:**
```http
GET /petclinic/owners?lastName=Garcia HTTP/1.1
Host: localhost:8080
```

**Escenarios de Respuesta:**

| Escenario | Cantidad de Resultados | Respuesta |
|-----------|------------------------|-----------|
| Búsqueda vacía | Todos los propietarios | Vista: `owners/ownersList` |
| Coincidencia única | 1 | Redirección a `/owners/{id}` |
| Múltiples coincidencias | N > 1 | Vista: `owners/ownersList` |
| Sin coincidencias | 0 | Vista: `owners/findOwners` con error |

**Mensajes de Error:**
| Código | Mensaje |
|--------|---------|
| `notFound` | "not found" |

---

#### GET /owners/{ownerId}

**Mostrar Detalles del Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/{ownerId}` |
| Manejador | `OwnerController.showOwner()` |
| Tipo de Respuesta | `text/html` |
| Vista | `owners/ownerDetails` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |

**Solicitud:**
```http
GET /petclinic/owners/1 HTTP/1.1
Host: localhost:8080
```

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `owner` | `Owner` | Propietario con mascotas y visitas |

---

#### GET /owners/{ownerId}/edit

**Mostrar Formulario de Edición de Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/{ownerId}/edit` |
| Manejador | `OwnerController.initUpdateOwnerForm()` |
| Tipo de Respuesta | `text/html` |
| Vista | `owners/createOrUpdateOwnerForm` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |

---

#### POST /owners/{ownerId}/edit

**Actualizar Propietario**

| Propiedad | Valor |
|-----------|-------|
| Método | `POST` |
| Ruta | `/owners/{ownerId}/edit` |
| Manejador | `OwnerController.processUpdateOwnerForm()` |
| Content-Type | `application/x-www-form-urlencoded` |
| Validación | `@Valid` + Bean Validation |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |

**Parámetros de Solicitud:**
Igual que POST `/owners/new`

**Respuesta:**
- **Éxito:** `302 Redirect` a `/owners/{ownerId}`
- **Error de Validación:** Devuelve formulario con mensajes de error

---

## Endpoints de Mascota

### PetController

**Fuente:** `src/main/java/org/springframework/samples/petclinic/web/PetController.java`

**Ruta Base:** `/owners/{ownerId}`

---

#### GET /owners/{ownerId}/pets/new

**Mostrar Formulario de Nueva Mascota**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/{ownerId}/pets/new` |
| Manejador | `PetController.initCreationForm()` |
| Tipo de Respuesta | `text/html` |
| Vista | `pets/createOrUpdatePetForm` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `pet` | `Pet` | Objeto mascota vacío |
| `owner` | `Owner` | Propietario cargado via `@ModelAttribute` |
| `types` | `Collection<PetType>` | Tipos de mascota disponibles |

---

#### POST /owners/{ownerId}/pets/new

**Crear Nueva Mascota**

| Propiedad | Valor |
|-----------|-------|
| Método | `POST` |
| Ruta | `/owners/{ownerId}/pets/new` |
| Manejador | `PetController.processCreationForm()` |
| Content-Type | `application/x-www-form-urlencoded` |
| Validación | `PetValidator` (personalizado) |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |

**Parámetros de Solicitud:**

| Parámetro | Tipo | Requerido | Validación |
|-----------|------|-----------|------------|
| `name` | String | Sí | No vacío |
| `birthDate` | LocalDate | Sí | No nulo, formato: `yyyy/MM/dd` |
| `type` | PetType | Sí (nueva mascota) | No nulo para nuevas mascotas |

**Solicitud:**
```http
POST /petclinic/owners/1/pets/new HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

name=Buddy&birthDate=2023/05/15&type=dog
```

**Reglas de Validación:**
- El nombre de la mascota debe ser único por propietario
- La fecha de nacimiento es requerida
- El tipo de mascota es requerido para nuevas mascotas

**Mensajes de Error:**
| Código | Mensaje |
|--------|---------|
| `duplicate` | "already exists" |
| `required` | "required" |

**Respuesta:**
- **Éxito:** `302 Redirect` a `/owners/{ownerId}`
- **Error de Validación:** Devuelve formulario con mensajes de error

---

#### GET /owners/{ownerId}/pets/{petId}/edit

**Mostrar Formulario de Edición de Mascota**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/{ownerId}/pets/{petId}/edit` |
| Manejador | `PetController.initUpdateForm()` |
| Tipo de Respuesta | `text/html` |
| Vista | `pets/createOrUpdatePetForm` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |
| `petId` | int | Identificador único de la mascota |

---

#### POST /owners/{ownerId}/pets/{petId}/edit

**Actualizar Mascota**

| Propiedad | Valor |
|-----------|-------|
| Método | `POST` |
| Ruta | `/owners/{ownerId}/pets/{petId}/edit` |
| Manejador | `PetController.processUpdateForm()` |
| Content-Type | `application/x-www-form-urlencoded` |
| Validación | `PetValidator` (personalizado) |

**Respuesta:**
- **Éxito:** `302 Redirect` a `/owners/{ownerId}`
- **Error de Validación:** Devuelve formulario con mensajes de error

---

## Endpoints de Visita

### VisitController

**Fuente:** `src/main/java/org/springframework/samples/petclinic/web/VisitController.java`

---

#### GET /owners/*/pets/{petId}/visits/new

**Mostrar Formulario de Nueva Visita**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/*/pets/{petId}/visits/new` |
| Manejador | `VisitController.initNewVisitForm()` |
| Tipo de Respuesta | `text/html` |
| Vista | `pets/createOrUpdateVisitForm` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `petId` | int | Identificador único de la mascota |

> **Nota:** El comodín `*` permite cualquier ID de propietario en la ruta URL.

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `visit` | `Visit` | Nueva visita con fecha actual |

---

#### POST /owners/{ownerId}/pets/{petId}/visits/new

**Crear Nueva Visita**

| Propiedad | Valor |
|-----------|-------|
| Método | `POST` |
| Ruta | `/owners/{ownerId}/pets/{petId}/visits/new` |
| Manejador | `VisitController.processNewVisitForm()` |
| Content-Type | `application/x-www-form-urlencoded` |
| Validación | `@Valid` + Bean Validation |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ownerId` | int | Identificador único del propietario |
| `petId` | int | Identificador único de la mascota |

**Parámetros de Solicitud:**

| Parámetro | Tipo | Requerido | Validación |
|-----------|------|-----------|------------|
| `date` | LocalDate | No | Formato: `yyyy/MM/dd`, por defecto hoy |
| `description` | String | Sí | `@NotEmpty` |

**Solicitud:**
```http
POST /petclinic/owners/1/pets/1/visits/new HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

date=2026/02/13&description=Revisión+anual
```

**Respuesta:**
- **Éxito:** `302 Redirect` a `/owners/{ownerId}`
- **Error de Validación:** Devuelve formulario con mensajes de error

---

#### GET /owners/*/pets/{petId}/visits

**Listar Visitas de Mascota**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/owners/*/pets/{petId}/visits` |
| Manejador | `VisitController.showVisits()` |
| Tipo de Respuesta | `text/html` |
| Vista | `visitList` |

**Parámetros de Ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `petId` | int | Identificador único de la mascota |

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `visits` | `List<Visit>` | Visitas ordenadas por fecha (descendente) |

---

## Endpoints de Veterinario

### VetController

**Fuente:** `src/main/java/org/springframework/samples/petclinic/web/VetController.java`

---

#### GET /vets

**Listar Todos los Veterinarios (HTML)**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/vets` |
| Manejador | `VetController.showVetList()` |
| Tipo de Respuesta | `text/html` |
| Vista | `vets/vetList` |

**Solicitud:**
```http
GET /petclinic/vets HTTP/1.1
Host: localhost:8080
Accept: text/html
```

**Atributos del Modelo:**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `vets` | `Vets` | Wrapper conteniendo lista de vets |

---

#### GET /vets.json

**Listar Todos los Veterinarios (API JSON)**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/vets.json` |
| Manejador | `VetController.showJsonVetList()` |
| Tipo de Respuesta | `application/json` |
| Produce | `MediaType.APPLICATION_JSON_VALUE` |

**Solicitud:**
```http
GET /petclinic/vets.json HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Respuesta:**
```json
{
  "vetList": [
    {
      "id": 1,
      "firstName": "James",
      "lastName": "Carter",
      "specialties": []
    },
    {
      "id": 2,
      "firstName": "Helen",
      "lastName": "Leary",
      "specialties": [
        {
          "id": 1,
          "name": "radiology"
        }
      ]
    },
    {
      "id": 3,
      "firstName": "Linda",
      "lastName": "Douglas",
      "specialties": [
        {
          "id": 2,
          "name": "surgery"
        },
        {
          "id": 3,
          "name": "dentistry"
        }
      ]
    }
  ]
}
```

---

#### GET /vets.xml

**Listar Todos los Veterinarios (API XML)**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/vets.xml` |
| Manejador | `VetController.showXmlVetList()` |
| Tipo de Respuesta | `application/xml` |
| Produce | `MediaType.APPLICATION_XML_VALUE` |

**Solicitud:**
```http
GET /petclinic/vets.xml HTTP/1.1
Host: localhost:8080
Accept: application/xml
```

**Respuesta:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<vets>
  <vet>
    <id>1</id>
    <firstName>James</firstName>
    <lastName>Carter</lastName>
  </vet>
  <vet>
    <id>2</id>
    <firstName>Helen</firstName>
    <lastName>Leary</lastName>
    <specialties>
      <specialty>
        <id>1</id>
        <name>radiology</name>
      </specialty>
    </specialties>
  </vet>
</vets>
```

---

## Endpoints Utilitarios

### Página de Bienvenida

#### GET /

**Página de Bienvenida (View Controller)**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/` |
| Manejador | MVC View Controller |
| Vista | `welcome` |
| Configuración | `mvc-core-config.xml` |

Configurado via:
```xml
<mvc:view-controller path="/" view-name="welcome"/>
```

---

### CrashController

**Fuente:** `src/main/java/org/springframework/samples/petclinic/web/CrashController.java`

#### GET /oups

**Endpoint de Demostración de Excepción**

| Propiedad | Valor |
|-----------|-------|
| Método | `GET` |
| Ruta | `/oups` |
| Manejador | `CrashController.triggerException()` |
| Propósito | Demostrar manejo de excepciones |

**Solicitud:**
```http
GET /petclinic/oups HTTP/1.1
Host: localhost:8080
```

**Respuesta:**
- Lanza `RuntimeException`
- Manejado por `SimpleMappingExceptionResolver`
- Renderiza vista `exception` (`WEB-INF/jsp/exception.jsp`)

---

## Recursos Estáticos

### Mapeos de Recursos

| Patrón | Ubicación | Descripción |
|--------|-----------|-------------|
| `/resources/**` | `/resources/` | CSS, JS, imágenes |
| `/webjars/**` | `classpath:/META-INF/resources/webjars/` | Bibliotecas WebJar |

### WebJars Disponibles

| Biblioteca | Versión | Ruta |
|------------|---------|------|
| Bootstrap | 5.3.8 | `/webjars/bootstrap/5.3.8/` |
| Font Awesome | 4.7.0 | `/webjars/font-awesome/4.7.0/` |
| Flatpickr | 4.6.13 | `/webjars/flatpickr/4.6.13/` |

---

## Modelos de Datos

### Owner (Propietario)

```java
public class Owner extends Person {
    // Heredado de Person
    Integer id;          // Clave primaria
    String firstName;    // @NotEmpty
    String lastName;     // @NotEmpty
    
    // Específico de Owner
    String address;      // @NotEmpty
    String city;         // @NotEmpty
    String telephone;    // @NotEmpty, @Digits(fraction=0, integer=10)
    Set<Pet> pets;       // Relación Uno-a-Muchos
}
```

### Pet (Mascota)

```java
public class Pet extends NamedEntity {
    Integer id;          // Clave primaria
    String name;         // Requerido (validación personalizada)
    LocalDate birthDate; // Requerido, formato: yyyy/MM/dd
    PetType type;        // Requerido para nuevas mascotas
    Owner owner;         // Relación Muchos-a-Uno
    Set<Visit> visits;   // Relación Uno-a-Muchos
}
```

### Visit (Visita)

```java
public class Visit extends BaseEntity {
    Integer id;          // Clave primaria
    LocalDate date;      // Por defecto fecha actual
    String description;  // @NotEmpty
    Pet pet;             // Relación Muchos-a-Uno
}
```

### Vet (Veterinario)

```java
public class Vet extends Person {
    Integer id;              // Clave primaria
    String firstName;        // @NotEmpty
    String lastName;         // @NotEmpty
    Set<Specialty> specialties; // Relación Muchos-a-Muchos
}
```

### Vets (Wrapper)

```java
@XmlRootElement
public class Vets {
    List<Vet> vetList;   // Usado para serialización XML/JSON
}
```

### PetType (Tipo de Mascota)

```java
public class PetType extends NamedEntity {
    Integer id;
    String name;
}
```

### Specialty (Especialidad)

```java
public class Specialty extends NamedEntity {
    Integer id;
    String name;
}
```

---

## Reglas de Validación

### Bean Validation (Jakarta Validation)

| Entidad | Campo | Restricciones |
|---------|-------|---------------|
| Person | firstName | `@NotEmpty` |
| Person | lastName | `@NotEmpty` |
| Owner | address | `@NotEmpty` |
| Owner | city | `@NotEmpty` |
| Owner | telephone | `@NotEmpty`, `@Digits(fraction=0, integer=10)` |
| Visit | description | `@NotEmpty` |

### Validación Personalizada (PetValidator)

| Campo | Regla | Código de Error |
|-------|-------|-----------------|
| name | Requerido, no vacío | `required` |
| type | Requerido para nuevas mascotas | `required` |
| birthDate | Requerido | `required` |

### Reglas de Negocio

| Regla | Ubicación | Descripción |
|-------|-----------|-------------|
| Nombre único de mascota por propietario | `PetController.processCreationForm()` | Verifica mascotas existentes |
| Protección de ID | `@InitBinder` | Campo `id` no permitido en binding |

---

## Manejo de Errores

### Configuración del Exception Resolver

```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
    <property name="defaultErrorView" value="exception"/>
    <property name="warnLogCategory" value="warn"/>
</bean>
```

### Respuestas de Error

| Escenario | Vista | Estado HTTP |
|-----------|-------|-------------|
| Errores de validación | Formulario original | 200 (con errores) |
| Recurso no encontrado | exception | 500 |
| Excepción de runtime | exception | 500 |

### Visualización de Errores de Validación

Los errores de validación se muestran usando etiquetas de formulario de Spring:
```jsp
<form:errors path="fieldName" cssClass="error"/>
```

---

## Ejemplos de Solicitud/Respuesta

### Flujo de Creación de Propietario

**Paso 1: Obtener Formulario**
```http
GET /petclinic/owners/new HTTP/1.1
Host: localhost:8080
Accept: text/html
```

**Paso 2: Enviar Formulario**
```http
POST /petclinic/owners/new HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

firstName=George&lastName=Franklin&address=110+W.+Liberty+St.&city=Madison&telephone=6085551023
```

**Paso 3: Redirección en Éxito**
```http
HTTP/1.1 302 Found
Location: /petclinic/owners/11
```

### Flujo de Búsqueda de Propietario

**Todos los Propietarios:**
```http
GET /petclinic/owners HTTP/1.1
Host: localhost:8080
```

**Filtrar por Apellido:**
```http
GET /petclinic/owners?lastName=Garcia HTTP/1.1
Host: localhost:8080
```

### Llamada API (JSON)

**Solicitud:**
```http
GET /petclinic/vets.json HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Respuesta:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

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

### Llamada API (XML)

**Solicitud:**
```http
GET /petclinic/vets.xml HTTP/1.1
Host: localhost:8080
Accept: application/xml
```

**Respuesta:**
```http
HTTP/1.1 200 OK
Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<vets>
  <vet>
    <id>1</id>
    <firstName>James</firstName>
    <lastName>Carter</lastName>
  </vet>
</vets>
```

---

## Matriz de Endpoints por Controlador

### OwnerController
| # | Método | Ruta | Acción |
|---|--------|------|--------|
| 1 | GET | `/owners/new` | Mostrar formulario de creación |
| 2 | POST | `/owners/new` | Crear propietario |
| 3 | GET | `/owners/find` | Mostrar formulario de búsqueda |
| 4 | GET | `/owners` | Buscar propietarios |
| 5 | GET | `/owners/{ownerId}` | Ver propietario |
| 6 | GET | `/owners/{ownerId}/edit` | Mostrar formulario de edición |
| 7 | POST | `/owners/{ownerId}/edit` | Actualizar propietario |

### PetController
| # | Método | Ruta | Acción |
|---|--------|------|--------|
| 8 | GET | `/owners/{ownerId}/pets/new` | Mostrar formulario de creación |
| 9 | POST | `/owners/{ownerId}/pets/new` | Crear mascota |
| 10 | GET | `/owners/{ownerId}/pets/{petId}/edit` | Mostrar formulario de edición |
| 11 | POST | `/owners/{ownerId}/pets/{petId}/edit` | Actualizar mascota |

### VisitController
| # | Método | Ruta | Acción |
|---|--------|------|--------|
| 12 | GET | `/owners/*/pets/{petId}/visits/new` | Mostrar formulario de creación |
| 13 | POST | `/owners/{ownerId}/pets/{petId}/visits/new` | Crear visita |
| 14 | GET | `/owners/*/pets/{petId}/visits` | Listar visitas |

### VetController
| # | Método | Ruta | Acción |
|---|--------|------|--------|
| 15 | GET | `/vets` | Listar vets (HTML) |
| 16 | GET | `/vets.json` | Listar vets (JSON) |
| 17 | GET | `/vets.xml` | Listar vets (XML) |

### Otros
| # | Método | Ruta | Acción |
|---|--------|------|--------|
| 18 | GET | `/` | Página de bienvenida |
| 19 | GET | `/oups` | Demo de error |

---

## Consideraciones de Seguridad

### Estado Actual

⚠️ **Sin Autenticación/Autorización Implementada**

La aplicación actualmente tiene:
- Sin funcionalidad de login/logout
- Sin control de acceso basado en roles
- Sin protección CSRF (más allá de los valores por defecto de Spring)
- Sin autenticación de API

### Recomendaciones para Producción

1. **Añadir Spring Security**
   ```xml
   <dependency>
       <groupId>org.springframework.security</groupId>
       <artifactId>spring-security-web</artifactId>
   </dependency>
   ```

2. **Implementar Protección CSRF**
   - Ya disponible con Spring Security
   - Añadir tokens CSRF a los formularios

3. **Autenticación de API**
   - Tokens JWT para endpoints REST
   - Claves API para servicio-a-servicio

4. **Sanitización de Entrada**
   - Protección XSS para entradas de usuario
   - Prevención de inyección SQL (manejado por JPA)

---

## Historial del Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Febrero 2026 | Documentación inicial de endpoints |

---

*Este documento fue auto-generado por el Agente Descubridor de Endpoints.*

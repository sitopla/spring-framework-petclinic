# Plan de Pruebas y Casos de Prueba

## Spring Framework PetClinic

| Información del Documento | |
|---------------------------|---|
| **Versión** | 1.0 |
| **Fecha** | 2026-02-13 |
| **Estado** | Final |
| **Autor** | Agente de Documentación de Pruebas |

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Estrategia de Pruebas](#2-estrategia-de-pruebas)
3. [Entorno de Pruebas](#3-entorno-de-pruebas)
4. [Cronograma de Pruebas](#4-cronograma-de-pruebas)
5. [Casos de Prueba - Pruebas Unitarias](#5-casos-de-prueba---pruebas-unitarias)
6. [Casos de Prueba - Pruebas de Integración](#6-casos-de-prueba---pruebas-de-integración)
7. [Casos de Prueba - Pruebas de Controlador](#7-casos-de-prueba---pruebas-de-controlador)
8. [Casos de Prueba - Pruebas Negativas](#8-casos-de-prueba---pruebas-negativas)
9. [Casos de Prueba - Pruebas de Límites](#9-casos-de-prueba---pruebas-de-límites)
10. [Datos de Prueba](#10-datos-de-prueba)
11. [Matriz de Trazabilidad](#11-matriz-de-trazabilidad)
12. [Análisis de Cobertura](#12-análisis-de-cobertura)
13. [Evaluación de Riesgos](#13-evaluación-de-riesgos)

---

## 1. Introducción

### 1.1 Propósito

Este documento define el plan de pruebas integral y los casos de prueba para la aplicación Spring Framework PetClinic. Cubre estrategias de pruebas unitarias, de integración y de controlador para asegurar la calidad y fiabilidad de la aplicación.

### 1.2 Alcance

**Dentro del Alcance:**
- Gestión de Propietarios (operaciones CRUD)
- Gestión de Mascotas (operaciones CRUD)
- Gestión de Visitas (Crear, Ver)
- Directorio de Veterinarios (Ver, Exportar)
- Validación de Datos
- Capa de Persistencia (JDBC, JPA, Spring Data JPA)

**Fuera del Alcance:**
- Pruebas de Rendimiento/Carga (documento separado)
- Pruebas de penetración de seguridad
- Pruebas de UI/UX
- Pruebas de accesibilidad

### 1.3 Referencias

| Documento | Versión | Ubicación |
|-----------|---------|-----------|
| Requisitos Funcionales | 1.0 | `doc/FUNCTIONAL_REQUIREMENTS.md` |
| Arquitectura | 1.0 | `doc/ARCHITECTURE.md` |
| Stack Tecnológico | 1.0 | `doc/TECHNOLOGY_STACK.md` |

### 1.4 Framework de Pruebas

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework de Pruebas | JUnit Jupiter | 6.0.2 |
| Mocking | Mockito | 5.21.0 |
| Aserciones | AssertJ | 3.27.7 |
| Biblioteca de Matchers | Hamcrest | 3.0 |
| Spring Test | Spring Test | 7.0.3 |
| JSON Path | JsonPath | 2.10.0 |

---

## 2. Estrategia de Pruebas

### 2.1 Niveles de Pruebas

| Nivel | Descripción | Objetivo | Herramientas |
|-------|-------------|----------|--------------|
| **Unitaria** | Clases/métodos individuales | 80%+ cobertura | JUnit, Mockito |
| **Integración** | Servicio + Repositorio | Los 3 perfiles | Spring Test, H2 |
| **Controlador** | Endpoints HTTP | Todos los endpoints | MockMvc |
| **Validación** | Validación de beans | Todas las restricciones | Hibernate Validator |

### 2.2 Tipos de Pruebas

```
┌─────────────────────────────────────────────────────────────┐
│                   PIRÁMIDE DE PRUEBAS                       │
│                                                             │
│                        ╱╲                                   │
│                       ╱  ╲  E2E (Manual)                   │
│                      ╱────╲                                 │
│                     ╱      ╲                                │
│                    ╱ Controlador╲  Pruebas MockMvc         │
│                   ╱────────────╲                            │
│                  ╱              ╲                           │
│                 ╱  Integración   ╲  Pruebas de Servicio    │
│                ╱──────────────────╲                         │
│               ╱                    ╲                        │
│              ╱   Pruebas Unitarias  ╲  Pruebas de Modelo   │
│             ╱────────────────────────╲                      │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Perfiles de Pruebas

La aplicación soporta tres perfiles de persistencia, cada uno requiriendo cobertura completa de pruebas:

| Perfil | Descripción | Clase de Prueba |
|--------|-------------|-----------------|
| `jpa` | Implementación Hibernate JPA | `ClinicServiceJpaTests` |
| `jdbc` | Implementación Spring JdbcClient | `ClinicServiceJdbcTests` |
| `spring-data-jpa` | Repositorios Spring Data JPA | `ClinicServiceSpringDataJpaTests` |

### 2.4 Criterios de Entrada

- [ ] Código completo y compilado
- [ ] Pruebas unitarias escritas para código nuevo
- [ ] Build local exitoso
- [ ] Base de datos de prueba disponible (H2 en memoria)

### 2.5 Criterios de Salida

- [ ] Todos los casos de prueba ejecutados
- [ ] 80%+ cobertura de código alcanzada
- [ ] Sin defectos P1/P2 abiertos
- [ ] Los tres perfiles de persistencia pasan
- [ ] Reporte de cobertura generado

---

## 3. Entorno de Pruebas

### 3.1 Requisitos de Hardware

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 2 núcleos | 4 núcleos |
| RAM | 4 GB | 8 GB |
| Disco | 1 GB | 5 GB |

### 3.2 Requisitos de Software

| Software | Versión | Propósito |
|----------|---------|-----------|
| Java JDK | 17 o 21 | Runtime |
| Maven | 3.8.4+ | Build y Pruebas |
| H2 Database | 2.4.240 | Base de datos de pruebas |

### 3.3 Base de Datos de Pruebas

| Base de Datos | Modo | Propósito |
|---------------|------|-----------|
| H2 | En memoria | Base de datos de pruebas por defecto |
| HSQLDB | En memoria | Perfil alternativo |

### 3.4 Archivos de Configuración de Pruebas

| Archivo | Propósito |
|---------|-----------|
| `spring/mvc-test-config.xml` | Configuración de servicio mock |
| `spring/business-config.xml` | Contexto de pruebas de integración |
| `db/h2/schema.sql` | Esquema de base de datos |
| `db/h2/data.sql` | Datos semilla de pruebas |

---

## 4. Cronograma de Pruebas

| Fase | Actividades | Duración |
|------|-------------|----------|
| **Pruebas Unitarias** | Pruebas de modelo, Pruebas de validador | Continuo |
| **Pruebas de Integración** | Pruebas de capa de servicio (3 perfiles) | Por build |
| **Pruebas de Controlador** | Pruebas de endpoints MockMvc | Por build |
| **Pruebas de Regresión** | Suite de pruebas completa | Pre-release |

### 4.1 Comandos de Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas
./mvnw test

# Ejecutar con perfil específico
./mvnw test -Dspring.profiles.active=jdbc

# Ejecutar con reporte de cobertura
./mvnw verify

# Ejecutar clase de prueba específica
./mvnw test -Dtest=OwnerControllerTests
```

---

## 5. Casos de Prueba - Pruebas Unitarias

### 5.1 Pruebas de Capa de Modelo

#### CP-U001: Colección de Mascotas de Propietario Ordenada por Nombre

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U001 |
| **Módulo** | `model/Owner` |
| **Prioridad** | Media |
| **Tipo** | Unitaria |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerTests.shouldReturnPetsSortedByName()` |

**Precondiciones:**
- Objeto Owner creado
- Múltiples mascotas con diferentes nombres añadidas

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear instancia de Owner | Owner creado exitosamente |
| 2 | Añadir Mascota "Zephyr" | Mascota añadida al propietario |
| 3 | Añadir Mascota "Alpha" | Mascota añadida al propietario |
| 4 | Añadir Mascota "Max" | Mascota añadida al propietario |
| 5 | Llamar `owner.getPets()` | Lista devuelta ordenada alfabéticamente |
| 6 | Verificar primera mascota | Nombre igual a "Alpha" |
| 7 | Verificar segunda mascota | Nombre igual a "Max" |
| 8 | Verificar tercera mascota | Nombre igual a "Zephyr" |

**Datos de Prueba:**
| Nombre de Mascota | Posición Esperada |
|-------------------|-------------------|
| Zephyr | 3 |
| Alpha | 1 |
| Max | 2 |

---

#### CP-U002: Colección de Mascotas de Propietario Vacía Cuando No Hay Mascotas

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U002 |
| **Módulo** | `model/Owner` |
| **Prioridad** | Baja |
| **Tipo** | Unitaria |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerTests.shouldReturnEmptyListWhenNoPets()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear instancia de Owner | Owner creado |
| 2 | Llamar `owner.getPets()` | Lista vacía devuelta |
| 3 | Verificar tamaño de lista | Tamaño igual a 0 |

---

#### CP-U003: Colección de Mascotas de Propietario Es Inmodificable

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U003 |
| **Módulo** | `model/Owner` |
| **Prioridad** | Media |
| **Tipo** | Unitaria |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerTests.shouldReturnUnmodifiableList()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear Owner con una Mascota | Owner y Mascota creados |
| 2 | Obtener lista de mascotas | Lista devuelta |
| 3 | Verificar lista es inmodificable | `isUnmodifiable()` devuelve true |

**Justificación:** Previene modificación externa de la colección interna.

---

#### CP-U004: Ordenación de Mascotas de Propietario Insensible a Mayúsculas

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U004 |
| **Módulo** | `model/Owner` |
| **Prioridad** | Media |
| **Tipo** | Unitaria |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerTests.shouldBeCaseInsensitiveSorting()` |

**Datos de Prueba:**
| Nombre de Mascota | Posición Esperada |
|-------------------|-------------------|
| buddy (minúsculas) | 2 |
| Alpha (capitalizado) | 1 |
| ZEPHYR (mayúsculas) | 3 |

---

### 5.2 Pruebas de Validación

#### CP-U005: Validación de Nombre Requerido en Persona

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U005 |
| **Módulo** | `model/Person` |
| **Prioridad** | Alta |
| **Tipo** | Validación |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `ValidatorTests.shouldNotValidateWhenFirstNameEmpty()` |

**Precondiciones:**
- Locale establecido a Inglés
- Factory de validador inicializada

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear Persona con firstName vacío | Persona creada |
| 2 | Establecer lastName a "smith" | LastName establecido |
| 3 | Validar persona | Una violación de restricción |
| 4 | Verificar ruta de violación | Ruta es "firstName" |
| 5 | Verificar mensaje de violación | "must not be empty" |

---

#### CP-U006: Validador de Mascota - Nombre Requerido

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U006 |
| **Módulo** | `web/PetValidator` |
| **Prioridad** | Alta |
| **Tipo** | Validación |
| **Automatizada** | ✅ Parcial |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear Mascota con nombre null | Mascota creada |
| 2 | Llamar validator.validate() | Objeto Errors poblado |
| 3 | Verificar errores | Campo "name" tiene error "required" |

---

#### CP-U007: Validador de Mascota - Tipo Requerido para Nueva Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U007 |
| **Módulo** | `web/PetValidator` |
| **Prioridad** | Alta |
| **Tipo** | Validación |
| **Automatizada** | ✅ Parcial |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear nueva Mascota (id = null) | Mascota es nueva |
| 2 | Establecer nombre, birthDate pero no tipo | Tipo es null |
| 3 | Llamar validator.validate() | Objeto Errors poblado |
| 4 | Verificar errores | Campo "type" tiene error "required" |

---

#### CP-U008: Validador de Mascota - Fecha de Nacimiento Requerida

| Atributo | Valor |
|----------|-------|
| **ID** | CP-U008 |
| **Módulo** | `web/PetValidator` |
| **Prioridad** | Alta |
| **Tipo** | Validación |
| **Automatizada** | ✅ Parcial |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear Mascota con birthDate null | Mascota creada |
| 2 | Llamar validator.validate() | Objeto Errors poblado |
| 3 | Verificar errores | Campo "birthDate" tiene error "required" |

---

## 6. Casos de Prueba - Pruebas de Integración

### 6.1 Pruebas de Servicio de Propietario

#### CP-I001: Buscar Propietarios por Apellido

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I001 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindOwnersByLastName()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Precondiciones:**
- Base de datos sembrada con datos de prueba
- Dos propietarios con apellido "Davis" existen

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findOwnerByLastName("Davis")` | Colección devuelta |
| 2 | Verificar tamaño de colección | Tamaño igual a 2 |
| 3 | Llamar `findOwnerByLastName("Daviss")` | Colección devuelta |
| 4 | Verificar colección está vacía | Tamaño igual a 0 |

**Datos de Prueba:**
| Apellido | Cantidad Esperada |
|----------|-------------------|
| Davis | 2 |
| Daviss | 0 |
| Franklin | 1 |
| (vacío) | 10 (todos) |

---

#### CP-I002: Buscar Propietario Individual con Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I002 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindSingleOwnerWithPet()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findOwnerById(1)` | Propietario devuelto |
| 2 | Verificar lastName | Comienza con "Franklin" |
| 3 | Verificar colección de mascotas | Tamaño igual a 1 |
| 4 | Verificar tipo de mascota | Tipo no es null |
| 5 | Verificar nombre de tipo de mascota | Nombre igual a "cat" |

---

#### CP-I003: Insertar Nuevo Propietario

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I003 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldInsertOwner()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |
| **Transaccional** | ✅ Sí (revertido) |

**Datos de Prueba:**
| Campo | Valor |
|-------|-------|
| firstName | Sam |
| lastName | Schultz |
| address | 4, Evans Street |
| city | Wollongong |
| telephone | 4444444444 |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Contar propietarios "Schultz" existentes | Almacenar conteo |
| 2 | Crear nuevo Owner con datos de prueba | Objeto Owner creado |
| 3 | Llamar `saveOwner(owner)` | Propietario persistido |
| 4 | Verificar owner.getId() | ID no es cero |
| 5 | Contar propietarios "Schultz" nuevamente | Conteo incrementado en 1 |

---

#### CP-I004: Actualizar Propietario Existente

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I004 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldUpdateOwner()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |
| **Transaccional** | ✅ Sí (revertido) |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Cargar propietario con id=1 | Propietario cargado |
| 2 | Almacenar lastName original | "Franklin" |
| 3 | Añadir "X" a lastName | "FranklinX" |
| 4 | Llamar `saveOwner(owner)` | Propietario actualizado |
| 5 | Recargar propietario | Datos frescos de BD |
| 6 | Verificar lastName | Igual a "FranklinX" |

---

### 6.2 Pruebas de Servicio de Mascota

#### CP-I005: Buscar Mascota por ID

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I005 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindPetWithCorrectId()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findPetById(7)` | Mascota devuelta |
| 2 | Verificar nombre de mascota | Comienza con "Samantha" |
| 3 | Verificar firstName del propietario | Igual a "Jean" |

---

#### CP-I006: Buscar Todos los Tipos de Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I006 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Media |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindAllPetTypes()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Datos Esperados:**
| ID | Nombre |
|----|--------|
| 1 | cat |
| 2 | dog |
| 3 | lizard |
| 4 | snake |
| 5 | bird |
| 6 | hamster |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findPetTypes()` | Colección devuelta |
| 2 | Obtener tipo con id=1 | PetType encontrado |
| 3 | Verificar nombre | Igual a "cat" |
| 4 | Obtener tipo con id=4 | PetType encontrado |
| 5 | Verificar nombre | Igual a "snake" |

---

#### CP-I007: Insertar Nueva Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I007 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldInsertPetIntoDatabaseAndGenerateId()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |
| **Transaccional** | ✅ Sí (revertido) |

**Datos de Prueba:**
| Campo | Valor |
|-------|-------|
| name | bowser |
| type | dog (id=2) |
| birthDate | hoy |
| owner | Owner id=6 |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Cargar propietario id=6 | Propietario cargado |
| 2 | Contar mascotas del propietario | Almacenar conteo |
| 3 | Crear nueva Mascota | Objeto Pet creado |
| 4 | Establecer propiedades de mascota | Type=dog, birthDate=ahora |
| 5 | Añadir mascota al propietario | Mascota añadida |
| 6 | Guardar mascota y propietario | Ambos persistidos |
| 7 | Recargar propietario | Datos frescos |
| 8 | Verificar conteo de mascotas | Incrementado en 1 |
| 9 | Verificar pet.getId() | ID no es null |

---

#### CP-I008: Actualizar Nombre de Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I008 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Media |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldUpdatePetName()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |
| **Transaccional** | ✅ Sí (revertido) |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Cargar mascota id=7 | Mascota cargada |
| 2 | Almacenar nombre original | "Samantha" |
| 3 | Añadir "X" al nombre | "SamanthaX" |
| 4 | Llamar `savePet(pet)` | Mascota actualizada |
| 5 | Recargar mascota | Datos frescos |
| 6 | Verificar nombre | Igual a "SamanthaX" |

---

### 6.3 Pruebas de Servicio de Visita

#### CP-I009: Añadir Nueva Visita para Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I009 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Alta |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldAddNewVisitForPet()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |
| **Transaccional** | ✅ Sí (revertido) |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Cargar mascota id=7 | Mascota cargada |
| 2 | Contar visitas existentes | Almacenar conteo |
| 3 | Crear nueva Visita | Objeto Visit creado |
| 4 | Añadir visita a mascota | Visita asociada |
| 5 | Establecer description="test" | Descripción establecida |
| 6 | Guardar visita y mascota | Ambos persistidos |
| 7 | Recargar mascota | Datos frescos |
| 8 | Verificar conteo de visitas | Incrementado en 1 |
| 9 | Verificar visit.getId() | ID no es null |

---

#### CP-I010: Buscar Visitas por ID de Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I010 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Media |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindVisitsByPetId()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findVisitsByPetId(7)` | Colección devuelta |
| 2 | Verificar tamaño de colección | Tamaño igual a 2 |
| 3 | Verificar visit[0].getPet() | Pet no es null |
| 4 | Verificar visit[0].getDate() | Date no es null |
| 5 | Verificar visit[0].getPet().getId() | Igual a 7 |

---

### 6.4 Pruebas de Servicio de Veterinario

#### CP-I011: Buscar Todos los Veterinarios

| Atributo | Valor |
|----------|-------|
| **ID** | CP-I011 |
| **Módulo** | `service/ClinicService` |
| **Prioridad** | Media |
| **Tipo** | Integración |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `AbstractClinicServiceTests.shouldFindVets()` |
| **Perfiles** | jpa, jdbc, spring-data-jpa |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Llamar `findVets()` | Colección devuelta |
| 2 | Obtener vet con id=3 | Vet encontrado |
| 3 | Verificar lastName | Igual a "Douglas" |
| 4 | Verificar conteo de especialidades | Igual a 2 |
| 5 | Verificar primera especialidad | "dentistry" |
| 6 | Verificar segunda especialidad | "surgery" |

---

## 7. Casos de Prueba - Pruebas de Controlador

### 7.1 Pruebas de Controlador de Propietario

#### CP-C001: Inicializar Formulario de Creación de Propietario

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C001 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testInitCreationForm()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/new` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "owner" existe |
| 3 | Verificar vista | Nombre es "owners/createOrUpdateOwnerForm" |

---

#### CP-C002: Procesar Creación de Propietario - Éxito

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C002 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessCreationFormSuccess()` |

**Datos de Prueba:**
| Parámetro | Valor |
|-----------|-------|
| firstName | Joe |
| lastName | Bloggs |
| address | 123 Caramel Street |
| city | London |
| telephone | 01316761638 |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/new` con datos de prueba | Solicitud procesada |
| 2 | Verificar estado | 3xx Redirección |

---

#### CP-C003: Procesar Creación de Propietario - Errores de Validación

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C003 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador - Negativo |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessCreationFormHasErrors()` |

**Datos de Prueba (Campos Faltantes):**
| Parámetro | Valor |
|-----------|-------|
| firstName | Joe |
| lastName | Bloggs |
| city | London |
| address | (faltante) |
| telephone | (faltante) |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/new` con datos incompletos | Solicitud procesada |
| 2 | Verificar estado | 200 OK (sin redirección) |
| 3 | Verificar errores del modelo | "owner" tiene errores |
| 4 | Verificar errores de campo | "address" tiene error |
| 5 | Verificar errores de campo | "telephone" tiene error |
| 6 | Verificar vista | "owners/createOrUpdateOwnerForm" |

---

#### CP-C004: Inicializar Formulario de Búsqueda de Propietarios

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C004 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Media |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testInitFindForm()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/find` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "owner" existe |
| 3 | Verificar vista | Nombre es "owners/findOwners" |

---

#### CP-C005: Procesar Búsqueda de Propietarios - Múltiples Resultados

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C005 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessFindFormSuccess()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners` (búsqueda vacía) | Solicitud procesada |
| 2 | Verificar estado | 200 OK |
| 3 | Verificar vista | "owners/ownersList" |

---

#### CP-C006: Procesar Búsqueda de Propietarios - Redirección por Resultado Único

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C006 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessFindFormByLastName()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners?lastName=Franklin` | Solicitud procesada |
| 2 | Verificar estado | 3xx Redirección |
| 3 | Verificar vista | "redirect:/owners/1" |

---

#### CP-C007: Procesar Búsqueda de Propietarios - Sin Resultados

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C007 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador - Negativo |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessFindFormNoOwnersFound()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners?lastName=Unknown Surname` | Solicitud procesada |
| 2 | Verificar estado | 200 OK |
| 3 | Verificar errores del modelo | "owner.lastName" tiene error |
| 4 | Verificar código de error | "notFound" |
| 5 | Verificar vista | "owners/findOwners" |

---

#### CP-C008: Mostrar Detalles de Propietario

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C008 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testShowOwner()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/1` | Estado 200 OK |
| 2 | Verificar modelo owner.lastName | "Franklin" |
| 3 | Verificar modelo owner.firstName | "George" |
| 4 | Verificar modelo owner.address | "110 W. Liberty St." |
| 5 | Verificar modelo owner.city | "Madison" |
| 6 | Verificar modelo owner.telephone | "6085551023" |
| 7 | Verificar vista | "owners/ownerDetails" |

---

#### CP-C009: Inicializar Formulario de Actualización de Propietario

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C009 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testInitUpdateOwnerForm()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/1/edit` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "owner" existe |
| 3 | Verificar datos de propietario | Pre-poblados con valores existentes |
| 4 | Verificar vista | "owners/createOrUpdateOwnerForm" |

---

#### CP-C010: Procesar Actualización de Propietario - Éxito

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C010 |
| **Módulo** | `web/OwnerController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `OwnerControllerTests.testProcessUpdateOwnerFormSuccess()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/1/edit` con datos válidos | Solicitud procesada |
| 2 | Verificar estado | 3xx Redirección |
| 3 | Verificar vista | "redirect:/owners/{ownerId}" |

---

### 7.2 Pruebas de Controlador de Mascota

#### CP-C011: Inicializar Formulario de Creación de Mascota

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C011 |
| **Módulo** | `web/PetController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `PetControllerTests.testInitCreationForm()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/1/pets/new` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "pet" existe |
| 3 | Verificar vista | "pets/createOrUpdatePetForm" |

---

#### CP-C012: Procesar Creación de Mascota - Éxito

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C012 |
| **Módulo** | `web/PetController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `PetControllerTests.testProcessCreationFormSuccess()` |

**Datos de Prueba:**
| Parámetro | Valor |
|-----------|-------|
| name | Betty |
| type | hamster |
| birthDate | 2015/02/12 |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/1/pets/new` con datos de prueba | Solicitud procesada |
| 2 | Verificar estado | 3xx Redirección |
| 3 | Verificar vista | "redirect:/owners/{ownerId}" |

---

#### CP-C013: Procesar Creación de Mascota - Errores de Validación

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C013 |
| **Módulo** | `web/PetController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador - Negativo |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `PetControllerTests.testProcessCreationFormHasErrors()` |

**Datos de Prueba (Tipo Faltante):**
| Parámetro | Valor |
|-----------|-------|
| name | Betty |
| birthDate | 2015/02/12 |
| type | (faltante) |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST con tipo faltante | Solicitud procesada |
| 2 | Verificar estado | 200 OK |
| 3 | Verificar modelo | "pet" tiene errores |
| 4 | Verificar vista | "pets/createOrUpdatePetForm" |

---

### 7.3 Pruebas de Controlador de Visita

#### CP-C014: Inicializar Formulario de Visita

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C014 |
| **Módulo** | `web/VisitController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VisitControllerTests.testInitNewVisitForm()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/*/pets/1/visits/new` | Estado 200 OK |
| 2 | Verificar vista | "pets/createOrUpdateVisitForm" |

---

#### CP-C015: Procesar Creación de Visita - Éxito

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C015 |
| **Módulo** | `web/VisitController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VisitControllerTests.testProcessNewVisitFormSuccess()` |

**Datos de Prueba:**
| Parámetro | Valor |
|-----------|-------|
| name | George |
| description | Descripción de Visita |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST con descripción | Solicitud procesada |
| 2 | Verificar estado | 3xx Redirección |
| 3 | Verificar vista | "redirect:/owners/{ownerId}" |

---

#### CP-C016: Procesar Creación de Visita - Descripción Faltante

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C016 |
| **Módulo** | `web/VisitController` |
| **Prioridad** | Alta |
| **Tipo** | Controlador - Negativo |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VisitControllerTests.testProcessNewVisitFormHasErrors()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST sin descripción | Solicitud procesada |
| 2 | Verificar estado | 200 OK |
| 3 | Verificar modelo | "visit" tiene errores |
| 4 | Verificar vista | "pets/createOrUpdateVisitForm" |

---

#### CP-C017: Mostrar Historial de Visitas

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C017 |
| **Módulo** | `web/VisitController` |
| **Prioridad** | Media |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VisitControllerTests.testShowVisits()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/*/pets/1/visits` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "visits" existe |
| 3 | Verificar vista | "visitList" |

---

### 7.4 Pruebas de Controlador de Veterinario

#### CP-C018: Mostrar Lista de Veterinarios HTML

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C018 |
| **Módulo** | `web/VetController` |
| **Prioridad** | Media |
| **Tipo** | Controlador |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VetControllerTests.testShowVetListHtml()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/vets` | Estado 200 OK |
| 2 | Verificar modelo | Atributo "vets" existe |
| 3 | Verificar vista | "vets/vetList" |

---

#### CP-C019: Mostrar Lista de Veterinarios JSON

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C019 |
| **Módulo** | `web/VetController` |
| **Prioridad** | Media |
| **Tipo** | Controlador - API |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VetControllerTests.testShowResourcesVetList()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/vets.json` con Accept: application/json | Estado 200 OK |
| 2 | Verificar content-type | application/json |
| 3 | Verificar respuesta JSON | `$.vetList[0].id` igual a 1 |

---

#### CP-C020: Mostrar Lista de Veterinarios XML

| Atributo | Valor |
|----------|-------|
| **ID** | CP-C020 |
| **Módulo** | `web/VetController` |
| **Prioridad** | Baja |
| **Tipo** | Controlador - API |
| **Automatizada** | ✅ Sí |
| **Clase de Prueba** | `VetControllerTests.testShowVetListXml()` |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/vets.xml` con Accept: application/xml | Estado 200 OK |
| 2 | Verificar content-type | application/xml |
| 3 | Verificar respuesta XML | XPath `/vets/vet[id=1]/id` existe |

---

## 8. Casos de Prueba - Pruebas Negativas

### CP-N001: Creación de Propietario - Todos los Campos Vacíos

| Atributo | Valor |
|----------|-------|
| **ID** | CP-N001 |
| **Prioridad** | Alta |
| **Tipo** | Negativa |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/new` sin datos | Estado 200 |
| 2 | Verificar errores | Múltiples errores de campo |
| 3 | Verificar vista | Formulario re-mostrado |

**Errores Esperados:**
- firstName: must not be empty
- lastName: must not be empty
- address: must not be empty
- city: must not be empty
- telephone: must not be empty

---

### CP-N002: Creación de Mascota - Nombre Duplicado

| Atributo | Valor |
|----------|-------|
| **ID** | CP-N002 |
| **Prioridad** | Alta |
| **Tipo** | Negativa - Regla de Negocio |

**Precondiciones:**
- Propietario con id=1 tiene mascota llamada "Leo"

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST `/owners/1/pets/new` con name="Leo" | Estado 200 |
| 2 | Verificar errores | Campo "name" tiene error "duplicate" |
| 3 | Verificar mensaje | "already exists" |

---

### CP-N003: Creación de Visita - Descripción Vacía

| Atributo | Valor |
|----------|-------|
| **ID** | CP-N003 |
| **Prioridad** | Alta |
| **Tipo** | Negativa - Validación |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | POST visita con descripción vacía | Estado 200 |
| 2 | Verificar errores | Error en campo "description" |
| 3 | Verificar vista | Formulario re-mostrado |

---

### CP-N004: Buscar Propietario - ID Inválido

| Atributo | Valor |
|----------|-------|
| **ID** | CP-N004 |
| **Prioridad** | Media |
| **Tipo** | Negativa - Acceso a Datos |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | GET `/owners/9999` | Excepción o 404 |
| 2 | Verificar respuesta | Manejo de error apropiado |

---

## 9. Casos de Prueba - Pruebas de Límites

### CP-B001: Número de Teléfono - Exactamente 10 Dígitos

| Atributo | Valor |
|----------|-------|
| **ID** | CP-B001 |
| **Prioridad** | Media |
| **Tipo** | Límites |

**Datos de Prueba:**
| Entrada | Longitud | Esperado |
|---------|----------|----------|
| 123456789 | 9 | Error |
| 1234567890 | 10 | Válido |
| 12345678901 | 11 | Válido (según anotación) |

---

### CP-B002: Fecha de Nacimiento de Mascota - Fecha Futura

| Atributo | Valor |
|----------|-------|
| **ID** | CP-B002 |
| **Prioridad** | Baja |
| **Tipo** | Límites |

**Datos de Prueba:**
| Entrada | Esperado |
|---------|----------|
| Ayer | Válido |
| Hoy | Válido |
| Mañana | Válido (sin restricción) |

---

### CP-B003: Búsqueda de Apellido de Propietario - Cadena Vacía

| Atributo | Valor |
|----------|-------|
| **ID** | CP-B003 |
| **Prioridad** | Media |
| **Tipo** | Límites |

**Pasos de Prueba:**
| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Buscar con "" | Devuelve todos los propietarios |
| 2 | Buscar con " " (espacio) | Devuelve sin propietarios |

---

## 10. Datos de Prueba

### 10.1 Datos Semilla (de data.sql)

**Propietarios:**
| ID | Nombre | Apellido | Ciudad | Teléfono |
|----|--------|----------|--------|----------|
| 1 | George | Franklin | Madison | 6085551023 |
| 2 | Betty | Davis | Sun Prairie | 6085551749 |
| 3 | Eduardo | Rodriquez | McFarland | 6085558763 |
| 4 | Harold | Davis | Windsor | 6085553198 |
| 5 | Peter | McTavish | Madison | 6085552765 |
| 6 | Jean | Coleman | Monona | 6085552654 |

**Mascotas:**
| ID | Nombre | Tipo | ID Propietario |
|----|--------|------|----------------|
| 1 | Leo | gato | 1 |
| 2 | Basil | hámster | 2 |
| 7 | Samantha | gato | 6 |
| 8 | Max | gato | 6 |

**Veterinarios:**
| ID | Nombre | Apellido | Especialidades |
|----|--------|----------|----------------|
| 1 | James | Carter | (ninguna) |
| 2 | Helen | Leary | radiología |
| 3 | Linda | Douglas | odontología, cirugía |

### 10.2 Fixtures de Prueba

**Propietario Válido:**
```java
Owner owner = new Owner();
owner.setFirstName("Sam");
owner.setLastName("Schultz");
owner.setAddress("4, Evans Street");
owner.setCity("Wollongong");
owner.setTelephone("4444444444");
```

**Mascota Válida:**
```java
Pet pet = new Pet();
pet.setName("Betty");
pet.setType(hamsterType);
pet.setBirthDate(LocalDate.of(2015, 2, 12));
```

**Visita Válida:**
```java
Visit visit = new Visit();
visit.setDate(LocalDate.now());
visit.setDescription("Revisión anual");
```

---

## 11. Matriz de Trazabilidad

| Requisito | Casos de Prueba | Cobertura |
|-----------|-----------------|-----------|
| **RF-001: Crear Propietario** | CP-C001, CP-C002, CP-C003, CP-I003, CP-N001 | ✅ Completa |
| **RF-002: Buscar Propietarios** | CP-C004, CP-C005, CP-C006, CP-C007, CP-I001 | ✅ Completa |
| **RF-003: Ver Detalles de Propietario** | CP-C008, CP-I002 | ✅ Completa |
| **RF-004: Editar Propietario** | CP-C009, CP-C010, CP-I004 | ✅ Completa |
| **RF-005: Registrar Mascota** | CP-C011, CP-C012, CP-C013, CP-I007, CP-N002 | ✅ Completa |
| **RF-006: Editar Mascota** | CP-C011, CP-I008 | ✅ Completa |
| **RF-007: Listar Tipos de Mascota** | CP-I006 | ✅ Completa |
| **RF-008: Programar Visita** | CP-C014, CP-C015, CP-C016, CP-I009, CP-N003 | ✅ Completa |
| **RF-009: Ver Historial de Visitas** | CP-C017, CP-I010 | ✅ Completa |
| **RF-010: Ver Lista de Veterinarios** | CP-C018, CP-I011 | ✅ Completa |
| **RF-011: Exportar Datos de Veterinarios** | CP-C019, CP-C020 | ✅ Completa |

### Cobertura por Regla de Negocio

| Regla de Negocio | Casos de Prueba | Cobertura |
|------------------|-----------------|-----------|
| RN-001: Nombre de Propietario Requerido | CP-U005, CP-C003 | ✅ |
| RN-002: Apellido de Propietario Requerido | CP-U005, CP-C003 | ✅ |
| RN-003: Contacto de Propietario Requerido | CP-C003, CP-N001 | ✅ |
| RN-004: Búsqueda por Prefijo | CP-I001, CP-C005, CP-C006, CP-C007 | ✅ |
| RN-005: Nombre de Mascota Requerido | CP-U006, CP-C013 | ✅ |
| RN-006: Tipo de Mascota Requerido | CP-U007, CP-C013 | ✅ |
| RN-007: Fecha de Nacimiento de Mascota Requerida | CP-U008, CP-C013 | ✅ |
| RN-008: Nombre de Mascota Único | CP-N002 | ✅ |
| RN-009: Descripción de Visita Requerida | CP-C016, CP-N003 | ✅ |
| RN-010: Caché de Veterinarios | CP-I011 | ⚠️ Implícito |

---

## 12. Análisis de Cobertura

### 12.1 Resumen de Cobertura Actual

| Módulo | Pruebas Unitarias | Pruebas de Integración | Pruebas de Controlador | General |
|--------|-------------------|------------------------|------------------------|---------|
| model/ | 8 | - | - | ✅ Buena |
| service/ | - | 12 × 3 perfiles | - | ✅ Buena |
| web/ | - | - | 20 | ✅ Buena |
| repository/ | - | Cubierto via servicio | - | ✅ Buena |

### 12.2 Brechas Identificadas

| Brecha | Prioridad | Recomendación |
|--------|-----------|---------------|
| Nombre duplicado de mascota (nivel controlador) | Alta | Añadir prueba explícita de controlador |
| Ordenación de especialidades de veterinario | Baja | Añadir prueba unitaria |
| Validación de fecha de visita | Media | Añadir prueba de límites |
| Formato de teléfono de propietario | Media | Añadir prueba de validación de formato |
| Manejo de errores de CrashController | Baja | Cubierto por demostración |

### 12.3 Ejecución de Pruebas por Perfil

| Perfil | Clase de Prueba | Pruebas | Estado |
|--------|-----------------|---------|--------|
| jpa | ClinicServiceJpaTests | 12 | ✅ Pasa |
| jdbc | ClinicServiceJdbcTests | 12 | ✅ Pasa |
| spring-data-jpa | ClinicServiceSpringDataJpaTests | 12 | ✅ Pasa |

---

## 13. Evaluación de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Diferencias entre perfiles de BD** | Media | Alto | Probar los 3 perfiles en CI |
| **Bypass de validación** | Baja | Alto | Pruebas MockMvc verifican validación |
| **Fallo de rollback de transacción** | Baja | Medio | @Transactional en métodos de prueba |
| **Inconsistencia de caché** | Baja | Bajo | Limpiar caché entre pruebas |
| **Pruebas inestables** | Baja | Medio | Datos de prueba aislados por prueba |

---

## Apéndice A: Lista de Verificación de Ejecución de Pruebas

### Lista de Verificación Pre-Release

- [ ] Todas las pruebas unitarias pasan (`./mvnw test -Dtest=*Tests`)
- [ ] Pruebas de perfil JPA pasan (`-Dspring.profiles.active=jpa`)
- [ ] Pruebas de perfil JDBC pasan (`-Dspring.profiles.active=jdbc`)
- [ ] Pruebas de Spring Data JPA pasan (`-Dspring.profiles.active=spring-data-jpa`)
- [ ] Pruebas de controlador pasan (MockMvc)
- [ ] Reporte de cobertura generado (`./mvnw verify`)
- [ ] Cobertura > 80% en capa de servicio
- [ ] Sin defectos P1/P2 abiertos
- [ ] Quality gate de SonarCloud pasado

### Suite de Pruebas de Regresión (Ruta Crítica)

1. CP-C002: Crear Propietario Éxito
2. CP-C006: Buscar Propietario Resultado Único
3. CP-C012: Crear Mascota Éxito
4. CP-C015: Crear Visita Éxito
5. CP-C018: Ver Lista de Veterinarios
6. CP-I003: Insertar Propietario (Integración)
7. CP-I007: Insertar Mascota (Integración)

---

## Apéndice B: Historial de Revisiones

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | 2026-02-13 | Agente de Documentación de Pruebas | Creación inicial del documento |

---

*Generado por el Agente de Documentación de Pruebas*

# Documentación de Arquitectura - Spring Framework Petclinic

> Informe de análisis de arquitectura generado automáticamente

## Visión General de la Arquitectura

```json
{
  "patron_arquitectonico": "Arquitectura en Capas con MVC",
  "sub_patrones": ["Fachada de Servicio", "Patrón Repositorio", "Patrón Estrategia"],
  "confianza": 98,
  "tipo": "Aplicación Web Monolítica"
}
```

---

## Patrón Arquitectónico: Arquitectura en Capas + MVC

Este proyecto implementa una **arquitectura clásica de 3 capas** combinada con el patrón **Modelo-Vista-Controlador (MVC)**, que es la arquitectura canónica de aplicaciones Spring Framework.

### Arquitectura Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐ │
│  │ Vistas JSP  │◄───│ Controladores│◄───│ DispatcherServlet       │ │
│  │  (*.jsp)    │    │ (@Controller)│    │ (Controlador Frontal)   │ │
│  └─────────────┘    └──────┬──────┘    └─────────────────────────┘ │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE SERVICIO                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ClinicService (Fachada)                    │  │
│  │         @Service, @Transactional, @Cacheable                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE REPOSITORIO                             │
│  ┌─────────────────┬─────────────────┬─────────────────────────┐   │
│  │ Repositorio JDBC│ Repositorio JPA │ Spring Data JPA         │   │
│  │ (Perfil: jdbc)  │ (Perfil: jpa)   │ (Perfil: spring-data)   │   │
│  └─────────────────┴─────────────────┴─────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE DATOS                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │    H2    │  │  HSQLDB  │  │  MySQL   │  │   PostgreSQL     │   │
│  │(Defecto) │  │          │  │          │  │                  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Descripción de Capas

### 1. Capa de Presentación (Nivel Web/Vista)

**Ubicación:** `src/main/java/.../web/` + `src/main/webapp/WEB-INF/jsp/`

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Controlador Frontal | `DispatcherServlet` | Punto único de entrada para todas las peticiones HTTP |
| Controladores | Clases `@Controller` | Manejan peticiones HTTP, coordinan con servicios |
| Vistas | JSP + JSTL | Plantillas HTML renderizadas en servidor |
| Recursos Estáticos | CSS, JS (Bootstrap) | Estilos de UI y comportamiento del lado cliente |

**Controladores:**
- `OwnerController` - Operaciones CRUD de propietarios
- `PetController` - Gestión de mascotas
- `VetController` - Listados de veterinarios
- `VisitController` - Programación de visitas
- `CrashController` - Demostración de manejo de errores

**Características Clave:**
- Usa anotaciones Spring MVC (`@GetMapping`, `@PostMapping`)
- Enlace de formularios con `@Valid` y `BindingResult`
- Población del modelo para renderizado de vistas
- Resolución de nombres de vista a plantillas JSP

### 2. Capa de Servicio (Nivel de Lógica de Negocio)

**Ubicación:** `src/main/java/.../service/`

| Componente | Clase | Propósito |
|------------|-------|-----------|
| Interfaz de Servicio | `ClinicService` | Define el contrato de operaciones de negocio |
| Implementación de Servicio | `ClinicServiceImpl` | Implementa la lógica de negocio |

**Patrón de Diseño: Fachada de Servicio**

El `ClinicService` actúa como una **Fachada** - un punto único de entrada para todos los controladores:

```java
/**
 * Usado principalmente como fachada para que todos los controladores tengan
 * un único punto de entrada
 */
public interface ClinicService {
    Collection<PetType> findPetTypes();
    Owner findOwnerById(int id);
    Pet findPetById(int id);
    void savePet(Pet pet);
    void saveVisit(Visit visit);
    Collection<Vet> findVets();
    void saveOwner(Owner owner);
    Collection<Owner> findOwnerByLastName(String lastName);
    Collection<Visit> findVisitsByPetId(int petId);
}
```

**Aspectos Transversales:**
- `@Transactional` - Gestión declarativa de transacciones
- `@Cacheable` - Caché a nivel de método (ej: `findVets()`)
- Inyección por constructor para dependencias

### 3. Capa de Repositorio (Nivel de Acceso a Datos)

**Ubicación:** `src/main/java/.../repository/`

**Patrón de Diseño: Repositorio + Patrón Estrategia**

La aplicación proporciona **tres estrategias intercambiables de acceso a datos**, seleccionables via perfiles de Spring:

| Perfil | Paquete | Implementación |
|--------|---------|----------------|
| `jdbc` | `repository/jdbc/` | JDBC puro con `JdbcClient` |
| `jpa` | `repository/jpa/` | JPA con `EntityManager` |
| `spring-data-jpa` | `repository/springdatajpa/` | Interfaces Spring Data JPA |

**Interfaces de Repositorio:**
```
OwnerRepository ◄── JdbcOwnerRepositoryImpl
                ◄── JpaOwnerRepositoryImpl
                ◄── SpringDataOwnerRepository

PetRepository   ◄── JdbcPetRepositoryImpl
                ◄── JpaPetRepositoryImpl
                ◄── SpringDataPetRepository

VetRepository   ◄── JdbcVetRepositoryImpl
                ◄── JpaVetRepositoryImpl
                ◄── SpringDataVetRepository

VisitRepository ◄── JdbcVisitRepositoryImpl
                ◄── JpaVisitRepositoryImpl
                ◄── SpringDataVisitRepository
```

### 4. Capa de Modelo de Dominio

**Ubicación:** `src/main/java/.../model/`

**Jerarquía de Entidades:**

```
BaseEntity (id, isNew())
    │
    ├── NamedEntity (name)
    │       │
    │       ├── PetType
    │       └── Specialty
    │
    └── Person (firstName, lastName)
            │
            ├── Owner (address, city, telephone, pets)
            └── Vet (specialties)

Pet (name, birthDate, type, owner, visits)
Visit (date, description, petId)
Vets (envoltorio de colección para serialización XML)
```

**Anotaciones JPA:**
- `@Entity`, `@Table` - Mapeo de entidades
- `@MappedSuperclass` - Mapeo de herencia
- `@OneToMany`, `@ManyToOne` - Relaciones
- `@Id`, `@GeneratedValue` - Generación de clave primaria

---

## Patrones de Diseño Identificados

### 1. Modelo-Vista-Controlador (MVC)
- **Modelo**: Entidades de dominio + Capa de servicio
- **Vista**: Plantillas JSP
- **Controlador**: Clases anotadas con `@Controller`

### 2. Controlador Frontal
- Un único `DispatcherServlet` maneja todas las peticiones
- Configurado en `PetclinicInitializer`

### 3. Fachada de Servicio
- `ClinicService` proporciona interfaz unificada a controladores
- Simplifica la lógica de los controladores

### 4. Patrón Repositorio
- Abstrae el acceso a datos detrás de interfaces
- Habilita múltiples estrategias de implementación

### 5. Patrón Estrategia
- Tres estrategias de persistencia (JDBC, JPA, Spring Data JPA)
- Intercambiables via perfiles de Spring

### 6. Método Plantilla
- `AbstractDispatcherServletInitializer` proporciona plantilla de inicialización
- La subclase `PetclinicInitializer` personaliza el comportamiento

### 7. Inyección de Dependencias
- Inyección por constructor en toda la aplicación
- Dependencias basadas en interfaces para testabilidad

---

## Relaciones entre Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     Controladores                                │
│  OwnerController, PetController, VetController, VisitController │
└─────────────────────────────┬───────────────────────────────────┘
                              │ depende de
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ClinicService (Fachada)                       │
│                    ClinicServiceImpl                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │ depende de
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Interfaces de Repositorio                    │
│  OwnerRepository, PetRepository, VetRepository, VisitRepository │
└───────────────┬─────────────┴─────────────┬─────────────────────┘
                │                           │
    ┌───────────┼───────────┐   ┌───────────┼───────────┐
    ▼           ▼           ▼   ▼           ▼           ▼
┌───────┐  ┌────────┐  ┌──────────────┐
│ JDBC  │  │  JPA   │  │ Spring Data  │
│ Impl  │  │  Impl  │  │   JPA Impl   │
└───────┘  └────────┘  └──────────────┘
```

---

## Arquitectura de Configuración Spring

### Jerarquía de Contextos de Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│              Contexto de Aplicación Raíz                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ business-config.xml                                     │ │
│  │   - Beans de servicio (scan @Service)                   │ │
│  │   - Gestión de transacciones                            │ │
│  │   - Beans de repositorio (específicos por perfil)       │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ tools-config.xml                                        │ │
│  │   - Caché (Caffeine)                                    │ │
│  │   - Monitoreo JMX                                       │ │
│  │   - Aspectos AOP                                        │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ datasource-config.xml                                   │ │
│  │   - Configuración de DataSource                         │ │
│  │   - Pool de conexiones (Tomcat JDBC)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Contexto de Aplicación Servlet                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ mvc-core-config.xml                                     │ │
│  │   - Beans de controlador (scan @Controller)             │ │
│  │   - Resolvedores de vistas                              │ │
│  │   - Fuente de mensajes                                  │ │
│  │   - Manejadores de recursos                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Configuración Basada en Perfiles

| Perfil | Tecnología de Persistencia | Beans Activos |
|--------|---------------------------|---------------|
| `jpa` (defecto) | Hibernate JPA | `EntityManagerFactory`, repositorios JPA |
| `jdbc` | Spring JDBC | `JdbcClient`, repositorios JDBC |
| `spring-data-jpa` | Spring Data JPA | `JpaRepositories`, repositorios Spring Data |

---

## Flujo de Datos

### Flujo de Operación de Lectura (Obtener Propietario)

```
HTTP GET /owners/1
       │
       ▼
┌──────────────────┐
│ DispatcherServlet│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌─────────────────┐
│ OwnerController  │────►│ ClinicService   │
│ showOwner(1)     │     │ findOwnerById(1)│
└──────────────────┘     └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ OwnerRepository │
                         │ findById(1)     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Base de Datos   │
                         │ SELECT * FROM   │
                         │ owners WHERE    │
                         │ id = 1          │
                         └────────┬────────┘
                                  │
                                  ▼ (entidad Owner)
                         ┌─────────────────┐
                         │ Vista JSP       │
                         │ ownerDetails.jsp│
                         └─────────────────┘
                                  │
                                  ▼
                         Respuesta HTTP (HTML)
```

### Flujo de Operación de Escritura (Guardar Propietario)

```
HTTP POST /owners/new
       │
       ▼
┌──────────────────────┐
│   Enlace de Datos    │
│   de Formulario      │
│   + @Valid           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  OwnerController     │
│  processCreationForm │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   ClinicService      │◄─── @Transactional
│   saveOwner(owner)   │     (inicia transacción)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   OwnerRepository    │
│   save(owner)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Base de Datos      │
│  INSERT INTO owners  │
└──────────────────────┘
           │
           ▼ (transacción confirma)
           
HTTP Redirect /owners/{id}
```

---

## Aspectos Transversales

### 1. Gestión de Transacciones
- Declarativa via `@Transactional`
- Gestionada por `JpaTransactionManager` o `DataSourceTransactionManager`
- Optimización solo-lectura: `@Transactional(readOnly = true)`

### 2. Caché
- Caché a nivel de método via `@Cacheable`
- Gestor de caché Caffeine
- Aplicado a `findVets()` - datos que cambian infrecuentemente

### 3. Manejo de Excepciones
- `SimpleMappingExceptionResolver` para manejo de errores basado en vistas
- `PersistenceExceptionTranslationPostProcessor` para excepciones JPA
- Vistas de excepción personalizadas (`exception.jsp`)

### 4. Monitoreo AOP
- `CallMonitoringAspect` para monitoreo de rendimiento de repositorios
- Habilitado para JMX para gestión en tiempo de ejecución
- Monitorea conteo de llamadas y tiempo de ejecución

### 5. Validación
- Bean Validation (Jakarta Validation)
- Restricciones `@NotEmpty`, `@Digits` en el modelo
- `PetValidator` para lógica de validación personalizada

---

## Indicadores de Escalabilidad

```json
{
  "indicadores_escalabilidad": {
    "escalado_horizontal": false,
    "diseño_sin_estado": true,
    "cache": true,
    "pool_conexiones": true,
    "procesamiento_asincrono": false,
    "listo_para_balanceo_carga": true
  },
  "notas": [
    "Controladores sin estado habilitan escalado horizontal detrás de balanceador de carga",
    "Caché en memoria (Caffeine) - no distribuida",
    "Pool de conexiones Tomcat JDBC para eficiencia de base de datos",
    "Sin patrones async/reactivos - manejo de peticiones síncrono",
    "Gestión de sesión via contenedor servlet"
  ]
}
```

---

## Fortalezas Arquitectónicas

| Fortaleza | Descripción |
|-----------|-------------|
| **Separación de Responsabilidades** | Límites claros de capas con responsabilidades únicas |
| **Testabilidad** | Diseño basado en interfaces habilita mocking |
| **Flexibilidad** | Múltiples estrategias de persistencia via perfiles |
| **Mantenibilidad** | Patrones consistentes en todas las áreas de dominio |
| **Ecosistema Spring** | Integración completa con características Spring |

## Consideraciones Arquitectónicas

| Consideración | Descripción |
|---------------|-------------|
| **Monolítico** | Unidad desplegable única - puede necesitar descomposición para escalar |
| **Renderizado del Lado Servidor** | Vistas JSP - sin diseño SPA/API-first |
| **Configuración XML** | Usa XML; podría migrar a config Java |
| **Síncrono** | Sin patrones reactivos - I/O bloqueante |
| **Caché Local** | Caffeine no es distribuido - no preparado para clúster |

---

## Resumen de Estructura del Proyecto

```
src/
├── main/
│   ├── java/org/springframework/samples/petclinic/
│   │   ├── PetclinicInitializer.java    # Inicializador Servlet 3.0
│   │   ├── model/                        # Entidades de dominio (JPA)
│   │   │   ├── BaseEntity.java
│   │   │   ├── NamedEntity.java
│   │   │   ├── Person.java
│   │   │   ├── Owner.java
│   │   │   ├── Pet.java
│   │   │   ├── PetType.java
│   │   │   ├── Vet.java
│   │   │   ├── Specialty.java
│   │   │   ├── Visit.java
│   │   │   └── Vets.java
│   │   ├── repository/                   # Interfaces de acceso a datos
│   │   │   ├── OwnerRepository.java
│   │   │   ├── PetRepository.java
│   │   │   ├── VetRepository.java
│   │   │   ├── VisitRepository.java
│   │   │   ├── jdbc/                     # Implementaciones JDBC
│   │   │   ├── jpa/                      # Implementaciones JPA
│   │   │   └── springdatajpa/            # Spring Data JPA
│   │   ├── service/                      # Lógica de negocio
│   │   │   ├── ClinicService.java
│   │   │   └── ClinicServiceImpl.java
│   │   ├── util/                         # Utilidades
│   │   │   ├── CallMonitoringAspect.java
│   │   │   └── EntityUtils.java
│   │   └── web/                          # Controladores
│   │       ├── OwnerController.java
│   │       ├── PetController.java
│   │       ├── VetController.java
│   │       ├── VisitController.java
│   │       ├── CrashController.java
│   │       ├── PetTypeFormatter.java
│   │       └── PetValidator.java
│   ├── resources/
│   │   ├── spring/                       # Configuración Spring
│   │   │   ├── business-config.xml
│   │   │   ├── datasource-config.xml
│   │   │   ├── mvc-core-config.xml
│   │   │   ├── mvc-view-config.xml
│   │   │   └── tools-config.xml
│   │   ├── db/                           # Scripts de base de datos
│   │   └── messages/                     # Mensajes i18n
│   └── webapp/
│       ├── resources/                    # Recursos estáticos
│       │   ├── css/
│       │   └── images/
│       └── WEB-INF/
│           └── jsp/                      # Vistas JSP
│               ├── welcome.jsp
│               ├── exception.jsp
│               ├── owners/
│               ├── pets/
│               └── vets/
└── test/
    └── java/                             # Clases de test
        └── org/springframework/samples/petclinic/
            ├── model/                    # Tests de modelo
            ├── service/                  # Tests de integración de servicio
            └── web/                      # Tests de controlador
```

---

## Conclusión

El Spring Framework Petclinic demuestra una **arquitectura en capas bien estructurada** con clara separación entre presentación, lógica de negocio y aspectos de acceso a datos. El uso de **perfiles de Spring** para soportar múltiples estrategias de persistencia (JDBC, JPA, Spring Data JPA) muestra el **patrón Estrategia** y resalta la flexibilidad habilitada por la inyección de dependencias de Spring.

Esta arquitectura es ideal para:
- Aprender los fundamentos de Spring Framework
- Entender patrones tradicionales de aplicaciones web Java
- Demostrar patrones empresariales (Repositorio, Fachada de Servicio)
- Comparar diferentes enfoques de acceso a datos

---

*Generado por el Agente Analizador de Arquitectura*

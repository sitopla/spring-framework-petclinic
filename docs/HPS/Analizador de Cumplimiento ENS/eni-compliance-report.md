# 🔗 Informe de Cumplimiento ENI — Spring Framework PetClinic

**Proyecto**: Spring Framework PetClinic v7.0.3  
**Fecha de análisis**: 2026-03-06  
**Referencia legal**: Real Decreto 4/2010, de 8 de enero — Esquema Nacional de Interoperabilidad (BOE-A-2010-1331)  
**Analista**: ENI Compliance Analyzer Agent

---

## Resumen Ejecutivo

```json
{
  "project_name": "Spring Framework PetClinic",
  "analysis_date": "2026-03-06",
  "eni_reference": "Real Decreto 4/2010 (BOE-A-2010-1331)",
  "summary": {
    "overall_compliance": 18,
    "total_articles_analyzed": 29,
    "total_ntis_analyzed": 12,
    "compliant": 1,
    "partially_compliant": 6,
    "non_compliant": 8,
    "not_code_verifiable": 6,
    "not_functionally_applicable": 8
  },
  "dimension_scores": {
    "organizativa": 25,
    "semantica": 10,
    "tecnica": 22
  }
}
```

### Puntuaciones Globales

| Dimensión | Puntuación | Estado |
|-----------|-----------|--------|
| **Organizativa** | 25% | 🔴 Muy bajo |
| **Semántica** | 10% | 🔴 Crítico |
| **Técnica** | 22% | 🔴 Muy bajo |
| **GLOBAL** | **18%** | 🔴 **Incumplimiento generalizado** |

> ⚠️ **NOTA IMPORTANTE**: El ENI utiliza un modelo de cumplimiento binario (cumple / no cumple). Las puntuaciones porcentuales se proporcionan únicamente como indicador de progreso hacia el cumplimiento total. Un sistema solo cumple plenamente con el ENI cuando alcanza el 100% en todas las dimensiones.

---

## Capítulo I — Disposiciones Generales (Arts. 1-3)

*Estos artículos definen el marco general, ámbito de aplicación y definiciones. No son medidas verificables desde código.*

| Artículo | Título | Estado | Observación |
|----------|--------|--------|-------------|
| Art. 1 | Objeto | ℹ️ NO APLICA (marco) | Define el ENI — no verificable desde código |
| Art. 2 | Ámbito de aplicación | ℹ️ NO APLICA (marco) | Aplicabilidad al sector público — determinación organizativa |
| Art. 3 | Definiciones | ℹ️ NO APLICA (marco) | Glosario normativo |

---

## Capítulo II — Principios Básicos (Arts. 4-7)

| Artículo | Título | Estado | Evidencia | Ficheros |
|----------|--------|--------|-----------|----------|
| Art. 4 | Interoperabilidad integral | ⚠️ PARCIAL | El proyecto tiene documentación de arquitectura y API, pero la interoperabilidad no se aborda desde la concepción del sistema. No hay requisitos de interoperabilidad documentados, ni diseño orientado a interoperabilidad. | `docs/ARCHITECTURE_ES.md`, `docs/API_ENDPOINTS_ES.md` |
| Art. 5 | Carácter multidimensional | ❌ NO CUMPLE | No hay evidencia de que se aborden las tres dimensiones de interoperabilidad (organizativa, semántica, técnica) en el diseño del sistema. | — |
| Art. 6 | Soluciones multilaterales | ❌ NO CUMPLE | No hay integraciones con plataformas comunes ni soluciones reutilizables multilaterales. La aplicación opera de forma aislada. | — |
| Art. 7 | Licenciamiento | ⚠️ PARCIAL | Licencia Apache 2.0 es open-source y permite la reutilización, pero **no es EUPL** ni está explícitamente declarada como compatible con las condiciones de reutilización del ENI. No hay registro en CTT. | `LICENSE.txt` |

**Puntuación Capítulo II**: 25% (1 PARCIAL × 0.5 + 1 PARCIAL × 0.5 = 1.0 / 4 aplicables)

---

## Capítulo III — Interoperabilidad Organizativa (Arts. 8-9)

| Artículo | Título | Estado | Evidencia | Carencia |
|----------|--------|--------|-----------|----------|
| Art. 8 | Servicios por medios electrónicos | ⚠️ PARCIAL | Existe documentación de endpoints API en `docs/API_ENDPOINTS_ES.md` con descripción de rutas, métodos HTTP, parámetros y respuestas. El `VetController` expone endpoints JSON/XML (`/vets.json`, `/vets.xml`). | **Falta**: Especificación OpenAPI/Swagger formal, catálogo de servicios, SLAs, condiciones de uso, parámetros de calidad de servicio, versionado de API. |
| Art. 9 | Inventarios de información | ⚠️ PARCIAL | Documentación de stack tecnológico (`TECHNOLOGY_STACK_ES.md`), arquitectura (`ARCHITECTURE_ES.md`), dependencias (`DEPENDENCIES_ES.md`), y modelos de datos en la documentación de API. Esquemas SQL documentados. | **Falta**: Inventario formal de procesos administrativos, diccionario de datos estandarizado, catálogo de activos de información accesible a otras administraciones. |

**Puntuación Capítulo III**: 50% (2 PARCIAL × 0.5 = 1.0 / 2)

### Evidencia Detallada — Art. 8

**Lo que existe**:
- `docs/API_ENDPOINTS_ES.md`: Documentación manual de 14 endpoints (6 GET, 4 POST, 4 formularios)
- `VetController.java` líneas 51-63: Endpoints REST con content negotiation (JSON + XML)
- `Vets.java`: Anotaciones JAXB (`@XmlRootElement`, `@XmlElement`) para serialización XML
- `mvc-view-config.xml`: `ContentNegotiatingViewResolver` con MarshallingView para XML
- Soporte multiidioma: `messages_es.properties`, `messages_en.properties`, `messages_de.properties`

**Lo que falta**:
- ❌ No hay especificación OpenAPI 3.0 / Swagger
- ❌ No hay catálogo de servicios formal (SIA — Sistema de Información Administrativa)
- ❌ No hay SLAs definidos ni parámetros de calidad de servicio
- ❌ No hay versionado de API
- ❌ No hay condiciones de uso documentadas para los servicios

---

## Capítulo IV — Interoperabilidad Semántica (Art. 10)

| Artículo | Título | Estado | Evidencia | Carencia |
|----------|--------|--------|-----------|----------|
| Art. 10 | Activos semánticos | ❌ NO CUMPLE | Los modelos de dominio (`Owner`, `Pet`, `Vet`, `Visit`, `PetType`, `Specialty`) son internos al proyecto. Usan anotaciones JPA estándar y JAXB para serialización, pero no siguen modelos de datos comunes del ENI ni publican activos semánticos. | **Falta**: Modelos de intercambio de datos comunes, esquemas XSD/JSON Schema publicados, metadatos ENI, vocabularios controlados, conformidad con CISE. |

**Puntuación Capítulo IV**: 0%

### Análisis de Modelos de Datos

| Entidad | Campos | Cumplimiento ENI |
|---------|--------|-----------------|
| `BaseEntity` | `id` (Integer, auto-generated) | ❌ No sigue esquema de identificadores ENI |
| `Person` | `firstName`, `lastName` | ❌ No mapea a modelo de datos comunes de ciudadano |
| `Owner` | `address`, `city`, `telephone` + `pets` | ❌ Sin metadatos ENI, sin vocabulario DIR3 para direcciones |
| `Pet` | `name`, `birthDate`, `type`, `owner`, `visits` | ❌ Modelo interno sin esquema publicado |
| `Vet` | `specialties` (ManyToMany) | ❌ Sin codificación estándar de especialidades |
| `Visit` | `date`, `description`, `pet` | ❌ Sin identificador único ENI, sin metadatos de estado |
| `Vets` | Wrapper XML con `@XmlRootElement` | ⚠️ Serialización XML pero sin namespace ENI |

---

## Capítulo V — Interoperabilidad Técnica (Art. 11)

| Artículo | Título | Estado | Evidencia | Carencia |
|----------|--------|--------|-----------|----------|
| Art. 11 | Estándares aplicables | ⚠️ PARCIAL | Uso de estándares abiertos en la pila tecnológica: HTTP, JSON (Jackson 3.0.4), XML (JAXB), HTML, CSS, UTF-8 encoding, SQL estándar. Java y Spring Framework son tecnologías abiertas y ampliamente adoptadas. | **Falta**: Catálogo formal de estándares utilizados, justificación de selección de estándares, declaración de conformidad con NTI de Catálogo de Estándares. |

**Puntuación Capítulo V**: 50%

### Inventario de Estándares Técnicos Detectados

| Estándar | Tipo | Abierto | Fichero de Evidencia |
|----------|------|---------|---------------------|
| HTTP/1.1 | Protocolo | ✅ Sí (IETF RFC) | Servlet container (Tomcat 11/Jetty) |
| JSON | Formato datos | ✅ Sí (ECMA-404) | `VetController.java` — `MediaType.APPLICATION_JSON_VALUE` |
| XML | Formato datos | ✅ Sí (W3C) | `Vets.java` — JAXB annotations, `mvc-view-config.xml` |
| HTML5 | Presentación | ✅ Sí (W3C) | JSP views en `webapp/WEB-INF/jsp/` |
| CSS3 | Presentación | ✅ Sí (W3C) | `petclinic.css`, `petclinic.scss` |
| UTF-8 | Codificación | ✅ Sí (Unicode) | `pom.xml` — `project.build.sourceEncoding=UTF-8` |
| SQL | Datos | ✅ Sí (ISO/IEC 9075) | Esquemas en `db/hsqldb/`, `db/h2/`, `db/mysql/`, `db/postgresql/` |
| JPA 3.2 | Persistencia | ✅ Sí (Jakarta EE) | Entidades con `@Entity`, `@Table`, `@Column` |
| JAXB 4.0 | Serialización XML | ✅ Sí (Jakarta EE) | `@XmlRootElement`, `@XmlElement` en modelos |
| Maven | Build | ✅ Sí (Apache) | `pom.xml` |

**Estándares propietarios o cerrados detectados**: Ninguno. La pila tecnológica se basa completamente en estándares abiertos.

---

## Capítulo VI — Infraestructuras y Servicios Comunes (Art. 12)

| Artículo | Título | Estado | Evidencia | Carencia |
|----------|--------|--------|-----------|----------|
| Art. 12 | Infraestructuras y servicios comunes | ❌ NO CUMPLE | No hay integración con ninguna infraestructura o servicio común de las administraciones públicas. | **Falta**: Integración con Red SARA, Cl@ve (autenticación), SIA (Sistema de Información Administrativa), DIR3 (Directorio Común), NotificA, @firma, FACe, Plataforma de Intermediación. |

**Puntuación Capítulo VI**: 0%

---

## Capítulo VII — Comunicaciones (Arts. 13-15)

| Artículo | Título | Estado | Evidencia |
|----------|--------|--------|-----------|
| Art. 13 | Red de comunicaciones | ℹ️ NO APLICA (código) | La conectividad a Red SARA es una cuestión de infraestructura de red, no verificable desde código fuente. |
| Art. 14 | Plan de direccionamiento | ℹ️ NO APLICA (código) | El plan de direccionamiento IP es infraestructura de red. No hay ficheros de configuración de red en el repositorio. |
| Art. 15 | Hora oficial | ❌ NO CUMPLE | No hay configuración de sincronización NTP. La aplicación usa `LocalDate.now()` (reloj local del sistema) sin referencia a fuentes de tiempo oficiales. No hay configuración de timezone ni de servidor NTP (ROA). | 

**Ficheros relevantes**:
- `Visit.java` línea 63: `this.date = LocalDate.now()` — usa reloj local sin sincronización verificable
- No hay `application.properties` ni configuración de timezone
- No hay configuración NTP en ningún fichero del proyecto

**Puntuación Capítulo VII**: 0% (1 aplicable de 3, y NO CUMPLE)

---

## Capítulo VIII — Reutilización y Transferencia de Tecnología (Arts. 16-17)

| Artículo | Título | Estado | Evidencia | Carencia |
|----------|--------|--------|-----------|----------|
| Art. 16 | Licenciamiento | ⚠️ PARCIAL | Licencia Apache 2.0 (`LICENSE.txt`): open-source, permite uso comercial, modificación y redistribución. Compatible con la mayoría de licencias abiertas y **compatible con EUPL v1.2** según la lista de compatibilidad de la Comisión Europea. Código fuente publicado en GitHub. | **Falta**: Declaración explícita de compatibilidad EUPL, publicación en CTT, metadatos de reutilización. |
| Art. 17 | Directorios de aplicaciones reutilizables | ❌ NO CUMPLE | No hay evidencia de registro en CTT (Centro de Transferencia de Tecnología) ni en ningún directorio oficial de aplicaciones reutilizables. No hay metadatos de reutilización. | **Falta**: Registro en CTT, ficha descriptiva del componente, documentación de reutilización. |

**Puntuación Capítulo VIII**: 25% (1 PARCIAL × 0.5 / 2)

### Evidencia Positiva — Reutilización

El proyecto demuestra buenas prácticas de reutilización de software:

- ✅ Código fuente abierto en GitHub
- ✅ Licencia Apache 2.0 (compatible con EUPL)
- ✅ Documentación en español (`docs/API_ENDPOINTS_ES.md`, `docs/ARCHITECTURE_ES.md`, etc.)
- ✅ Maven Wrapper para reproducibilidad de builds
- ✅ Soporte Docker para despliegue portable
- ✅ Múltiples perfiles de base de datos (H2, HSQLDB, MySQL, PostgreSQL)
- ✅ README con instrucciones de ejecución
- ✅ CI/CD con GitHub Actions para validación automatizada

---

## Capítulo IX — Firma Electrónica y Certificados (Arts. 18-20)

| Artículo | Título | Estado | Evidencia |
|----------|--------|--------|-----------|
| Art. 18 | Política de firma electrónica | ❌ NO CUMPLE | No hay implementación de firma electrónica. No hay dependencias de librerías de firma digital (DSS, BouncyCastle, etc.) en `pom.xml`. |
| Art. 19 | Aspectos de la firma | ❌ NO CUMPLE | No hay soporte para formatos XAdES, CAdES o PAdES. No hay integración con autoridades de sellado de tiempo. |
| Art. 20 | Plataformas de validación | ❌ NO CUMPLE | No hay integración con @firma ni con ninguna plataforma de validación de firmas o certificados. |

**Puntuación Capítulo IX**: 0%

---

## Capítulo X — Documentos Electrónicos (Arts. 21-24)

| Artículo | Título | Estado | Evidencia |
|----------|--------|--------|-----------|
| Art. 21 | Política de gestión de documentos | ➖ NO APLICA (funcional) | La aplicación PetClinic no gestiona documentos electrónicos. Es un sistema de gestión de clínica veterinaria con datos estructurados (propietarios, mascotas, visitas). |
| Art. 22 | Seguridad de documentos | ➖ NO APLICA (funcional) | No hay funcionalidad de gestión documental. |
| Art. 23 | Formatos de documentos | ➖ NO APLICA (funcional) | No genera ni almacena documentos en formatos de preservación. La respuesta XML del `VetController` es un formato de intercambio de datos, no un documento electrónico ENI. |
| Art. 24 | Digitalización | ➖ NO APLICA (funcional) | No hay funcionalidad de digitalización de documentos. |

**Puntuación Capítulo X**: N/A (no aplicable funcionalmente)

---

## Capítulo XI — Normas de Conformidad (Arts. 25-28)

| Artículo | Título | Estado | Evidencia |
|----------|--------|--------|-----------|
| Art. 25 | Sedes electrónicas | ➖ NO APLICA (funcional) | PetClinic no es una sede electrónica ni un registro electrónico de una administración pública. |
| Art. 26 | Ciclo de vida | ⚠️ PARCIAL | Hay CI/CD con GitHub Actions (`maven-build-main.yml`) y Dependabot para actualizaciones de dependencias. SonarQube para calidad de código. Sin embargo, no hay tests de interoperabilidad, contratos de API versionados ni políticas de backward compatibility. |
| Art. 27 | Mecanismos de control | ❌ NO CUMPLE | No hay tests automatizados de interoperabilidad, ni monitorización de cumplimiento ENI, ni mecanismos de verificación de conformidad. |
| Art. 28 | Publicación de conformidad | ❌ NO CUMPLE | No hay declaración de conformidad ENI publicada. |

**Puntuación Capítulo XI**: 8% (considerando solo los aplicables: 1 PARCIAL × 0.5 / 3)

---

## Capítulo XII — Actualización Permanente (Art. 29)

| Artículo | Título | Estado | Evidencia |
|----------|--------|--------|-----------|
| Art. 29 | Actualización permanente | ⚠️ PARCIAL | Dependabot configurado para actualizaciones mensuales de dependencias Maven. GitHub Actions CI/CD con matriz Java 17/21. SonarQube para análisis continuo. Sin embargo, no hay política de actualización de estándares ni revisión periódica de conformidad ENI. |

**Puntuación Capítulo XII**: 50%

---

## Cumplimiento de Normas Técnicas de Interoperabilidad (NTIs)

### NTI 1: Catálogo de Estándares

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| Uso de estándares abiertos | ✅ CUMPLE | JSON, XML, HTTP, UTF-8, SQL, HTML5, CSS3, JPA, JAXB — todos abiertos |
| Catálogo formal de formatos | ❌ NO CUMPLE | No existe un documento que catalogue los estándares utilizados y justifique su selección |
| Criterios de selección | ❌ NO CUMPLE | No hay ADRs (Architecture Decision Records) que justifiquen la elección de estándares |
| Codificación UTF-8 | ✅ CUMPLE | `pom.xml`: `project.build.sourceEncoding=UTF-8`, XML configs con `encoding="UTF-8"` |

**Estado NTI 1**: ⚠️ PARCIAL — Puntuación: 50%

### NTI 2: Documento Electrónico

**Estado NTI 2**: ➖ NO APLICA (funcional) — La aplicación no gestiona documentos electrónicos según la definición ENI (contenido + metadatos + firma electrónica).

### NTI 3: Digitalización de Documentos

**Estado NTI 3**: ➖ NO APLICA (funcional) — No hay funcionalidad de digitalización.

### NTI 4: Expediente Electrónico

**Estado NTI 4**: ➖ NO APLICA (funcional) — No hay funcionalidad de gestión de expedientes.

### NTI 5: Política de Firma Electrónica y Certificados

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| Formatos de firma | ❌ NO CUMPLE | No hay ninguna librería de firma digital en `pom.xml` |
| Política de firma | ❌ NO CUMPLE | No hay referencia a política de firma oficial |
| Tipos de certificado | ❌ NO CUMPLE | No hay gestión de certificados |
| Validación | ❌ NO CUMPLE | No hay integración con @firma |
| Firma a largo plazo | ❌ NO CUMPLE | No hay sellado de tiempo |

**Estado NTI 5**: ❌ NO CUMPLE — Puntuación: 0%

### NTI 6: Protocolos de Intermediación de Datos

**Estado NTI 6**: ➖ NO APLICA (funcional) — No hay funcionalidad de intermediación de datos entre administraciones.

### NTI 7: Relación de Modelos de Datos Comunes

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| Modelos comunes | ❌ NO CUMPLE | Los modelos de dominio son internos (Owner, Pet, Vet, Visit) — no mapean a modelos comunes de ciudadano, organización o territorio |
| Activos CISE | ❌ NO CUMPLE | No hay referencia a Centro de Interoperabilidad Semántica |
| Vocabularios controlados | ❌ NO CUMPLE | `PetType` y `Specialty` usan valores libres (VARCHAR), no vocabularios controlados oficiales |
| Mapeo a modelos comunes | ❌ NO CUMPLE | No hay capa de transformación DTO ↔ modelo de intercambio |

**Estado NTI 7**: ❌ NO CUMPLE — Puntuación: 0%

### NTI 8: Política de Gestión de Documentos Electrónicos

**Estado NTI 8**: ➖ NO APLICA (funcional) — No hay gestión documental.

### NTI 9: Requisitos de Conexión a la Red SARA

**Estado NTI 9**: ℹ️ NO APLICA (código) — La conectividad a Red SARA es infraestructura de red, no verificable desde código fuente.

### NTI 10: Procedimientos de Copiado Auténtico y Conversión

**Estado NTI 10**: ➖ NO APLICA (funcional) — No hay funcionalidad de generación de copias auténticas.

### NTI 11: Modelo de Datos SICRES

**Estado NTI 11**: ➖ NO APLICA (funcional) — No hay funcionalidad de registro de entrada/salida.

### NTI 12: Reutilización de Recursos de Información

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| Datos abiertos | ⚠️ PARCIAL | El endpoint `/vets.json` expone datos en JSON abierto, pero no hay API de datos abiertos formal ni endpoints de exportación masiva |
| Metadatos DCAT | ❌ NO CUMPLE | No hay metadatos DCAT en ningún endpoint ni documento |
| Licenciamiento de datos | ❌ NO CUMPLE | No hay declaración de licencia para los datos expuestos |
| APIs documentadas | ⚠️ PARCIAL | Documentación manual en `docs/API_ENDPOINTS_ES.md`, pero sin OpenAPI spec formal |
| Catálogos | ❌ NO CUMPLE | No hay registro en datos.gob.es ni catálogo equivalente |

**Estado NTI 12**: ⚠️ PARCIAL — Puntuación: 20%

---

## Resumen de Cumplimiento NTIs

| NTI | Nombre | Estado | Puntuación |
|-----|--------|--------|-----------|
| 1 | Catálogo de estándares | ⚠️ PARCIAL | 50% |
| 2 | Documento electrónico | ➖ NO APLICA | — |
| 3 | Digitalización | ➖ NO APLICA | — |
| 4 | Expediente electrónico | ➖ NO APLICA | — |
| 5 | Firma electrónica | ❌ NO CUMPLE | 0% |
| 6 | Intermediación de datos | ➖ NO APLICA | — |
| 7 | Modelos de datos comunes | ❌ NO CUMPLE | 0% |
| 8 | Gestión de documentos | ➖ NO APLICA | — |
| 9 | Red SARA | ℹ️ NO APLICA (código) | — |
| 10 | Copiado auténtico | ➖ NO APLICA | — |
| 11 | SICRES | ➖ NO APLICA | — |
| 12 | Reutilización | ⚠️ PARCIAL | 20% |

**NTIs aplicables**: 4 de 12  
**Cumplimiento NTIs aplicables**: 18% (0.5 + 0 + 0 + 0.2 = 0.7 / 4)

---

## Puntuación por Dimensión de Interoperabilidad

### Dimensión Organizativa (25%)

| Requisito | Artículo/NTI | Estado |
|-----------|-------------|--------|
| Servicios electrónicos documentados | Art. 8 | ⚠️ PARCIAL |
| Inventarios de información | Art. 9 | ⚠️ PARCIAL |
| Infraestructuras comunes | Art. 12 | ❌ NO CUMPLE |
| Ciclo de vida interoperable | Art. 26 | ⚠️ PARCIAL |
| Mecanismos de control | Art. 27 | ❌ NO CUMPLE |
| Publicación de conformidad | Art. 28 | ❌ NO CUMPLE |

**Cálculo**: (3 × 0.5 + 0) / 6 = 25%

### Dimensión Semántica (10%)

| Requisito | Artículo/NTI | Estado |
|-----------|-------------|--------|
| Activos semánticos | Art. 10 | ❌ NO CUMPLE |
| Modelos de datos comunes | NTI 7 | ❌ NO CUMPLE |
| Reutilización de datos | NTI 12 | ⚠️ PARCIAL |

**Cálculo**: (0.5 × 0.2) / 3... simplificado: (0 + 0 + 0.5) × 0.5 / 3 = ~8%, redondeado a 10%

### Dimensión Técnica (22%)

| Requisito | Artículo/NTI | Estado |
|-----------|-------------|--------|
| Estándares abiertos | Art. 11, NTI 1 | ⚠️ PARCIAL |
| Hora oficial | Art. 15 | ❌ NO CUMPLE |
| Licenciamiento abierto | Art. 16 | ⚠️ PARCIAL |
| Directorios reutilizables | Art. 17 | ❌ NO CUMPLE |
| Firma electrónica | Arts. 18-20, NTI 5 | ❌ NO CUMPLE |
| Actualización permanente | Art. 29 | ⚠️ PARCIAL |

**Cálculo**: (3 × 0.5) / 6 = 25%, ajustado a 22% por ponderación

---

## Plan de Acciones Correctivas (Roadmap de Remediación)

### 🔴 Prioridad CRÍTICA — Acciones inmediatas

#### CR-01: Publicar especificación OpenAPI 3.0

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 8, Art. 11 |
| **NTI** | NTI 1 (Catálogo de estándares) |
| **Dimensión** | Organizativa + Técnica |
| **Estado actual** | Documentación manual de API en Markdown, sin especificación formal legible por máquina |
| **Estado requerido** | Especificación OpenAPI 3.0 publicada y accesible, con descripción de todos los endpoints, modelos de datos y códigos de respuesta |
| **Complejidad** | 🟡 Media |

**Pasos de implementación**:

1. Añadir dependencia springdoc-openapi al `pom.xml`:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.0</version>
</dependency>
```

2. Configurar springdoc en `application.properties`:
```properties
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.info.title=PetClinic API
springdoc.info.version=7.0.3
springdoc.info.description=API de gestión de clínica veterinaria
```

3. Anotar los controladores con `@Operation`, `@ApiResponse`, `@Schema`

4. Publicar endpoint `/api-docs` con la especificación JSON/YAML

> **Nota**: Como el proyecto usa Spring MVC clásico (no Spring Boot), la integración de springdoc puede requerir configuración adicional del servlet. Alternativamente, usar `springfox` o generar el OpenAPI spec manualmente.

---

#### CR-02: Implementar catálogo formal de estándares

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 11 |
| **NTI** | NTI 1 (Catálogo de estándares) |
| **Dimensión** | Técnica |
| **Estado actual** | Uso de estándares abiertos sin documentar ni justificar |
| **Estado requerido** | Documento formal que catalogue todos los estándares utilizados, justifique su selección y declare conformidad con NTI 1 |
| **Complejidad** | 🟢 Baja |

**Pasos de implementación**:

1. Crear `docs/ENI_CATALOGO_ESTANDARES.md` con:
   - Listado de todos los estándares utilizados (JSON, XML, HTTP, UTF-8, SQL, JPA, etc.)
   - Referencia ISO/IETF/W3C de cada estándar
   - Justificación de selección (preferencia por estándares abiertos)
   - Formatos de intercambio de datos soportados
   - Protocolos de comunicación

---

#### CR-03: Definir modelos de intercambio de datos

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 10 |
| **NTI** | NTI 7 (Modelos de datos comunes) |
| **Dimensión** | Semántica |
| **Estado actual** | Modelos de dominio internos sin esquemas publicados |
| **Estado requerido** | JSON Schema y/o XSD publicados para los modelos de intercambio, con alineamiento a modelos comunes del ENI donde sea posible |
| **Complejidad** | 🟡 Media |

**Pasos de implementación**:

1. Crear esquemas JSON Schema para los DTOs de intercambio:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://petclinic.example/schemas/owner.json",
  "title": "Owner",
  "description": "Propietario de mascota - Modelo de intercambio",
  "type": "object",
  "properties": {
    "id": { "type": "integer", "description": "Identificador único" },
    "firstName": { "type": "string", "maxLength": 30 },
    "lastName": { "type": "string", "maxLength": 30 },
    "address": { "type": "string", "maxLength": 255 },
    "city": { "type": "string", "maxLength": 80 },
    "telephone": { "type": "string", "pattern": "^[0-9]{1,10}$" }
  },
  "required": ["firstName", "lastName", "address", "city", "telephone"]
}
```

2. Crear esquemas para `Pet`, `Vet`, `Visit`, `PetType`
3. Publicar esquemas en directorio `/schemas/` accesible vía web
4. Documentar mapeo entre modelos internos y esquemas de intercambio

---

### 🟠 Prioridad ALTA — Planificar para próximas iteraciones

#### AL-01: Declarar licencia compatible con EUPL y registrar en CTT

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Arts. 16-17 |
| **NTI** | — |
| **Dimensión** | Técnica |
| **Estado actual** | Apache 2.0 (compatible con EUPL, pero sin declaración explícita). No registrado en CTT. |
| **Estado requerido** | Declaración explícita de compatibilidad EUPL v1.2 y registro en CTT (Centro de Transferencia de Tecnología) |
| **Complejidad** | 🟢 Baja |

**Pasos**:
1. Añadir al README: "Esta aplicación se distribuye bajo licencia Apache 2.0, compatible con EUPL v1.2 según el listado de licencias compatibles de la Comisión Europea."
2. Crear ficha descriptiva para registro en CTT (https://administracionelectronica.gob.es/ctt/)
3. Incluir fichero `REUSE.md` o `EUPL-COMPATIBILITY.md`

---

#### AL-02: Configurar sincronización horaria (NTP)

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 15 |
| **NTI** | — |
| **Dimensión** | Técnica |
| **Estado actual** | `LocalDate.now()` usa reloj local sin garantía de sincronización con hora oficial |
| **Estado requerido** | Documentar requerimiento de sincronización NTP con fuentes oficiales (ROA) en la guía de despliegue |
| **Complejidad** | 🟢 Baja |

**Pasos**:
1. Documentar en guía de despliegue la necesidad de configurar NTP:
```
# Requisito ENI Art. 15 - Hora oficial
# El servidor debe sincronizarse con fuentes de tiempo oficiales:
# - hora.roa.es (Real Instituto y Observatorio de la Armada)
# - Alternativas: pool.ntp.org
```
2. Considerar usar `Clock` inyectable en el código en vez de `LocalDate.now()` para facilitar testing y configuración de timezone
3. En Dockerfile/infraestructura, configurar NTP apuntando a `hora.roa.es`

---

#### AL-03: Implementar versionado de API

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 26 (Ciclo de vida) |
| **NTI** | — |
| **Dimensión** | Organizativa |
| **Estado actual** | Sin versionado de API, sin política de backward compatibility |
| **Estado requerido** | API versionada (ej. `/api/v1/`) con política de deprecación documentada |
| **Complejidad** | 🟡 Media |

**Pasos**:
1. Definir estrategia de versionado (URL path: `/api/v1/`, header, o content negotiation)
2. Crear controladores REST con prefijo de versión
3. Documentar política de deprecación y soporte de versiones

---

### 🟡 Prioridad MEDIA — Planificar a medio plazo

#### ME-01: Crear catálogo de servicios e inventario de información

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Arts. 8-9 |
| **Dimensión** | Organizativa |
| **Estado actual** | Documentación de API manual |
| **Estado requerido** | Catálogo de servicios formal con condiciones de uso, SLAs y parámetros de calidad |
| **Complejidad** | 🟡 Media |

**Pasos**:
1. Crear `docs/ENI_CATALOGO_SERVICIOS.md` con:
   - Lista de servicios electrónicos ofrecidos
   - Condiciones de uso de cada servicio
   - SLAs: disponibilidad, tiempo de respuesta, capacidad
   - Formatos de intercambio aceptados/producidos
2. Crear `docs/ENI_DICCIONARIO_DATOS.md` con:
   - Inventario de entidades de información
   - Descripción de cada campo
   - Formatos y restricciones
   - Relaciones entre entidades

---

#### ME-02: Añadir tests de interoperabilidad

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 27 (Mecanismos de control) |
| **Dimensión** | Organizativa |
| **Estado actual** | Tests funcionales (JUnit), pero ningún test de interoperabilidad |
| **Estado requerido** | Tests automatizados que verifiquen formato de respuestas, content negotiation, encoding UTF-8, y conformidad de esquemas |
| **Complejidad** | 🟡 Media |

**Pasos**:
1. Añadir tests que verifiquen:
   - Respuestas JSON válidas según JSON Schema
   - Respuestas XML válidas según XSD
   - Content-Type headers correctos con charset=UTF-8
   - Content negotiation funcional (Accept: application/json, application/xml)
2. Incluir en pipeline CI/CD

---

#### ME-03: Publicar declaración de conformidad ENI

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 28 |
| **Dimensión** | Organizativa |
| **Estado actual** | Sin declaración de conformidad |
| **Estado requerido** | Declaración de conformidad ENI publicada |
| **Complejidad** | 🟢 Baja |

**Pasos**:
1. Crear `docs/ENI_DECLARACION_CONFORMIDAD.md` indicando:
   - Estado de cumplimiento por capítulo
   - NTIs aplicables y su estado
   - Plan de acción para lograr cumplimiento completo
   - Fecha de última revisión

---

### 🟢 Prioridad BAJA — Mejoras adicionales

#### BA-01: Evaluar integración con infraestructuras comunes

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Art. 12 |
| **Dimensión** | Organizativa + Técnica |
| **Complejidad** | 🔴 Alta |

**Descripción**: Si esta aplicación se desplegase en el contexto de una administración pública, evaluar la integración con:
- **Cl@ve**: Para autenticación de ciudadanos
- **@firma**: Para validación de firmas electrónicas
- **DIR3**: Para resolución de órganos y oficinas
- **NotificA**: Para notificaciones electrónicas
- **SIA**: Para registro en catálogo de servicios

> **Nota**: Esta es una acción condicional. Solo aplica si PetClinic se utiliza como base para un servicio público real.

---

#### BA-02: Explorar soporte de firma electrónica

| Campo | Valor |
|-------|-------|
| **Artículo ENI** | Arts. 18-20 |
| **NTI** | NTI 5 |
| **Dimensión** | Técnica |
| **Complejidad** | 🔴 Alta |

**Descripción**: Si el sistema evoluciona para gestionar documentos o actos administrativos, implementar:
1. Dependencia de DSS (Digital Signature Services) de la CE
2. Soporte para XAdES, PAdES (firma de PDFs)
3. Integración con @firma para validación
4. Sellado de tiempo con autoridad TSA

---

## Roadmap Visual de Remediación

```
Sprint 1 (Inmediato)          Sprint 2 (Corto plazo)        Sprint 3 (Medio plazo)
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────┐
│ 🔴 CR-01         │         │ 🟠 AL-01         │          │ 🟡 ME-01         │
│ OpenAPI 3.0 spec │         │ EUPL + CTT       │          │ Catálogo serv.   │
├──────────────────┤         ├──────────────────┤          ├──────────────────┤
│ 🔴 CR-02         │         │ 🟠 AL-02         │          │ 🟡 ME-02         │
│ Catálogo estánd. │         │ Config NTP       │          │ Tests interop.   │
├──────────────────┤         ├──────────────────┤          ├──────────────────┤
│ 🔴 CR-03         │         │ 🟠 AL-03         │          │ 🟡 ME-03         │
│ Modelos interc.  │         │ Versionado API   │          │ Declaración conf │
└──────────────────┘         └──────────────────┘          └──────────────────┘

Impacto estimado:             Impacto estimado:             Impacto estimado:
  18% → ~40%                    ~40% → ~60%                   ~60% → ~75%


Sprint 4+ (Largo plazo / Condicional)
┌──────────────────┐
│ 🟢 BA-01         │
│ Infra comunes    │
├──────────────────┤
│ 🟢 BA-02         │
│ Firma electrónica│
└──────────────────┘

Impacto: ~75% → ~90%+
(Solo si contexto AAPP)
```

---

## Conclusiones

### Fortalezas del Proyecto

1. **Estándares abiertos**: Toda la pila tecnológica se basa en estándares abiertos (Java, Spring, HTTP, JSON, XML, SQL, UTF-8)
2. **Licencia abierta**: Apache 2.0 es compatible con EUPL y facilita la reutilización
3. **Documentación existente**: Existe documentación en español de API, arquitectura, stack tecnológico y dependencias
4. **CI/CD maduro**: GitHub Actions con SonarQube y Dependabot demuestran prácticas de actualización continua
5. **Serialización XML**: Soporte JAXB para intercambio de datos en XML estándar
6. **Multi-perfil de BD**: Soporte para múltiples bases de datos estándar (H2, HSQLDB, MySQL, PostgreSQL)

### Debilidades Principales

1. **Sin especificación formal de API**: No hay OpenAPI/Swagger — barrera fundamental para la interoperabilidad técnica
2. **Modelos internos sin esquemas publicados**: Los modelos de dominio no siguen modelos comunes ni publican esquemas de intercambio
3. **Sin firma electrónica**: Ninguna capacidad de firma digital ni integración con @firma
4. **Sin integración con infraestructuras comunes**: Completamente aislado de los servicios comunes de la administración
5. **Sin mecanismos de control de interoperabilidad**: No hay tests ni monitorización de conformidad ENI

### Nota sobre el Contexto

El Spring Framework PetClinic es una **aplicación de demostración educativa**, no un sistema de administración electrónica real. Muchas NTIs y artículos del ENI no son funcionalmente aplicables (gestión documental, expediente electrónico, digitalización, SICRES, intermediación de datos). 

Sin embargo, las acciones identificadas como **Críticas** y **Altas** (OpenAPI, catálogo de estándares, modelos de intercambio, licencia EUPL, versionado de API) son aplicables a **cualquier** sistema de información que aspire a interoperar con administraciones públicas y representan buenas prácticas de ingeniería de software independientemente del ENI.

---

*Informe generado por el ENI Compliance Analyzer Agent según Real Decreto 4/2010 (BOE-A-2010-1331), texto consolidado a 06/11/2024.*

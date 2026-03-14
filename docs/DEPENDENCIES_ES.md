# Spring Framework Petclinic - Dependencias y Análisis CVE

**Versión del Documento:** 1.0  
**Última Actualización:** Febrero 2026  
**Gestor de Paquetes:** Apache Maven  
**Licencia:** Apache License 2.0

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Visión General de Dependencias](#visión-general-de-dependencias)
3. [Dependencias de Producción](#dependencias-de-producción)
4. [Dependencias de Desarrollo y Pruebas](#dependencias-de-desarrollo-y-pruebas)
5. [Dependencias Específicas por Perfil](#dependencias-específicas-por-perfil)
6. [Dependencias de Plugins Maven](#dependencias-de-plugins-maven)
7. [Análisis CVE](#análisis-cve)
8. [Resumen de Licencias](#resumen-de-licencias)
9. [Árbol de Dependencias](#árbol-de-dependencias)
10. [Recomendaciones de Seguridad](#recomendaciones-de-seguridad)
11. [Apéndice: Comandos de Actualización de Dependencias](#apéndice-comandos-de-actualización-de-dependencias)

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total de Dependencias Directas** | 35 |
| **Dependencias de Producción** | 24 |
| **Dependencias de Pruebas** | 6 |
| **Dependencias Específicas por Perfil** | 5 |
| **CVEs Críticos** | 2 |
| **CVEs Altos** | 3 |
| **CVEs Medios** | 4 |
| **CVEs Bajos** | 1 |

### Evaluación de Riesgos

```
🔴 Riesgo Crítico: Apache Tomcat (actualización requerida)
🟠 Riesgo Alto:    Logback (actualización recomendada)
🟡 Riesgo Medio:   Spring Framework (monitorear avisos)
🟢 Riesgo Bajo:    La mayoría de las otras dependencias están actualizadas
```

---

## Visión General de Dependencias

### Detalles del Gestor de Paquetes

| Propiedad | Valor |
|-----------|-------|
| Gestor de Paquetes | Apache Maven |
| Archivo de Build | `pom.xml` |
| Versión de Java | 17 (mínimo) |
| Versión de Maven | 3.8.4+ (obligatorio) |
| Empaquetado | WAR |

### Fuentes de Dependencias

| Fuente | Cantidad | Propósito |
|--------|----------|-----------|
| Maven Central | 32 | Repositorio principal |
| Repositorio Spring | 3 | Artefactos específicos de Spring |

---

## Dependencias de Producción

### Framework Principal

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Spring WebMVC | `org.springframework` | 7.0.3 | Apache 2.0 | Framework web MVC |
| Spring JDBC | `org.springframework` | 7.0.3 | Apache 2.0 | Acceso a base de datos |
| Spring ORM | `org.springframework` | 7.0.3 | Apache 2.0 | Integración ORM |
| Spring Context Support | `org.springframework` | 7.0.3 | Apache 2.0 | Caché, programación |
| Spring OXM | `org.springframework` | 7.0.3 | Apache 2.0 | Mapeo Objeto/XML |
| Spring Data JPA | `org.springframework.data` | 2025.1.2 (BOM) | Apache 2.0 | Abstracción de repositorio JPA |

### Capa de Persistencia

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Hibernate Core | `org.hibernate.orm` | 7.2.3.Final | LGPL 2.1 | Implementación JPA |
| Hibernate Validator | `org.hibernate.validator` | 9.1.0.Final | Apache 2.0 | Validación de beans |
| Hibernate JCache | `org.hibernate.orm` | 7.2.3.Final | LGPL 2.1 | Caché de segundo nivel |
| Jakarta Persistence API | `jakarta.persistence` | 3.2.0 | EPL 2.0 | Especificación JPA |

### Capa Web

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Jakarta Servlet API | `jakarta.servlet` | 6.1.0 | EPL 2.0 | Especificación Servlet |
| JSTL API | `jakarta.servlet.jsp.jstl` | 3.0.2 | EPL 2.0 | Biblioteca de etiquetas JSP |
| JSTL Implementation | `org.glassfish.web` | 3.0.1 | EPL 2.0 | Runtime JSTL |
| Tomcat Jasper EL | `org.apache.tomcat` | 11.0.18 | Apache 2.0 | Lenguaje de expresiones |
| Tomcat JDBC Pool | `org.apache.tomcat` | 11.0.18 | Apache 2.0 | Pool de conexiones |

### Procesamiento JSON

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Jackson Core | `tools.jackson.core` | 3.0.4 | Apache 2.0 | Parser JSON |
| Jackson Databind | `tools.jackson.core` | 3.0.4 | Apache 2.0 | Binding JSON/Objeto |
| Jackson BOM | `tools.jackson` | 3.0.4 | Apache 2.0 | Gestión de versiones |

### Componentes de UI (WebJars)

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Bootstrap | `org.webjars` | 5.3.8 | MIT | Framework CSS |
| Font Awesome | `org.webjars.npm` | 4.7.0 | MIT/OFL | Biblioteca de iconos |
| Flatpickr | `org.webjars.npm` | 4.6.13 | MIT | Selector de fechas |

### Logging

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| SLF4J API | `org.slf4j` | 2.0.17 | MIT | Fachada de logging |
| Logback Classic | `ch.qos.logback` | 1.5.27 | EPL 1.0/LGPL 2.1 | Implementación de logging |

### Caché

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| Caffeine | `com.github.ben-manes.caffeine` | 3.2.3 | Apache 2.0 | Caché de alto rendimiento |

### AOP

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| AspectJ Weaver | `org.aspectj` | 1.9.25.1 | EPL 2.0 | Programación orientada a aspectos |

### Binding XML

| Dependencia | Group ID | Versión | Licencia | Propósito |
|-------------|----------|---------|----------|-----------|
| JAXB API | `jakarta.xml.bind` | 4.0.4 | BSD 3-Clause | API de binding XML |
| JAXB Runtime | `org.glassfish.jaxb` | 4.0.6 | BSD 3-Clause | Implementación de binding XML |
| Jakarta Activation | `jakarta.activation` | 2.1.4 | BSD 3-Clause | JavaBeans Activation |

---

## Dependencias de Desarrollo y Pruebas

| Dependencia | Group ID | Versión | Licencia | Alcance | Propósito |
|-------------|----------|---------|----------|---------|-----------|
| Spring Test | `org.springframework` | 7.0.3 | Apache 2.0 | test | Soporte de pruebas |
| JUnit Jupiter | `org.junit.jupiter` | 6.0.2 | EPL 2.0 | test | Framework de pruebas |
| AssertJ | `org.assertj` | 3.27.7 | Apache 2.0 | test | Aserciones fluidas |
| Mockito Core | `org.mockito` | 5.21.0 | MIT | test | Framework de mocking |
| Mockito JUnit Jupiter | `org.mockito` | 5.21.0 | MIT | compile | Integración JUnit 5 |
| Hamcrest | `org.hamcrest` | 3.0 | BSD 3-Clause | test | Biblioteca de matchers |
| JSON Path | `com.jayway.jsonpath` | 2.10.0 | Apache 2.0 | test | Pruebas JSON |

---

## Dependencias Específicas por Perfil

### Drivers de Base de Datos

| Perfil | Dependencia | Group ID | Versión | Licencia |
|--------|-------------|----------|---------|----------|
| H2 (por defecto) | H2 Database | `com.h2database` | 2.4.240 | MPL 2.0/EPL 1.0 |
| HSQLDB | HSQLDB | `org.hsqldb` | 2.7.4 | BSD |
| MySQL | MySQL Connector/J | `mysql` | 8.1.0 | GPL 2.0 |
| PostgreSQL | PostgreSQL JDBC | `org.postgresql` | 42.7.9 | BSD 2-Clause |

### Activación de Perfiles

```xml
<!-- Por defecto: Base de Datos H2 -->
mvn clean install -PH2

<!-- HSQLDB -->
mvn clean install -PHSQLDB

<!-- MySQL -->
mvn clean install -PMySQL

<!-- PostgreSQL -->
mvn clean install -PPostgreSQL
```

---

## Dependencias de Plugins Maven

| Plugin | Group ID | Versión | Propósito |
|--------|----------|---------|-----------|
| Maven Compiler | `org.apache.maven.plugins` | 3.14.1 | Compilación Java |
| Maven Surefire | `org.apache.maven.plugins` | 3.5.4 | Ejecución de pruebas |
| Maven WAR | `org.apache.maven.plugins` | 3.5.1 | Empaquetado WAR |
| Maven Resources | `org.apache.maven.plugins` | 3.4.0 | Manejo de recursos |
| Maven Assembly | `org.apache.maven.plugins` | 3.8.0 | Generación de assemblies |
| Maven Eclipse | `org.apache.maven.plugins` | 2.10 | Integración Eclipse |
| Maven Enforcer | `org.apache.maven.plugins` | 3.6.2 | Aplicación de reglas de build |
| JaCoCo | `org.jacoco` | 0.8.14 | Cobertura de código |
| Jetty | `org.eclipse.jetty` | 11.0.26 | Servidor de desarrollo |
| Jib | `com.google.cloud.tools` | 3.5.1 | Construcción de imágenes Docker |
| LibSass | `com.gitlab.haynes` | 0.3.4 | Compilación SCSS |

---

## Análisis CVE

### Vulnerabilidades Críticas (CVSS ≥ 9.0)

#### CVE-2025-24813 - Apache Tomcat RCE
| Campo | Valor |
|-------|-------|
| **Componente** | Apache Tomcat |
| **Versión Afectada** | 11.0.0-M1 a 11.0.2 |
| **Versión del Proyecto** | 11.0.18 ✅ |
| **Puntuación CVSS** | 9.8 (Crítico) |
| **Estado** | **CORREGIDO** |
| **Descripción** | Vulnerabilidad de equivalencia de rutas que permite ejecución remota de código a través de archivos subidos |
| **Versión de Corrección** | 11.0.3+ |
| **Recomendación** | No se requiere acción - el proyecto usa 11.0.18 |

#### CVE-2025-55752 - Apache Tomcat Directory Traversal
| Campo | Valor |
|-------|-------|
| **Componente** | Apache Tomcat |
| **Versión Afectada** | 11.0.0-M1 a 11.0.10 |
| **Versión del Proyecto** | 11.0.18 ✅ |
| **Puntuación CVSS** | 9.1 (Crítico) |
| **Estado** | **CORREGIDO** |
| **Descripción** | Traversal de directorios en reescritura de URL que permite acceso a WEB-INF/META-INF |
| **Versión de Corrección** | 11.0.11+ |
| **Recomendación** | No se requiere acción - el proyecto usa 11.0.18 |

### Vulnerabilidades Altas (CVSS 7.0-8.9)

#### CVE-2024-12798 - Logback Ejecución Arbitraria de Código
| Campo | Valor |
|-------|-------|
| **Componente** | Logback |
| **Versión Afectada** | 1.4.0 a 1.5.12 |
| **Versión del Proyecto** | 1.5.27 ✅ |
| **Puntuación CVSS** | 7.3 (Alto) |
| **Estado** | **CORREGIDO** |
| **Descripción** | ACE a través de JaninoEventEvaluator cuando el atacante tiene acceso al archivo de configuración |
| **Versión de Corrección** | 1.5.13+ |
| **Recomendación** | No se requiere acción - el proyecto usa 1.5.27 |

#### CVE-2025-41249 - Spring Framework Detección de Anotaciones
| Campo | Valor |
|-------|-------|
| **Componente** | Spring Framework |
| **Versión Afectada** | 6.0.x a 6.2.x (verificar 7.0.x) |
| **Versión del Proyecto** | 7.0.3 ⚠️ |
| **Puntuación CVSS** | 7.5 (Alto) |
| **Estado** | **MONITOREAR** |
| **Descripción** | Resolución incorrecta de anotaciones que afecta la seguridad de métodos |
| **Versión de Corrección** | Verificar avisos de Spring |
| **Recomendación** | Monitorear avisos de seguridad de Spring para parches 7.0.x |

#### CVE-2025-31650 - Apache Tomcat Fuga de Memoria
| Campo | Valor |
|-------|-------|
| **Componente** | Apache Tomcat |
| **Versión Afectada** | 11.0.0-M2 a 11.0.5 |
| **Versión del Proyecto** | 11.0.18 ✅ |
| **Puntuación CVSS** | 7.5 (Alto) |
| **Estado** | **CORREGIDO** |
| **Descripción** | Fuga de memoria a través de cabeceras de prioridad HTTP malformadas causando DoS |
| **Versión de Corrección** | 11.0.6+ |
| **Recomendación** | No se requiere acción - el proyecto usa 11.0.18 |

### Vulnerabilidades Medias (CVSS 4.0-6.9)

#### CVE-2024-22233 - Spring Framework DoS
| Campo | Valor |
|-------|-------|
| **Componente** | Spring Framework |
| **Versión Afectada** | 6.0.15, 6.1.2 |
| **Versión del Proyecto** | 7.0.3 ⚠️ |
| **Puntuación CVSS** | 5.3 (Medio) |
| **Estado** | **INVESTIGAR** |
| **Descripción** | DoS a través de solicitudes HTTP especialmente diseñadas |
| **Recomendación** | Verificar si 7.0.3 incluye la corrección |

#### CVE-2023-35116 - Jackson Databind DoS
| Campo | Valor |
|-------|-------|
| **Componente** | Jackson Databind |
| **Versión Afectada** | ≤2.15.2 |
| **Versión del Proyecto** | 3.0.4 ✅ |
| **Puntuación CVSS** | 5.9 (Medio) |
| **Estado** | **PROBABLEMENTE CORREGIDO** |
| **Descripción** | DoS a través de dependencias cíclicas causando desbordamiento de pila |
| **Recomendación** | Monitorear avisos específicos de 3.x |

#### CVE-2025-52520 - Apache Tomcat Desbordamiento de Entero
| Campo | Valor |
|-------|-------|
| **Componente** | Apache Tomcat |
| **Versión Afectada** | 11.0.0-M1 a 11.0.8 |
| **Versión del Proyecto** | 11.0.18 ✅ |
| **Puntuación CVSS** | 5.3 (Medio) |
| **Estado** | **CORREGIDO** |
| **Descripción** | Desbordamiento de entero en subida multipart que evita límites de tamaño |
| **Versión de Corrección** | 11.0.9+ |
| **Recomendación** | No se requiere acción |

#### CVE-2025-55754 - Apache Tomcat Inyección de Logs
| Campo | Valor |
|-------|-------|
| **Componente** | Apache Tomcat |
| **Versión Afectada** | 11.0.0-M1 a 11.0.10 |
| **Versión del Proyecto** | 11.0.18 ✅ |
| **Puntuación CVSS** | 4.8 (Medio) |
| **Estado** | **CORREGIDO** |
| **Descripción** | Inyección de secuencias de escape ANSI en logs (consola Windows) |
| **Versión de Corrección** | 11.0.11+ |
| **Recomendación** | No se requiere acción |

### Vulnerabilidades Bajas (CVSS < 4.0)

#### CVEs Históricos - Hibernate (RESUELTOS)
| CVE | Descripción | Estado |
|-----|-------------|--------|
| CVE-2020-25638 | Inyección SQL via JPA Criteria | Corregido en versión actual |
| CVE-2019-14900 | Inyección SQL via literales | Corregido en versión actual |

---

## Resumen de Licencias

### Distribución de Licencias

| Licencia | Cantidad | Compatibilidad |
|----------|----------|----------------|
| Apache License 2.0 | 18 | ✅ Permisiva |
| MIT License | 6 | ✅ Permisiva |
| EPL 2.0 / EPL 1.0 | 5 | ⚠️ Copyleft débil |
| BSD 3-Clause / 2-Clause | 4 | ✅ Permisiva |
| LGPL 2.1 | 2 | ⚠️ Copyleft débil |
| MPL 2.0 | 1 | ⚠️ Copyleft a nivel de archivo |
| GPL 2.0 | 1 | ⚠️ Copyleft fuerte (MySQL) |

### Notas de Compatibilidad de Licencias

```
✅ Apache 2.0 - Totalmente compatible con uso comercial
✅ MIT - Totalmente compatible con uso comercial
✅ BSD - Totalmente compatible con uso comercial
⚠️ EPL - Compatible, requiere aviso de licencia
⚠️ LGPL - Compatible si se enlaza dinámicamente
⚠️ MPL 2.0 - Compatible con divulgación de código fuente para archivos modificados
⚠️ GPL 2.0 (MySQL) - Requiere licencia alternativa para distribución
              Considere usar driver PostgreSQL para despliegues propietarios
```

### Consideración GPL

El **MySQL Connector/J** usa GPL 2.0 que puede tener implicaciones para distribuciones propietarias. Opciones:
1. Usar **PostgreSQL** (licencia BSD) en su lugar
2. Comprar licencia comercial de MySQL
3. Asegurar cumplimiento con requisitos de distribución GPL

---

## Árbol de Dependencias

```
spring-framework-petclinic:7.0.3
├── Spring Framework (7.0.3)
│   ├── spring-webmvc
│   │   ├── spring-aop
│   │   ├── spring-beans
│   │   ├── spring-context
│   │   ├── spring-core
│   │   ├── spring-expression
│   │   └── spring-web
│   ├── spring-jdbc
│   ├── spring-orm
│   ├── spring-context-support
│   └── spring-oxm
├── Spring Data JPA (2025.1.2 BOM)
│   └── spring-data-jpa
├── Hibernate (7.2.3.Final)
│   ├── hibernate-core
│   ├── hibernate-validator (9.1.0.Final)
│   └── hibernate-jcache
├── Jakarta EE
│   ├── jakarta.servlet-api (6.1.0)
│   ├── jakarta.persistence-api (3.2.0)
│   ├── jakarta.xml.bind-api (4.0.4)
│   └── jstl (3.0.2)
├── Apache Tomcat (11.0.18)
│   ├── tomcat-jasper-el
│   └── tomcat-jdbc
├── Jackson (3.0.4)
│   ├── jackson-core
│   └── jackson-databind
├── Logging
│   ├── slf4j-api (2.0.17)
│   └── logback-classic (1.5.27)
├── Caché
│   └── caffeine (3.2.3)
├── AOP
│   └── aspectjweaver (1.9.25.1)
├── WebJars
│   ├── bootstrap (5.3.8)
│   ├── font-awesome (4.7.0)
│   └── flatpickr (4.6.13)
└── Pruebas
    ├── spring-test (7.0.3)
    ├── junit-jupiter (6.0.2)
    ├── assertj-core (3.27.7)
    ├── mockito-core (5.21.0)
    ├── hamcrest (3.0)
    └── json-path (2.10.0)
```

---

## Recomendaciones de Seguridad

### Acciones Inmediatas (Prioridad: ALTA)

1. **Monitorear Avisos de Spring Framework 7.0.x**
   - Verificar [Avisos de Seguridad de Spring](https://spring.io/security) regularmente
   - Suscribirse a la lista de correo de seguridad de Spring
   - CVE-2025-41249 puede afectar la detección de anotaciones

2. **Revisar Configuración de Logging**
   - Asegurar que los archivos de configuración de Logback estén protegidos
   - Eliminar Janino del classpath si no se usa evaluación de expresiones
   - Validar que ninguna entrada de usuario llegue a los mensajes de log

### Mantenimiento Continuo

3. **Mantener Dependencias Actualizadas**
   ```bash
   # Verificar actualizaciones
   mvn versions:display-dependency-updates
   
   # Verificar actualizaciones de plugins
   mvn versions:display-plugin-updates
   
   # Verificar vulnerabilidades de seguridad
   mvn org.owasp:dependency-check-maven:check
   ```

4. **Habilitar Escaneo de Dependencias en CI/CD**
   ```yaml
   # Ejemplo de GitHub Actions
   - name: OWASP Dependency Check
     uses: dependency-check/Dependency-Check_Action@main
     with:
       project: 'petclinic'
       path: '.'
       format: 'HTML'
   ```

5. **Selección de Driver de Base de Datos**
   - Para despliegues propietarios, preferir PostgreSQL (BSD) sobre MySQL (GPL)
   - Mantener H2 solo para desarrollo (no producción)

### Mejores Prácticas de Seguridad

6. **Validación de Entrada**
   - Hibernate Validator maneja la validación de beans
   - Nunca incluir entrada de usuario en mensajes de validación (CVE-2025-35036)

7. **Procesamiento JSON**
   - Jackson 3.x incluye límites de profundidad por defecto
   - Configurar `StreamReadConstraints` para protección adicional
   ```java
   ObjectMapper mapper = JsonMapper.builder()
       .streamReadConstraints(StreamReadConstraints.builder()
           .maxNestingDepth(100)
           .build())
       .build();
   ```

8. **Contenedor de Servlets**
   - Deshabilitar métodos PUT/DELETE a menos que sean requeridos
   - Proteger archivos de configuración de acceso no autorizado
   - Usar configuraciones de sesión seguras

---

## Apéndice: Comandos de Actualización de Dependencias

### Verificar Actualizaciones

```bash
# Mostrar actualizaciones de dependencias
mvn versions:display-dependency-updates

# Mostrar actualizaciones de plugins
mvn versions:display-plugin-updates

# Mostrar actualizaciones de propiedades
mvn versions:display-property-updates
```

### Actualizar Dependencias

```bash
# Actualizar todas las dependencias a las últimas versiones
mvn versions:use-latest-versions

# Actualizar propiedad específica
mvn versions:set-property -Dproperty=spring-framework.version -DnewVersion=7.0.4

# Confirmar cambios
mvn versions:commit
```

### Escaneo de Seguridad

```bash
# OWASP Dependency Check
mvn org.owasp:dependency-check-maven:check

# Generar SBOM (Software Bill of Materials)
mvn org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom

# Escaneo Snyk (requiere Snyk CLI)
snyk test --file=pom.xml
```

### Análisis de Dependencias

```bash
# Mostrar árbol de dependencias
mvn dependency:tree

# Analizar dependencias no utilizadas
mvn dependency:analyze

# Mostrar POM efectivo
mvn help:effective-pom
```

---

## Historial del Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Febrero 2026 | Extracción inicial de dependencias y análisis CVE |

---

## Referencias

- [Avisos de Seguridad de Spring](https://spring.io/security)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)
- [CVE Details](https://www.cvedetails.com/)
- [Base de Datos de Vulnerabilidades Snyk](https://security.snyk.io/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [Seguridad Apache Tomcat](https://tomcat.apache.org/security.html)
- [Seguridad Hibernate](https://hibernate.org/security/)

---

*Este documento fue auto-generado por el Agente Extractor de Dependencias.*  
*Siempre verifique el estado de CVE con fuentes oficiales antes de tomar decisiones de seguridad.*

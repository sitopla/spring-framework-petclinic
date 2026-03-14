# Skill: Generación de Testcontainers para PostgreSQL

**Contexto:** Se usa para tests de integración que requieren una base de datos real en lugar de H2.

**Reglas de Generación:**
1. Usar la dependencia `org.testcontainers:postgresql`.
2. Implementar la interfaz `BeforeAllCallback` o usar `@ServiceConnection` (disponible en Spring Boot 3.1+).
3. Configurar el contenedor como `static` para reutilizarlo entre clases de test y mejorar la velocidad.

**Ejemplo de Referencia (Gold Standard):**
```java
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfig {
    @Bean
    @ServiceConnection
    static PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));
    }
}

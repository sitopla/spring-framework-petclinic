---
name: testing
description: Generate integration tests with Testcontainers and Cucumber for Spring applications. Use when creating database integration tests with PostgreSQL/MySQL containers, or BDD tests with Gherkin. Provides real database testing instead of H2.
---

# Testing Patterns for Spring Applications

Integration testing with Testcontainers and BDD with Cucumber.

## Coverage

- **Testcontainers**: Real database testing (PostgreSQL, MySQL, MongoDB)
- **Cucumber**: BDD integration tests with Gherkin syntax
- **Spring Test**: MockMvc and WebTestClient patterns

## Testcontainers (PostgreSQL)

### Dependencies

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.5</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.19.5</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.19.5</version>
    <scope>test</scope>
</dependency>
```

### Configuration (Spring Boot 3.1+)

```java
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfig {

    @Bean
    @ServiceConnection
    static PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));
    }
}
```

### Usage in Tests

```java
@SpringBootTest
@Import(TestcontainersConfig.class)
class RepositoryIntegrationTests {

    @Autowired
    private OwnerRepository ownerRepository;

    @Test
    void shouldSaveAndFindOwner() {
        Owner owner = new Owner();
        owner.setFirstName("John");
        owner.setLastName("Doe");
        
        Owner saved = ownerRepository.save(owner);
        
        assertThat(ownerRepository.findById(saved.getId()))
            .isPresent()
            .hasValueSatisfying(o -> assertThat(o.getLastName()).isEqualTo("Doe"));
    }
}
```

## Cucumber BDD Tests

See [cucumber-api.md](cucumber-api.md) for Gherkin patterns and step definitions.

### Quick Setup

```java
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.example.steps")
public class CucumberIntegrationTest {
}
```

## Best Practices

1. **Static containers**: Use `static` for container reuse across test classes
2. **@ServiceConnection**: Auto-configure DataSource (Spring Boot 3.1+)
3. **Parallel tests**: Use `@Testcontainers` with `parallel = true` carefully
4. **Clean state**: Use `@Sql` or `@DirtiesContext` for test isolation

## Detailed References

- [testcontainers-pg.md](testcontainers-pg.md) - PostgreSQL patterns
- [cucumber-api.md](cucumber-api.md) - Cucumber/Gherkin patterns

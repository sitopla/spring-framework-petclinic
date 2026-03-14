---
name: cucumber-api
description: Generate BDD integration tests using Cucumber for Spring MVC/REST APIs. Use when users request integration tests, API tests, BDD tests, or Gherkin scenarios for Java Spring projects. Supports REST endpoints testing with MockMvc, RestAssured, or WebTestClient.
---

# Cucumber API Integration Tests

Generate BDD-style integration tests for Spring applications using Cucumber and Gherkin syntax.

## Quick Start

1. Add dependencies to `pom.xml` (see [references/maven-dependencies.md](references/maven-dependencies.md))
2. Create feature files in `src/test/resources/features/`
3. Generate step definitions in `src/test/java/.../steps/`
4. Create test runner class

## Project Structure

```
src/test/
├── java/
│   └── {package}/
│       ├── CucumberIntegrationTest.java    # Test runner
│       └── steps/
│           ├── CommonSteps.java            # Shared steps (Given context)
│           └── {Feature}Steps.java         # Feature-specific steps
└── resources/
    └── features/
        └── {feature}.feature               # Gherkin scenarios
```

## Feature File Pattern

```gherkin
Feature: {Resource} API
  As a {role}
  I want to {action}
  So that {benefit}

  Background:
    Given the application is running
    And the database contains test data

  Scenario: {Action} {resource} successfully
    Given {precondition}
    When I {action} "{endpoint}" with:
      | field | value |
    Then the response status should be {code}
    And the response should contain "{expected}"

  Scenario Outline: {Action} with multiple inputs
    When I {action} "<endpoint>" with "<data>"
    Then the response status should be <status>

    Examples:
      | endpoint | data | status |
      | /api/v1  | {}   | 200    |
```

## Step Definitions Pattern

```java
@CucumberContextConfiguration
@ContextConfiguration(classes = {TestConfig.class})
@WebAppConfiguration
public class CommonSteps {

    @Autowired
    private WebApplicationContext context;

    protected MockMvc mockMvc;
    protected ResultActions result;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Given("the application is running")
    public void applicationIsRunning() {
        assertThat(context).isNotNull();
    }

    @When("I GET {string}")
    public void iGet(String endpoint) throws Exception {
        result = mockMvc.perform(get(endpoint)
            .contentType(MediaType.APPLICATION_JSON));
    }

    @When("I POST {string} with:")
    public void iPostWith(String endpoint, DataTable data) throws Exception {
        String json = convertToJson(data);
        result = mockMvc.perform(post(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(json));
    }

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int status) throws Exception {
        result.andExpect(status().is(status));
    }
}
```

## Test Runner

```java
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "{package}.steps")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty, html:target/cucumber-reports.html, json:target/cucumber.json")
public class CucumberIntegrationTest {
}
```

## Detailed References

- **Maven Setup**: See [references/maven-dependencies.md](references/maven-dependencies.md)
- **Gherkin Patterns**: See [references/gherkin-patterns.md](references/gherkin-patterns.md)
- **Spring Integration**: See [references/spring-integration.md](references/spring-integration.md)

## Best Practices

1. **One feature per domain entity** - Keep features focused
2. **Reusable steps** - Share common steps across features via inheritance
3. **Data Tables** - Use for complex request/response validation
4. **Tags** - Use `@smoke`, `@regression`, `@api` for test filtering
5. **Background** - Setup common preconditions once per feature
6. **Scenario Outline** - Use for data-driven tests with Examples table
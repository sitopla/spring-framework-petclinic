# Spring Integration for Cucumber

## Table of Contents

1. [Test Configuration](#test-configuration)
2. [Step Definitions Base Class](#step-definitions-base-class)
3. [Database Setup](#database-setup)
4. [MockMvc Integration](#mockmvc-integration)
5. [Test Runner](#test-runner)

## Test Configuration

### cucumber.properties

Create `src/test/resources/cucumber.properties`:

```properties
cucumber.publish.quiet=true
cucumber.plugin=pretty, html:target/cucumber-reports.html, json:target/cucumber.json
cucumber.glue=org.springframework.samples.petclinic.steps
cucumber.features=src/test/resources/features
```

### Test Spring Configuration

```java
@Configuration
@ComponentScan(basePackages = "org.springframework.samples.petclinic")
@PropertySource("classpath:spring/data-access.properties")
public class CucumberTestConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .addScript("classpath:db/h2/schema.sql")
            .addScript("classpath:db/h2/data.sql")
            .build();
    }
}
```

## Step Definitions Base Class

### CommonSteps.java

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@CucumberContextConfiguration
@ContextConfiguration(locations = {"classpath:spring/business-config.xml", "classpath:spring/mvc-core-config.xml"})
@WebAppConfiguration
public class CommonSteps {

    @Autowired
    protected WebApplicationContext context;

    protected MockMvc mockMvc;
    protected ResultActions result;
    protected String responseBody;

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
            .accept(MediaType.TEXT_HTML, MediaType.APPLICATION_JSON));
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I POST {string} with form data:")
    public void iPostWithFormData(String endpoint, io.cucumber.datatable.DataTable data) throws Exception {
        var params = data.asMap(String.class, String.class);
        var request = post(endpoint)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        params.forEach(request::param);
        result = mockMvc.perform(request);
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int status) throws Exception {
        result.andExpect(status().is(status));
    }

    @Then("the response should contain {string}")
    public void responseShouldContain(String expected) {
        assertThat(responseBody).contains(expected);
    }

    @Then("the page should display {string}")
    public void pageShouldDisplay(String text) {
        assertThat(responseBody).contains(text);
    }
}
```

## Database Setup

### Test Data Steps

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.java.en.Given;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.service.ClinicService;

public class DatabaseSteps extends CommonSteps {

    @Autowired
    private ClinicService clinicService;

    @Given("an owner exists with id {int}")
    public void ownerExistsWithId(int id) {
        Owner owner = clinicService.findOwnerById(id);
        assertThat(owner).isNotNull();
    }

    @Given("the database contains test data")
    public void databaseContainsTestData() {
        // Test data is loaded from data.sql
        assertThat(clinicService.findOwnerByLastName("Franklin")).isNotEmpty();
    }
}
```

## MockMvc Integration

### Form Submission Steps

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.java.en.When;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class FormSteps extends CommonSteps {

    @When("I submit the owner form with:")
    public void iSubmitOwnerFormWith(io.cucumber.datatable.DataTable data) throws Exception {
        var params = data.asMap(String.class, String.class);
        
        var request = post("/owners/new")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("firstName", params.get("firstName"))
            .param("lastName", params.get("lastName"))
            .param("address", params.get("address"))
            .param("city", params.get("city"))
            .param("telephone", params.get("telephone"));
        
        result = mockMvc.perform(request);
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I search for owner with lastName {string}")
    public void iSearchForOwner(String lastName) throws Exception {
        result = mockMvc.perform(get("/owners")
            .param("lastName", lastName));
        responseBody = result.andReturn().getResponse().getContentAsString();
    }
}
```

## Test Runner

### CucumberIntegrationTest.java

```java
package org.springframework.samples.petclinic;

import org.junit.platform.suite.api.*;
import static io.cucumber.junit.platform.engine.Constants.*;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "org.springframework.samples.petclinic.steps")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty, html:target/cucumber-reports.html, json:target/cucumber.json")
@ConfigurationParameter(key = FEATURES_PROPERTY_NAME, value = "src/test/resources/features")
public class CucumberIntegrationTest {
}
```

### Running Tests

```bash
# Run all Cucumber tests
mvn test -Dtest=CucumberIntegrationTest

# Run specific tagged scenarios
mvn test -Dtest=CucumberIntegrationTest -Dcucumber.filter.tags="@smoke"

# Generate reports
mvn verify
# Reports at: target/cucumber-reports.html
```

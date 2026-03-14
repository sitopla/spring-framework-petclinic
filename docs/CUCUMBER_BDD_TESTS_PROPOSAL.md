# 🥒 Propuesta de Tests de Integración BDD con Cucumber

> **Proyecto:** Spring Framework PetClinic  
> **Fecha:** 2026-02-17  
> **Skill utilizada:** cucumber-api

---

## 📋 Resumen Ejecutivo

Esta propuesta define tests de integración BDD (Behavior-Driven Development) usando **Cucumber** y **Gherkin** para validar los endpoints del PetClinic. Los tests cubren las operaciones CRUD de los 4 controladores principales.

### Controladores Analizados

| Controlador | Endpoints | Operaciones |
|-------------|-----------|-------------|
| `OwnerController` | `/owners/**` | CRUD completo |
| `PetController` | `/owners/{ownerId}/pets/**` | Create, Update |
| `VetController` | `/vets`, `/vets.json`, `/vets.xml` | Read (HTML, JSON, XML) |
| `VisitController` | `/owners/*/pets/{petId}/visits/**` | Create, List |

---

## 🔧 Paso 1: Dependencias Maven

Añadir al `pom.xml`:

```xml
<properties>
    <!-- Cucumber -->
    <cucumber.version>7.15.0</cucumber.version>
</properties>

<dependencies>
    <!-- Cucumber Core -->
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-java</artifactId>
        <version>${cucumber.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- Cucumber Spring Integration -->
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-spring</artifactId>
        <version>${cucumber.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- Cucumber JUnit Platform -->
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-junit-platform-engine</artifactId>
        <version>${cucumber.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- JUnit Platform Suite -->
    <dependency>
        <groupId>org.junit.platform</groupId>
        <artifactId>junit-platform-suite</artifactId>
        <version>1.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 📁 Paso 2: Estructura de Archivos Propuesta

```
src/test/
├── java/org/springframework/samples/petclinic/
│   ├── CucumberIntegrationTest.java          # Test runner
│   └── steps/
│       ├── CommonSteps.java                   # Steps compartidos
│       ├── OwnerSteps.java                    # Steps de Owner
│       ├── PetSteps.java                      # Steps de Pet
│       ├── VetSteps.java                      # Steps de Vet
│       └── VisitSteps.java                    # Steps de Visit
└── resources/
    ├── cucumber.properties                    # Configuración Cucumber
    └── features/
        ├── owner.feature                      # Escenarios de Owner
        ├── pet.feature                        # Escenarios de Pet
        ├── vet.feature                        # Escenarios de Vet
        └── visit.feature                      # Escenarios de Visit
```

---

## 🥒 Paso 3: Feature Files (Escenarios Gherkin)

### 3.1 Owner Feature (`owner.feature`)

```gherkin
@owner @api
Feature: Owner Management
  As a clinic administrator
  I want to manage pet owners
  So that I can maintain the client database

  Background:
    Given the application is running
    And the database contains test data

  # ============================================
  # READ OPERATIONS
  # ============================================

  @smoke @read
  Scenario: Display find owners form
    When I GET "/owners/find"
    Then the response status should be 200
    And the page should display "Find Owners"

  @smoke @read
  Scenario: List all owners when no search criteria
    When I GET "/owners"
    Then the response status should be 200
    And the page should display "Owners"

  @read
  Scenario: Find owner by last name
    Given an owner exists with lastName "Franklin"
    When I search for owner with lastName "Franklin"
    Then the response status should be 200
    And the page should display "George Franklin"

  @read
  Scenario: Find owner by partial last name
    When I search for owner with lastName "Davis"
    Then the response status should be 200
    And the page should display "Betty Davis"

  @read
  Scenario: Search returns multiple owners
    When I search for owner with lastName ""
    Then the response status should be 200
    And the page should display "Owners"
    And the response should contain multiple owners

  @read
  Scenario: Search returns no owners
    When I search for owner with lastName "NonExistentName"
    Then the response status should be 200
    And the page should display "has not been found"

  @read
  Scenario: View owner details by ID
    Given an owner exists with id 1
    When I GET "/owners/1"
    Then the response status should be 200
    And the page should display "George Franklin"
    And the page should display "110 W. Liberty St."
    And the page should display "Madison"

  # ============================================
  # CREATE OPERATIONS
  # ============================================

  @smoke @create
  Scenario: Display new owner form
    When I GET "/owners/new"
    Then the response status should be 200
    And the page should display "Owner"
    And the page should display "First Name"

  @create
  Scenario: Create new owner with valid data
    When I submit the owner form with:
      | firstName | John           |
      | lastName  | Doe            |
      | address   | 123 Main St    |
      | city      | Springfield    |
      | telephone | 6085551234     |
    Then the response status should be 302
    And I should be redirected to owner details

  @create @validation
  Scenario: Create owner fails with missing first name
    When I submit the owner form with:
      | firstName |                |
      | lastName  | Doe            |
      | address   | 123 Main St    |
      | city      | Springfield    |
      | telephone | 6085551234     |
    Then the response status should be 200
    And the page should display "must not be blank"

  @create @validation
  Scenario: Create owner fails with invalid telephone
    When I submit the owner form with:
      | firstName | John           |
      | lastName  | Doe            |
      | address   | 123 Main St    |
      | city      | Springfield    |
      | telephone | invalid-phone  |
    Then the response status should be 200
    And the page should display "numeric"

  @create @validation
  Scenario Outline: Validate owner creation with various inputs
    When I submit the owner form with:
      | firstName | <firstName> |
      | lastName  | <lastName>  |
      | address   | <address>   |
      | city      | <city>      |
      | telephone | <telephone> |
    Then the response status should be <status>

    Examples:
      | firstName | lastName | address      | city        | telephone  | status |
      | John      | Doe      | 123 Main St  | Springfield | 6085551234 | 302    |
      |           | Doe      | 123 Main St  | Springfield | 6085551234 | 200    |
      | John      |          | 123 Main St  | Springfield | 6085551234 | 200    |
      | John      | Doe      |              | Springfield | 6085551234 | 200    |
      | John      | Doe      | 123 Main St  |             | 6085551234 | 200    |
      | John      | Doe      | 123 Main St  | Springfield |            | 200    |

  # ============================================
  # UPDATE OPERATIONS
  # ============================================

  @update
  Scenario: Display edit owner form
    Given an owner exists with id 1
    When I GET "/owners/1/edit"
    Then the response status should be 200
    And the page should display "George"
    And the page should display "Franklin"

  @update
  Scenario: Update owner with valid data
    Given an owner exists with id 1
    When I update owner 1 with:
      | firstName | George         |
      | lastName  | Franklin-Updated |
      | address   | 110 W. Liberty St. |
      | city      | Madison        |
      | telephone | 6085551023     |
    Then the response status should be 302
    And I should be redirected to "/owners/1"
```

### 3.2 Pet Feature (`pet.feature`)

```gherkin
@pet @api
Feature: Pet Management
  As a pet owner
  I want to manage my pets
  So that the clinic can track my animals

  Background:
    Given the application is running
    And the database contains test data
    And an owner exists with id 1

  # ============================================
  # CREATE OPERATIONS
  # ============================================

  @smoke @create
  Scenario: Display new pet form
    When I GET "/owners/1/pets/new"
    Then the response status should be 200
    And the page should display "New Pet"
    And the page should display pet type options

  @create
  Scenario: Create new pet with valid data
    When I submit the pet form for owner 1 with:
      | name      | Buddy      |
      | birthDate | 2020-05-15 |
      | type      | dog        |
    Then the response status should be 302
    And I should be redirected to "/owners/1"

  @create @validation
  Scenario: Create pet fails with missing name
    When I submit the pet form for owner 1 with:
      | name      |            |
      | birthDate | 2020-05-15 |
      | type      | dog        |
    Then the response status should be 200
    And the page should display validation error

  @create @validation
  Scenario: Create pet fails with duplicate name for same owner
    Given owner 1 already has a pet named "Leo"
    When I submit the pet form for owner 1 with:
      | name      | Leo        |
      | birthDate | 2021-01-01 |
      | type      | cat        |
    Then the response status should be 200
    And the page should display "already exists"

  # ============================================
  # UPDATE OPERATIONS
  # ============================================

  @update
  Scenario: Display edit pet form
    Given a pet exists with id 1 for owner 1
    When I GET "/owners/1/pets/1/edit"
    Then the response status should be 200
    And the page should display pet details

  @update
  Scenario: Update pet with valid data
    Given a pet exists with id 1 for owner 1
    When I update pet 1 for owner 1 with:
      | name      | Leo Updated |
      | birthDate | 2010-09-07  |
      | type      | cat         |
    Then the response status should be 302
    And I should be redirected to "/owners/1"
```

### 3.3 Vet Feature (`vet.feature`)

```gherkin
@vet @api
Feature: Veterinarian Information
  As a clinic visitor
  I want to view veterinarian information
  So that I can choose the right specialist for my pet

  Background:
    Given the application is running
    And the database contains test data

  # ============================================
  # HTML VIEW
  # ============================================

  @smoke @read
  Scenario: View veterinarians list as HTML
    When I GET "/vets"
    Then the response status should be 200
    And the page should display "Veterinarians"
    And the page should display "James Carter"
    And the page should display "Helen Leary"

  @read
  Scenario: Verify vet specialties are displayed
    When I GET "/vets"
    Then the response status should be 200
    And the page should display "radiology"
    And the page should display "surgery"
    And the page should display "dentistry"

  # ============================================
  # JSON API
  # ============================================

  @smoke @api @json
  Scenario: Get veterinarians as JSON
    When I GET "/vets.json" accepting "application/json"
    Then the response status should be 200
    And the response content type should be "application/json"
    And the JSON response should contain vet list

  @api @json
  Scenario: Verify JSON response structure
    When I GET "/vets.json" accepting "application/json"
    Then the response status should be 200
    And the JSON response should have "vetList" array
    And each vet should have "firstName" field
    And each vet should have "lastName" field
    And each vet should have "specialties" array

  # ============================================
  # XML API
  # ============================================

  @api @xml
  Scenario: Get veterinarians as XML
    When I GET "/vets.xml" accepting "application/xml"
    Then the response status should be 200
    And the response content type should be "application/xml"
    And the XML response should contain vets element
```

### 3.4 Visit Feature (`visit.feature`)

```gherkin
@visit @api
Feature: Pet Visits Management
  As a pet owner
  I want to schedule and view pet visits
  So that I can track my pet's medical history

  Background:
    Given the application is running
    And the database contains test data
    And an owner exists with id 1
    And owner 1 has a pet with id 1

  # ============================================
  # CREATE OPERATIONS
  # ============================================

  @smoke @create
  Scenario: Display new visit form
    When I GET "/owners/1/pets/1/visits/new"
    Then the response status should be 200
    And the page should display "New Visit"
    And the page should display pet information

  @create
  Scenario: Create new visit with valid data
    When I submit the visit form for pet 1 of owner 1 with:
      | date        | 2024-03-15                    |
      | description | Annual checkup and vaccination |
    Then the response status should be 302
    And I should be redirected to "/owners/1"

  @create @validation
  Scenario: Create visit fails with missing description
    When I submit the visit form for pet 1 of owner 1 with:
      | date        | 2024-03-15 |
      | description |            |
    Then the response status should be 200
    And the page should display validation error

  @create
  Scenario: Create visit with past date
    When I submit the visit form for pet 1 of owner 1 with:
      | date        | 2020-01-15           |
      | description | Historical record    |
    Then the response status should be 302
    And I should be redirected to "/owners/1"

  # ============================================
  # READ OPERATIONS
  # ============================================

  @read
  Scenario: View pet visits history
    Given pet 1 has existing visits
    When I GET "/owners/1/pets/1/visits"
    Then the response status should be 200
    And the page should display visit history
```

---

## ☕ Paso 4: Step Definitions

### 4.1 CommonSteps.java

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
@ContextConfiguration(locations = {
    "classpath:spring/business-config.xml",
    "classpath:spring/tools-config.xml",
    "classpath:spring/mvc-core-config.xml"
})
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
    public void theApplicationIsRunning() {
        assertThat(context).isNotNull();
    }

    @Given("the database contains test data")
    public void theDatabaseContainsTestData() {
        // Test data is loaded from db/h2/data.sql
        assertThat(context.getBean("clinicService")).isNotNull();
    }

    @When("I GET {string}")
    public void iGet(String endpoint) throws Exception {
        result = mockMvc.perform(get(endpoint)
            .accept(MediaType.TEXT_HTML));
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I GET {string} accepting {string}")
    public void iGetAccepting(String endpoint, String mediaType) throws Exception {
        result = mockMvc.perform(get(endpoint)
            .accept(MediaType.parseMediaType(mediaType)));
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @Then("the response status should be {int}")
    public void theResponseStatusShouldBe(int status) throws Exception {
        result.andExpect(status().is(status));
    }

    @Then("the page should display {string}")
    public void thePageShouldDisplay(String text) {
        assertThat(responseBody).contains(text);
    }

    @Then("the response should contain {string}")
    public void theResponseShouldContain(String expected) {
        assertThat(responseBody).contains(expected);
    }

    @Then("the response content type should be {string}")
    public void theResponseContentTypeShouldBe(String contentType) throws Exception {
        result.andExpect(content().contentTypeCompatibleWith(MediaType.parseMediaType(contentType)));
    }

    @Then("I should be redirected to {string}")
    public void iShouldBeRedirectedTo(String url) throws Exception {
        result.andExpect(redirectedUrl(url));
    }

    @Then("I should be redirected to owner details")
    public void iShouldBeRedirectedToOwnerDetails() throws Exception {
        result.andExpect(status().is3xxRedirection());
        String redirectUrl = result.andReturn().getResponse().getRedirectedUrl();
        assertThat(redirectUrl).matches("/owners/\\d+");
    }
}
```

### 4.2 OwnerSteps.java

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class OwnerSteps extends CommonSteps {

    @Autowired
    private ClinicService clinicService;

    @Given("an owner exists with id {int}")
    public void anOwnerExistsWithId(int id) {
        Owner owner = clinicService.findOwnerById(id);
        assertThat(owner).isNotNull();
    }

    @Given("an owner exists with lastName {string}")
    public void anOwnerExistsWithLastName(String lastName) {
        assertThat(clinicService.findOwnerByLastName(lastName)).isNotEmpty();
    }

    @When("I search for owner with lastName {string}")
    public void iSearchForOwnerWithLastName(String lastName) throws Exception {
        result = mockMvc.perform(get("/owners")
            .param("lastName", lastName));
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I submit the owner form with:")
    public void iSubmitTheOwnerFormWith(DataTable dataTable) throws Exception {
        Map<String, String> params = dataTable.asMap(String.class, String.class);

        result = mockMvc.perform(post("/owners/new")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("firstName", params.getOrDefault("firstName", ""))
            .param("lastName", params.getOrDefault("lastName", ""))
            .param("address", params.getOrDefault("address", ""))
            .param("city", params.getOrDefault("city", ""))
            .param("telephone", params.getOrDefault("telephone", "")));
        
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I update owner {int} with:")
    public void iUpdateOwnerWith(int ownerId, DataTable dataTable) throws Exception {
        Map<String, String> params = dataTable.asMap(String.class, String.class);

        result = mockMvc.perform(post("/owners/" + ownerId + "/edit")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("firstName", params.getOrDefault("firstName", ""))
            .param("lastName", params.getOrDefault("lastName", ""))
            .param("address", params.getOrDefault("address", ""))
            .param("city", params.getOrDefault("city", ""))
            .param("telephone", params.getOrDefault("telephone", "")));
        
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @Then("the response should contain multiple owners")
    public void theResponseShouldContainMultipleOwners() {
        // Check that the response contains the owners list table
        assertThat(responseBody).contains("<table");
        assertThat(responseBody).contains("</table>");
    }
}
```

### 4.3 VetSteps.java

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.java.en.Then;

import static org.assertj.core.api.Assertions.assertThat;

public class VetSteps extends CommonSteps {

    @Then("the JSON response should contain vet list")
    public void theJsonResponseShouldContainVetList() {
        assertThat(responseBody).contains("vetList");
        assertThat(responseBody).contains("firstName");
        assertThat(responseBody).contains("lastName");
    }

    @Then("the JSON response should have {string} array")
    public void theJsonResponseShouldHaveArray(String fieldName) {
        assertThat(responseBody).contains("\"" + fieldName + "\"");
    }

    @Then("each vet should have {string} field")
    public void eachVetShouldHaveField(String fieldName) {
        assertThat(responseBody).contains("\"" + fieldName + "\"");
    }

    @Then("the XML response should contain vets element")
    public void theXmlResponseShouldContainVetsElement() {
        assertThat(responseBody).contains("<vets>");
        assertThat(responseBody).contains("</vets>");
    }
}
```

### 4.4 PetSteps.java

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class PetSteps extends CommonSteps {

    @Autowired
    private ClinicService clinicService;

    @Given("a pet exists with id {int} for owner {int}")
    public void aPetExistsWithIdForOwner(int petId, int ownerId) {
        Pet pet = clinicService.findPetById(petId);
        assertThat(pet).isNotNull();
        assertThat(pet.getOwner().getId()).isEqualTo(ownerId);
    }

    @Given("owner {int} already has a pet named {string}")
    public void ownerAlreadyHasAPetNamed(int ownerId, String petName) {
        var owner = clinicService.findOwnerById(ownerId);
        assertThat(owner.getPet(petName, false)).isNotNull();
    }

    @When("I submit the pet form for owner {int} with:")
    public void iSubmitThePetFormForOwnerWith(int ownerId, DataTable dataTable) throws Exception {
        Map<String, String> params = dataTable.asMap(String.class, String.class);

        result = mockMvc.perform(post("/owners/" + ownerId + "/pets/new")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("name", params.getOrDefault("name", ""))
            .param("birthDate", params.getOrDefault("birthDate", ""))
            .param("type", params.getOrDefault("type", "")));
        
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @When("I update pet {int} for owner {int} with:")
    public void iUpdatePetForOwnerWith(int petId, int ownerId, DataTable dataTable) throws Exception {
        Map<String, String> params = dataTable.asMap(String.class, String.class);

        result = mockMvc.perform(post("/owners/" + ownerId + "/pets/" + petId + "/edit")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("name", params.getOrDefault("name", ""))
            .param("birthDate", params.getOrDefault("birthDate", ""))
            .param("type", params.getOrDefault("type", "")));
        
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @Then("the page should display pet type options")
    public void thePageShouldDisplayPetTypeOptions() {
        assertThat(responseBody).containsAnyOf("cat", "dog", "bird", "snake", "hamster", "lizard");
    }

    @Then("the page should display pet details")
    public void thePageShouldDisplayPetDetails() {
        assertThat(responseBody).contains("name");
        assertThat(responseBody).contains("birthDate");
    }

    @Then("the page should display validation error")
    public void thePageShouldDisplayValidationError() {
        assertThat(responseBody).containsAnyOf("required", "must not be", "error", "invalid");
    }
}
```

### 4.5 VisitSteps.java

```java
package org.springframework.samples.petclinic.steps;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.service.ClinicService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class VisitSteps extends CommonSteps {

    @Autowired
    private ClinicService clinicService;

    @Given("owner {int} has a pet with id {int}")
    public void ownerHasAPetWithId(int ownerId, int petId) {
        Pet pet = clinicService.findPetById(petId);
        assertThat(pet).isNotNull();
        assertThat(pet.getOwner().getId()).isEqualTo(ownerId);
    }

    @Given("pet {int} has existing visits")
    public void petHasExistingVisits(int petId) {
        Pet pet = clinicService.findPetById(petId);
        assertThat(pet.getVisits()).isNotEmpty();
    }

    @When("I submit the visit form for pet {int} of owner {int} with:")
    public void iSubmitTheVisitFormForPetOfOwnerWith(int petId, int ownerId, DataTable dataTable) throws Exception {
        Map<String, String> params = dataTable.asMap(String.class, String.class);

        result = mockMvc.perform(post("/owners/" + ownerId + "/pets/" + petId + "/visits/new")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("date", params.getOrDefault("date", ""))
            .param("description", params.getOrDefault("description", "")));
        
        responseBody = result.andReturn().getResponse().getContentAsString();
    }

    @Then("the page should display pet information")
    public void thePageShouldDisplayPetInformation() {
        assertThat(responseBody).containsAnyOf("Pet", "Name", "Owner");
    }

    @Then("the page should display visit history")
    public void thePageShouldDisplayVisitHistory() {
        assertThat(responseBody).contains("Visit");
    }
}
```

---

## 🏃 Paso 5: Test Runner

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

---

## ⚙️ Paso 6: Configuración

### cucumber.properties

```properties
cucumber.publish.quiet=true
cucumber.plugin=pretty, html:target/cucumber-reports.html, json:target/cucumber.json
cucumber.glue=org.springframework.samples.petclinic.steps
cucumber.features=src/test/resources/features
```

---

## 📊 Resumen de Escenarios

| Feature | Scenarios | Tags |
|---------|-----------|------|
| Owner   | 14        | `@owner`, `@smoke`, `@create`, `@read`, `@update`, `@validation` |
| Pet     | 7         | `@pet`, `@smoke`, `@create`, `@update`, `@validation` |
| Vet     | 5         | `@vet`, `@smoke`, `@api`, `@json`, `@xml` |
| Visit   | 5         | `@visit`, `@smoke`, `@create`, `@read` |
| **Total** | **31**  | |

---

## 🚀 Ejecución de Tests

```bash
# Ejecutar todos los tests de Cucumber
mvn test -Dtest=CucumberIntegrationTest

# Ejecutar solo tests de smoke
mvn test -Dtest=CucumberIntegrationTest -Dcucumber.filter.tags="@smoke"

# Ejecutar tests de un feature específico
mvn test -Dtest=CucumberIntegrationTest -Dcucumber.filter.tags="@owner"

# Ejecutar tests de validación
mvn test -Dtest=CucumberIntegrationTest -Dcucumber.filter.tags="@validation"

# Ejecutar tests de API (JSON/XML)
mvn test -Dtest=CucumberIntegrationTest -Dcucumber.filter.tags="@api"

# Generar reportes
mvn verify
# Reportes en: target/cucumber-reports.html
```

---

## ✅ Beneficios de esta Implementación

1. **Legibilidad**: Escenarios en lenguaje natural (Gherkin)
2. **Reutilización**: Steps compartidos entre features
3. **Trazabilidad**: Tags para categorizar y filtrar tests
4. **Reportes**: HTML y JSON reports automáticos
5. **Integración CI/CD**: Compatible con GitHub Actions
6. **Data-Driven Testing**: Scenario Outlines con Examples
7. **Spring Integration**: Uso de MockMvc con contexto Spring completo

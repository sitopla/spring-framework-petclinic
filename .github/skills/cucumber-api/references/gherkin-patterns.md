# Gherkin Patterns for API Testing

## Table of Contents

1. [CRUD Operations](#crud-operations)
2. [Authentication](#authentication)
3. [Validation Errors](#validation-errors)
4. [Pagination](#pagination)
5. [Search and Filter](#search-and-filter)

## CRUD Operations

### Create Resource

```gherkin
Feature: Create Owner
  As a clinic administrator
  I want to register new pet owners
  So that they can book appointments

  Scenario: Create owner with valid data
    Given I am an authenticated admin
    When I POST "/owners/new" with:
      | firstName | lastName | address       | city    | telephone  |
      | John      | Doe      | 123 Main St   | Madison | 6085551234 |
    Then the response status should be 201
    And the response should contain "John"
    And the owner should be saved in database

  Scenario: Create owner with missing required fields
    When I POST "/owners/new" with:
      | firstName |
      | John      |
    Then the response status should be 400
    And the response should contain "lastName is required"
```

### Read Resource

```gherkin
Feature: Get Owners
  Scenario: Get owner by ID
    Given an owner exists with id 1
    When I GET "/owners/1"
    Then the response status should be 200
    And the response should contain:
      | field     | value  |
      | firstName | George |
      | lastName  | Franklin |

  Scenario: Get non-existent owner
    When I GET "/owners/9999"
    Then the response status should be 404
```

### Update Resource

```gherkin
Feature: Update Owner
  Scenario: Update owner successfully
    Given an owner exists with id 1
    When I PUT "/owners/1" with:
      | firstName | lastName | address        | city    | telephone  |
      | George    | Updated  | 110 W. Liberty | Madison | 6085551023 |
    Then the response status should be 200
    And the owner 1 should have lastName "Updated"
```

### Delete Resource

```gherkin
Feature: Delete Owner
  Scenario: Delete owner with no pets
    Given an owner exists with id 1 and has no pets
    When I DELETE "/owners/1"
    Then the response status should be 204
    And owner 1 should not exist in database

  Scenario: Cannot delete owner with pets
    Given an owner exists with id 1 and has pets
    When I DELETE "/owners/1"
    Then the response status should be 409
    And the response should contain "Cannot delete owner with existing pets"
```

## Authentication

```gherkin
Feature: API Authentication
  Scenario: Access protected resource without token
    When I GET "/api/admin/dashboard"
    Then the response status should be 401

  Scenario: Access protected resource with valid token
    Given I have a valid JWT token for user "admin"
    When I GET "/api/admin/dashboard" with authorization
    Then the response status should be 200

  Scenario: Access resource with expired token
    Given I have an expired JWT token
    When I GET "/api/admin/dashboard" with authorization
    Then the response status should be 401
    And the response should contain "Token expired"
```

## Validation Errors

```gherkin
Feature: Input Validation
  Scenario Outline: Validate owner fields
    When I POST "/owners/new" with:
      | firstName   | lastName   | telephone   |
      | <firstName> | <lastName> | <telephone> |
    Then the response status should be <status>
    And the response should contain "<message>"

    Examples:
      | firstName | lastName | telephone   | status | message                    |
      |           | Doe      | 6085551234  | 400    | firstName is required      |
      | John      |          | 6085551234  | 400    | lastName is required       |
      | John      | Doe      | abc         | 400    | telephone must be numeric  |
      | John      | Doe      | 6085551234  | 201    | created successfully       |
```

## Pagination

```gherkin
Feature: List Owners with Pagination
  Background:
    Given the database contains 50 owners

  Scenario: Get first page of owners
    When I GET "/owners?page=0&size=10"
    Then the response status should be 200
    And the response should contain 10 owners
    And the response should have pagination info:
      | totalElements | 50 |
      | totalPages    | 5  |
      | currentPage   | 0  |

  Scenario: Get last page of owners
    When I GET "/owners?page=4&size=10"
    Then the response status should be 200
    And the response should contain 10 owners
```

## Search and Filter

```gherkin
Feature: Search Owners
  Scenario: Search owners by last name
    Given owners exist:
      | firstName | lastName |
      | George    | Franklin |
      | Betty     | Davis    |
      | Eduardo   | Rodriguez |
    When I GET "/owners?lastName=Davis"
    Then the response status should be 200
    And the response should contain 1 owner
    And the first owner should have firstName "Betty"

  Scenario: Search with no results
    When I GET "/owners?lastName=NonExistent"
    Then the response status should be 200
    And the response should contain 0 owners
```

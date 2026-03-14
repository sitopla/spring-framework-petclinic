# Skill: Tests de Aceptación con Cucumber y RestAssured

**Contexto:** Validación de Historias de Usuario mediante BDD para endpoints REST.

**Reglas de Generación:**
1. **Features:** Crear archivos `.feature` en `src/test/resources/features` usando lenguaje Gherkin.
2. **Step Definitions:** Usar `RestAssured` para realizar las llamadas HTTP.
3. **Aserciones:** Utilizar `AssertJ` para verificar el cuerpo de la respuesta y los códigos de estado.

**Ejemplo de Referencia:**
```gherkin
Feature: Gestión de Usuarios
  Scenario: Crear un nuevo usuario exitosamente
    Given un usuario con email "test@example.com"
    When envío una solicitud POST a "/api/users"
    Then el código de respuesta debe ser 201

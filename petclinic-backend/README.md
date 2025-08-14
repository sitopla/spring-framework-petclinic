# PetClinic Backend - Spring Boot REST API

This is the backend component of the decoupled PetClinic application, built with Spring Boot and providing RESTful APIs for the Angular frontend.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **Spring Web**
- **Spring Validation**
- **H2/MySQL/PostgreSQL**
- **OpenAPI 3 (Swagger)**
- **MapStruct** (for DTO mapping)

## Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.8 or higher

### Run the Application

```bash
# Clone and navigate to backend directory
cd petclinic-backend

# Run with Maven wrapper
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/petclinic-backend-0.0.1-SNAPSHOT.jar
```

The API will be available at: **http://localhost:8080**

### API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### Database Access

**H2 Console** (default): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:petclinic`
- Username: `sa`
- Password: (leave empty)

## Configuration

### Database Profiles

The application supports multiple databases through Spring profiles:

**H2 (Default)**
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:petclinic
    username: sa
    password: 
```

**MySQL**
```yaml
spring:
  profiles:
    active: mysql
  datasource:
    url: jdbc:mysql://localhost:3306/petclinic
    username: petclinic
    password: petclinic
```

**PostgreSQL**
```yaml
spring:
  profiles:
    active: postgresql
  datasource:
    url: jdbc:postgresql://localhost:5432/petclinic
    username: postgres
    password: petclinic
```

### CORS Configuration

CORS is configured to allow requests from the Angular frontend:
- **Allowed Origins**: `http://localhost:4200`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: All headers

## API Endpoints

### Owners
- `GET /api/owners` - List/search owners
- `GET /api/owners/{id}` - Get owner by ID  
- `POST /api/owners` - Create owner
- `PUT /api/owners/{id}` - Update owner
- `DELETE /api/owners/{id}` - Delete owner

### Pets
- `GET /api/owners/{ownerId}/pets` - Get pets by owner
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/owners/{ownerId}/pets` - Create pet
- `PUT /api/pets/{id}` - Update pet  
- `DELETE /api/pets/{id}` - Delete pet
- `GET /api/pet-types` - List pet types

### Visits
- `GET /api/pets/{petId}/visits` - Get visits by pet
- `POST /api/pets/{petId}/visits` - Create visit
- `PUT /api/visits/{id}` - Update visit
- `DELETE /api/visits/{id}` - Delete visit

### Vets  
- `GET /api/vets` - List veterinarians
- `GET /api/vets/{id}` - Get vet by ID

## Sample Data

The application includes sample data that is loaded on startup:
- 6 pet types (cat, dog, lizard, snake, bird, hamster)
- 3 specialties (radiology, surgery, dentistry)  
- 6 veterinarians with various specialties
- 10 owners with contact information
- 13 pets of various types
- 4 visit records

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected errors

All error responses follow a consistent format with helpful error messages.

## Testing

Run the test suite:
```bash
./mvnw test
```

## Building for Production

```bash
# Create executable JAR
./mvnw clean package

# Run the JAR
java -jar target/petclinic-backend-0.0.1-SNAPSHOT.jar

# With specific profile
java -jar target/petclinic-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

## Docker Support

Create a Dockerfile for containerization:

```dockerfile
FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY target/petclinic-backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
docker build -t petclinic-backend .
docker run -p 8080:8080 petclinic-backend
```
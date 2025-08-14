# PetClinic Decoupled Architecture

This is a decoupled version of the Spring PetClinic application, featuring:
- **Backend**: Spring Boot REST API
- **Frontend**: Angular Single Page Application

## Architecture Overview

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.1 with Java 17
- **Database**: H2 (in-memory), MySQL, PostgreSQL support
- **API**: RESTful endpoints with OpenAPI/Swagger documentation
- **Authentication**: CORS enabled for Angular frontend
- **Port**: 8080

### Frontend (Angular)
- **Framework**: Angular 17 with TypeScript
- **UI Library**: Angular Material
- **HTTP Client**: Angular HttpClient with RxJS
- **Architecture**: Standalone components, lazy loading
- **Port**: 4200

## Project Structure

```
├── petclinic-backend/           # Spring Boot REST API
│   ├── src/main/java/
│   │   └── org/springframework/samples/petclinic/
│   │       ├── model/           # JPA Entities
│   │       ├── dto/             # Data Transfer Objects  
│   │       ├── repository/      # Spring Data JPA Repositories
│   │       ├── service/         # Business Logic
│   │       ├── controller/      # REST Controllers
│   │       └── config/          # Configuration
│   └── src/main/resources/
│       ├── application.yml      # Application configuration
│       └── data.sql            # Sample data
│
└── petclinic-frontend/         # Angular SPA
    └── src/app/
        ├── core/               # Core services and models
        │   ├── models/         # TypeScript interfaces
        │   └── services/       # HTTP services
        ├── features/           # Feature modules
        │   ├── owners/         # Owner management
        │   └── vets/           # Veterinarian listing
        └── app.component.ts    # Root component
```

## REST API Endpoints

### Owners
- `GET /api/owners` - Search owners (optional ?lastName=)
- `GET /api/owners/{id}` - Get owner by ID
- `POST /api/owners` - Create new owner
- `PUT /api/owners/{id}` - Update owner
- `DELETE /api/owners/{id}` - Delete owner

### Pets  
- `GET /api/owners/{ownerId}/pets` - Get pets for owner
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/owners/{ownerId}/pets` - Add pet to owner
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet
- `GET /api/pet-types` - Get all pet types

### Visits
- `GET /api/pets/{petId}/visits` - Get visits for pet
- `POST /api/pets/{petId}/visits` - Add visit to pet
- `PUT /api/visits/{id}` - Update visit
- `DELETE /api/visits/{id}` - Delete visit

### Vets
- `GET /api/vets` - Get all veterinarians
- `GET /api/vets/{id}` - Get vet by ID

## Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 18+**  
- **Maven 3.8+**
- **Angular CLI** (`npm install -g @angular/cli`)

### Running the Backend

1. Navigate to backend directory:
   ```bash
   cd petclinic-backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. The API will be available at: http://localhost:8080
4. Swagger UI: http://localhost:8080/swagger-ui.html
5. H2 Console: http://localhost:8080/h2-console

### Running the Frontend

1. Navigate to frontend directory:
   ```bash
   cd petclinic-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will be available at: http://localhost:4200

### Database Configuration

The backend uses H2 in-memory database by default. To use MySQL or PostgreSQL:

**MySQL:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/petclinic
    username: petclinic
    password: petclinic
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    database: mysql
```

**PostgreSQL:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/petclinic
    username: postgres
    password: petclinic
    driver-class-name: org.postgresql.Driver
  jpa:
    database: postgresql
```

## Development Features

### Backend Features
- **OpenAPI Documentation**: Auto-generated API docs
- **CORS Support**: Configured for Angular frontend
- **Data Validation**: Bean validation with custom error handling
- **Exception Handling**: Global exception handler
- **Database Flexibility**: H2, MySQL, PostgreSQL support
- **Spring Profiles**: Different configurations for environments

### Frontend Features
- **Lazy Loading**: Feature modules loaded on demand  
- **Reactive Forms**: Form validation and error handling
- **Material Design**: Modern UI with Angular Material
- **Type Safety**: Full TypeScript typing
- **HTTP Interceptors**: Centralized error handling
- **Responsive Design**: Works on mobile and desktop

## Key Differences from Original

1. **Separation of Concerns**: Frontend and backend are completely separate applications
2. **Modern Stack**: Latest Angular and Spring Boot versions
3. **API-First**: RESTful API design with proper HTTP methods
4. **TypeScript**: Full type safety on frontend
5. **Material Design**: Modern, responsive UI
6. **Standalone Architecture**: Each application can be deployed independently

## Testing

### Backend Tests
```bash
cd petclinic-backend
./mvnw test
```

### Frontend Tests  
```bash
cd petclinic-frontend
npm test
```

## Build for Production

### Backend
```bash
cd petclinic-backend
./mvnw clean package
java -jar target/petclinic-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd petclinic-frontend
npm run build
# Serve dist/ folder with any web server
```

## Next Steps

This decoupled architecture provides the foundation for:

1. **Microservices**: Split backend into smaller services
2. **Mobile Apps**: REST API can serve mobile applications
3. **Multiple Frontends**: Different UIs can consume the same API
4. **Independent Scaling**: Scale frontend and backend separately
5. **Technology Flexibility**: Upgrade Angular or Spring Boot independently

## Contributing

This is a demonstration project showing how to decouple a traditional Spring MVC application into a modern Angular + Spring Boot architecture.
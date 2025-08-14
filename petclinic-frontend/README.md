# PetClinic Frontend - Angular SPA

This is the frontend component of the decoupled PetClinic application, built with Angular 17 and Angular Material, consuming REST APIs from the Spring Boot backend.

## Technology Stack

- **Angular 17**
- **TypeScript 5.2**
- **Angular Material 17**
- **RxJS 7.8**
- **Angular CLI 17**

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation and Run

```bash
# Navigate to frontend directory
cd petclinic-frontend

# Install dependencies
npm install

# Start development server
npm start
# or
ng serve

# Open browser
http://localhost:4200
```

### Build for Production

```bash
# Build for production
npm run build
# or
ng build --configuration production

# Serve built files (from dist/ folder)
npx serve dist/petclinic-frontend
```

## Application Structure

```
src/app/
├── core/                       # Core services and models
│   ├── models/                 # TypeScript interfaces
│   │   ├── owner.model.ts
│   │   ├── pet.model.ts
│   │   ├── visit.model.ts
│   │   ├── vet.model.ts
│   │   └── index.ts
│   └── services/               # HTTP services
│       ├── owner.service.ts
│       ├── pet.service.ts
│       ├── visit.service.ts
│       └── vet.service.ts
├── features/                   # Feature modules
│   ├── owners/                 # Owner management
│   │   ├── owner-list/         # List and search owners
│   │   ├── owner-detail/       # Owner details with pets
│   │   ├── owner-form/         # Create/edit owner
│   │   └── owners.routes.ts
│   └── vets/                   # Veterinarian listing
│       ├── vet-list/           # List all vets
│       └── vets.routes.ts
├── app.component.ts            # Root component
├── app.routes.ts               # Application routes
└── main.ts                     # Application bootstrap
```

## Features

### Owner Management
- **Search Owners**: Find owners by last name or view all
- **Owner Details**: View owner information with pets and visit history
- **Add/Edit Owner**: Create new owners or update existing ones
- **Form Validation**: Comprehensive form validation with error messages

### Pet Management
- **View Pets**: See all pets for an owner with details
- **Add Pet**: Add new pets to owners (future feature)
- **Edit Pet**: Update pet information (future feature)
- **Pet Types**: Support for different pet types

### Veterinarian Directory  
- **List Vets**: View all veterinarians
- **Specialties**: See vet specialties with visual chips

### Visit Tracking
- **Visit History**: View past visits for each pet
- **Add Visits**: Schedule new visits (future feature)

## Technical Features

### Modern Angular Architecture
- **Standalone Components**: No NgModules, modern Angular approach
- **Lazy Loading**: Feature modules loaded on demand
- **Reactive Programming**: RxJS for HTTP operations and state management

### Material Design
- **Angular Material**: Modern, accessible UI components
- **Responsive Layout**: Works on desktop and mobile
- **Theme Support**: Material Design theming

### Form Management  
- **Reactive Forms**: Template-driven and model-driven forms
- **Validation**: Built-in and custom validators
- **Error Handling**: User-friendly error messages

### HTTP Communication
- **HttpClient**: Angular's modern HTTP client
- **Type Safety**: Full TypeScript typing for API responses  
- **Error Handling**: Centralized error handling
- **Loading States**: Progress indicators during API calls

## Configuration

### API Base URL
The backend API URL is configured in each service. To change it, update the `apiUrl` in:
- `src/app/core/services/owner.service.ts`
- `src/app/core/services/pet.service.ts`  
- `src/app/core/services/visit.service.ts`
- `src/app/core/services/vet.service.ts`

### Environment Configuration
Create environment files for different deployments:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// src/environments/environment.prod.ts  
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## Available Scripts

```bash
# Development server
npm start
ng serve

# Build for production
npm run build
ng build

# Run tests
npm test
ng test

# Lint code  
ng lint

# Build and watch for changes
npm run watch
ng build --watch
```

## Testing

### Unit Tests
```bash
npm test
# or
ng test
```

### End-to-End Tests  
```bash
# Install e2e dependencies
ng add @angular/e2e

# Run e2e tests
ng e2e
```

## Routing

The application uses Angular Router with lazy loading:

- `/` - Redirects to `/owners`
- `/owners` - Owner list and search
- `/owners/new` - Create new owner
- `/owners/:id` - Owner details
- `/owners/:id/edit` - Edit owner
- `/vets` - Veterinarian list

## Deployment

### Development
```bash
ng serve --host 0.0.0.0 --port 4200
```

### Production Build
```bash
ng build --configuration production
```

### Docker Deployment
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/petclinic-frontend /usr/share/nginx/html
EXPOSE 80
```

### Static Hosting
The built application can be deployed to:
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `angular-cli-ghpages`
- **AWS S3**: Upload `dist/` folder and configure static hosting

## Future Enhancements

### Planned Features
- Pet management (add/edit/delete pets)
- Visit management (add/edit visits)  
- Search and filters for all entities
- User authentication and authorization
- Offline support with Service Workers
- PWA capabilities
- Real-time updates with WebSockets

### Technical Improvements
- State management with NgRx
- Internationalization (i18n)
- Advanced error handling
- Loading skeletons
- Accessibility improvements
- Performance optimizations

## Contributing

This frontend application demonstrates modern Angular development practices:
- Standalone components
- Signal-based reactive programming (Angular 16+)
- Angular Material design system
- TypeScript best practices
- Modern tooling and build system
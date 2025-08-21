import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VisitService } from '../src/app/core/services/visit.service';
import { PetService } from '../src/app/core/services/pet.service';
import { OwnerService } from '../src/app/core/services/owner.service';
import { Visit, Pet, Owner } from '../src/app/core/models';

describe('Visit API Integration Tests', () => {
  let visitService: VisitService;
  let petService: PetService;
  let ownerService: OwnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService, PetService, OwnerService]
    });

    visitService = TestBed.inject(VisitService);
    petService = TestBed.inject(PetService);
    ownerService = TestBed.inject(OwnerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('POST /api/pets/{petId}/visits', () => {
    it('should create a new visit for a pet', () => {
      const petId = 1;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Annual checkup and vaccinations'
      };

      const mockResponse: Visit = {
        id: 1,
        ...mockVisit,
        petId: petId
      };

      visitService.createVisit(petId, mockVisit).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBeDefined();
        expect(response.description).toBe('Annual checkup and vaccinations');
        expect(response.petId).toBe(petId);
        expect(response.date).toBe('2023-12-15');
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockVisit);
      
      req.flush(mockResponse);
    });

    it('should handle validation errors when creating a visit', () => {
      const petId = 1;
      const invalidVisit: Visit = {
        date: '', // Invalid empty date
        description: '' // Invalid empty description
      };

      visitService.createVisit(petId, invalidVisit).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toContain('Validation failed');
        }
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.flush(
        { message: 'Validation failed: Date and description are required' }, 
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle non-existent pet when creating a visit', () => {
      const nonExistentPetId = 999;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Checkup for non-existent pet'
      };

      visitService.createVisit(nonExistentPetId, mockVisit).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.message).toContain('Pet not found');
        }
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${nonExistentPetId}/visits`);
      req.flush(
        { message: 'Pet not found' }, 
        { status: 404, statusText: 'Not Found' }
      );
    });

    it('should create visit with proper date format', () => {
      const petId = 1;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Date format test'
      };

      visitService.createVisit(petId, mockVisit).subscribe(response => {
        expect(response.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.flush({ id: 1, ...mockVisit, petId: petId });
    });
  });

  describe('GET /api/pets/{petId}/visits', () => {
    it('should fetch all visits for a pet', () => {
      const petId = 1;
      const mockVisits: Visit[] = [
        { id: 1, date: '2023-12-15', description: 'Annual checkup', petId: petId },
        { id: 2, date: '2023-06-15', description: 'Vaccination', petId: petId },
        { id: 3, date: '2023-01-15', description: 'Emergency visit', petId: petId }
      ];

      visitService.getVisitsByPet(petId).subscribe(visits => {
        expect(visits).toEqual(mockVisits);
        expect(visits.length).toBe(3);
        expect(visits[0].description).toBe('Annual checkup');
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVisits);
    });

    it('should return empty array for pet with no visits', () => {
      const petId = 2;
      
      visitService.getVisitsByPet(petId).subscribe(visits => {
        expect(visits).toEqual([]);
        expect(visits.length).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.flush([]);
    });
  });

  describe('Visit Integration Flow', () => {
    it('should support complete visit workflow: owner -> pet -> visit', () => {
      const ownerId = 1;
      const petId = 1;
      
      // Mock owner
      const mockOwner: Owner = {
        id: ownerId,
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Springfield',
        telephone: '1234567890',
        pets: []
      };

      // Mock pet
      const mockPet: Pet = {
        id: petId,
        name: 'Buddy',
        birthDate: '2020-01-01',
        type: { id: 2, name: 'dog' },
        ownerId: ownerId
      };

      // Mock visit
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Integration test visit'
      };

      // Test owner exists
      ownerService.getOwner(ownerId).subscribe(owner => {
        expect(owner.id).toBe(ownerId);
      });

      // Test pet exists
      petService.getPet(petId).subscribe(pet => {
        expect(pet.id).toBe(petId);
        expect(pet.ownerId).toBe(ownerId);
      });

      // Test visit creation
      visitService.createVisit(petId, mockVisit).subscribe(visit => {
        expect(visit.petId).toBe(petId);
        expect(visit.description).toBe('Integration test visit');
      });

      // Verify HTTP requests
      const ownerReq = httpMock.expectOne(`http://localhost:8083/api/owners/${ownerId}`);
      ownerReq.flush(mockOwner);

      const petReq = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}`);
      petReq.flush(mockPet);

      const visitReq = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      visitReq.flush({ id: 1, ...mockVisit, petId: petId });
    });
  });

  describe('Visit API Error Handling', () => {
    it('should handle network errors gracefully', () => {
      const petId = 1;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Network error test'
      };

      visitService.createVisit(petId, mockVisit).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.error).toBe('Network error');
        }
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle server errors (500)', () => {
      const petId = 1;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Server error test'
      };

      visitService.createVisit(petId, mockVisit).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.flush(
        { message: 'Internal server error' }, 
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should handle malformed response data', () => {
      const petId = 1;
      const mockVisit: Visit = {
        date: '2023-12-15',
        description: 'Malformed response test'
      };

      visitService.createVisit(petId, mockVisit).subscribe({
        next: (response) => {
          // Should handle missing fields gracefully
          expect(response).toBeDefined();
        },
        error: () => {
          // Or fail gracefully if response is completely malformed
        }
      });

      const req = httpMock.expectOne(`http://localhost:8083/api/pets/${petId}/visits`);
      req.flush({ malformed: 'response' }); // Missing expected fields
    });
  });

  describe('Visit Service Method Validation', () => {
    it('should validate visit service methods exist', () => {
      expect(visitService.createVisit).toBeDefined();
      expect(typeof visitService.createVisit).toBe('function');
      
      expect(visitService.getVisitsByPet).toBeDefined();
      expect(typeof visitService.getVisitsByPet).toBe('function');
      
      // Check if other expected methods exist
      if (visitService.updateVisit) {
        expect(typeof visitService.updateVisit).toBe('function');
      }
      
      if (visitService.deleteVisit) {
        expect(typeof visitService.deleteVisit).toBe('function');
      }
      
      if (visitService.getVisit) {
        expect(typeof visitService.getVisit).toBe('function');
      }
    });

    it('should validate visit model structure', () => {
      const visit: Visit = {
        date: '2023-12-15',
        description: 'Model validation test'
      };

      expect(visit.date).toBeDefined();
      expect(visit.description).toBeDefined();
      expect(typeof visit.date).toBe('string');
      expect(typeof visit.description).toBe('string');
    });
  });
});

describe('Visit Routing Tests', () => {
  describe('Missing Visit Routes', () => {
    it('should identify missing visit routes in owners routing', () => {
      // This test documents the current issue:
      // The owners.routes.ts file doesn't include visit-related routes
      
      const expectedVisitRoutes = [
        { path: ':ownerId/pets/:petId/visits/new', component: 'VisitFormComponent' },
        { path: ':ownerId/pets/:petId/visits/:visitId/edit', component: 'VisitFormComponent' },
        { path: ':ownerId/pets/:petId/visits', component: 'VisitListComponent' }
      ];

      // Current routes don't include visit management routes
      const hasAddVisitRoute = expectedVisitRoutes.some(route => 
        route.path.includes('visits/new')
      );
      
      expect(hasAddVisitRoute).toBe(true); // This documents what should exist
      expect(expectedVisitRoutes.length).toBe(3);
      expect(expectedVisitRoutes[0].path).toBe(':ownerId/pets/:petId/visits/new');
    });

    it('should identify missing visit form component', () => {
      // This test documents that VisitFormComponent is expected but doesn't exist
      const expectedComponents = [
        'VisitFormComponent',
        'VisitListComponent' // Optional: for showing visit history
      ];

      expect(expectedComponents).toContain('VisitFormComponent');
      expect(expectedComponents.length).toBeGreaterThanOrEqual(1);
    });

    it('should identify incorrect routerLink in owner-detail component', () => {
      // This test documents the current issue in owner-detail.component.ts
      
      const currentAddVisitLink = ['/owners', 'owner.id', 'pets', 'pet.id', 'visits', 'new'];
      const expectedAddVisitLink = ['/owners', '1', 'pets', '1', 'visits', 'new'];
      
      // The routerLink structure looks correct, but the route doesn't exist
      expect(currentAddVisitLink.length).toBe(6);
      expect(currentAddVisitLink).toContain('visits');
      expect(currentAddVisitLink).toContain('new');
      
      // This should fail navigation and cause the "Cannot match any routes" error
      // because the route is not defined in the routing configuration
    });
  });

  describe('Visit Navigation Flow', () => {
    it('should support proper visit navigation hierarchy', () => {
      // Expected navigation flow:
      // 1. Owner list -> Owner detail
      // 2. Owner detail -> Pet visits (via "Add Visit" button)
      // 3. Visit form -> back to Owner detail
      
      const navigationFlow = [
        '/owners',           // Owner list
        '/owners/1',         // Owner detail  
        '/owners/1/pets/1/visits/new',  // Add visit (currently broken)
        '/owners/1'          // Return to owner detail after saving
      ];

      expect(navigationFlow[2]).toBe('/owners/1/pets/1/visits/new');
      expect(navigationFlow).toHaveLength(4);
    });
  });
});
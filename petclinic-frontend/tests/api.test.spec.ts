import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetService } from '../src/app/core/services/pet.service';
import { OwnerService } from '../src/app/core/services/owner.service';
import { Pet, PetType, Owner } from '../src/app/core/models';

describe('API Integration Tests', () => {
  let petService: PetService;
  let ownerService: OwnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService, OwnerService]
    });

    petService = TestBed.inject(PetService);
    ownerService = TestBed.inject(OwnerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('POST /api/owners/{ownerId}/pets', () => {
    it('should create a new pet for an owner', () => {
      const ownerId = 1;
      const mockPetType: PetType = { id: 1, name: 'dog' };
      const mockPet: Pet = {
        name: 'Buddy',
        birthDate: '2023-01-01',
        type: mockPetType,
        ownerId: ownerId
      };

      const mockResponse: Pet = {
        id: 1,
        ...mockPet
      };

      petService.createPet(ownerId, mockPet).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBeDefined();
        expect(response.name).toBe('Buddy');
        expect(response.ownerId).toBe(ownerId);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${ownerId}/pets`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPet);
      
      req.flush(mockResponse);
    });

    it('should handle validation errors when creating a pet', () => {
      const ownerId = 1;
      const invalidPet: Pet = {
        name: '', // Invalid empty name
        birthDate: '2023-01-01',
        type: { id: 1, name: 'dog' }
      };

      petService.createPet(ownerId, invalidPet).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${ownerId}/pets`);
      req.flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle non-existent owner when creating a pet', () => {
      const nonExistentOwnerId = 999;
      const mockPet: Pet = {
        name: 'Buddy',
        birthDate: '2023-01-01',
        type: { id: 1, name: 'dog' }
      };

      petService.createPet(nonExistentOwnerId, mockPet).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${nonExistentOwnerId}/pets`);
      req.flush({ message: 'Owner not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('GET /api/pet-types', () => {
    it('should fetch all pet types', () => {
      const mockPetTypes: PetType[] = [
        { id: 1, name: 'cat' },
        { id: 2, name: 'dog' },
        { id: 3, name: 'lizard' },
        { id: 4, name: 'snake' },
        { id: 5, name: 'bird' },
        { id: 6, name: 'hamster' }
      ];

      petService.getPetTypes().subscribe(petTypes => {
        expect(petTypes).toEqual(mockPetTypes);
        expect(petTypes.length).toBe(6);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/pet-types');
      expect(req.request.method).toBe('GET');
      req.flush(mockPetTypes);
    });
  });

  describe('Owner API Integration', () => {
    it('should verify owner exists before adding pet', () => {
      const ownerId = 1;
      const mockOwner: Owner = {
        id: ownerId,
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Springfield',
        telephone: '1234567890',
        pets: []
      };

      ownerService.getOwner(ownerId).subscribe(owner => {
        expect(owner).toEqual(mockOwner);
        expect(owner.id).toBe(ownerId);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${ownerId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOwner);
    });
  });

  describe('API Error Handling', () => {
    it('should handle network errors gracefully', () => {
      const ownerId = 1;
      const mockPet: Pet = {
        name: 'Buddy',
        birthDate: '2023-01-01',
        type: { id: 1, name: 'dog' }
      };

      petService.createPet(ownerId, mockPet).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.error).toBe('Network error');
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${ownerId}/pets`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle server errors (500)', () => {
      const ownerId = 1;
      const mockPet: Pet = {
        name: 'Buddy',
        birthDate: '2023-01-01',
        type: { id: 1, name: 'dog' }
      };

      petService.createPet(ownerId, mockPet).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/owners/${ownerId}/pets`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
package org.springframework.samples.petclinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.dto.PetDto;
import org.springframework.samples.petclinic.dto.PetTypeDto;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.PetType;
import org.springframework.samples.petclinic.service.OwnerService;
import org.springframework.samples.petclinic.service.PetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Pet", description = "Pet management operations")
public class PetController {

    private final PetService petService;
    private final OwnerService ownerService;

    @Autowired
    public PetController(PetService petService, OwnerService ownerService) {
        this.petService = petService;
        this.ownerService = ownerService;
    }

    @GetMapping("/owners/{ownerId}/pets")
    @Operation(summary = "Get all pets for an owner")
    public ResponseEntity<List<PetDto>> getPetsByOwner(@PathVariable Integer ownerId) {
        List<Pet> pets = petService.findPetsByOwnerId(ownerId);
        List<PetDto> petDtos = pets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(petDtos);
    }

    @GetMapping("/pets/{id}")
    @Operation(summary = "Get pet by ID")
    public ResponseEntity<PetDto> getPet(@PathVariable Integer id) {
        Pet pet = petService.findPetById(id);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(pet));
    }

    @PostMapping("/owners/{ownerId}/pets")
    @Operation(summary = "Add a new pet to owner")
    public ResponseEntity<PetDto> createPet(
            @PathVariable Integer ownerId,
            @Valid @RequestBody PetDto petDto) {
        Owner owner = ownerService.findOwnerById(ownerId);
        if (owner == null) {
            return ResponseEntity.notFound().build();
        }
        
        Pet pet = convertToEntity(petDto);
        pet.setOwner(owner);
        Pet savedPet = petService.savePet(pet);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedPet));
    }

    @PutMapping("/pets/{id}")
    @Operation(summary = "Update an existing pet")
    public ResponseEntity<PetDto> updatePet(
            @PathVariable Integer id,
            @Valid @RequestBody PetDto petDto) {
        if (!petService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Pet pet = convertToEntity(petDto);
        pet.setId(id);
        Pet updatedPet = petService.savePet(pet);
        return ResponseEntity.ok(convertToDto(updatedPet));
    }

    @DeleteMapping("/pets/{id}")
    @Operation(summary = "Delete a pet")
    public ResponseEntity<Void> deletePet(@PathVariable Integer id) {
        if (!petService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pet-types")
    @Operation(summary = "Get all pet types")
    public ResponseEntity<List<PetTypeDto>> getPetTypes() {
        List<PetType> petTypes = petService.findPetTypes();
        List<PetTypeDto> petTypeDtos = petTypes.stream()
                .map(this::convertPetTypeToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(petTypeDtos);
    }

    private PetDto convertToDto(Pet pet) {
        PetDto dto = new PetDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setBirthDate(pet.getBirthDate());
        dto.setOwnerId(pet.getOwner() != null ? pet.getOwner().getId() : null);
        
        if (pet.getType() != null) {
            dto.setType(convertPetTypeToDto(pet.getType()));
        }
        
        return dto;
    }

    private Pet convertToEntity(PetDto dto) {
        Pet pet = new Pet();
        pet.setId(dto.getId());
        pet.setName(dto.getName());
        pet.setBirthDate(dto.getBirthDate());
        
        if (dto.getType() != null && dto.getType().getId() != null) {
            PetType petType = new PetType();
            petType.setId(dto.getType().getId());
            petType.setName(dto.getType().getName());
            pet.setType(petType);
        }
        
        return pet;
    }

    private PetTypeDto convertPetTypeToDto(PetType petType) {
        PetTypeDto dto = new PetTypeDto();
        dto.setId(petType.getId());
        dto.setName(petType.getName());
        return dto;
    }
}
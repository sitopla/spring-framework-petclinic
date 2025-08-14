package org.springframework.samples.petclinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.dto.OwnerDto;
import org.springframework.samples.petclinic.model.Owner;
import org.springframework.samples.petclinic.service.OwnerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Owner", description = "Owner management operations")
public class OwnerController {

    private final OwnerService ownerService;

    @Autowired
    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    @Operation(summary = "Get all owners or search by last name")
    public ResponseEntity<List<OwnerDto>> getOwners(
            @RequestParam(required = false) String lastName) {
        List<Owner> owners = ownerService.findOwnerByLastName(lastName);
        List<OwnerDto> ownerDtos = owners.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ownerDtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get owner by ID")
    public ResponseEntity<OwnerDto> getOwner(@PathVariable Integer id) {
        Owner owner = ownerService.findOwnerById(id);
        if (owner == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(owner));
    }

    @PostMapping
    @Operation(summary = "Create a new owner")
    public ResponseEntity<OwnerDto> createOwner(@Valid @RequestBody OwnerDto ownerDto) {
        Owner owner = convertToEntity(ownerDto);
        Owner savedOwner = ownerService.saveOwner(owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedOwner));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing owner")
    public ResponseEntity<OwnerDto> updateOwner(
            @PathVariable Integer id,
            @Valid @RequestBody OwnerDto ownerDto) {
        if (!ownerService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Owner owner = convertToEntity(ownerDto);
        owner.setId(id);
        Owner updatedOwner = ownerService.saveOwner(owner);
        return ResponseEntity.ok(convertToDto(updatedOwner));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an owner")
    public ResponseEntity<Void> deleteOwner(@PathVariable Integer id) {
        if (!ownerService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ownerService.deleteOwner(id);
        return ResponseEntity.noContent().build();
    }

    private OwnerDto convertToDto(Owner owner) {
        OwnerDto dto = new OwnerDto();
        dto.setId(owner.getId());
        dto.setFirstName(owner.getFirstName());
        dto.setLastName(owner.getLastName());
        dto.setAddress(owner.getAddress());
        dto.setCity(owner.getCity());
        dto.setTelephone(owner.getTelephone());
        
        if (owner.getPets() != null) {
            dto.setPets(owner.getPets().stream()
                    .map(pet -> {
                        var petDto = new org.springframework.samples.petclinic.dto.PetDto();
                        petDto.setId(pet.getId());
                        petDto.setName(pet.getName());
                        petDto.setBirthDate(pet.getBirthDate());
                        if (pet.getType() != null) {
                            var typeDto = new org.springframework.samples.petclinic.dto.PetTypeDto();
                            typeDto.setId(pet.getType().getId());
                            typeDto.setName(pet.getType().getName());
                            petDto.setType(typeDto);
                        }
                        return petDto;
                    })
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private Owner convertToEntity(OwnerDto dto) {
        Owner owner = new Owner();
        owner.setId(dto.getId());
        owner.setFirstName(dto.getFirstName());
        owner.setLastName(dto.getLastName());
        owner.setAddress(dto.getAddress());
        owner.setCity(dto.getCity());
        owner.setTelephone(dto.getTelephone());
        return owner;
    }
}
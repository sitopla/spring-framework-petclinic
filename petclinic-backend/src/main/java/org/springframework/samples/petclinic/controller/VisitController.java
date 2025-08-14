package org.springframework.samples.petclinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.dto.VisitDto;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.Visit;
import org.springframework.samples.petclinic.service.PetService;
import org.springframework.samples.petclinic.service.VisitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Visit", description = "Visit management operations")
public class VisitController {

    private final VisitService visitService;
    private final PetService petService;

    @Autowired
    public VisitController(VisitService visitService, PetService petService) {
        this.visitService = visitService;
        this.petService = petService;
    }

    @GetMapping("/pets/{petId}/visits")
    @Operation(summary = "Get all visits for a pet")
    public ResponseEntity<List<VisitDto>> getVisitsByPet(@PathVariable Integer petId) {
        List<Visit> visits = visitService.findVisitsByPetId(petId);
        List<VisitDto> visitDtos = visits.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(visitDtos);
    }

    @GetMapping("/visits/{id}")
    @Operation(summary = "Get visit by ID")
    public ResponseEntity<VisitDto> getVisit(@PathVariable Integer id) {
        Visit visit = visitService.findVisitById(id);
        if (visit == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(visit));
    }

    @PostMapping("/pets/{petId}/visits")
    @Operation(summary = "Add a new visit to pet")
    public ResponseEntity<VisitDto> createVisit(
            @PathVariable Integer petId,
            @Valid @RequestBody VisitDto visitDto) {
        Pet pet = petService.findPetById(petId);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        
        Visit visit = convertToEntity(visitDto);
        visit.setPet(pet);
        Visit savedVisit = visitService.saveVisit(visit);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedVisit));
    }

    @PutMapping("/visits/{id}")
    @Operation(summary = "Update an existing visit")
    public ResponseEntity<VisitDto> updateVisit(
            @PathVariable Integer id,
            @Valid @RequestBody VisitDto visitDto) {
        if (!visitService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Visit visit = convertToEntity(visitDto);
        visit.setId(id);
        Visit updatedVisit = visitService.saveVisit(visit);
        return ResponseEntity.ok(convertToDto(updatedVisit));
    }

    @DeleteMapping("/visits/{id}")
    @Operation(summary = "Delete a visit")
    public ResponseEntity<Void> deleteVisit(@PathVariable Integer id) {
        if (!visitService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }

    private VisitDto convertToDto(Visit visit) {
        VisitDto dto = new VisitDto();
        dto.setId(visit.getId());
        dto.setDate(visit.getDate());
        dto.setDescription(visit.getDescription());
        dto.setPetId(visit.getPet() != null ? visit.getPet().getId() : null);
        return dto;
    }

    private Visit convertToEntity(VisitDto dto) {
        Visit visit = new Visit();
        visit.setId(dto.getId());
        visit.setDate(dto.getDate());
        visit.setDescription(dto.getDescription());
        return visit;
    }
}
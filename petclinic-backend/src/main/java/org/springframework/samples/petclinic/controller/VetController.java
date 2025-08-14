package org.springframework.samples.petclinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.dto.SpecialtyDto;
import org.springframework.samples.petclinic.dto.VetDto;
import org.springframework.samples.petclinic.model.Specialty;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.VetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vets")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Vet", description = "Veterinarian operations")
public class VetController {

    private final VetService vetService;

    @Autowired
    public VetController(VetService vetService) {
        this.vetService = vetService;
    }

    @GetMapping
    @Operation(summary = "Get all veterinarians")
    public ResponseEntity<List<VetDto>> getVets() {
        List<Vet> vets = vetService.findVets();
        List<VetDto> vetDtos = vets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vetDtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get veterinarian by ID")
    public ResponseEntity<VetDto> getVet(@PathVariable Integer id) {
        Vet vet = vetService.findVetById(id);
        if (vet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(vet));
    }

    private VetDto convertToDto(Vet vet) {
        VetDto dto = new VetDto();
        dto.setId(vet.getId());
        dto.setFirstName(vet.getFirstName());
        dto.setLastName(vet.getLastName());
        
        if (vet.getSpecialties() != null) {
            dto.setSpecialties(vet.getSpecialties().stream()
                    .map(this::convertSpecialtyToDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private SpecialtyDto convertSpecialtyToDto(Specialty specialty) {
        SpecialtyDto dto = new SpecialtyDto();
        dto.setId(specialty.getId());
        dto.setName(specialty.getName());
        return dto;
    }
}
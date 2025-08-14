package org.springframework.samples.petclinic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.PetType;
import org.springframework.samples.petclinic.repository.PetRepository;
import org.springframework.samples.petclinic.repository.PetTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PetService {

    private final PetRepository petRepository;
    private final PetTypeRepository petTypeRepository;

    @Autowired
    public PetService(PetRepository petRepository, PetTypeRepository petTypeRepository) {
        this.petRepository = petRepository;
        this.petTypeRepository = petTypeRepository;
    }

    @Transactional(readOnly = true)
    public Pet findPetById(int id) {
        Optional<Pet> pet = petRepository.findById(id);
        return pet.orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Pet> findPetsByOwnerId(int ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Pet savePet(Pet pet) {
        return petRepository.save(pet);
    }

    public void deletePet(int id) {
        petRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PetType> findPetTypes() {
        return petTypeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public boolean existsById(int id) {
        return petRepository.existsById(id);
    }
}
package org.springframework.samples.petclinic.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vets")
public class Vet extends Person {

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "vet_specialties", 
               joinColumns = @JoinColumn(name = "vet_id"),
               inverseJoinColumns = @JoinColumn(name = "specialty_id"))
    @JsonManagedReference
    private List<Specialty> specialties = new ArrayList<>();

    public List<Specialty> getSpecialties() {
        return this.specialties;
    }

    public void setSpecialties(List<Specialty> specialties) {
        this.specialties = specialties;
    }

    public int getNrOfSpecialties() {
        return getSpecialties().size();
    }

    public void addSpecialty(Specialty specialty) {
        getSpecialties().add(specialty);
    }
}
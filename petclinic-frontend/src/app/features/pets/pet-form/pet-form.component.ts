import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Pet, PetType } from '../../../core/models';
import { PetService } from '../../../core/services/pet.service';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading">
      <mat-card class="pet-form-card">
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? 'Edit Pet' : 'Add New Pet' }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="petForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Pet Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="petForm.get('name')?.hasError('required')">
                  Pet name is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Birth Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="birthDate" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="petForm.get('birthDate')?.hasError('required')">
                  Birth date is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Pet Type</mat-label>
                <mat-select formControlName="typeId" required>
                  <mat-option *ngFor="let type of petTypes" [value]="type.id">
                    {{ type.name }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="petForm.get('typeId')?.hasError('required')">
                  Pet type is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="petForm.invalid || submitting">
                <mat-icon>save</mat-icon>
                {{ isEditMode ? 'Update Pet' : 'Add Pet' }}
              </button>
              
              <button 
                mat-button 
                type="button" 
                [routerLink]="['/owners', ownerId]">
                <mat-icon>cancel</mat-icon>
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .pet-form-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .form-row {
      margin-bottom: 16px;
    }
    
    .form-row mat-form-field {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px;
    }
  `]
})
export class PetFormComponent implements OnInit {
  petForm: FormGroup;
  petTypes: PetType[] = [];
  isEditMode = false;
  ownerId!: number;
  petId?: number;
  loading = true;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private ownerService: OwnerService
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      typeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ownerId = Number(this.route.snapshot.paramMap.get('ownerId'));
    this.petId = Number(this.route.snapshot.paramMap.get('petId'));
    this.isEditMode = !!this.petId;

    this.loadPetTypes();
    
    if (this.isEditMode) {
      this.loadPet();
    } else {
      this.loading = false;
    }
  }

  private loadPetTypes() {
    this.petService.getPetTypes().subscribe({
      next: (types) => {
        this.petTypes = types;
      },
      error: (error) => {
        console.error('Error loading pet types:', error);
      }
    });
  }

  private loadPet() {
    if (this.petId) {
      this.petService.getPet(this.petId).subscribe({
        next: (pet) => {
          this.petForm.patchValue({
            name: pet.name,
            birthDate: new Date(pet.birthDate),
            typeId: pet.type?.id
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading pet:', error);
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.petForm.valid) {
      this.submitting = true;
      
      const formValue = this.petForm.value;
      const petData: Pet = {
        name: formValue.name,
        birthDate: formValue.birthDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        type: this.petTypes.find(type => type.id === formValue.typeId)!,
        ownerId: this.ownerId
      };

      if (this.isEditMode && this.petId) {
        petData.id = this.petId;
        this.petService.updatePet(this.petId, petData).subscribe({
          next: () => {
            this.router.navigate(['/owners', this.ownerId]);
          },
          error: (error) => {
            console.error('Error updating pet:', error);
            this.submitting = false;
          }
        });
      } else {
        this.petService.createPet(this.ownerId, petData).subscribe({
          next: () => {
            this.router.navigate(['/owners', this.ownerId]);
          },
          error: (error) => {
            console.error('Error creating pet:', error);
            this.submitting = false;
          }
        });
      }
    }
  }
}
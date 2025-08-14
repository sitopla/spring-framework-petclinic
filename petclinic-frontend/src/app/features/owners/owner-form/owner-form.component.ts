import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Owner } from '../../../core/models';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <mat-card class="form-container">
      <mat-card-header>
        <mat-card-title>{{isEditMode ? 'Edit' : 'New'}} Owner</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="ownerForm" (ngSubmit)="onSubmit()">
          <mat-form-field class="form-field">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required>
            <mat-error *ngIf="ownerForm.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" required>
            <mat-error *ngIf="ownerForm.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" required>
            <mat-error *ngIf="ownerForm.get('address')?.hasError('required')">
              Address is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" required>
            <mat-error *ngIf="ownerForm.get('city')?.hasError('required')">
              City is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field">
            <mat-label>Telephone</mat-label>
            <input matInput formControlName="telephone" required pattern="[0-9]{10}">
            <mat-error *ngIf="ownerForm.get('telephone')?.hasError('required')">
              Telephone is required
            </mat-error>
            <mat-error *ngIf="ownerForm.get('telephone')?.hasError('pattern')">
              Telephone must be 10 digits
            </mat-error>
          </mat-form-field>

          <div class="button-container">
            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="ownerForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <mat-icon *ngIf="!loading">save</mat-icon>
              {{isEditMode ? 'Update' : 'Create'}} Owner
            </button>
            
            <button mat-button type="button" (click)="cancel()">
              <mat-icon>cancel</mat-icon>
              Cancel
            </button>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{errorMessage}}
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-container {
      max-width: 500px;
      margin: 0 auto;
    }
    
    .form-field {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .button-container {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .error-message {
      color: #f44336;
      margin-top: 10px;
    }
  `]
})
export class OwnerFormComponent implements OnInit {
  ownerForm: FormGroup;
  isEditMode = false;
  ownerId: number | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService
  ) {
    this.ownerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(80)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.ownerId = Number(id);
      this.loadOwner(this.ownerId);
    }
  }

  private loadOwner(id: number) {
    this.ownerService.getOwner(id).subscribe({
      next: (owner) => {
        this.ownerForm.patchValue({
          firstName: owner.firstName,
          lastName: owner.lastName,
          address: owner.address,
          city: owner.city,
          telephone: owner.telephone
        });
      },
      error: (error) => {
        console.error('Error loading owner:', error);
        this.errorMessage = 'Failed to load owner data';
      }
    });
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const owner: Owner = this.ownerForm.value;

      const operation = this.isEditMode && this.ownerId
        ? this.ownerService.updateOwner(this.ownerId, owner)
        : this.ownerService.createOwner(owner);

      operation.subscribe({
        next: (savedOwner) => {
          this.loading = false;
          this.router.navigate(['/owners', savedOwner.id]);
        },
        error: (error) => {
          console.error('Error saving owner:', error);
          this.loading = false;
          this.errorMessage = 'Failed to save owner. Please try again.';
        }
      });
    }
  }

  cancel() {
    if (this.isEditMode && this.ownerId) {
      this.router.navigate(['/owners', this.ownerId]);
    } else {
      this.router.navigate(['/owners']);
    }
  }
}
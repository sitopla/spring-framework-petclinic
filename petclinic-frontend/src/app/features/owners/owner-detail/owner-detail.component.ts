import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Owner } from '../../../core/models';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && owner">
      <mat-card class="owner-card">
        <mat-card-header>
          <mat-card-title>Owner Information</mat-card-title>
          <div class="header-buttons">
            <button mat-raised-button color="primary" [routerLink]="['/owners', owner.id, 'edit']">
              <mat-icon>edit</mat-icon> Edit Owner
            </button>
            <button mat-raised-button color="accent" [routerLink]="['/owners', owner.id, 'pets', 'new']">
              <mat-icon>add</mat-icon> Add New Pet
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <div class="owner-info">
            <div class="info-row">
              <strong>Name:</strong> {{owner.firstName}} {{owner.lastName}}
            </div>
            <div class="info-row">
              <strong>Address:</strong> {{owner.address}}
            </div>
            <div class="info-row">
              <strong>City:</strong> {{owner.city}}
            </div>
            <div class="info-row">
              <strong>Telephone:</strong> {{owner.telephone}}
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="pets-card" *ngIf="owner.pets && owner.pets.length > 0">
        <mat-card-header>
          <mat-card-title>Pets and Visits</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngFor="let pet of owner.pets" class="pet-section">
            <div class="pet-header">
              <h3>{{pet.name}}</h3>
              <div class="pet-buttons">
                <button mat-button color="primary" [routerLink]="['/owners', owner.id, 'pets', pet.id, 'edit']">
                  Edit Pet
                </button>
                <button mat-button color="accent" [routerLink]="['/owners', owner.id, 'pets', pet.id, 'visits', 'new']">
                  Add Visit
                </button>
              </div>
            </div>
            
            <div class="pet-info">
              <div><strong>Birth Date:</strong> {{pet.birthDate | date}}</div>
              <div><strong>Type:</strong> {{pet.type?.name}}</div>
            </div>

            <div *ngIf="pet.visits && pet.visits.length > 0" class="visits-table">
              <h4>Visit History</h4>
              <table mat-table [dataSource]="pet.visits" class="mat-elevation-z1">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Visit Date</th>
                  <td mat-cell *matCellDef="let visit">{{visit.date | date}}</td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let visit">{{visit.description}}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="visitColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: visitColumns;"></tr>
              </table>
            </div>

            <div *ngIf="!pet.visits || pet.visits.length === 0" class="no-visits">
              <p>No visits recorded for this pet.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="!owner.pets || owner.pets.length === 0" class="no-pets">
        <mat-card>
          <mat-card-content>
            <p>No pets registered for this owner.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .owner-card, .pets-card {
      margin-bottom: 20px;
    }
    
    .header-buttons {
      display: flex;
      gap: 10px;
    }
    
    .owner-info {
      display: grid;
      gap: 10px;
    }
    
    .info-row {
      padding: 5px 0;
    }
    
    .pet-section {
      border-bottom: 1px solid #e0e0e0;
      padding: 20px 0;
    }
    
    .pet-section:last-child {
      border-bottom: none;
    }
    
    .pet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .pet-header h3 {
      margin: 0;
      color: #1976d2;
    }
    
    .pet-buttons {
      display: flex;
      gap: 10px;
    }
    
    .pet-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .visits-table {
      margin-top: 15px;
    }
    
    .visits-table h4 {
      margin-bottom: 10px;
      color: #666;
    }
    
    .no-visits, .no-pets {
      text-align: center;
      color: #666;
      margin: 20px 0;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
  `]
})
export class OwnerDetailComponent implements OnInit {
  owner: Owner | null = null;
  loading = true;
  visitColumns: string[] = ['date', 'description'];

  constructor(
    private route: ActivatedRoute,
    private ownerService: OwnerService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOwner(id);
    }
  }

  private loadOwner(id: number) {
    this.ownerService.getOwner(id).subscribe({
      next: (owner) => {
        this.owner = owner;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading owner:', error);
        this.loading = false;
      }
    });
  }
}
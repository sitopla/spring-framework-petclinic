import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { Vet } from '../../../core/models';
import { VetService } from '../../../core/services/vet.service';

@Component({
  selector: 'app-vet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Veterinarians</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!loading && vets.length > 0" class="table-container">
          <table mat-table [dataSource]="vets" class="mat-elevation-z1">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let vet">
                {{vet.firstName}} {{vet.lastName}}
              </td>
            </ng-container>

            <ng-container matColumnDef="specialties">
              <th mat-header-cell *matHeaderCellDef>Specialties</th>
              <td mat-cell *matCellDef="let vet">
                <div *ngIf="vet.specialties && vet.specialties.length > 0; else noSpecialties">
                  <mat-chip-set>
                    <mat-chip *ngFor="let specialty of vet.specialties">
                      {{specialty.name}}
                    </mat-chip>
                  </mat-chip-set>
                </div>
                <ng-template #noSpecialties>
                  <span class="no-specialties">No specialties</span>
                </ng-template>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <div *ngIf="!loading && vets.length === 0">
          <p>No veterinarians found</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .table-container {
      width: 100%;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    
    .no-specialties {
      color: #666;
      font-style: italic;
    }
    
    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  `]
})
export class VetListComponent implements OnInit {
  vets: Vet[] = [];
  loading = false;
  displayedColumns: string[] = ['name', 'specialties'];

  constructor(private vetService: VetService) {}

  ngOnInit() {
    this.loadVets();
  }

  private loadVets() {
    this.loading = true;
    
    this.vetService.getVets().subscribe({
      next: (vets) => {
        this.vets = vets;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vets:', error);
        this.loading = false;
      }
    });
  }
}
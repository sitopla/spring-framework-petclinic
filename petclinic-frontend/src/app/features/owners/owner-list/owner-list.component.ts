import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Owner } from '../../../core/models';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Find Owners</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="search-container">
          <mat-form-field class="form-field">
            <mat-label>Last Name</mat-label>
            <input matInput [(ngModel)]="searchLastName" (keyup.enter)="search()" placeholder="Enter last name">
          </mat-form-field>
          
          <div class="button-container">
            <button mat-raised-button color="primary" (click)="search()">
              <mat-icon>search</mat-icon> Search
            </button>
            <button mat-raised-button color="accent" routerLink="/owners/new">
              <mat-icon>add</mat-icon> Add Owner
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!loading && owners.length > 0" class="table-container">
          <table mat-table [dataSource]="owners" class="mat-elevation-z1">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let owner">
                <a [routerLink]="['/owners', owner.id]">
                  {{owner.firstName}} {{owner.lastName}}
                </a>
              </td>
            </ng-container>

            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let owner">{{owner.address}}</td>
            </ng-container>

            <ng-container matColumnDef="city">
              <th mat-header-cell *matHeaderCellDef>City</th>
              <td mat-cell *matCellDef="let owner">{{owner.city}}</td>
            </ng-container>

            <ng-container matColumnDef="telephone">
              <th mat-header-cell *matHeaderCellDef>Telephone</th>
              <td mat-cell *matCellDef="let owner">{{owner.telephone}}</td>
            </ng-container>

            <ng-container matColumnDef="pets">
              <th mat-header-cell *matHeaderCellDef>Pets</th>
              <td mat-cell *matCellDef="let owner">{{owner.pets?.length || 0}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <div *ngIf="!loading && owners.length === 0 && searched">
          <p>No owners found</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .search-container {
      margin-bottom: 20px;
    }
    
    .button-container {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    .table-container {
      width: 100%;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
    
    a {
      color: #1976d2;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class OwnerListComponent implements OnInit {
  owners: Owner[] = [];
  searchLastName = '';
  loading = false;
  searched = false;
  displayedColumns: string[] = ['name', 'address', 'city', 'telephone', 'pets'];

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.search();
  }

  search() {
    this.loading = true;
    this.searched = true;
    
    this.ownerService.searchOwners(this.searchLastName).subscribe({
      next: (owners) => {
        this.owners = owners;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching owners:', error);
        this.loading = false;
      }
    });
  }
}
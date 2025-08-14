import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./owner-list/owner-list.component').then(c => c.OwnerListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./owner-form/owner-form.component').then(c => c.OwnerFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./owner-detail/owner-detail.component').then(c => c.OwnerDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./owner-form/owner-form.component').then(c => c.OwnerFormComponent)
  }
];
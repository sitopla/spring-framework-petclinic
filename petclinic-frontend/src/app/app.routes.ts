import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/owners',
    pathMatch: 'full'
  },
  {
    path: 'owners',
    loadChildren: () => import('./features/owners/owners.routes').then(r => r.routes)
  },
  {
    path: 'vets',
    loadChildren: () => import('./features/vets/vets.routes').then(r => r.routes)
  }
];
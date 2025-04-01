import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './shared/constants';

const { email, dadType, batch } = ADMIN_ROUTES;
export const routes: Routes = [
  {
    path: '',
    redirectTo: email.path,
    pathMatch: 'full',
  },
  {
    path: email.path,
    loadComponent: () =>
      import('./email/email.component').then(m => m.EmailComponent),
  },
  {
    path: batch.path,
    loadComponent: () =>
      import('./batch/batch.component').then(m => m.BatchComponent),
  },
  {
    path: dadType.path,
    loadComponent: () =>
      import('./dad-type/dad-type.component').then(m => m.DadTypeComponent),
  },
];

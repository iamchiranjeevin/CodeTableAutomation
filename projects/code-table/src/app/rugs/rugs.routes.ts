import { Routes } from '@angular/router';
import { RUGS_ROUTES } from './shared/constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: RUGS_ROUTES.blockedContracts.path,
    pathMatch: 'full',
  },
  {
    path: RUGS_ROUTES.blockedContracts.path,
    loadComponent: () =>
      import('./blocked-contracts/blocked-contracts.component').then(
        m => m.BlockedContractsComponent
      ),
  },
  {
    path: RUGS_ROUTES.rugErrorCodes.path,
    loadComponent: () =>
      import('./rug-error-codes/rug-error-codes.component').then(
        m => m.RugErrorCodesComponent
      ),
  },
];

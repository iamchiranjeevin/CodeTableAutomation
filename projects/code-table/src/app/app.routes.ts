import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { APP_ROUTES } from './shared/constants';

const {
  rugs,
  admin,
  productionTables,
  restricted,
  projects,
  '404': fourFour,
} = APP_ROUTES;
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: projects.path,
  },
  {
    canMatch: [authGuard, roleGuard],
    data: { allowedUserRoles: projects.userRole },
    loadChildren: () =>
      import('./projects/projects.routes').then(m => m.routes),
    loadComponent: () =>
      import('./projects/projects.component').then(m => m.ProjectsComponent),
    path: projects.path,
    title: projects.title,
  },
  {
    canMatch: [authGuard, roleGuard],
    data: { allowedUserRoles: productionTables.userRole },
    loadComponent: () =>
      import('./production-tables/production-tables.component').then(
        m => m.ProductionTablesComponent
      ),
    path: `${productionTables.path}/:id`,
    title: productionTables.title,
  },
  {
    canMatch: [authGuard, roleGuard],
    data: { allowedUserRoles: admin.userRole },
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
    path: admin.path,
    title: admin.title,
  },
  {
    canMatch: [authGuard, roleGuard],
    data: { allowedUserRoles: rugs.userRole },
    loadComponent: () =>
      import('./rugs/rugs.component').then(m => m.RugsComponent),
    loadChildren: () => import('./rugs/rugs.routes').then(m => m.routes),
    path: rugs.path,
    title: rugs.title,
  },
  {
    canMatch: [authGuard],
    data: { allowedUserRoles: restricted.userRole },
    loadComponent: () =>
      import('./restricted/restricted.component').then(
        m => m.RestrictedComponent
      ),
    path: restricted.path,
    title: restricted.title,
  },
  {
    canMatch: [authGuard],
    data: { allowedUserRoles: fourFour.userRole },
    loadComponent: () =>
      import('./four-o-four/four-o-four.component').then(
        c => c.FourOFourComponent
      ),
    path: '**',
    title: fourFour.title,
  },
];

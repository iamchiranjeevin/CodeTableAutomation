import { Routes } from '@angular/router';
import { PROJECTS_ROUTES } from './shared/constants';

const { testPhases, workInProgress, archived, deleted } = PROJECTS_ROUTES;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: workInProgress.path,
  },
  {
    loadComponent: () =>
      import('./work-in-progress/work-in-progress.component').then(
        c => c.WorkInProgressComponent
      ),
    path: workInProgress.path,
  },
  {
    loadComponent: () =>
      import('./work-in-progress/work-in-progress.component').then(
        c => c.WorkInProgressComponent
      ),
    path: `${workInProgress.path}/:id`,
  },
  {
    loadComponent: () =>
      import('./test-phases/test-phases.component').then(
        m => m.TestPhasesComponent
      ),
    loadChildren: () =>
      import('./test-phases/test-phases.routes').then(m => m.testPhasesRoutes),
    path: testPhases.path,
  },
  {
    loadComponent: () =>
      import('./archived/archived.component').then(m => m.ArchivedComponent),
    path: archived.path,
  },
  {
    loadComponent: () =>
      import('./archived/archived.component').then(m => m.ArchivedComponent),
    path: `${archived.path}/:id`,
  },
  {
    loadComponent: () =>
      import('./deleted/deleted.component').then(m => m.DeletedComponent),
    path: deleted.path,
  },
  {
    loadComponent: () =>
      import('./deleted/deleted.component').then(m => m.DeletedComponent),
    path: `${deleted.path}/:id`,
  },
];

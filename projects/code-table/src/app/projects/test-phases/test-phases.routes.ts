import { Routes } from '@angular/router';
import { TEST_PHASES_ROUTES } from './shared/constants';

let _tmp_webstorm_ = TEST_PHASES_ROUTES;
const { test, beforeTest, tested } = TEST_PHASES_ROUTES;
export const testPhasesRoutes: Routes = [
  {
    path: '',
    redirectTo: beforeTest.path,
    pathMatch: 'full',
  },
  {
    path: beforeTest.path,
    loadComponent: () =>
      import('./before-tmhp-test/before-tmhp-test.component').then(
        m => m.BeforeTmhpTestComponent
      ),
  },
  {
    path: `${beforeTest.path}/:id`,
    loadComponent: () =>
      import('./before-tmhp-test/before-tmhp-test.component').then(
        m => m.BeforeTmhpTestComponent
      ),
  },
  {
    path: test.path,
    loadComponent: () =>
      import('./tmhp-test/tmhp-test.component').then(m => m.TmhpTestComponent),
  },
  {
    path: `${test.path}/:id`,
    loadComponent: () =>
      import('./tmhp-test/tmhp-test.component').then(m => m.TmhpTestComponent),
  },
  {
    path: tested.path,
    loadComponent: () =>
      import('./tested/tested.component').then(m => m.TestedComponent),
  },
  {
    path: `${tested.path}/:id`,
    loadComponent: () =>
      import('./tested/tested.component').then(m => m.TestedComponent),
  },
];

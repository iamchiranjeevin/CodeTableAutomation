import { AppRoute, AppRoutesKeys, UserRole } from './types';
import { ADMIN_ROUTES } from '../admin/shared/constants';
import { PROJECTS_ROUTES } from '../projects/shared/constants';
import { RUGS_ROUTES } from '../rugs/shared/constants';
import { v4 as uuidv4 } from 'uuid';

export const AppRoutes = [
  'admin',
  'productionTables',
  'projects',
  'rugs',
] as const;

export const APP_ROUTES: AppRoute<
  AppRoutesKeys,
  '',
  typeof ADMIN_ROUTES | typeof PROJECTS_ROUTES | typeof RUGS_ROUTES
> = {
  '404': { path: '404', title: '404 Page not found', parent: '' },
  admin: {
    children: ADMIN_ROUTES,
    parent: '',
    path: 'admin',
    title: 'Admin',
    userRole: [UserRole.admin],
    id: uuidv4(),
  },
  productionTables: {
    path: 'production-tables',
    title: 'Production Tables',
    userRole: [UserRole.admin, UserRole.readWrite],
    parent: '',
    id: uuidv4(),
  },
  projects: {
    children: PROJECTS_ROUTES,
    path: 'projects',
    title: 'Projects',
    userRole: [UserRole.admin, UserRole.readWrite],
    parent: '',
    id: uuidv4(),
  },
  restricted: { path: 'restricted', title: 'Access Restricted', parent: '' },
  rugs: {
    children: RUGS_ROUTES,
    path: 'rugs',
    title: 'RUGS',
    userRole: [UserRole.readOnly],
    parent: '',
    id: uuidv4(),
  },
} as const;

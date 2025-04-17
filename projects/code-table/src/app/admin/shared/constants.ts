import { AppRoute, AppRoutesKeys, UserRole } from '../../shared/types';
import { AdminRoutesKeys } from './types';
import { v4 as uuidv4 } from 'uuid';

export const AdminRoutes = ['email', 'dadType', 'batch'] as const;

export const ADMIN_ROUTES: AppRoute<
  AdminRoutesKeys,
  Extract<AppRoutesKeys, 'admin'>,
  undefined
> = {
  batch: {
    title: 'BATCH',
    path: 'batch',
    userRole: [UserRole.admin],
    parent: 'admin',
    id: uuidv4(),
  },
  dadType: {
    title: 'DAD Type',
    path: 'dad-type',
    userRole: [UserRole.admin],
    parent: 'admin',
    id: uuidv4(),
  },
  email: {
    title: 'E-mail',
    path: 'email',
    userRole: [UserRole.admin],
    parent: 'admin',
    id: uuidv4(),
  },
};

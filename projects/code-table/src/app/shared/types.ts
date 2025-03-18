import { AppRoutes } from './constants';

export enum UserRole {
  admin,
  readOnly,
  readWrite,
}

export type AppRoute<T extends string, P, C> = {
  [K in T]: RouteType<P, C>;
};

export interface RouteType<P, C> {
  title: string;
  id?: string;
  path: string;
  description?: string;
  userRole?: UserRole[];
  children?: C;
  parent: P;
}

export type AppRoutesKeys = ErrorRoutesKeys | (typeof AppRoutes)[number];

export type ErrorRoutesKeys = '404' | 'restricted';

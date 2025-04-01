import { AppRoute, AppRoutesKeys } from '../../shared/types';
import { ProjectsRoutesKeys } from './types';
import { TEST_PHASES_ROUTES } from '../test-phases/shared/constants';
import { v4 as uuidv4 } from 'uuid';

export const ProjectsRoutes = [
  'workInProgress',
  'testPhases',
  'archived',
  'deleted',
] as const;

export const PROJECTS_ROUTES: AppRoute<
  ProjectsRoutesKeys,
  Extract<AppRoutesKeys, 'projects'>,
  typeof TEST_PHASES_ROUTES
> = {
  workInProgress: {
    path: 'work-in-progress',
    title: 'Work in progress',
    parent: 'projects',
    id: uuidv4(),
  },
  testPhases: {
    path: 'test-phases',
    title: 'Test Phases',
    parent: 'projects',
    children: TEST_PHASES_ROUTES,
    id: uuidv4(),
  },
  archived: {
    path: 'archived',
    title: 'Archived',
    parent: 'projects',
    id: uuidv4(),
  },
  deleted: {
    path: 'deleted',
    title: 'Deleted',
    parent: 'projects',
    id: uuidv4(),
  },
} as const;

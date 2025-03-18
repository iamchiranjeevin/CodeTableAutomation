import { TestPhasesRoutesKeys } from './types';
import { AppRoute } from '../../../shared/types';
import { ProjectsRoutesKeys } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

export const TestPhasesRoutes = ['beforeTest', 'test', 'tested'] as const;

export const TEST_PHASES_ROUTES: AppRoute<
  TestPhasesRoutesKeys,
  Extract<ProjectsRoutesKeys, 'testPhases'>,
  undefined
> = {
  beforeTest: {
    title: 'Before TMHP Test',
    path: 'before-tmhp-test',
    parent: 'testPhases',
    id: uuidv4(),
  },
  test: {
    title: 'TMHP Test',
    path: 'tmhp-test',
    parent: 'testPhases',
    id: uuidv4(),
  },
  tested: {
    title: 'Tested',
    path: 'tested',
    parent: 'testPhases',
    id: uuidv4(),
  },
} as const;

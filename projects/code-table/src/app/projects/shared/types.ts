import { ProjectsRoutes } from './constants';

export type ProjectsRoutesKeys = (typeof ProjectsRoutes)[number];

export type ProjectType =
  | 'Testphases'
  | 'archived'
  | 'deleted'
  | 'workinprogress';

export type TestPhaseStatus = 'tmhp_test' | 'tested' | 'before_tmhp';

export type ProjectStatus = 'completed' | 'pending' | 'in_progress' | 'active';

export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  test_phase_status: TestPhaseStatus;
  code_tables: CodeTable[];
}

export interface CodeTable {
  id: number;
  name: string;
  newUpdateFlag: boolean;
  pk1: string;
  pk2: string;
  pk3: string;
}

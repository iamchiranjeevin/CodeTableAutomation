import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProjectsService } from './api/projects.service';
import { Project } from './shared/types';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AppStore } from '../app.store';

interface ProjectsState {
  projects: Project[];
}

const PROJECTS_STORE: ProjectsState = {
  projects: [],
};

export const ProjectsStore = signalStore(
  { providedIn: 'root' },
  withState(PROJECTS_STORE),
  withProps(() => ({
    _projectsService: inject(ProjectsService),
    _appStore: inject(AppStore),
  })),
  withMethods(({ _projectsService, _appStore, ...store }) => ({
    loadProjects: rxMethod<void>(
      pipe(
        switchMap(() => {
          return _projectsService.getProjects().pipe(
            tapResponse({
              next: projects => {
                patchState(store, { projects });
                _appStore.updateProjects(projects);
              },
              error: (error: { message: string }) => {
                patchState(store, { projects: [] });
              },
            })
          );
        })
      )
    ),
  }))
);

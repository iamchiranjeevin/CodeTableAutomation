import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Project } from '../shared/types';
import { getProjectsData } from './projects.mock';

const API_URL = 'http://localhost:3000/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  readonly #httpClient = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    // return this.#httpClient.get<Project[]>(API_URL);
    return of(getProjectsData()).pipe(delay(1000));
  }
}

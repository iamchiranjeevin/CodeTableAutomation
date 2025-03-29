import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectsStore } from './projects.store';

@Component({
  selector: 'app-projects',
  imports: [RouterOutlet],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly #projectsStore = inject(ProjectsStore);
  readonly #projects = this.#projectsStore.projects;
}

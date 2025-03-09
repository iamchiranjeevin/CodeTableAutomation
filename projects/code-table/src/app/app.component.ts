import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProjectsStore } from './projects/projects.store';
import { ProductionTablesStore } from './production-tables/production-tables.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('class') appClass =
    'flex flex-col w-full h-full items-stretch justify-start';
  readonly #projectsStore = inject(ProjectsStore);
  readonly #productionTablesStore = inject(ProductionTablesStore);

  constructor() {
    this.#projectsStore.loadProjects();
    this.#productionTablesStore.loadProductionTables();
  }
}

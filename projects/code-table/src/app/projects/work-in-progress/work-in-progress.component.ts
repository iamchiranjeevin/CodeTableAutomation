import { Component } from '@angular/core';
import { ProjectsTableComponent } from '../test-phases/shared/projects-table/projects-table.component';

@Component({
  selector: 'app-work-in-progress',
  imports: [ProjectsTableComponent],
  templateUrl: './work-in-progress.component.html',
  styleUrl: './work-in-progress.component.scss',
})
export class WorkInProgressComponent {}

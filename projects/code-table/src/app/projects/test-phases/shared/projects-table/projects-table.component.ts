import { AfterViewInit, Component, input, viewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Project } from '../../../shared/types';

@Component({
  selector: 'app-projects-table',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatRow,
    MatHeaderRow,
    MatSortHeader,
  ],
  templateUrl: './projects-table.component.html',
  styleUrl: './projects-table.component.scss',
})
export class ProjectsTableComponent implements AfterViewInit {
  projects = input.required<Project[]>();
  displayedColumns: string[] = [];

  dataSource: MatTableDataSource<Project> = new MatTableDataSource(
    [] as Project[]
  );

  paginator = viewChild.required<MatPaginator>('paginator');

  ngAfterViewInit() {
    this.dataSource.data = this.projects();
    this.dataSource.paginator = this.paginator();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

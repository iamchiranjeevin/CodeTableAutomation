import { NgForOf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatDivider } from '@angular/material/divider';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
import { ActivatedRoute, Params } from '@angular/router';
import { SnakeCaseToStringPipe } from '../shared/pipes/snake-case-to-string.pipe';
import { DynamicDetailsComponent } from './dynamic-details/dynamic-details.component';
import { ProductionTablesStore } from './production-tables.store';
import { ProductionTable, ProductionTableData } from './shared/types';
import { propsToSet } from './shared/utils';
import { ta } from 'date-fns/locale';

@Component({
  selector: 'app-production-tables',
  imports: [
    MatColumnDef,
    MatTable,
    NgForOf,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    SnakeCaseToStringPipe,
    MatPaginator,
    MatDivider,
    MatSort,
    MatSortHeader,
    DynamicDetailsComponent,
  ],
  templateUrl: './production-tables.component.html',
  styleUrl: './production-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()],
})
export class ProductionTablesComponent implements AfterViewInit {
  @HostBinding('class') className = 'h-full';
  tableName = signal('');

  dataSource = new MatTableDataSource<ProductionTableData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected displayedColumns = signal<string[]>([]);
  protected columnsToDisplay = signal<string[]>([]);
  readonly #productionTablesStore = inject(ProductionTablesStore);
  protected readonly dynamicDetails =
    this.#productionTablesStore.getDynamicDetails();
  readonly #route = inject(ActivatedRoute);
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.#route.params
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(params => this.getTableDataById(params));
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showDetails(data: ProductionTableData) {
    this.#productionTablesStore.updateDynamicDetails(data);
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getTableDataById(params: Params) {
    const id = params['id'];
    const tableDetails = this.#productionTablesStore.getTableDetailsById(+id);
    if (!tableDetails) {
      return;
    }
    this.updateTableDetails(tableDetails);
  }

  private updateTableDetails(tableDetails: ProductionTable) {
    const keys = new Set<string>();
    propsToSet(tableDetails, keys);
    this.displayedColumns.set(Array.from(keys));
    this.columnsToDisplay.set(Array.from(keys));
    this.tableName.set(`${tableDetails.name} Production Table`);

    this.dataSource = new MatTableDataSource(tableDetails.data);
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ProductionTablesStore } from './production-tables.store';
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
import { NgForOf } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductionTable, ProductionTableData } from './shared/types';
import { SnakeCaseToStringPipe } from '../shared/pipes/snake-case-to-string.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatDivider } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { propsToSet } from './shared/utils';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { DynamicDetailsComponent } from './dynamic-details/dynamic-details.component';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

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
  dataSource: MatTableDataSource<ProductionTableData>;
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);
  protected displayedColumns = signal<string[]>([]);
  protected columnsToDisplay = signal<string[]>([]);
  protected data = signal<ProductionTableData[]>([]);
  readonly #productionTablesStore = inject(ProductionTablesStore);
  protected readonly dynamicDetails =
    this.#productionTablesStore.getDynamicDetails();
  readonly #route = inject(ActivatedRoute);
  readonly #destroyRef = inject(DestroyRef);
  hiddenColumns = new Set<string>(['PHASE','REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY',
     'UPDATE_DATE', 'UPDATE_BY', 'PHASE_TYPE']);
  columnNameMapping: Record<string, string> = {
      "SERVICE_GRP": "SERVICE_GROUP"
    };

  constructor() {    
    this.#route.params.subscribe(params => {     
      const name = params['name']; 
      if (name) {
        this.#productionTablesStore.loadProductionTables(name);
      }
    });
    effect(() => {
      this.#route.params
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(params => this.loadTableData(params));
    });
    this.dataSource = new MatTableDataSource(this.data());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator() ?? null;
    this.dataSource.sort = this.sort() ?? null;
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

  private loadTableData(params: Params) {
    const tableName = params['name']; 
    if (!tableName) {
      return;
    }

    const tableRows = this.#productionTablesStore.getTableDetails();
    if (!tableRows) {
      return;
    }

    this.updateTableDetails(tableRows);
    
  }


  private updateTableDetails(tableRows: any) {
    const keys = new Set<string>();
    propsToSet(tableRows, keys);
    this.displayedColumns.set(Array.from(keys));
    console.log("Displayed Columns:", this.displayedColumns());
    console.log("Hidden Columns:", this.hiddenColumns);
    this.columnsToDisplay.set(Array.from(keys));
    this.columnsToDisplay.set(this.displayedColumns().filter(column => !this.hiddenColumns.has(column)));
    console.log("Columns to Display:", this.columnsToDisplay());
    //this.tableName.set(`${tableDetails.name} Production Table`);
    this.tableName.set(`SSAS_AUTH_AGENT_AND_HOLD Production Table`);
    this.data.set(tableRows);
  }
}
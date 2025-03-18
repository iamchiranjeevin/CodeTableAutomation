import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  ViewChild,
  ChangeDetectorRef 
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
import { getApiTableName, getDisplayTableName, propsToSet } from './shared/utils';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { DynamicDetailsComponent } from './dynamic-details/dynamic-details.component';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExportDialogComponent } from './shared/export-dialog.component';
import { CommonModule } from '@angular/common';


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
    MatIconModule,
    [CommonModule]
  ],
  templateUrl: './production-tables.component.html',
  styleUrl: './production-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()],
})
export class ProductionTablesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @HostBinding('class') className = 'h-full';
  tableName = signal('');
  dataSource: MatTableDataSource<ProductionTableData>;
  totalRows: number = 0;
  private cdr = inject(ChangeDetectorRef);

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
      "SERVICE_GRP": "SERVICE_GROUP",
      "IS_PROGRAM_ON_HOLD": "PROGRAM_ON_HOLD"
    };    

  constructor(public dialog: MatDialog) {    
    this.#route.params.subscribe(params => {     
      const name = params['name']; 
      if (name) {
        const apiTableName = getApiTableName(name);
        this.#productionTablesStore.loadProductionTables(apiTableName);
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    setTimeout(() => {
      if (this.totalRows > 2500) {
        this.paginator.pageSize = 2500;  
        this.paginator.length = this.totalRows;
        this.paginator.pageSizeOptions = []; 
        this.cdr.detectChanges(); 
      }
    });
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

    const apiTableName = getApiTableName(tableName);
    const tableRows = this.#productionTablesStore.getTableDetails();
    if (!tableRows) {
      return;
    }

    this.totalRows = tableRows.length;
    this.updateTableDetails(tableRows, apiTableName);
    
  }


  private updateTableDetails(tableRows: any, apiTableName: string) {
    const keys = new Set<string>();
    propsToSet(tableRows, keys);
    this.displayedColumns.set(Array.from(keys));
    console.log("Displayed Columns:", this.displayedColumns());
    console.log("Hidden Columns:", this.hiddenColumns);
    this.columnsToDisplay.set(Array.from(keys));
    this.columnsToDisplay.set(this.displayedColumns().filter(column => !this.hiddenColumns.has(column)));
    console.log("Columns to Display:", this.columnsToDisplay());
    //this.tableName.set(`${tableDetails.name} Production Table`);
    const displayTableName = getDisplayTableName(apiTableName);
    this.tableName.set(`${displayTableName} PRODUCTION VIEW`);
    this.data.set(tableRows);
    this.dataSource.data = tableRows;

    if (tableRows.length > 2500) {
      this.dataSource.paginator = this.paginator;
    }
  }

openExportDialog() {
  console.log('Opening Export Dialog...');
  console.log('this.dataSource.data:', JSON.stringify(this.dataSource?.data, null, 2));

  if (!this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0) {
    console.warn('No data available for export!');
    return;
  }

  const dialogRef = this.dialog.open(ExportDialogComponent, {
    width: '600px',
    data: {
      rows: this.dataSource.data, // Pass rows
      columnsToDisplay: this.columnsToDisplay() // Pass column names
    }
  });

  dialogRef.afterClosed().subscribe(selectedData => {
    if (selectedData) {
      this.exportToCSV(selectedData);
    }
  });
}

exportToCSV(selectedRows: any[]) {
  if (selectedRows.length === 0) {
    alert('No rows selected for export!');
    return;
  }
  const headers = this.columnsToDisplay(); // Convert signal to array
  const csvContent = [
    headers.join(','), // Header row
    ...selectedRows.map(row => headers.map(col => row[col]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported_data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

}
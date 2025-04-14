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
import { getApiTableName, getDisplayTableName, propsToSet, trimTableSuffix } from './shared/utils';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { DynamicDetailsComponent } from './dynamic-details/dynamic-details.component';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExportDialogComponent } from './shared/export-dialog.component';
import { CommonModule } from '@angular/common';
import { NoDataDialogComponent } from './no-data-dialog.component';
import { SearchTableDialogComponent } from './search/searchtable-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    [CommonModule],
    MatProgressSpinnerModule
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
      "IS_PROGRAM_ON_HOLD": "PROGRAM_ON_HOLD",
      "SERVICE_LOWER_LIMIT": "RANGE_LOWER_LIMIT",
      "SERVICE_UPPER_LIMIT": "RANGE_UPPER_LIMIT",
      "BILLING_CD": "BILLING_CODE",
      "FUND_CD" : "FUND_CODE"
    };   
  loading = signal(true);

  constructor(public dialog: MatDialog) {    
    this.#route.params.subscribe(params => {     
      const name = params['name']; 
      if (name) {       
                
        // Clear dynamic details before loading new table
        this.#productionTablesStore.updateDynamicDetails(null);
        const apiTableName = getApiTableName(name);        
        this.#productionTablesStore.updateTableName(apiTableName || '');        
        this.#productionTablesStore.loadProductionTables(apiTableName);
      }
    });
    effect(() => { 
      this.loading.set(true);
      const tableData = this.#productionTablesStore.getTableDetails();
      queueMicrotask(() => {
        if (tableData && tableData.length > 0) {          
          this.dataSource.data = tableData;
          this.totalRows = tableData.length;
    
          let apiTableName = this.#productionTablesStore.currentTableName();
          if (!apiTableName) {
            apiTableName = getApiTableName(this.#route.snapshot.params['name']);
          }
    
          this.updateTableDetails(tableData, apiTableName);
          this.loading.set(false);          
        } else if (!this.loading() && Array.isArray(tableData) && tableData.length === 0) {
          this.dialog.open(NoDataDialogComponent, {
            width: '400px',
          });
    
          this.dataSource.data = [];
          this.totalRows = 0;
          this.loading.set(false); 
        }        
      });
    });
      
     // Add a separate effect for handling dynamic details
     effect(() => {
      const dynamicDetails = this.#productionTablesStore.getDynamicDetails();
      if (!dynamicDetails) {
        this.cdr.detectChanges();
      }
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

    const apiTableName = getApiTableName(this.#route.snapshot.params['name']);
     if (apiTableName) {      
       this.#productionTablesStore.loadProductionTables(apiTableName);
     }
  }

  showDetails(row: ProductionTableData) {
    // Update store with selected row details
    this.#productionTablesStore.updateDynamicDetails(row);

    // Force change detection
    this.cdr.detectChanges();
     
    // Scroll to details section after a brief delay to ensure rendering
    setTimeout(() => {
      const detailsElement = document.querySelector('app-dynamic-details');
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  private updateTableDetails(tableRows: any, apiTableName: string) {
    const keys = new Set<string>();
    propsToSet(tableRows, keys);
    // Map the column names
    const mappedKeys = Array.from(keys).map(key => {
      const mappedName = this.columnNameMapping[key];
      if (mappedName) {
        // Update the actual data to use the mapped column name
        tableRows.forEach((row: any) => {
          row[mappedName] = row[key];
          delete row[key];
        });
        return mappedName;
      }
      return key;
    });
    
    this.displayedColumns.set(mappedKeys);
    const tableSpecificHiddenColumns: Record<string, Set<string>> = {
      "SSAS_AUTH_AGENT_AND_HOLD": new Set(['PHASE','REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY',
        'UPDATE_DATE', 'UPDATE_BY', 'PHASE_TYPE']), 
     "SSAS_CAP_THRESHOLD_CEILING": new Set([
         'PHASE', 'REC_ID', 'PHASE_TYPE', 'CREATE_DATE', 'CREATE_BY',
         'UPDATE_DATE', 'UPDATE_BY', 'STATUS'
       ]),
       "CF1": new Set(['PHASE', 'REC_ID', 'ID','PHASE_TYPE','SORT_ORDER','TMHP_FLAG']),
     };
     this.hiddenColumns = tableSpecificHiddenColumns[apiTableName] || new Set();
     this.columnsToDisplay.set(mappedKeys.filter(column => !this.hiddenColumns.has(column)));
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

openDialog() {    
  const apiTableName = trimTableSuffix(this.tableName());
  console.log(`Opening ${apiTableName}`);  

  this.dialog.open(SearchTableDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    data: { tableName: apiTableName }
  });
}

}
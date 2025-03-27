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
    "IS_PROGRAM_ON_HOLD": "PROGRAM_ON_HOLD",
    "SERVICE_LOWER_LIMIT": "RANGE_LOWER_LIMIT",
    "SERVICE_UPPER_LIMIT": "RANGE_UPPER_LIMIT"
  };    

  constructor(public dialog: MatDialog) {    
    this.#route.params.subscribe(params => {     
      const name = params['name']; 
      if (name) {
        // Clear dynamic details before loading new table
        this.#productionTablesStore.updateDynamicDetails(null);
        const apiTableName = getApiTableName(name);
        this.#productionTablesStore.loadProductionTables(apiTableName);
      }
    });
    effect(() => {
      const tableData = this.#productionTablesStore.getTableDetails();
       if (tableData) {
         this.dataSource.data = tableData;
         this.totalRows = tableData.length;
         if (tableData.length > 0) {
           const apiTableName = getApiTableName(this.#route.snapshot.params['name']);
           this.updateTableDetails(tableData, apiTableName);
         }
       }
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
      "MG1_SSAS_AUTH_AGENT_AND_HOLD": new Set(['PHASE','REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY',
        'UPDATE_DATE', 'UPDATE_BY', 'PHASE_TYPE']), 
      "MG1_SSAS_CAP_THRESHOLD_CEILING": new Set([
        'PHASE', 'REC_ID', 'PHASE_TYPE', 'CREATE_DATE', 'CREATE_BY',
        'UPDATE_DATE', 'UPDATE_BY', 'STATUS'
      ]),
      // Add default hidden columns for all new tables
      "MG1_CF1": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CFB": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CFI": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CFM": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CFP": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CFR": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CLC": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CLS": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CMD": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CMR": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CNB": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CNP": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CNC": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_COV": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CPQ": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CPS": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CPT": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CRC": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CSG": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CSI": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CSP": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CSR": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_CSS": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_DA2": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_DA3": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_DAD": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_DCE": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_SSAS_DIAGNOSIS": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_ECC": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_FCD": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_FSR": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_SSAS_SERVICE_RESI_LOCATION": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_LST": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_SSAS_MOVEMENT_SEQUENCES": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_PME": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_SSAS_REFERENCE_TABLE": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY']),
      "MG1_SGO": new Set(['PHASE', 'REC_ID', 'ID', 'CREATE_DATE', 'CREATE_BY', 'UPDATE_DATE', 'UPDATE_BY'])
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

}
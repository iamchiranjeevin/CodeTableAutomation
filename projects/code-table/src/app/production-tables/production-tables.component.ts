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
import { getApiTableName, getDisplayTableName } from './shared/utils';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { DynamicDetailsComponent } from './dynamic-details/dynamic-details.component';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExportDialogComponent } from './shared/export-dialog.component';
import { CommonModule } from '@angular/common';
import { SearchCriteriaDialogComponent } from './components/search-criteria-dialog/search-criteria-dialog.component';
import { SearchCriteriaService } from './services/search-criteria.service';
import { TableConfigService } from './services/table-config.service';
import { TableContextMenuComponent } from './components/table-context-menu/table-context-menu.component';
import { DataTransformationService } from './services/data-transformation.service';

// Helper function to extract all property keys from an array of objects
function propsToSet(arr: any[], set: Set<string>) {
  arr.forEach(obj => {
    Object.keys(obj).forEach(key => set.add(key));
  });
}

@Component({
  selector: 'app-production-tables',
  standalone: true,
  imports: [
    CommonModule,
    MatColumnDef,
    MatTable,
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
    MatDialogModule,
    TableContextMenuComponent
  ],
  templateUrl: './production-tables.component.html',
  styleUrl: './production-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()],
})
export class ProductionTablesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('contextMenu') contextMenu!: TableContextMenuComponent;
  @HostBinding('class') className = 'h-full';
  tableName = signal('');
  dataSource: MatTableDataSource<ProductionTableData>;
  totalRows: number = 0;
  private cdr = inject(ChangeDetectorRef);
  
  columnNameMapping: Record<string, string> = {};

  protected displayedColumns = signal<string[]>([]);
  protected columnsToDisplay = signal<string[]>([]);
  protected data = signal<ProductionTableData[]>([]);
  readonly #productionTablesStore = inject(ProductionTablesStore);
  protected readonly dynamicDetails =
    this.#productionTablesStore.getDynamicDetails();
  readonly #route = inject(ActivatedRoute);
  readonly #destroyRef = inject(DestroyRef);
  hiddenColumns = new Set<string>([]);
  apiConnectionError = false;

  constructor(
    public dialog: MatDialog,
    private tableConfig: TableConfigService,
    private searchCriteriaService: SearchCriteriaService,
    private dataTransformation: DataTransformationService
  ) {    
    this.#route.params.subscribe(params => {     
      const name = params['name']; 
      if (name) {
        // Clear dynamic details before loading new table
        this.#productionTablesStore.updateDynamicDetails(null);
        const apiTableName = this.tableConfig.getApiName(name);
        this.#productionTablesStore.loadProductionTables(apiTableName);
      }
    });
    
    effect(() => {
      const tableData = this.#productionTablesStore.getTableDetails();
      if (tableData) {
        const apiTableName = this.tableConfig.getApiName(this.#route.snapshot.params['name']);
        
        // Transform API data to display format
        const transformedData = this.dataTransformation.transformApiToDisplay(
          apiTableName, 
          tableData
        );
        
        this.updateTableDetails(transformedData, apiTableName);
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

    // Add this to the constructor or a lifecycle hook
    this.setupApiErrorHandling();
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

    const apiTableName = this.tableConfig.getApiName(this.#route.snapshot.params['name']);
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

    const apiTableName = this.tableConfig.getApiName(tableName);
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
    
    // Get column mappings from the service instead of hardcoded mapping
    const columnMappings = this.tableConfig.getColumnMappings(apiTableName);
    
    // Update the columnNameMapping property for use in the template
    this.columnNameMapping = columnMappings;
    
    // Map the column names using the service
    const mappedKeys = Array.from(keys).map(key => {
      const mappedName = columnMappings[key] || key;
      
      // Update the actual data to use the mapped column name
      if (mappedName !== key) {
        tableRows.forEach((row: any) => {
          row[mappedName] = row[key];
          delete row[key];
        });
      }
      
      return mappedName;
    });
    
    this.displayedColumns.set(mappedKeys);
    
    // Use the table config service to get hidden columns
    this.hiddenColumns = new Set(this.tableConfig.getHiddenColumns(apiTableName));
    
    this.columnsToDisplay.set(mappedKeys.filter(column => !this.hiddenColumns.has(column)));
    
    const displayTableName = this.tableConfig.getDisplayName(apiTableName);
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

onTableRightClick(event: MouseEvent, tableName: string) {
  event.preventDefault();
  const config = this.tableConfig.getConfig(tableName);
  
  if (config?.searchConfig?.enabled) {
    // Position and show context menu
    this.contextMenu.x = event.clientX;
    this.contextMenu.y = event.clientY;
    
    // Open the search dialog when menu item is clicked
    this.contextMenu.onSearch = () => {
      this.openSearchDialog(tableName);
    };
  }
}

private openSearchDialog(tableName: string) {
  const config = this.tableConfig.getSearchConfig(tableName);
  if (!config) return;
  
  const dialogRef = this.dialog.open(SearchCriteriaDialogComponent, {
    width: '600px',
    data: { searchConfig: config }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.type === 'finish') {
      const apiTableName = this.tableConfig.getApiName(tableName);
      this.handleSearch(result.data, apiTableName);
    }
  });
}

private handleSearch(searchData: any, tableName: string) {
  // Prepare search data based on table type
  const preparedSearchData = this.prepareSearchData(searchData, tableName);
  
  console.log(`Sending search request for ${tableName}:`, preparedSearchData);
  
  this.searchCriteriaService.searchTable({
    tableName,
    criteria: preparedSearchData
  }).subscribe({
    next: (searchResults) => {
      console.log(`${tableName} search results:`, searchResults);
      const transformedData = this.dataTransformation.transformApiToDisplay(
        tableName, 
        searchResults
      );
      this.updateTableDetails(transformedData, tableName);
    },
    error: (error) => {
      console.error(`${tableName} search failed:`, error);
      this.handleApiError(error);
    }
  });
}

// Extract table-specific search data preparation to a separate method
private prepareSearchData(searchData: any, tableName: string): any {
  if (tableName === 'SSAS_CAP_THRESHOLD_CEILING') {
    return {
      ...searchData,
      SERVICE_GROUP: searchData.SERVICE_GROUP || '',
      CAP_ID: searchData.CAP_ID || '',
      CAP_TYPE: searchData.CAP_TYPE || '',
      SERVICE_CD: searchData.SERVICE_CD || '',
      BEGIN_DATE: searchData.BEGIN_DATE || null,
      END_DATE: searchData.END_DATE || null,
      ACTIVE: searchData.ACTIVE || null,
      HISTORY: searchData.HISTORY || ''
    };
  }
  
  // Default case for other tables
  return searchData;
}

// Setup API error handling in a more robust way
private setupApiErrorHandling() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    if (event.reason?.status === 0) {
      this.apiConnectionError = true;
      this.cdr.detectChanges();
      
      // Reset after 10 seconds
      setTimeout(() => {
        this.apiConnectionError = false;
        this.cdr.detectChanges();
      }, 10000);
    }
  });
}

// Improved error handling
private handleApiError(error: any) {
  console.error('API Error:', error);
  this.apiConnectionError = error.status === 0;
  this.cdr.detectChanges();
  
  // Reset after 10 seconds
  if (this.apiConnectionError) {
    setTimeout(() => {
      this.apiConnectionError = false;
      this.cdr.detectChanges();
    }, 10000);
  }
}

// Add trackBy function for better performance with ngFor
trackByFn(index: number, item: ProductionTableData): any {
  return item['ID'] || index;
}

}
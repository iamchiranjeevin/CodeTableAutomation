import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

export class ProductionTablesComponent {
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  private getSearchConfig(tableName: string) {
    const configs: Record<string, any> = {
      'SSAS_CAP_THRESHOLD_CEILING': {
        fields: [
          { name: 'SERVICE_GROUP', label: 'Service Group', type: 'dropdown' },
          { name: 'CAP_ID', label: 'Cap ID', type: 'dropdown' },
          { name: 'CAP_TYPE', label: 'Cap Type', type: 'dropdown' },
          { name: 'SERVICE_CODE', label: 'Service Code', type: 'dropdown' },
          { name: 'BEGIN_DATE', label: 'Begin Date', type: 'date' },
          { name: 'END_DATE', label: 'End Date', type: 'date' },
          { name: 'ACTIVE', label: 'Active', type: 'dropdown' },
          { name: 'HISTORY', label: 'History', type: 'checkbox' }
        ]
      }
    };
    return configs[tableName];
  }

  openSearchDialog(tableName: string) {
    const searchConfig = this.getSearchConfig(tableName);
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '600px',
      data: { tableName, searchConfig }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Search criteria:', result);
      }
    });
  }
} 
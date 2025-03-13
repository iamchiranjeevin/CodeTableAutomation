import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
})
export class ExportDialogComponent {
  exportAll = false;
  rows: any[];
  columnsToDisplay: string[];
  displayedColumns: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.rows = (data.rows ?? []).map((row: any) => ({
      ...row,
      selected: row.selected ?? false
    }));
    this.columnsToDisplay = data.columnsToDisplay ?? [];

   
    this.displayedColumns = ['select', ...this.columnsToDisplay];
  }

  toggleAllSelection(selectAll: boolean) {
    this.rows.forEach(row => (row.selected = selectAll));
  }

  getSelectedRows() {
    return this.rows.filter(row => row.selected);
  }
}

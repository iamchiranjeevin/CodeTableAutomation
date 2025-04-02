import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-no-data-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">Code Table</h2>
      <mat-dialog-content>No data found for the selected criteria.</mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="closeDialog()">OK</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: left;
      padding: 20px;
    }
    .dialog-title {
  font-weight: normal; 
  font-size: 18px;
}
  `]
})
export class NoDataDialogComponent {
  constructor(private dialogRef: MatDialogRef<NoDataDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Search {{data.tableName}}</h2>
    <mat-dialog-content>
      <div *ngFor="let field of data.searchConfig.fields">
        <mat-form-field *ngIf="field.type !== 'checkbox'">
          <mat-label>{{field.label}}</mat-label>
          <input matInput *ngIf="field.type === 'text'" [(ngModel)]="searchCriteria[field.name]">
          <mat-select *ngIf="field.type === 'dropdown'" [(ngModel)]="searchCriteria[field.name]">
            <mat-option value="">Select</mat-option>
          </mat-select>
          <input matInput [matDatepicker]="picker" *ngIf="field.type === 'date'" [(ngModel)]="searchCriteria[field.name]">
          <mat-datepicker-toggle *ngIf="field.type === 'date'" matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-checkbox *ngIf="field.type === 'checkbox'" [(ngModel)]="searchCriteria[field.name]">
          {{field.label}}
        </mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSearch()">Search</button>
    </mat-dialog-actions>
  `
})
export class SearchDialogComponent {
  searchCriteria: Record<string, any> = {};

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {tableName: string, searchConfig: any}
  ) {}

  onSearch(): void {
    this.dialogRef.close(this.searchCriteria);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 
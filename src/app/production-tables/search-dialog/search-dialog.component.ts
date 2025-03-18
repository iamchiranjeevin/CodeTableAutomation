import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductionTablesSearchService } from '../api/production-tables-search.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class SearchDialogComponent implements OnInit {
  searchForm: FormGroup;
  searchFields: any[] = [];
  fieldValues: Record<string, string[]> = {};

  constructor(
    private fb: FormBuilder,
    private searchService: ProductionTablesSearchService,
    @Inject(MAT_DIALOG_DATA) public data: {tableName: string, searchConfig: any},
    private dialogRef: MatDialogRef<SearchDialogComponent>
  ) {
    this.searchForm = this.fb.group({});
  }

  ngOnInit() {
    this.initializeSearchFields();
    this.loadFieldValues();
  }

  private initializeSearchFields() {
    this.searchFields = this.data.searchConfig.fields;
    this.searchFields.forEach(field => {
      this.searchForm.addControl(field.name, this.fb.control(''));
    });
  }

  private loadFieldValues() {
    const requests = this.searchFields
      .filter(field => field.type === 'dropdown')
      .map(field => {
        return this.searchService.getSearchCriteria(
          this.data.tableName, 
          field.name
        );
      });

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((response, index) => {
          const fieldName = this.searchFields[index].name;
          this.fieldValues[fieldName] = response.values;
        });
      },
      error: (error) => {
        console.error('Error loading field values:', error);
        // Handle error appropriately
      }
    });
  }

  onSearch() {
    this.dialogRef.close(this.searchForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
} 
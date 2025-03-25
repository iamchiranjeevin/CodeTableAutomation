import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchTableService } from './searchtable.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dynamic-search-dialog',
  standalone: true,
  imports: [    
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,  
    MatNativeDateModule,
  ],
  templateUrl: './searchtable-dialog.component.html',
  styleUrl: './searchtable-dialog.component.scss'
})
export class SearchTableDialogComponent implements OnInit {
  form!: FormGroup;

  dynamicControls: any[] = []; 

  constructor(
    private fb: FormBuilder,
    private tableService: SearchTableService,
    public dialogRef: MatDialogRef<SearchTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({}); 

    this.tableService.getTableSearchCriteria(this.data.tableName).subscribe((response) => {
      this.createDynamicForm(response);
    });
  }

  createDynamicForm(response: any): void {
    this.dynamicControls = []; 

    
    if (response.serviceGroups) {
      this.addDropdown('serviceGroup', 'Service Group', response.serviceGroups, 'SERVICE_GROUP', 'DESCRIPTION');
    }

    if (response.capIds) {
      this.addDropdown('capId', 'CAP ID', response.capIds, 'CAP_ID');
    }

    if (response.capTypes) {
      this.addDropdown('capType', 'CAP Type', response.capTypes, 'CODE', 'DESCRIPTION');
    }

    if (response.serviceCodes) {
      this.addDropdown('serviceCode', 'Service Code', response.serviceCodes, 'SERVICE_CD', 'DESCRIPTION');
    }

    // Add static fields
    this.addDatePicker('beginDate', 'Begin Date');
    this.addDatePicker('endDate', 'End Date');
    this.addDropdown('active', 'Active', [{ value: 'A', label: 'Active' }, { value: 'C', label: 'Closed' }]);
    this.addCheckbox('history', 'History');
  }

  
  addDropdown(controlName: string, label: string, options: any[], valueKey: string = 'value', labelKey: string = 'label') {
    this.dynamicControls.push({ type: 'dropdown', controlName, label, options, valueKey, labelKey });
    this.form.addControl(controlName, this.fb.control(''));
  }

  
  addDatePicker(controlName: string, label: string) {
    this.dynamicControls.push({ type: 'date', controlName, label });
    this.form.addControl(controlName, this.fb.control(''));
  }

  
  addCheckbox(controlName: string, label: string) {
    this.dynamicControls.push({ type: 'checkbox', controlName, label });
    this.form.addControl(controlName, this.fb.control(false));
  }

  finish(): void {
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  formatDate(controlName: string): void {
    const dateValue = this.form.get(controlName)?.value;
    if (dateValue) {
      const formattedDate = formatDate(dateValue, 'MM/dd/yyyy', 'en-US');
      this.form.get(controlName)?.setValue(formattedDate);
    }
  }
  
}

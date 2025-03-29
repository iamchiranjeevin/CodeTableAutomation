import { Component, inject, Inject, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
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
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { ProductionTablesStore } from '../production-tables.store';
import { getApiTableName } from '../shared/utils';
 
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
export class SearchTableDialogComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  dynamicControls: any[] = [];
 
  @ViewChildren(MatDatepicker) datePickers!: QueryList<MatDatepicker<any>>;
  datePickersMap: { [key: string]: MatDatepicker<any> } = {};
  readonly #productionTablesStore = inject(ProductionTablesStore);
  apiTableName: string = '';
 
  constructor(
    private fb: FormBuilder,
    private tableService: SearchTableService,
    public dialogRef: MatDialogRef<SearchTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
 
  ngOnInit(): void {
    this.form = this.fb.group({});
  
    // Convert display table name to API table name for consistency
    this.apiTableName = getApiTableName(this.data.tableName);
    
    this.tableService.getTableSearchCriteria(this.apiTableName).subscribe((response) => {
      this.createDynamicForm(response);
    });
  }
 
  ngAfterViewInit(): void {
    // We don't need to map datepickers anymore since each one has its own instance in the template
    // The template handles the association between datepicker and input
  }
 
  createDynamicForm(response: any): void {
    this.dynamicControls = [];
    
    // Add Service Group first (from API)
    if (response.serviceGroups) {
      this.addDropdown('serviceGroup', 'Service Group', response.serviceGroups, 'SERVICE_GROUP', 'DESCRIPTION');
    }
 
    // Add table-specific fields in the correct order
    if (this.apiTableName === 'SSAS_CAP_THRESHOLD_CEILING') {
      if (response.capIds) {
        this.addDropdown('capId', 'CAP ID', response.capIds, 'CAP_ID');
      }
 
      if (response.capTypes) {
        this.addDropdown('capType', 'CAP Type', response.capTypes, 'CODE', 'DESCRIPTION');
      }
 
      if (response.serviceCodes) {
        this.addDropdown('serviceCode', 'Service Code', response.serviceCodes, 'SERVICE_CD', 'DESCRIPTION');
      }
 
      // Add CAP-specific date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add common fields for CAP
      this.addDropdown('active', 'Active', [{ value: 'A', label: 'A' }, { value: 'C', label: 'C' }]);
      this.addCheckbox('history', 'History');
    }
    else if (this.apiTableName === 'SSAS_AUTH_AGENT_AND_HOLD') {
      // Add AAH-specific fields in the exact order specified
      
      // First add Auth Agent Type if available (from API)
      if (response.authAgentTypes) {
        this.addDropdown('authAgentType', 'Auth Agent Type', response.authAgentTypes, 'CODE', 'DESCRIPTION');
      }
      
      // Then add fields in the specified order:
      // HOLD BEGIN DATE, HOLD END DATE, ACTIVE, PROGRAM ON HOLD, HISTORY, CONTRACT CAP CHECK
      this.addDatePicker('holdBeginDate', 'Hold Begin Date');
      this.addDatePicker('holdEndDate', 'Hold End Date');
      this.addDropdown('active', 'Active', [{ value: 'A', label: 'A' }, { value: 'C', label: 'C' }]);
      this.addDropdown('programOnHold', 'Program On Hold', [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
      ]);
      this.addCheckbox('history', 'History');
      this.addDropdown('contractCapCheck', 'Contract Cap Check', [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
      ]);
    }
  }
 
  addDropdown(controlName: string, label: string, options: any[], valueKey: string = 'value', labelKey: string = 'label') {
    const serviceGroupControls = ['serviceGroup', 'serviceCode'];
    const isServiceGroup = serviceGroupControls.includes(controlName);
 
    //  Y/N values are stored as strings in the database
    this.dynamicControls.push({
      type: 'dropdown',
      controlName,
      label,
      options,
      valueKey,
      labelKey,
      isServiceGroup
    });
 
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
    const formValues = this.form.value;
    
    // Create request body based on table type
    let row: any = {
      SERVICE_GROUP: formValues.serviceGroup || "",
      ACTIVE: formValues.active || null,
      HISTORY: formValues.history ? "true" : "false"
    };
 
    // Add table-specific fields to the row
    if (this.apiTableName === 'SSAS_CAP_THRESHOLD_CEILING') {
      row = {
        ...row,
        CAP_ID: formValues.capId || "",
        CAP_TYPE: formValues.capType || "",
        SERVICE_CD: formValues.serviceCode || "",
        BEGIN_DATE: formValues.beginDate ? formValues.beginDate.toISOString() : null,
        END_DATE: formValues.endDate ? formValues.endDate.toISOString() : null,
      };
    } else if (this.apiTableName === 'SSAS_AUTH_AGENT_AND_HOLD') {
      row = {
        ...row,
        AUTH_AGENT_TYPE: formValues.authAgentType || "",
        HOLD_BEGIN_DATE: formValues.holdBeginDate ? formValues.holdBeginDate.toISOString() : null,
        HOLD_END_DATE: formValues.holdEndDate ? formValues.holdEndDate.toISOString() : null,
        IS_PROGRAM_ON_HOLD: formValues.programOnHold || "",
        CONTRACT_CAP_CHECK: formValues.contractCapCheck || ""
      };
    }
 
    const requestBody = {
      tableName: this.apiTableName,
      row: row
    };
 
    this.tableService.getProductionTableData(requestBody.tableName, requestBody.row).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response) {        
          this.#productionTablesStore.updateProdRows(response);        
          this.dialogRef.close(this.form.value);
        } else {          
          console.error('Update failed:', response);
        }
      },
      error: (error) => {
        console.error("Error updating data:", error);                            
      }
    });
    console.log('Close API Response:');    
  }
 
  cancel(): void {
    this.dialogRef.close();
  }
 
  formatDate(controlName: string): void {
    const dateValue = this.form.get(controlName)?.value;
    if (dateValue) {
      const formattedDate = formatDate(dateValue, 'MM/dd/yyyy', 'en-US');
      this.form.patchValue({ [controlName]: formattedDate });
    }
  }
 
  isShortField(controlName: string): boolean {
    const shortFields = ['active', 'programOnHold', 'contractCapCheck'];
    return shortFields.includes(controlName);
  }
}
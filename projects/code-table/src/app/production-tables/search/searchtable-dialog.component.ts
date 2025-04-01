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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { formatDate } from '@angular/common';
import { ProductionTablesStore } from '../production-tables.store';
import { getApiTableName } from '../shared/utils';
import { TableConfigService } from '../shared/services/table-config.service';
import { TableService } from '../shared/services/table.service';
import { SearchControl } from '../shared/models/table-config.interface';
import { HttpClientModule } from '@angular/common/http';

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
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  templateUrl: './searchtable-dialog.component.html',
  styleUrl: './searchtable-dialog.component.scss'
})
export class SearchTableDialogComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  dynamicControls: any[] = []; 
  isLoading = true; // Add loading state

  @ViewChildren(MatDatepicker) datePickers!: QueryList<MatDatepicker<any>>;
  datePickersMap: { [key: string]: MatDatepicker<any> } = {};
  readonly #productionTablesStore = inject(ProductionTablesStore);
  apiTableName: string = '';
  
  readonly #tableConfigService = inject(TableConfigService);
  
  constructor(
    private fb: FormBuilder,
    private tableService: TableService,
    public dialogRef: MatDialogRef<SearchTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.apiTableName = data.apiTableName;
  }

  ngOnInit(): void {
    // Try to get configuration for this table
    const config = this.#tableConfigService.getConfigByApiName(this.apiTableName);
    
    if (config && config.searchConfig) {
      // Use configuration-based approach
      this.buildConfigBasedForm(config);
    } else {
      // Fall back to existing approach
      this.getSearchFormData();
    }
  }

  ngAfterViewInit(): void {
    // We don't need to map datepickers anymore since each one has its own instance in the template
    // The template handles the association between datepicker and input
  }

  // Build form based on configuration
  buildConfigBasedForm(config: any) {
    const controls = this.#tableConfigService.generateSearchControls(config);
    const formGroup: Record<string, any> = {};
    
    // Clear existing controls
    this.dynamicControls = [];
    
    // Add controls from configuration
    controls.forEach((control: SearchControl) => {
      formGroup[control.name] = [control.defaultValue];
      
      this.dynamicControls.push({
        controlName: control.name,
        label: control.label,
        type: control.type
      });
    });
    
    this.form = this.fb.group(formGroup);
    this.isLoading = false;
  }

  // Your existing getSearchFormData method
  getSearchFormData() {
    // Your existing implementation
  }

  finish(): void {
    console.log(this.form.value);
    const formValues = this.form.value;
    
    // Try to get configuration for this table
    const config = this.#tableConfigService.getConfigByApiName(this.apiTableName);
    
    if (config) {
      // Use configuration-based approach
      const requestBody = this.#tableConfigService.createSearchRequestBody(
        config,
        formValues
      );
      
      console.log('Search Request:', requestBody);
      
      this.tableService.getProductionTableData(
        requestBody.tableName, 
        requestBody.row
      ).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          if (response) {
            this.#productionTablesStore.updateProdRows(response);
            this.dialogRef.close(this.form.value);
          } else {
            console.error('Search failed:', response);
          }
        },
        error: (error: Error) => {
          console.error("Error searching data:", error);
        }
      });
    } else {
      // Fall back to existing implementation
      let row: any = {
        SERVICE_GROUP: formValues.serviceGroup || "",
        ACTIVE: formValues.active || null,
        HISTORY: formValues.history ? "Enabled" : "Disabled"
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
        next: (response: any) => {
          console.log('API Response:', response);
          if (response) {
            this.#productionTablesStore.updateProdRows(response);
            this.dialogRef.close(this.form.value);
          } else {
            console.error('Search failed:', response);
          }
        },
        error: (error: Error) => {
          console.error("Error searching data:", error);
        }
      });
    }
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

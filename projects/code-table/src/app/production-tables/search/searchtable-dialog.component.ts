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
import { format } from 'date-fns';
 
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
    MatProgressSpinnerModule
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
    
    this.tableService.getTableSearchCriteria(this.apiTableName).subscribe({
      next: (response) => {
        this.createDynamicForm(response);
        this.isLoading = false; // Set loading to false when data is loaded
      },
      error: (error) => {
        console.error('Error loading search criteria:', error);
        this.isLoading = false; // Also set loading to false on error
      }
    });
  }
 
  ngAfterViewInit(): void {
    // We don't need to map datepickers anymore since each one has its own instance in the template
    // The template handles the association between datepicker and input
  }
 
  createDynamicForm(response: any): void {
    this.dynamicControls = [];
    
    // Add Service Group first (from API)
    if (response.serviceGroups &&
      this.apiTableName !== 'CFB' &&
      this.apiTableName !== 'MG1_CFB') {      this.addDropdown('serviceGroup', 'Service Group', response.serviceGroups, 'SERVICE_GROUP', 'DESCRIPTION');
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
    else if (this.apiTableName === 'CF1' || this.apiTableName === 'MG1_CF1') {
      // Add CF1-specific fields
      
      // Add Billing Code dropdown if available from API
      if (response.billingCodes) {
        this.addDropdown('billingCode', 'Billing Code', response.billingCodes, 'BILLING_CD', 'DESCRIPTION');
      } else {
        // If billingCodes is not available, add a simple input field
        this.addInput('billingCode', 'Billing Code');
      }
      
      // Always add Description field as a text input
      this.addInput('description', 'Description');
      
      // Add date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add Atypical Indicator dropdown
      this.addDropdown('atypicalIndicator', 'Atypical Indicator', [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
      ]);
      
      // Add Active dropdown
      this.addDropdown('active', 'Active', [
        { value: 'A', label: 'A' },
        { value: 'C', label: 'C' }
      ]);
      
      // Add History checkbox
      this.addCheckbox('history', 'History');
    } else if (this.apiTableName === 'CFB' || this.apiTableName === 'MG1_CFB') {
      // Add CFB-specific fields in the correct order
      
      // Log the response to see the actual structure
      console.log('CFB Search Criteria Response:', response);
      
      // Add Billing Code dropdown if available from API
      if (response.billingCodes && response.billingCodes.length > 0) {
        // Determine the correct property names by examining the first item
        const firstItem = response.billingCodes[0];
        const codeKey = 'BILLING_CODE' in firstItem ? 'BILLING_CODE' :
                       'CODE' in firstItem ? 'CODE' : 'BILLING_CD';
        
        this.addDropdown('billingCode', 'Billing Code', response.billingCodes, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('billingCode', 'Billing Code');
      }
      
      // Add Service Group dropdown if available from API
      if (response.serviceGroups && response.serviceGroups.length > 0) {
        const firstItem = response.serviceGroups[0];
        const codeKey = 'SERVICE_GROUP' in firstItem ? 'SERVICE_GROUP' :
                       'SERVICE_GRP' in firstItem ? 'SERVICE_GRP' : 'CODE';
        
        this.addDropdown('serviceGroup', 'Service Group', response.serviceGroups, codeKey, 'DESCRIPTION');
      }
      
      // Add Fund Code dropdown if available from API
      if (response.fundCodes && response.fundCodes.length > 0) {
        const firstItem = response.fundCodes[0];
        const codeKey = 'FUND_CODE' in firstItem ? 'FUND_CODE' :
                       'FUND_CD' in firstItem ? 'FUND_CD' : 'CODE';
        
        this.addDropdown('fundCode', 'Fund Code', response.fundCodes, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('fundCode', 'Fund Code');
      }
      
      // Add date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add Service Code dropdown if available from API
      if (response.serviceCodes && response.serviceCodes.length > 0) {
        const firstItem = response.serviceCodes[0];
        const codeKey = 'SERVICE_CODE' in firstItem ? 'SERVICE_CODE' :
                       'SERVICE_CD' in firstItem ? 'SERVICE_CD' : 'CODE';
        
        this.addDropdown('serviceCode', 'Service Code', response.serviceCodes, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('serviceCode', 'Service Code');
      }
      
      // Add Level of Service Type
      if (response.levelOfServiceTypes && response.levelOfServiceTypes.length > 0) {
        const firstItem = response.levelOfServiceTypes[0];
        console.log('Level of Service Types first item:', firstItem);
        
        const codeKey = this.findBestPropertyKey(firstItem, [
          'LVL_SRVC_TYPE_CODE',
          'LEVEL_OF_SERVICE_TYPE',
          'LOS_TYPE',
          'TYPE',
          'CODE',
          'VALUE'
        ]);
        
        console.log(`Using ${codeKey} for Level of Service Type dropdown`);
        
        this.addDropdown('levelOfServiceType', 'Level of Service Type', response.levelOfServiceTypes, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('levelOfServiceType', 'Level of Service Type');
      }
      
      // Add Level of Service
      if (response.levelOfServices && response.levelOfServices.length > 0) {
        const firstItem = response.levelOfServices[0];
        console.log('Level of Services first item:', firstItem);
        
        const codeKey = this.findBestPropertyKey(firstItem, [
          'LVL_SRVC_CODE',
          'LEVEL_OF_SERVICE',
          'LOS',
          'CODE',
          'VALUE'
        ]);
        
        console.log(`Using ${codeKey} for Level of Service dropdown`);
        
        this.addDropdown('levelOfService', 'Level of Service', response.levelOfServices, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('levelOfService', 'Level of Service');
      }
      
      // Add Fed Type of Service
      this.addInput('fedTypeOfService', 'Fed Type of Service');
      
      // Add MI Record Type
      this.addInput('miRecordType', 'MI Record Type');
      
      // Add Active dropdown
      this.addDropdown('active', 'Active', [
        { value: 'A', label: 'A' },
        { value: 'C', label: 'C' }
      ]);
      
      // Add History checkbox
      this.addCheckbox('history', 'History');
    } else if (this.apiTableName === 'CFI' || this.apiTableName === 'MG1_CFI') {
      // Add CFI-specific fields
      
      // Add Item Code dropdown if available from API
      if (response.itemCodes) {
        console.log('CFI Item Codes Response:', response.itemCodes);
        
        // Determine the correct property name by examining the first item
        const firstItem = response.itemCodes[0];
        const codeKey = 'ITEM_CD' in firstItem ? 'ITEM_CD' :
                       'ITEM_CODE' in firstItem ? 'ITEM_CODE' : 'CODE';
        
        console.log('Using code key for item codes:', codeKey);
        
        // Add to the list of controls that should show both code and description
        const showBothCodeAndDescription = [
          'serviceGroup', 'serviceCode', 'billingCode', 'fundCode',
          'levelOfServiceType', 'levelOfService', 'itemCode'
        ];
        
        this.addDropdown('itemCode', 'Item Code', response.itemCodes, codeKey, 'DESCRIPTION');
      } else {
        this.addInput('itemCode', 'Item Code');
      }
      
      // Always add Description field as a text input
      this.addInput('description', 'Description');
      
      // Add date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add Active dropdown
      this.addDropdown('active', 'Active', [
        { value: 'A', label: 'A' },
        { value: 'C', label: 'C' }
      ]);
      
      // Add History checkbox
      this.addCheckbox('history', 'History');
    } else if (this.apiTableName === 'CFM' || this.apiTableName === 'MG1_CFM') {
      // Add CFM-specific fields
      
      // Add Eligibility Category dropdown if available from API
      if (response.eligibilityCategories) {
        this.addDropdown('eligibilityCategory', 'Eligibility Category',
          response.eligibilityCategories, 'ELIGIBILITY_CATEGORY', 'DESCRIPTION');
      } else {
        this.addInput('eligibilityCategory', 'Eligibility Category');
      }
      
      // Add date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add Active dropdown
      this.addDropdown('active', 'Active', [
        { value: 'A', label: 'A' },
        { value: 'C', label: 'C' }
      ]);
      
      // Add History checkbox
      this.addCheckbox('history', 'History');
    } else if (this.apiTableName === 'CFP' || this.apiTableName === 'MG1_CFP') {
      // Add CFP-specific fields
      
      // Add Procedure Code dropdown if available from API
      if (response.procedureCodes) {
        this.addDropdown('procedureCode', 'Procedure Code',
          response.procedureCodes, 'PROCEDURE_CODE', 'DESCRIPTION');
      } else {
        this.addInput('procedureCode', 'Procedure Code');
      }
      
      // Add Procedure Type dropdown if available
      if (response.procedureTypes) {
        this.addDropdown('procedureType', 'Procedure Type',
          response.procedureTypes, 'CODE', 'DESCRIPTION');
      } else {
        this.addInput('procedureType', 'Procedure Type');
      }
      
      // Always add Description field as a text input
      this.addInput('description', 'Description');
      
      // Add date fields
      this.addDatePicker('beginDate', 'Begin Date');
      this.addDatePicker('endDate', 'End Date');
      
      // Add TMHP Flag dropdown
      this.addDropdown('tmhpFlag', 'TMHP Flag', [
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
      ]);
      
      // Add Active dropdown
      this.addDropdown('active', 'Active', [
        { value: 'A', label: 'A' },
        { value: 'C', label: 'C' }
      ]);
      
      // Add History checkbox
      this.addCheckbox('history', 'History');
    }
  }
 
  addDropdown(controlName: string, label: string, options: any[], valueKey: string = 'value', labelKey: string = 'label') {
    // Log the first option to see its structure
    if (options && options.length > 0) {
      console.log(`Dropdown options for ${controlName}:`, options[0]);
    }
 
    // Define which controls should show both code and description
    const showBothCodeAndDescription = [
      'serviceGroup', 'serviceCode', 'billingCode', 'fundCode',
      'levelOfServiceType', 'levelOfService', 'itemCode'
    ];
    
    // Check if this control should show both code and description
    const isServiceGroup = showBothCodeAndDescription.includes(controlName);
    
    // Check if we're in CFB or CFI table context
    const isCFBTable = this.apiTableName === 'CFB' || this.apiTableName === 'MG1_CFB';
    const isCFITable = this.apiTableName === 'CFI' || this.apiTableName === 'MG1_CFI';
    
    // For CFB and CFI tables, ensure all dropdowns show both code and description
    const shouldShowBoth = isServiceGroup ||
      (isCFBTable && ['billingCode', 'serviceGroup', 'fundCode', 'serviceCode',
                      'levelOfServiceType', 'levelOfService'].includes(controlName));
 
    this.dynamicControls.push({
      type: 'dropdown',
      controlName,
      label,
      options: options,
      valueKey,
      labelKey,
      isServiceGroup: shouldShowBoth // Set to true for all CFB dropdowns
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
 
  addInput(controlName: string, label: string) {
    this.dynamicControls.push({ type: 'input', controlName, label });
    this.form.addControl(controlName, this.fb.control(''));
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
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null,
      };
    } else if (this.apiTableName === 'SSAS_AUTH_AGENT_AND_HOLD') {
      row = {
        ...row,
        AUTH_AGENT_TYPE: formValues.authAgentType || "",
        HOLD_BEGIN_DATE: formValues.holdBeginDate ? format(new Date(formValues.holdBeginDate), 'MM/dd/yyyy') : null,
        HOLD_END_DATE: formValues.holdEndDate ? format(new Date(formValues.holdEndDate), 'MM/dd/yyyy') : null,
        IS_PROGRAM_ON_HOLD: formValues.programOnHold || "",
        CONTRACT_CAP_CHECK: formValues.contractCapCheck || ""
      };
    } else if (this.apiTableName === 'CF1' || this.apiTableName === 'MG1_CF1') {
      row = {
        ...row,
        BILLING_CD: formValues.billingCode || "",
        DESCRIPTION: formValues.description || "",
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null,
        ATYPICAL_INDICATOR: formValues.atypicalIndicator || ""
      };
    } else if (this.apiTableName === 'CFB' || this.apiTableName === 'MG1_CFB') {
      row = {
        ...row,
        BILLING_CODE: formValues.billingCode || "",
        SERVICE_CODE: formValues.serviceCode || "",
        LEVEL_OF_SERVICE_TYPE: formValues.levelOfServiceType || "",
        LEVEL_OF_SERVICE: formValues.levelOfService || "",
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null,
        FUND_CD: formValues.fundCode || ""
      };
    } else if (this.apiTableName === 'CFI' || this.apiTableName === 'MG1_CFI') {
      row = {
        ...row,
        ITEM_CD: formValues.itemCode || "",
        DESCRIPTION: formValues.description || "",
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null
      };
    } else if (this.apiTableName === 'CFM' || this.apiTableName === 'MG1_CFM') {
      row = {
        ...row,
        ELIGIBILITY_CATEGORY: formValues.eligibilityCategory || "",
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null
      };
    } else if (this.apiTableName === 'CFP' || this.apiTableName === 'MG1_CFP') {
      row = {
        ...row,
        PROCEDURE_CODE: formValues.procedureCode || "",
        PROCEDURE_TYPE: formValues.procedureType || "",
        DESCRIPTION: formValues.description || "",
        BEGIN_DATE: formValues.beginDate ? format(new Date(formValues.beginDate), 'MM/dd/yyyy') : null,
        END_DATE: formValues.endDate ? format(new Date(formValues.endDate), 'MM/dd/yyyy') : null,
        TMHP_FLAG: formValues.tmhpFlag || ""
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
 
  private findBestPropertyKey(obj: any, possibleKeys: string[]): string {
    if (!obj) return possibleKeys[0]; // Default to first option if object is null
    
    for (const key of possibleKeys) {
      if (key in obj) {
        return key;
      }
    }
    
    // If none of the keys are found, return the first one as default
    return possibleKeys[0];
  }
}

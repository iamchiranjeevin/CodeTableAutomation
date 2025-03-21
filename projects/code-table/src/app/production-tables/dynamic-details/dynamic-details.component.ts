import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,   
  QueryList,   
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionTablesStore } from '../production-tables.store';
import { ProductionTableData, ProductionTableRow, UpdateRequestBody } from '../shared/types';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DynamicDetailsService } from './dynamic-details.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog.service';
import { format, isValid } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dynamic-details',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    ReactiveFormsModule,
    CommonModule    
  ],
  templateUrl: './dynamic-details.component.html',
  styleUrl: './dynamic-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()]
})
export class DynamicDetailsComponent {
  readonly #fb = inject(FormBuilder);

  
  
  readonly #productionTablesStore = inject(ProductionTablesStore);
  @ViewChild('productionTable', { static: false }) productionTable!: ElementRef;
  dynamicDetailsForm: FormGroup = this.#fb.group({});
  columnKeys: string[] = [];
  datePickers: { [key: string]: MatDatepicker<any> } = {};
  @ViewChildren(MatDatepicker) datePickerRefs!: QueryList<MatDatepicker<any>>;
  columnLabels: Record<string, string> | undefined;
  protected readonly dynamicDetails = this.#productionTablesStore.getDynamicDetails();

  constructor(private dynamicDetailsService: DynamicDetailsService,
    private confirmDialogService: ConfirmDialogService,    
    private snackBar: MatSnackBar) {
    effect(() => {      
      this.buildDynamicForm();
    });
  }  

  allowedColumnsMap: { [tableName: string]: string[] } = {
    "SSAS_AUTH_AGENT_AND_HOLD": ["ID","REC_ID","SERVICE_GRP", "AUTH_AGENT_TYPE", "AUTH_AGENT_NAME",
      "AUTH_AGENT_ID", "AUTH_AGENT_MAIL_CODE", "AUTH_AGENT_PHONE", "AGENCY_CODE",
      "IS_PROGRAM_ON_HOLD", "HOLD_BEGIN_DATE", "HOLD_END_DATE", "COMMENTS", "ACTIVE", "CONTRACT_CAP_CHECK"]    
  };
  private convertUpperSnakeToUpperCase(key: string): string {
    return key.replace(/_/g, ' '); 
  }
  buildDynamicForm() {
    const selectedRowDetails = this.#productionTablesStore.getDynamicDetails()() as ProductionTableData | null;
    if (!selectedRowDetails) {
      console.log("No row selected for dynamic-details");
      return; 
    }

    const selectedTableValue = selectedRowDetails['REC_ID'];
    console.log("selectedTableValue(REC_ID):", selectedTableValue);
    const selectedTable = (typeof selectedTableValue === 'string' || typeof selectedTableValue === 'number') 
                          ? selectedTableValue  : 'default'; 
    const allowedColumns = this.allowedColumnsMap[selectedTable] || Object.keys(selectedRowDetails); 
    console.log("allowedColumns:", allowedColumns);
    this.columnKeys = Object.keys(selectedRowDetails).filter(key => allowedColumns.includes(key));

    const customColumnLabels: Record<string, string> = {
      "SERVICE_GRP": "SERVICE GROUP",
      "AUTH_AGENT_MAIL_CODE": "AUTH AGENT MAIL GROUP",
      "IS_PROGRAM_ON_HOLD": "PROGRAM ON HOLD"
    };

  
  this.columnLabels = this.columnKeys.reduce((map, key) => {
    map[key] = customColumnLabels[key] || this.convertUpperSnakeToUpperCase(key);
    return map;
  }, {} as Record<string, string>);

  console.log("columnLabels mapping:", this.columnLabels);
    
    let formControls: { [key: string]: any } = {};
    
    this.columnKeys.forEach((key) => {
      formControls[key] = [selectedRowDetails[key] ?? '']; 
    });    

    this.dynamicDetailsForm = this.#fb.group(formControls);
  } 

  updateProductionTableData2() { 
    if (this.dynamicDetailsForm.valid) {   
      console.log("Form Values:", this.dynamicDetailsForm.value);  
        this.confirmDialogService.openConfirmDialog({
            title: 'Code Table',
            message: 'Are you sure you want to update production record?',
            confirmText: 'OK',
            cancelText: 'Cancel'
        }).subscribe(result => {
            if (result) { 
                
                let updatedFormValues = this.dynamicDetailsForm.value;
                
                const updatedUpperSnakeValues = this.convertCamelKeysToUpperSnakeCase(updatedFormValues);
               
                updatedUpperSnakeValues["SERVICE_GRP"] = updatedUpperSnakeValues["SERVICE_GROUP"] ?? updatedUpperSnakeValues["SERVICE_GRP"];
                delete updatedUpperSnakeValues["SERVICE_GROUP"];

                updatedUpperSnakeValues["AUTH_AGENT_MAIL_CODE"] = updatedUpperSnakeValues["AUTH_AGENT_MAIL_GROUP"] ?? updatedUpperSnakeValues["AUTH_AGENT_MAIL_CODE"];
                delete updatedUpperSnakeValues["AUTH_AGENT_MAIL_GROUP"];
                
                const productionTableRow: ProductionTableRow = this.convertFormToProductionTableRow(this.dynamicDetailsForm);
                
                productionTableRow.holdBeginDate = this.formatDate(productionTableRow.holdBeginDate) as string;
                productionTableRow.holdEndDate = this.formatDate(productionTableRow.holdEndDate) as string;
                
                const updateRequestBody = this.createUpdateRequestBody(
                    "00000382348", // user ID
                    productionTableRow.id,
                    productionTableRow.holdBeginDate,
                    productionTableRow.holdEndDate,
                    productionTableRow.recid,
                    updatedUpperSnakeValues
                ); 

                console.log('updateRequestBody: ', updateRequestBody);              
                
                
                this.dynamicDetailsService.updateProductionTableRow(updateRequestBody).subscribe(
                    response => {
                        console.log("Update response:", response);
                        if (response.success) { 
                            const productionData = this.mapProductionTableRowToData(productionTableRow);
                            this.#productionTablesStore.updateDynamicDetails(productionData);
                            this.showSuccessToast("Production update successful!"); 
                           
                            const productionTable = document.getElementById('productionTable');
                            if (productionTable) {
                                productionTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }

                            this.#productionTablesStore.updateDynamicDetails(null);
                        }             
                    },
                    error => {              
                        console.error("Error updating data:", error);
                        this.showErrorToast("Failed to update production data.");
                    }
                );
            }
        }); 
    } else {
        console.warn("Form is invalid!", this.dynamicDetailsForm.errors);
    }
}

  convertCamelKeysToUpperSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
    const convertedObj: Record<string, any> = {};
  
    Object.keys(obj).forEach((key) => {
      let snakeKey = key.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(); // Convert camelCase to UPPER_SNAKE_CASE
  
      // Special case for 'serviceGroup' mapping to 'SERVICE_GRP'
      if (key === "serviceGroup") {
        snakeKey = "SERVICE_GRP";
      }
  
      convertedObj[snakeKey] = obj[key]; // Assign the value
    });
  
    return convertedObj;
  }

  convertFormToProductionTableRow(form: FormGroup): ProductionTableRow {
    const formValues = form.value; 
  
    return {
      id: Number(formValues.ID) || 0,
      serviceGroup: formValues.SERVICE_GRP || '',
      authAgentType: formValues.AUTH_AGENT_TYPE || '',
      authAgentName: formValues.AUTH_AGENT_NAME || '',
      authAgentId: formValues.AUTH_AGENT_ID || '',
      authAgentMailCode: formValues.AUTH_AGENT_MAIL_GROUP || '',
      authAgentPhone: formValues.AUTH_AGENT_PHONE || '',
      agencyCode: formValues.AGENCY_CODE || '',
      isProgramOnHold: formValues.IS_PROGRAM_ON_HOLD || '',
      holdBeginDate: formValues.HOLD_BEGIN_DATE || '',
      holdEndDate: formValues.HOLD_END_DATE || '',
      active: formValues.ACTIVE || '',
      contractCapCheck: formValues.CONTRACT_CAP_CHECK || '',
      comments: formValues.COMMENTS || '',
      recid: formValues.REC_ID || ''
    };
  }
  
  createUpdateRequestBody(userName: string, id: number, from: string, to: string, tblName:string, rowData: Record<string, any>) {
    const { RECID, ...filteredRowData } = rowData;
    return {
      tableName: `MG1_${tblName}`,
      id: id.toString(),
      from: "",
      to: "",
      userName: userName,
      row: filteredRowData as UpdateRequestBody["row"]
    };
  }
  showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      panelClass: ['success-toast'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
  
  showErrorToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-toast'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }  

  mapProductionTableRowToData(row: ProductionTableRow): ProductionTableData {
    return this.convertCamelKeysToUpperSnakeCase(row) as ProductionTableData;
  }

  formatDate(date: string | null): string | null {
    if (!date) return ""; 
  
    try {
      const parsedDate = new Date(date);
      return isValid(parsedDate) ? format(parsedDate, 'MM/dd/yyyy') : null; 
    } catch (error) {
      console.error("Invalid date format:", date);
      return null;
    }
  }
  
}

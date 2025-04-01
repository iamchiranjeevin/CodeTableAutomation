import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,   
  QueryList,   
  ViewChild,
  ViewChildren,
  ChangeDetectorRef
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionTablesStore } from '../production-tables.store';
import { ProductionTableData, ProductionTableRow, UpdateRequestBody, CapUpdateRequestBody, BaseUpdateRequestBody, DynamicTableRow, DynamicUpdateRequestBody } from '../shared/types';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DynamicDetailsService } from './dynamic-details.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog.service';
import { format, isValid } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TableConfigService } from '../shared/services/table-config.service';


const TABLE_NAME_API_MAPPING: Record<string, string> = {
  'AAH-AUTH AGENT HOLD': 'SSAS_AUTH_AGENT_AND_HOLD',
  'CAP- CAP_ THRESHOLD': 'SSAS_CAP_THRESHOLD_CEILING',
  'CF1-BILLING CODE': 'CF1',
  'CFB- BILLING COMBINATION': 'MG1_CFB',
  'CFI-ITEM CODE': 'MG1_CFI',
  'CFM- ELIGIBILITY COMBINATION': 'MG1_CFM',
  'CFP-PROCEDURE CODE': 'MG1_CFP',
  'CFR-PROCEDURE CODE RATE': 'MG1_CFR',
  'CLC-LVL OF SRVC GRP CROSS REF': 'MG1_CLC',
  'CLS - LEVEL OF SERVICE': 'MG1_CLS',
  'CMD - MODIFIER': 'MG1_CMD',
  'CMR - MODIFIER CROSS REFERENCE': 'MG1_CMR',
  'CNB-BILL CODE CROSSWALK': 'MG1_CNB',
  'CNP - NATIONAL PROCEDURE CODES': 'MG1_CNP',
  'CNS - CMS NATIONAL CODES': 'MG1_CNC',
  'COV - COVERAGE CODE': 'MG1_COV',
  'CPQ - PROCEDURE CODE QUALIFIER': 'MG1_CPQ',
  'CPS - PLACE OF SERVICE': 'MG1_CPS',
  'CPT - CLIENT PROGRAM TYPE': 'MG1_CPT',
  'CRC- REVENUE CODES': 'MG1_CRC',
  'CSG - SERVICE GROUP': 'MG1_CSG',
  'CSI - SERVICE CODE ITEM REC': 'MG1_CSI',
  'CSP - SERVICE CODE PROCEDURE': 'MG1_CSP',
  'CSR - SERVICE CODE': 'MG1_CSR',
  'CSS - SERVICE GRP SERVICE CD': 'MG1_CSS',
  'DA2 - SERVICE AUTH EDITS': 'MG1_DA2',
  'DA3 - NE SERV EDITS': 'MG1_DA3',
  'DAD - REFERENCE CODES': 'MG1_DAD',
  'DCE - TMHP DUPLICATE CLAIM EDIT': 'MG1_DCE',
  'DIA - DIAGNOSIS': 'MG1_SSAS_DIAGNOSIS',
  'ECC - ELIGIBILITY CATEGORY': 'MG1_ECC',
  'FCD - FUND CODE': 'MG1_FCD',
  'FSR - FISCAL ACCOUNT CODE': 'MG1_FSR',
  'LBR - SERVICE_RESI_LOCATION': 'MG1_SSAS_SERVICE_RESI_LOCATION',
  'LST - LEVEL OF SERVICE TYPE': 'MG1_LST',
  'MSQ - MOVEMENT_SEQUENCES': 'MG1_SSAS_MOVEMENT_SEQUENCES',
  'PME - TMHP MUTEX': 'MG1_PME',
  'REF - REFERENCE_TABLE': 'MG1_SSAS_REFERENCE_TABLE',
  'SGO - SRVC GRP SRVC OVERLAP': 'MG1_SGO'
};

const REVERSE_TABLE_NAME_MAPPING: Record<string, string> = {
  'MG1_SSAS_AUTH_AGENT_AND_HOLD': 'AAH-AUTH AGENT HOLD',
  'MG1_SSAS_CAP_THRESHOLD_CEILING': 'CAP- CAP_ THRESHOLD',
  'MG1_CF1': 'CF1-BILLING CODE',
  'MG1_CFB': 'CFB- BILLING COMBINATION',
  'MG1_CFI': 'CFI-ITEM CODE',
  'MG1_CFM': 'CFM- ELIGIBILITY COMBINATION',
  'MG1_CFP': 'CFP-PROCEDURE CODE',
  'MG1_CFR': 'CFR-PROCEDURE CODE RATE',
  'MG1_CLC': 'CLC-LVL OF SRVC GRP CROSS REF',
  'MG1_CLS': 'CLS - LEVEL OF SERVICE',
  'MG1_CMD': 'CMD - MODIFIER',
  'MG1_CMR': 'CMR - MODIFIER CROSS REFERENCE',
  'MG1_CNB': 'CNB-BILL CODE CROSSWALK',
  'MG1_CNP': 'CNP - NATIONAL PROCEDURE CODES',
  'MG1_CNC': 'CNS - CMS NATIONAL CODES',
  'MG1_COV': 'COV - COVERAGE CODE',
  'MG1_CPQ': 'CPQ - PROCEDURE CODE QUALIFIER',
  'MG1_CPS': 'CPS - PLACE OF SERVICE',
  'MG1_CPT': 'CPT - CLIENT PROGRAM TYPE',
  'MG1_CRC': 'CRC- REVENUE CODES',
  'MG1_CSG': 'CSG - SERVICE GROUP',
  'MG1_CSI': 'CSI - SERVICE CODE ITEM REC',
  'MG1_CSP': 'CSP - SERVICE CODE PROCEDURE',
  'MG1_CSR': 'CSR - SERVICE CODE',
  'MG1_CSS': 'CSS - SERVICE GRP SERVICE CD',
  'MG1_DA2': 'DA2 - SERVICE AUTH EDITS',
  'MG1_DA3': 'DA3 - NE SERV EDITS',
  'MG1_DAD': 'DAD - REFERENCE CODES',
  'MG1_DCE': 'DCE - TMHP DUPLICATE CLAIM EDIT',
  'MG1_SSAS_DIAGNOSIS': 'DIA - DIAGNOSIS',
  'MG1_ECC': 'ECC - ELIGIBILITY CATEGORY',
  'MG1_FCD': 'FCD - FUND CODE',
  'MG1_FSR': 'FSR - FISCAL ACCOUNT CODE',
  'MG1_SSAS_SERVICE_RESI_LOCATION': 'LBR - SERVICE_RESI_LOCATION',
  'MG1_LST': 'LST - LEVEL OF SERVICE TYPE',
  'MG1_SSAS_MOVEMENT_SEQUENCES': 'MSQ - MOVEMENT_SEQUENCES',
  'MG1_PME': 'PME - TMHP MUTEX',
  'MG1_SSAS_REFERENCE_TABLE': 'REF - REFERENCE_TABLE',
  'MG1_SGO': 'SGO - SRVC GRP SRVC OVERLAP'
};

export interface TableFieldConfig {
  apiField: string;          // Field name in API
  displayField?: string;     // Display name (if different from API)
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required?: boolean;
  defaultValue?: any;
  options?: {value: string, label: string}[]; // For select fields
  hidden?: boolean;          // Whether to hide in UI
  readOnly?: boolean;        // Whether field is read-only
  format?: (value: any) => any; // Custom formatter for API submission
}

export interface TableConfig {
  displayName: string;       // Human-readable table name
  apiName: string;           // API table name
  prefix?: string;           // Prefix to add to API name (e.g., 'MG1_')
  idField: string;           // Primary key field
  fields: Record<string, TableFieldConfig>;
  hiddenColumns: string[];   // Columns to hide in table view
  searchConfig?: {           // Configuration for search dialog
    fields: string[];        // Fields to include in search
    defaultValues?: Record<string, any>;
  };
}

@Component({
  selector: 'app-dynamic-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule   
  ],
  templateUrl: './dynamic-details.component.html',
  styleUrl: './dynamic-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()] 
})
export class DynamicDetailsComponent {
  readonly #fb = inject(FormBuilder);  
  readonly #productionTablesStore = inject(ProductionTablesStore);
  readonly #route = inject(ActivatedRoute);
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #tableConfigService = inject(TableConfigService);


  @ViewChild('productionTable', { static: false }) productionTable!: ElementRef;
  dynamicDetailsForm: FormGroup = this.#fb.group({});
  columnKeys: string[] = [];
  datePickers: { [key: string]: MatDatepicker<any> } = {};
  @ViewChildren(MatDatepicker) datePickerRefs!: QueryList<MatDatepicker<any>>;
  columnLabels: Record<string, string> | undefined;
  protected readonly dynamicDetails = this.#productionTablesStore.getDynamicDetails();
  private apiFieldMapping: Record<string, string> = {
    "RANGE_LOWER_LIMIT": "SERVICE_LOWER_LIMIT",
    "RANGE_UPPER_LIMIT": "SERVICE_UPPER_LIMIT"
  };

  hiddenFormFields: string[] = [
    'ID', 
    'REC_ID', 
    'CREATE_DATE', 
    'PHASE_TYPE', 
    'UPDATE_DATE', 
    'UPDATE_BY', 
    'SORT_ORDER'
  ];

  constructor(private dynamicDetailsService: DynamicDetailsService,
    private confirmDialogService: ConfirmDialogService,    
    private snackBar: MatSnackBar,
     private router: ActivatedRoute) {
    effect(() => {      
      this.buildDynamicForm();
    });
  }  

  allowedColumnsMap: { [tableName: string]: string[] } = {
    "SSAS_AUTH_AGENT_AND_HOLD": ["ID","REC_ID","SERVICE_GRP", "AUTH_AGENT_TYPE", "AUTH_AGENT_NAME",
      "AUTH_AGENT_ID", "AUTH_AGENT_MAIL_CODE", "AUTH_AGENT_PHONE", "AGENCY_CODE",
      "IS_PROGRAM_ON_HOLD", "HOLD_BEGIN_DATE", "HOLD_END_DATE", "COMMENTS", "ACTIVE", "CONTRACT_CAP_CHECK"],
      "SSAS_CAP_THRESHOLD_CEILING": ["ID", "REC_ID","SERVICE_GRP", "CAP_ID", "CAP_TYPE", 
       "LEVEL_OF_SERVICE", "SERVICE_CODES", "BEGIN_DATE", "END_DATE", "LIMIT_TYPE",
       "STATE_THRESHOLD", "COACH_THRESHOLD", "PERCENT_200_THRESHOLD", "LIFE_TIME_CAP_MET",
       "AGE_LIMIT_TYPE", "RANGE_LIMITATION_SERVICE_CODE", "RANGE_LOWER_LIMIT",
       "RANGE_UPPER_LIMIT", "ACTIVE", "COMMENTS", "TMHP_FLAG", "THRESHOLD_INDICATOR"]  
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

    if (this.dynamicDetailsForm) {
      this.dynamicDetailsForm.reset();
    }

    const selectedTableValue = selectedRowDetails['REC_ID']; 
    console.log('REC_ID print:', selectedTableValue);  
    const selectedTable = (typeof selectedTableValue === 'string' || typeof selectedTableValue === 'number') 
                          ? selectedTableValue  : 'default'; 
    const allowedColumns = this.allowedColumnsMap[selectedTable] || Object.keys(selectedRowDetails); 
    console.log("allowedColumns:", allowedColumns);
    this.columnKeys = Object.keys(selectedRowDetails).filter(key => allowedColumns.includes(key));

    // Build form controls
    const formControls: { [key: string]: any } = {};
    this.columnKeys.forEach((key) => {
      formControls[key] = [selectedRowDetails[key] ?? '']; 
    });

    // Create new form instance
    this.dynamicDetailsForm = this.#fb.group(formControls);
    
    // Update column labels
    this.updateColumnLabels();
    
    // Force change detection
    this.#cdr.detectChanges();
  }
  private updateColumnLabels() {
    const customColumnLabels: Record<string, string> = {
      "SERVICE_GRP": "SERVICE GROUP",
      "AUTH_AGENT_MAIL_CODE": "AUTH AGENT MAIL GROUP",
      "IS_PROGRAM_ON_HOLD": "PROGRAM ON HOLD"
    };

  
    this.columnLabels = this.columnKeys.reduce((map, key) => {
      map[key] = customColumnLabels[key] || this.convertUpperSnakeToUpperCase(key);
      return map;
    }, {} as Record<string, string>);
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

              // Get the current table details
           const currentDetails = this.#productionTablesStore.getDynamicDetails()();
           const tableName = currentDetails?.['TABLE_NAME'] || 
                            (currentDetails?.['REC_ID'] === 'SSAS_AUTH_AGENT_AND_HOLD' ? 'AAH-AUTH AGENT HOLD' : 'CAP- CAP_ THRESHOLD');
                
                let updatedFormValues = this.dynamicDetailsForm.value;
                
                const updatedUpperSnakeValues = this.convertCamelKeysToUpperSnakeCase(updatedFormValues);
               
                updatedUpperSnakeValues["SERVICE_GRP"] = updatedUpperSnakeValues["SERVICE_GROUP"] ?? updatedUpperSnakeValues["SERVICE_GRP"];
                delete updatedUpperSnakeValues["SERVICE_GROUP"];

                updatedUpperSnakeValues["AUTH_AGENT_MAIL_CODE"] = updatedUpperSnakeValues["AUTH_AGENT_MAIL_GROUP"] ?? updatedUpperSnakeValues["AUTH_AGENT_MAIL_CODE"];
                delete updatedUpperSnakeValues["AUTH_AGENT_MAIL_GROUP"];
                // Remove REC_ID
                delete updatedUpperSnakeValues["REC_ID"];

                console.log('Table Name:', tableName);
           console.log('Updated Values:', updatedUpperSnakeValues);

                const dateFields = [
                  'HOLD_BEGIN_DATE', 
                  'HOLD_END_DATE', 
                  'BEGIN_DATE', 
                  'END_DATE',
                  'CREATE_DATE',
                  'UPDATE_DATE',
                  'UPDATE_BY'
                ];
      
                dateFields.forEach(field => {
                  if (updatedUpperSnakeValues[field]) {
                    updatedUpperSnakeValues[field] = this.formatDate(updatedUpperSnakeValues[field]);
                  }
                }); 
                
                const updateRequestBody = this.createUpdateRequestBody(
                  "00000382348", // user ID
                  updatedUpperSnakeValues['ID'],
                  "",
                  "",
                  tableName,
                  updatedUpperSnakeValues
                );
    
                console.log('Update Request Body:', updateRequestBody);             
                
                
                this.dynamicDetailsService.updateProductionTableRow(updateRequestBody as UpdateRequestBody).subscribe({
                  next: (response) => {
                    console.log('API Response:', response);
                    if (response && response.success) {
                      this.showSuccessToast("Production update successful!");
                      this.#productionTablesStore.updateDynamicDetails(null);
                      
                      const productionTable = document.getElementById('productionTable');
                      if (productionTable) {
                        productionTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      const errorMessage = response?.message || "Failed to update production data.";
                      this.showErrorToast(errorMessage);
                      console.error('Update failed:', response);
                            }

                          },
                          error: (error) => {
                            console.error("Error updating data:", error);
                            this.showErrorToast("Failed to update production data.");
                          }
            });
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
      id: Number(formValues['ID']) || 0,
       serviceGroup: formValues['SERVICE_GRP'] || '',
       authAgentType: formValues['AUTH_AGENT_TYPE'] || '',
       authAgentName: formValues['AUTH_AGENT_NAME'] || '',
       authAgentId: formValues['AUTH_AGENT_ID'] || '',
       authAgentMailCode: formValues['AUTH_AGENT_MAIL_GROUP'] || '',
       authAgentPhone: formValues['AUTH_AGENT_PHONE'] || '',
       agencyCode: formValues['AGENCY_CODE'] || '',
       isProgramOnHold: formValues['IS_PROGRAM_ON_HOLD'] || '',
       holdBeginDate: formValues['HOLD_BEGIN_DATE'] || '',
       holdEndDate: formValues['HOLD_END_DATE'] || '',
       active: formValues['ACTIVE'] || '',
       contractCapCheck: formValues['CONTRACT_CAP_CHECK'] || '',
       comments: formValues['COMMENTS'] || '',
       recid: formValues['REC_ID'] || ''
    };
  }
  
  createUpdateRequestBody(userName: string, id: number, from: string, to: string, displayTableName: string, rowData: Record<string, any>): DynamicUpdateRequestBody {
    const { REC_ID, RECID, CREATE_DATE, CREATE_BY, UPDATE_DATE, UPDATE_BY, ...filteredRowData } = rowData;
    const apiTableName = TABLE_NAME_API_MAPPING[displayTableName] || displayTableName;
     
     const baseRequest = {
       tableName: `MG1_${apiTableName}`,
      id: id.toString(),
      from: "",
      to: "",
      userName: userName      
    };
    return this.createDynamicPayload(baseRequest, filteredRowData, apiTableName);
  }

  private createDynamicPayload(baseRequest: BaseUpdateRequestBody, filteredRowData: Record<string, any>, tableType: string): DynamicUpdateRequestBody {
    if (tableType === 'SSAS_CAP_THRESHOLD_CEILING') {
      // Map the display fields back to API fields
      const mappedData = { ...filteredRowData };
      Object.entries(this.apiFieldMapping).forEach(([displayName, apiName]) => {
        if (mappedData[displayName] !== undefined) {
          mappedData[apiName] = mappedData[displayName] as string | number;
          delete mappedData[displayName];
        }
      });
      const row = {
         ID: typeof mappedData['ID'] === 'string' ? parseInt(mappedData['ID']) : mappedData['ID'],
         SERVICE_GROUP: mappedData['SERVICE_GRP'] || '21',
         CAP_ID: mappedData['CAP_ID'] || '',
         CAP_TYPE: mappedData['CAP_TYPE'] || '',
         LEVEL_OF_SERVICE: mappedData['LEVEL_OF_SERVICE'] || '',
         SERVICE_CODES: mappedData['SERVICE_CODES'] || '',
         BEGIN_DATE: this.formatDate(mappedData['BEGIN_DATE']) || null,
         END_DATE: this.formatDate(mappedData['END_DATE']) || null,
         LIMIT_TYPE: parseInt(mappedData['LIMIT_TYPE']) || 1,
         STATE_THRESHOLD: parseFloat(mappedData['STATE_THRESHOLD']) || 0,
         COACH_THRESHOLD: parseFloat(mappedData['COACH_THRESHOLD']) || 0,
         PERCENT_200_THRESHOLD: parseFloat(mappedData['PERCENT_200_THRESHOLD']) || 9999999.99,
         LIFE_TIME_CAP_MET: mappedData['LIFE_TIME_CAP_MET'] || '',
         AGE_LIMIT_TYPE: parseInt(mappedData['AGE_LIMIT_TYPE']) || 3,
         RANGE_LIMITATION_SERVICE_CODE: mappedData['RANGE_LIMITATION_SERVICE_CODE'] || '',
         SERVICE_LOWER_LIMIT: parseInt(String(mappedData['SERVICE_LOWER_LIMIT'])) || 1,
         SERVICE_UPPER_LIMIT: parseInt(String(mappedData['SERVICE_UPPER_LIMIT'])) || 2,
         ACTIVE: mappedData['ACTIVE'] || 'A',
         COMMENTS: mappedData['COMMENTS'] || '',
         TMHP_FLAG: mappedData['TMHP_FLAG'] || '',
         THRESHOLD_INDICATOR: mappedData['THRESHOLD_INDICATOR'] || 'N'
      };

      return {
        ...baseRequest,
        row
      };
    }

    // Handle other table types (AAH)
    return {
      ...baseRequest,
      row: {
        ...filteredRowData,
        ID: typeof filteredRowData['ID'] === 'string' ? parseInt(filteredRowData['ID']) : filteredRowData['ID']
      }
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

  isDateField(key: string): boolean {
    const dateFields = [
      'HOLD_BEGIN_DATE', 
      'HOLD_END_DATE', 
      'BEGIN_DATE', 
      'END_DATE',
      'CREATE_DATE'
    ];
    return key.toLowerCase().includes('date') && dateFields.includes(key);
  }

  isRangeLimitField(key: string): boolean {
    return key === 'LIMIT_TYPE' || key === 'AGE_LIMIT_TYPE';
  }

  incrementValue(key: string): void {
    const control = this.dynamicDetailsForm.get(key);
    if (control) {
      const currentValue = control.value ? parseInt(control.value) : 0;
      control.setValue(currentValue + 1);
    }
  }

  decrementValue(key: string): void {
    const control = this.dynamicDetailsForm.get(key);
    if (control) {
      const currentValue = control.value ? parseInt(control.value) : 0;
      control.setValue(Math.max(0, currentValue - 1)); // Prevent negative values
    }
  }
  
  getFieldType(key: string): string {
    // First try to get the type from configuration
    const currentDetails = this.#productionTablesStore.getDynamicDetails()();
    const tableName = currentDetails?.['TABLE_NAME'] || 
                     (currentDetails?.['REC_ID'] === 'SSAS_AUTH_AGENT_AND_HOLD' ? 
                      'AAH-AUTH AGENT HOLD' : 'CAP- CAP_ THRESHOLD');
    
    const config = this.#tableConfigService.getConfigByDisplayName(tableName);
    
    if (!config) return 'text';  // Add a default return if config is undefined
    
    if (config && config.fields[key]) {
      return config.fields[key].type;
    }
    
    // Fall back to hardcoded types
    const dateFields = ['HOLD_BEGIN_DATE', 'HOLD_END_DATE', 'BEGIN_DATE', 'END_DATE', 'CREATE_DATE', 'UPDATE_DATE'];
    if (dateFields.includes(key)) {
      return 'date';
    }
    
    const numberFields = ['STATE_THRESHOLD', 'COACH_THRESHOLD', 'PERCENT_200_THRESHOLD', 'SERVICE_LOWER_LIMIT', 
                          'SERVICE_UPPER_LIMIT', 'LIMIT_TYPE', 'AGE_LIMIT_TYPE'];
    if (numberFields.includes(key)) {
      return 'number';
    }
    
    return 'text';
  }
}

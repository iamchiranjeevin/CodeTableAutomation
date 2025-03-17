import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject   
} from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionTablesStore } from '../production-tables.store';
import { ProductionTableData, ProductionTableRow, UpdateRequestBody } from '../shared/types';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DynamicDetailsService } from './dynamic-details.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog.service';
import { format, isValid } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dynamic-details',
  imports: [
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './dynamic-details.component.html',
  styleUrl: './dynamic-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()]
})
export class DynamicDetailsComponent {
  readonly #fb = inject(FormBuilder);
  protected dynamicDetailsForm = this.#fb.group({
    active: [new FormControl('', Validators.required)],
    agencyCode: [new FormControl('', Validators.required)],
    authAgentId: [new FormControl('', Validators.required)],
    authAgentMailCode: [new FormControl('', Validators.required)],
    authAgentName: [new FormControl('', Validators.required)],
    authAgentPhone: [new FormControl('', Validators.required)],
    authAgentType: [new FormControl('', Validators.required)],
    comments: [new FormControl('', Validators.required)],
    contractCapCheck: [new FormControl('', Validators.required)],
    holdBeginDate: [new FormControl('', Validators.required)],
    holdEndDate: [new FormControl('', Validators.required)],
    isProgramOnHold: [new FormControl('', Validators.required)],
    serviceGroup: [new FormControl('', Validators.required)],
    id: [new FormControl('', Validators.required)],
    recid: [new FormControl('', Validators.required)],
  });
  readonly #productionTablesStore = inject(ProductionTablesStore);

  constructor(private dynamicDetailsService: DynamicDetailsService,
    private confirmDialogService: ConfirmDialogService,    
    private snackBar: MatSnackBar) {
    effect(() => {
      const details = this.#productionTablesStore.getDynamicDetails();
      this.patchFormWithDetails(details());
    });
  }

  patchFormWithDetails(details: ProductionTableData | null) {    
    console.log(details);
    if (details === null) {
      return;
    }

    const formatToString = (value: string | number | boolean | null | undefined) => {
      return value != null ? String(value) : '';
    };

    const getValue = (obj: any, key: string): any => {
      const normalizedKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
      return normalizedKey ? obj[normalizedKey] : null;
    };

    this.dynamicDetailsForm.setValue({
    active: formatToString(getValue(details, 'active')),
    agencyCode: formatToString(getValue(details, 'agency_code')),
    authAgentId: formatToString(getValue(details, 'auth_agent_id')),
    authAgentMailCode: formatToString(getValue(details, 'auth_agent_mail_code')),
    authAgentName: formatToString(getValue(details, 'auth_agent_name')),
    authAgentPhone: formatToString(getValue(details, 'auth_agent_phone')),
    authAgentType: formatToString(getValue(details, 'auth_agent_type')),
    comments: formatToString(getValue(details, 'comments')),
    contractCapCheck: formatToString(getValue(details, 'contract_cap_check')),
    holdBeginDate: formatToString(getValue(details, 'hold_begin_date')),
    holdEndDate: formatToString(getValue(details, 'hold_end_date')),
    isProgramOnHold: formatToString(getValue(details, 'is_program_on_hold')),
    serviceGroup: formatToString(getValue(details, 'service_grp')),
    id: formatToString(getValue(details, 'id')),
    recid: formatToString(getValue(details, 'rec_id')),
    });
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
      id: Number(formValues.id) || 0,
      serviceGroup: formValues.serviceGroup || '',
      authAgentType: formValues.authAgentType || '',
      authAgentName: formValues.authAgentName || '',
      authAgentId: formValues.authAgentId || '',
      authAgentMailCode: formValues.authAgentMailCode || '',
      authAgentPhone: formValues.authAgentPhone || '',
      agencyCode: formValues.agencyCode || '',
      isProgramOnHold: formValues.isProgramOnHold || '',
      holdBeginDate: formValues.holdBeginDate || '',
      holdEndDate: formValues.holdEndDate || '',
      active: formValues.active || '',
      contractCapCheck: formValues.contractCapCheck || '',
      comments: formValues.comments || '',
      recid: formValues.recid || ''
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
  updateProductionTableData() {
    if (this.dynamicDetailsForm.valid) {     

      this.confirmDialogService.openConfirmDialog({
        title: 'Code Table',
        message: 'Are you sure you want to update production record?',
        confirmText: 'OK',
        cancelText: 'Cancel'
      }).subscribe(result => {
        if (result) { 

          const productionTableRow: ProductionTableRow = this.convertFormToProductionTableRow(this.dynamicDetailsForm);       

          productionTableRow.holdBeginDate = this.formatDate(productionTableRow.holdBeginDate) as string;;
          productionTableRow.holdEndDate = this.formatDate(productionTableRow.holdEndDate) as string;          

          const productionTableRowReq = this.convertCamelKeysToUpperSnakeCase(productionTableRow);        
          const updateRequestBody = this.createUpdateRequestBody("00000382348", productionTableRow.id, productionTableRow.holdBeginDate,
             productionTableRow.holdEndDate, productionTableRow.recid, productionTableRowReq);             			 

          this.dynamicDetailsService.updateProductionTableRow(updateRequestBody).subscribe(
            response => {
              console.log("Update response:", response);
              if (response.success) { 
                const productionData = this.mapProductionTableRowToData(productionTableRow);
                this.#productionTablesStore.updateDynamicDetails(productionData);
                this.showSuccessToast("Production update successful!"); 
              }             
            },
            error => {              
              console.error("Error updating data:", error);
            }
          );



        }}); 
     
    } else {
      console.warn("Form is invalid!", this.dynamicDetailsForm.errors);
    }
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

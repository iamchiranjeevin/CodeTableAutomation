import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injectable 
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from '../../shared/confirm-dialog.service';

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
  });
  readonly #productionTablesStore = inject(ProductionTablesStore);

  constructor(private dynamicDetailsService: DynamicDetailsService,
    private confirmDialogService: ConfirmDialogService) {
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
    isProgramOnHold: formatToString(getValue(details, 'program_on_hold')),
    serviceGroup: formatToString(getValue(details, 'service_group')),
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
      comments: formValues.comments || ''
    };
  }
  
  createUpdateRequestBody(userName: string, id: number, rowData: Record<string, any>) {
    return {
      tableName: "MG1_SSAS_AUTH_AGENT_AND_HOLD",
      id: id.toString(),
      from: "",
      to: "",
      userName: userName,
      row: rowData as UpdateRequestBody["row"]
    };
  }
  
  updateProductionTableData() {
    if (this.dynamicDetailsForm.valid) {
      console.log("Form is valid");
      console.log("Form Data:", this.dynamicDetailsForm.value);

      this.confirmDialogService.openConfirmDialog({
        title: 'Code Table',
        message: 'Are you sure you want to update production record?',
        confirmText: 'OK',
        cancelText: 'Cancel'
      }).subscribe(result => {
        if (result) {
          console.log("User confirmed update");          
         
          const productionTableRow: ProductionTableRow = this.convertFormToProductionTableRow(this.dynamicDetailsForm);
          console.log("Converted ProductionTableRow:", productionTableRow);
          const productionTableRowReq = this.convertCamelKeysToUpperSnakeCase(productionTableRow);
          console.log("Converted to UPPER_SNAKE_CASE:", productionTableRowReq);
          const updateRequestBody = this.createUpdateRequestBody("00000382348", 20, productionTableRowReq);
          console.log("Final UpdateRequestBody:", updateRequestBody);          
  
          this.dynamicDetailsService.updateProductionTableRow(updateRequestBody).subscribe(
            response => {
              console.log("Update response:", response);
              if (response.success) {
                console.log("Update Success");
                const productionData = this.mapProductionTableRowToData(productionTableRow);
                this.#productionTablesStore.updateDynamicDetails(productionData);
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
  
}

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
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionTablesStore } from '../production-tables.store';
import { ProductionTableData, ProductionTableRow, UpdateRequestBody, BaseUpdateRequestBody, DynamicUpdateRequestBody } from '../shared/types';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DynamicDetailsService } from './dynamic-details.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog.service';
import { format, isValid } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TableConfigService } from '../services/table-config.service';
import { DataTransformationService } from '../services/data-transformation.service';

@Component({
  selector: 'app-dynamic-details',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dynamic-details.component.html',
  styleUrl: './dynamic-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDateFnsAdapter()],
  styles: [`
    .number-controls {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .number-controls button {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    .number-controls mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
    }
  `]
})
export class DynamicDetailsComponent {
  readonly #fb = inject(FormBuilder);
  readonly #productionTablesStore = inject(ProductionTablesStore);
  readonly #dynamicDetailsService = inject(DynamicDetailsService);
  readonly #confirmDialog = inject(ConfirmDialogService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #tableConfig = inject(TableConfigService);
  readonly #dataTransformation = inject(DataTransformationService);
  readonly #cdr = inject(ChangeDetectorRef);

  dynamicDetailsForm!: FormGroup;
  currentRowData: any = {};
  currentTableName: string = '';
  currentApiTableName: string = '';
  
  // Add missing properties referenced in the template
  columnKeys: string[] = [];
  columnLabels: Record<string, string> = {};
  
  isDateField(field: string): boolean {
    const dataTypes = this.#tableConfig.getColumnDataTypes(this.currentApiTableName);
    return dataTypes[field] === 'date';
  }
  
  isRangeLimitField(field: string): boolean {
    return field === 'RANGE_LOWER_LIMIT' || field === 'RANGE_UPPER_LIMIT';
  }
  
  incrementValue(field: string): void {
    const control = this.dynamicDetailsForm.get(field);
    if (control) {
      const currentValue = Number(control.value) || 0;
      control.setValue(currentValue + 1);
    }
  }
  
  decrementValue(field: string): void {
    const control = this.dynamicDetailsForm.get(field);
    if (control) {
      const currentValue = Number(control.value) || 0;
      if (currentValue > 0) {
        control.setValue(currentValue - 1);
      }
    }
  }

  saveChanges() {
    if (!this.dynamicDetailsForm.valid) return;
    
    // Get form values
    const formValues = this.dynamicDetailsForm.getRawValue();
    
    // Transform display data to API format
    const apiData = this.#dataTransformation.transformDisplayToApi(
      this.currentApiTableName,
      formValues
    );
    
    // Create update request body
    const updateRequest = this.createUpdateRequestBody(
      '0000038234', // UserName
      this.currentRowData.ID || 0,
      '',
      '',
      this.currentTableName,
      apiData
    );
    
    // Fix the method call to match the service signature
    this.#confirmDialog.openConfirmDialog({
      title: 'Confirm Update',
      message: 'Are you sure you want to update this record?'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.#dynamicDetailsService.updateData(updateRequest).subscribe({
          next: (response: any) => {
            this.#snackBar.open('Record updated successfully', 'Close', {
              duration: 3000
            });
            
            // Refresh the table data
            this.#productionTablesStore.loadProductionTables(this.currentApiTableName);
          },
          error: (error: any) => {
            this.#snackBar.open('Failed to update record', 'Close', {
              duration: 3000
            });
            console.error('Update failed:', error);
          }
        });
      }
    });
  }
  
  // Add the missing property for the template
  updateProductionTableData2 = this.saveChanges.bind(this);
  
  createUpdateRequestBody(userName: string, id: number, from: string, to: string, displayTableName: string, rowData: Record<string, any>): DynamicUpdateRequestBody {
    const { REC_ID, RECID, CREATE_DATE, CREATE_BY, UPDATE_DATE, UPDATE_BY, ...filteredRowData } = rowData;
    
    const apiTableName = this.#tableConfig.getApiName(displayTableName);
    
    const baseRequest = {
      tableName: `MG1_${apiTableName}`,
      id: id.toString(),
      from: from,
      to: to,
      userName: userName,
    };

    return this.createDynamicPayload(baseRequest, filteredRowData, apiTableName);
  }

  private createDynamicPayload(baseRequest: BaseUpdateRequestBody, filteredRowData: Record<string, any>, tableType: string): DynamicUpdateRequestBody {
    // Get table configuration
    const config = this.#tableConfig.getConfig(tableType);
    if (!config) {
      console.warn(`No configuration found for table: ${tableType}`);
      return { ...baseRequest, row: filteredRowData };
    }
    
    // Use the configuration to create the payload
    return {
      ...baseRequest,
      row: filteredRowData
    };
  }
}

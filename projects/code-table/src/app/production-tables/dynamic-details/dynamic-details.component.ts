import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionTablesStore } from '../production-tables.store';
import { ProductionTableData } from '../shared/types';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

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
    authAgentMailGroup: [new FormControl('', Validators.required)],
    authAgentName: [new FormControl('', Validators.required)],
    authAgentPhone: [new FormControl('', Validators.required)],
    authAgentType: [new FormControl('', Validators.required)],
    comments: [new FormControl('', Validators.required)],
    contractCapCheck: [new FormControl('', Validators.required)],
    holdBeginDate: [new FormControl('', Validators.required)],
    holdEndDate: [new FormControl('', Validators.required)],
    programOnHold: [new FormControl('', Validators.required)],
    serviceGroup: [new FormControl('', Validators.required)],
  });
  readonly #productionTablesStore = inject(ProductionTablesStore);

  constructor() {
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
    authAgentMailGroup: formatToString(getValue(details, 'auth_agent_mail_code')),
    authAgentName: formatToString(getValue(details, 'auth_agent_name')),
    authAgentPhone: formatToString(getValue(details, 'auth_agent_phone')),
    authAgentType: formatToString(getValue(details, 'auth_agent_type')),
    comments: formatToString(getValue(details, 'comments')),
    contractCapCheck: formatToString(getValue(details, 'contract_cap_check')),
    holdBeginDate: formatToString(getValue(details, 'hold_begin_date')),
    holdEndDate: formatToString(getValue(details, 'hold_end_date')),
    programOnHold: formatToString(getValue(details, 'program_on_hold')),
    serviceGroup: formatToString(getValue(details, 'service_group')),
    });
  }

  updateProductionTableData() {
    if (this.dynamicDetailsForm.valid) {
      console.log("Form Data:", this.dynamicDetailsForm.value);
      // Call service/ API to update production table data
    } else {
      console.log("Form is invalid!");
    }
  }
}

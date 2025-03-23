import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { TableSearchConfig } from '../../config/search-config.types';

interface DialogData {
  searchConfig: TableSearchConfig;
}

@Component({
  selector: 'app-search-criteria-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  template: `
    <div class="search-form">
      <h2 mat-dialog-title>Search Criteria</h2>
      <form [formGroup]="searchForm">
        <ng-container *ngFor="let field of data.searchConfig.fields">
          <ng-container [ngSwitch]="field.type">
            <mat-form-field *ngSwitchCase="'select'">
              <mat-label>{{field.label}}</mat-label>
              <mat-select [formControlName]="field.field">
                <mat-option *ngFor="let option of getFieldOptions(field.field)" [value]="option">
                  {{option}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field *ngSwitchCase="'date'">
              <mat-label>{{field.label}}</mat-label>
              <input matInput [matDatepicker]="picker" [formControlName]="field.field">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-checkbox *ngSwitchCase="'checkbox'"
                         [formControlName]="field.field">
              {{field.label}}
            </mat-checkbox>
          </ng-container>
        </ng-container>
      </form>
    </div>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="accent" (click)="onSearch()">Search</button>
      <button mat-button color="primary" (click)="onFinish()">Finish</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./search-criteria-dialog.component.scss']
})
export class SearchCriteriaDialogComponent implements OnInit {
  searchForm: FormGroup;
  serviceGroups: string[] = [];
  capIds: string[] = [];
  capTypes: string[] = [];
  serviceCodes: string[] = [];

  constructor(
    private searchCriteriaService: SearchCriteriaService,
    private dialogRef: MatDialogRef<SearchCriteriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.searchForm = this.createSearchForm(data.searchConfig);
  }

  ngOnInit() {
    this.loadSearchCriteria();
  }

  public getFieldOptions(fieldName: string): string[] {
    switch (fieldName) {
      case 'serviceGroup': return this.serviceGroups;
      case 'capId': return this.capIds;
      case 'capType': return this.capTypes;
      case 'serviceCode': return this.serviceCodes;
      default: return [];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.dialogRef.close({ type: 'search', data: this.searchForm.value });
    }
  }

  onFinish(): void {
    if (this.searchForm.valid) {
      this.dialogRef.close({ type: 'finish', data: this.searchForm.value });
    }
  }

  private createSearchForm(config: TableSearchConfig): FormGroup {
    const group: Record<string, any> = {};
    config.fields.forEach(field => {
      group[field.field] = [field.defaultValue || null];
    });
    return this.fb.group(group);
  }

  private loadSearchCriteria() {
    this.searchCriteriaService.getSearchCriteria('SSAS_CAP_THRESHOLD_CEILING')
      .subscribe(criteria => {
        this.serviceGroups = criteria.serviceGroups;
        this.capIds = criteria.capIds;
        this.capTypes = criteria.capTypes;
        this.serviceCodes = criteria.serviceCodes;
      });
  }
}
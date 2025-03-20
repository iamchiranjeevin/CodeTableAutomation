import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SearchCriteriaService } from '../../services/search-criteria.service';

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
        <mat-form-field>
          <mat-label>Service Group</mat-label>
          <mat-select formControlName="serviceGroup">
            <mat-option *ngFor="let group of serviceGroups" [value]="group">
              {{group}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>CAP ID</mat-label>
          <mat-select formControlName="capId">
            <mat-option *ngFor="let id of capIds" [value]="id">
              {{id}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>CAP Type</mat-label>
          <mat-select formControlName="capType">
            <mat-option *ngFor="let type of capTypes" [value]="type">
              {{type}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Service Code</mat-label>
          <mat-select formControlName="serviceCode">
            <mat-option *ngFor="let code of serviceCodes" [value]="code">
              {{code}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Begin Date</mat-label>
          <input matInput [matDatepicker]="beginPicker" formControlName="beginDate">
          <mat-datepicker-toggle matSuffix [for]="beginPicker"></mat-datepicker-toggle>
          <mat-datepicker #beginPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="endDate">
          <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Active</mat-label>
          <mat-select formControlName="active">
            <mat-option value="A">Active</mat-option>
            <mat-option value="C">Inactive</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-checkbox formControlName="history">History</mat-checkbox>
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
  private readonly searchCriteriaService = inject(SearchCriteriaService);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SearchCriteriaDialogComponent>);

  searchForm!: FormGroup;
  serviceGroups: string[] = [];
  capIds: string[] = [];
  capTypes: string[] = [];
  serviceCodes: string[] = [];

  ngOnInit() {
    this.initForm();
    this.loadSearchCriteria();
  }

  private initForm() {
    this.searchForm = this.fb.group({
      serviceGroup: [''],
      capId: [''],
      capType: [''],
      serviceCode: [''],
      beginDate: [null],
      endDate: [null],
      active: [''],
      history: [false]
    });
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

  onCancel() {
    this.dialogRef.close();
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.dialogRef.close(this.searchForm.value);
    }
  }

  onFinish() {
    if (this.searchForm.valid) {
      const searchRequest = {
        tableName: 'SSAS_CAP_THRESHOLD_CEILING',
        criteria: this.searchForm.value
      };
      this.dialogRef.close({ type: 'finish', data: searchRequest });
    }
  }
}
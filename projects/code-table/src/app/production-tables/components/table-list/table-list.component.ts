import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { TableConfigService } from '../../services/table-config.service';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, MatListModule],
  template: `
    <mat-nav-list>
      <h3 matSubheader>Production Tables</h3>
      <a mat-list-item *ngFor="let table of availableTables" 
         (click)="navigateToTable(table)">
        {{table}}
      </a>
    </mat-nav-list>
  `,
  styles: [`
    mat-nav-list {
      padding: 0;
    }
  `]
})
export class TableListComponent {
  private router = inject(Router);
  private tableConfig = inject(TableConfigService);
  
  availableTables = Object.values(this.tableConfig.getAllDisplayNames());
  
  navigateToTable(tableName: string) {
    this.router.navigate(['/production-tables', tableName]);
  }
} 
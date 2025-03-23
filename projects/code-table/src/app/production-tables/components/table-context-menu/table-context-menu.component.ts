import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-context-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  template: `
    <div class="context-menu" [style.left]="x + 'px'" [style.top]="y + 'px'">
      <mat-menu #contextMenu="matMenu">
        <button mat-menu-item (click)="onSearch()">Search</button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .context-menu {
      position: fixed;
      z-index: 1000;
    }
  `]
})
export class TableContextMenuComponent {
  x = 0;
  y = 0;

  onSearch() {
    // Handle search
  }
} 
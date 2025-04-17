import { Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppStore } from '../../app.store';
import { MenuLink } from '../shared/types';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { SearchTableDialogComponent } from '../../production-tables/search/searchtable-dialog.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  imports: [
    CommonModule,    
    MatTreeModule,
    RouterModule,
    MatIconModule
  ]
})
export class SideNavComponent {
  readonly #appStore = inject(AppStore);
  private dialog = inject(MatDialog);
  
  // Convert Signal<MenuLink[]> to plain array
  dataSource: Observable<MenuLink[]> = toObservable(this.#appStore.menuLinks).pipe(
    map(signal => signal()) // Extracts the actual array from the signal
  );

  // Function to access children of a node
  childrenAccessor = (node: MenuLink) => node.children ?? [];

  // Check if a node has children
  hasChild = (_: number, node: MenuLink) => !!node.children && node.children.length > 0;

  // Context menu properties
  contextMenuVisible = false;
  menuX = 0;
  menuY = 0;
  selectedTableName = '';

  onRightClick(event: MouseEvent, node: MenuLink) {
    event.preventDefault(); // Prevent default browser right-click menu

    this.selectedTableName = node.title;
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.contextMenuVisible = true;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  openDialog() {
    this.dialog.open(SearchTableDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { tableName: this.selectedTableName }
    });

    this.closeContextMenu();
  }
}
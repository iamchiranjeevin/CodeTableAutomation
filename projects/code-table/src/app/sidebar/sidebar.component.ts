import { Component, OnInit } from '@angular/core';
import { NavigationService, NavItem } from '../shared/navigation.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule
  ],
  template: `
    <div class="sidebar">
      <ng-container *ngFor="let item of navItems$ | async">
        <mat-expansion-panel [expanded]="item.expanded">
          <mat-expansion-panel-header>
            <mat-panel-title>
              {{ item.name }}
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <mat-nav-list *ngIf="item.children">
            <a mat-list-item 
               *ngFor="let child of item.children" 
               [routerLink]="child.route" 
               routerLinkActive="active-link">
              {{ child.name }}
            </a>
          </mat-nav-list>
        </mat-expansion-panel>
      </ng-container>
    </div>
  `,
  styles: [`
    .sidebar {
      height: 100%;
      overflow-y: auto;
    }
    .active-link {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class SidebarComponent implements OnInit {
  navItems$!: Observable<NavItem[]>;

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.navItems$ = this.navigationService.getNavItems();
  }
} 
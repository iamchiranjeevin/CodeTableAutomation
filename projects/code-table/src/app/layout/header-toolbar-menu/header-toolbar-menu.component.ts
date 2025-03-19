import { Component, input, viewChild } from '@angular/core';
import { MenuLink } from '../shared/types';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuPanel,
  MatMenuTrigger,
} from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [
    MatMenu,
    MatMenuContent,
    RouterLink,
    MatMenuTrigger,
    MatMenuItem,
    RouterLinkActive,
  ],
  selector: 'app-header-toolbar-menu',
  styleUrl: './header-toolbar-menu.component.scss',
  templateUrl: './header-toolbar-menu.component.html',
})
export class HeaderToolbarMenuComponent {
  readonly menuLinks = input.required<MenuLink[]>();
  readonly childMenu = viewChild.required<MatMenuPanel>('childMenu');
}

import { Component, inject } from '@angular/core';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AppStore } from '../../app.store';
import { MenuLink } from '../shared/types';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [
    MatTree,
    MatTreeNode,
    MatIcon,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatIconButton,
    MatTreeNodeToggle,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  readonly #appStore = inject(AppStore);
  dataSource = this.#appStore.menuLinks();

  childrenAccessor = (node: MenuLink) => node.children ?? [];

  hasChild = (_: number, node: MenuLink) =>
    !!node.children && node.children.length > 0;
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

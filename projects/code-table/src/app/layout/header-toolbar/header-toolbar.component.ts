import { Component, inject } from '@angular/core';
import { AppStore } from '../../app.store';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LayoutStore } from '../layout.store';

@Component({
  imports: [
    MatToolbar,    
    MatIcon,    
    MatIconButton,
  ],
  selector: 'app-header-toolbar',
  styleUrl: './header-toolbar.component.scss',
  templateUrl: './header-toolbar.component.html',
})
export class HeaderToolbarComponent {
  readonly #appStore = inject(AppStore);
  menuLinks = this.#appStore.menuLinks();
  readonly #layoutStore = inject(LayoutStore);

  toggleSideNav() {
    this.#layoutStore.showSideNav();
  }
}

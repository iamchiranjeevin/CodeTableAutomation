import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LayoutStore } from './layout.store';
import { MenuLink } from './shared/types';
import { Router, RouterOutlet } from '@angular/router';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  imports: [
    HeaderComponent,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    SideNavComponent,
    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @HostBinding('class') appClass =
    'flex flex-col w-full h-full items-stretch justify-start';
  links = signal<MenuLink[]>([]);
  activeIds = signal<string[]>([]);
  readonly layoutStore = inject(LayoutStore);
  readonly router = inject(Router);
  protected showSideNav = this.layoutStore.sideNavToggle();

  constructor() {
    effect(() => {
      const link = this.layoutStore.activeLink();
      this.activeIds.set(this.layoutStore.activeIds());
      if (link.children && link.children.length > 0) {
        this.links.set(link.children);
      } else {
        this.links.set([
          {
            title: link.title ?? '',
            path: link.path ?? '',
            children: [],
            id: link.id ?? '',
          },
        ]);
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]).then();
  }
}

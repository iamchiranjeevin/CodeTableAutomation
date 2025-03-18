import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { LayoutComponent } from '../../layout/layout.component';
import { MenuLink } from '../../layout/shared/types';

@Component({
  selector: 'app-test-phases',
  imports: [RouterOutlet, MatTabLink, MatTabNav, MatTabNavPanel],
  templateUrl: './test-phases.component.html',
  styleUrl: './test-phases.component.scss',
})
export class TestPhasesComponent extends LayoutComponent {
  constructor() {
    super();
    effect(() => {
      const activeLink = this.layoutStore.activeLink();
      const activeIds = this.layoutStore.activeIds();
      this.extracted(activeIds, activeLink);
    });
  }

  private extracted(activeIds: string[], activeLink: Partial<MenuLink>) {
    activeIds.forEach((id: string, index: number) => {
      if (activeLink?.id !== id) {
        return;
      }
      activeIds.splice(index, 1);
      if (activeIds.length === 1) {
        this.links.set(activeLink.children ?? []);
        return;
      }
      activeLink.children?.forEach((link: MenuLink) => {
        this.extracted(activeIds, link);
      });
    });
  }
}

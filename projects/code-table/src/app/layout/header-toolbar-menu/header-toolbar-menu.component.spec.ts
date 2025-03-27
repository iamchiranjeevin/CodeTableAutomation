import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderToolbarMenuComponent } from './header-toolbar-menu.component';

describe('HeaderToolbarMenuComponent', () => {
  let component: HeaderToolbarMenuComponent;
  let fixture: ComponentFixture<HeaderToolbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderToolbarMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderToolbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

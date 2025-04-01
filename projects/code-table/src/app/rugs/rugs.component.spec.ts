import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RugsComponent } from './rugs.component';

describe('RugsComponent', () => {
  let component: RugsComponent;
  let fixture: ComponentFixture<RugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RugsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

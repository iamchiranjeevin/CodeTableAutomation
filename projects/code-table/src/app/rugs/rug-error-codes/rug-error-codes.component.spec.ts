import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RugErrorCodesComponent } from './rug-error-codes.component';

describe('RugErrorCodesComponent', () => {
  let component: RugErrorCodesComponent;
  let fixture: ComponentFixture<RugErrorCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RugErrorCodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RugErrorCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

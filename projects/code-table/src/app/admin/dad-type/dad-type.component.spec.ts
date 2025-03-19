import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadTypeComponent } from './dad-type.component';

describe('DadTypeComponent', () => {
  let component: DadTypeComponent;
  let fixture: ComponentFixture<DadTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DadTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

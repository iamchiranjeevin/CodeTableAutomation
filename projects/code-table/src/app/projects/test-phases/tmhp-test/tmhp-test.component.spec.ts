import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmhpTestComponent } from './tmhp-test.component';

describe('TmhpTestComponent', () => {
  let component: TmhpTestComponent;
  let fixture: ComponentFixture<TmhpTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmhpTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TmhpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

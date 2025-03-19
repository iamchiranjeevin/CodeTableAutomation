import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeTmhpTestComponent } from './before-tmhp-test.component';

describe('BeforeTmhpTestComponent', () => {
  let component: BeforeTmhpTestComponent;
  let fixture: ComponentFixture<BeforeTmhpTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeTmhpTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BeforeTmhpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

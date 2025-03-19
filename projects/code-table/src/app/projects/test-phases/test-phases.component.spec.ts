import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPhasesComponent } from './test-phases.component';

describe('TestPhasesComponent', () => {
  let component: TestPhasesComponent;
  let fixture: ComponentFixture<TestPhasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPhasesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPhasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

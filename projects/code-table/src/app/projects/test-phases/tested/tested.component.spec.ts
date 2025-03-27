import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestedComponent } from './tested.component';

describe('TestedComponent', () => {
  let component: TestedComponent;
  let fixture: ComponentFixture<TestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionTablesComponent } from './production-tables.component';

describe('ProductionTablesComponent', () => {
  let component: ProductionTablesComponent;
  let fixture: ComponentFixture<ProductionTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionTablesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

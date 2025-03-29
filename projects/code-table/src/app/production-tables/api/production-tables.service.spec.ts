import { TestBed } from '@angular/core/testing';

import { ProductionTablesService } from './production-tables.service';

describe('ProductionTablesService', () => {
  let service: ProductionTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

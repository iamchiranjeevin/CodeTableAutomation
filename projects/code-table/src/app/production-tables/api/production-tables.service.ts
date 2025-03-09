import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { getProductionTables } from './production-tables.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);

  getProductionTables() {
    return of(getProductionTables()).pipe(delay(1000));
    // return this.#httpClient.get<ProductionTable[]>(``);
  }
}

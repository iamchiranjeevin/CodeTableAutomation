import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of, Observable } from 'rxjs';
// import { getProductionTables } from './production-tables.mock';
import { ProductionTable } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';  

  getProductionTables(tableName: string): Observable<ProductionTable> {
    const requestPayload = { tableName };
    return this.#httpClient.post<ProductionTable>(this.apiUrl, requestPayload);
  } 

}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductionTablePaginationResponse } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';

  getProductionTables(tableName: string): Observable<any> {
    return this.#httpClient
      .post<ProductionTablePaginationResponse>(`${this.apiUrl}`, { tableName })
      .pipe(map(response => {
        return {
          totalRecords: response.totalRowCount,
          response: response.rows || []
        }

      }));
  }
}
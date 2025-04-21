import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { getProductionTablesCFB2500 } from './production-tables.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';

  getProductionTables(tableName: string): Observable<any> {
    return of(getProductionTablesCFB2500()).pipe(delay(1000));

    // return this.#httpClient
    //   .post<ProductionTablePaginationResponse>(`${this.apiUrl}`, { tableName })
    //   .pipe(
    //     map(response => {
    //       return {
    //         totalRecords: response.totalRowCount,
    //         response: response.rows || [],
    //       };
    //     })
    //   );
  }
}

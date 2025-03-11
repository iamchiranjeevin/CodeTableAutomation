import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of, map, Observable } from 'rxjs';
import { ProductionTable } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';

  getProductionTables(tableName: string): Observable<any> {    
    return this.#httpClient
      .post<{ rows: any[] }>(`${this.apiUrl}/${tableName}`, {})
      .pipe(map(response => response.rows || [])); 
}
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductionTablesService {
  readonly #httpClient = inject(HttpClient);
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';

  getProductionTables(tableName: string): Observable<any> {
    console.log('Fetching production table data for:', tableName);
    
    // Always try to use the real API
    console.log('Using real API endpoint:', `${this.apiUrl}/${tableName}`);
    return this.#httpClient.get(`${this.apiUrl}/${tableName}`);
  }
  
  updateTableRecord(updateRequest: any): Observable<any> {
    console.log('Updating record:', updateRequest);
    console.log('Using real API for update');
    return this.#httpClient.post(`${this.apiUrl}/update`, updateRequest);
  }
  
  searchTable(searchRequest: any): Observable<any> {
    console.log('Searching table with criteria:', searchRequest);
    console.log('Using real API for search');
    return this.#httpClient.post(`${this.apiUrl}/search`, searchRequest);
  }
  
  private getMockData(tableName: string): Observable<any> {
    console.warn('MOCK DATA BEING USED - This should not appear in production');
    return of([
      { ID: 1, NAME: 'Mock Record 1', STATUS: 'Active', CREATE_DATE: '2023-01-01' },
      { ID: 2, NAME: 'Mock Record 2', STATUS: 'Inactive', CREATE_DATE: '2023-02-15' }
    ]);
  }
}
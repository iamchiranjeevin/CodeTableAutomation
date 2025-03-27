import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchTableService {
  private API_URL = 'http://168.60.227.116:8080/productionTableSearchCriteria';
  private TableSearchResultsAPI_URL = 'http://168.60.227.116:8080/productionTableSearchResults';

  constructor(private http: HttpClient) {}

  getTableSearchCriteria(tableName: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { tableName: tableName.replaceAll(' ', '_') });
  }  

  getProductionTableData(tableName: string, rowFilter: any): Observable<any> { 

    const requestBody = {
      tableName: tableName,
      row: rowFilter
    };

    return this.http
        .post<{ rows: any[] }>(`${this.TableSearchResultsAPI_URL}`, requestBody)
        .pipe(map(response => response.rows || [])); 
  }
}

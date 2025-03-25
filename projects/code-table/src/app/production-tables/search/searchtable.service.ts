import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchTableService {
  private API_URL = 'http://168.60.227.116:8080/productionTableSearchCriteria';

  constructor(private http: HttpClient) {}

  getTableSearchCriteria(tableName: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { tableName: tableName.replaceAll(' ', '_') });
  }  
  
}

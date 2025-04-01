import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http: HttpClient) {}

  getProductionTableData(tableName: string, row: any): Observable<any> {
    // Implement your API call here
    return this.http.post<any>(`/api/${tableName}`, { row });
  }
} 
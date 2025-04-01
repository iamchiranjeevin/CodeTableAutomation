import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http: HttpClient) {}

  getProductionTableData(tableName: string, row: any): Observable<any> {
    const url = `/api/production-tables/${tableName}/search`;
    return this.http.post<any>(url, { row });
  }
} 
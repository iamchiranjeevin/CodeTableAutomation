import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchCriteria {
  tableName: string;
  fieldName: string;
}

export interface SearchCriteriaResponse {
  values: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductionTablesSearchService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'http://168.60.227.116:8080/productionTableSearchCriteria';

  getSearchCriteria(tableName: string, fieldName: string): Observable<SearchCriteriaResponse> {
    const payload: SearchCriteria = {
      tableName,
      fieldName
    };
    return this.httpClient.post<SearchCriteriaResponse>(this.apiUrl, payload);
  }
} 
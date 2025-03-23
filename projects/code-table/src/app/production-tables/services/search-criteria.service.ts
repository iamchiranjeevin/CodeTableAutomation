import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchCriteriaResponse, SearchRequest } from '../config/search-config.types';

@Injectable({
  providedIn: 'root'
})
export class SearchCriteriaService {
  private readonly baseUrl = 'http://168.60.227.116:8080';

  constructor(private http: HttpClient) {}

  getSearchCriteria(tableName: string): Observable<SearchCriteriaResponse> {
    return this.http.get<SearchCriteriaResponse>(`${this.baseUrl}/productionTableSearchCriteria/${tableName}`);
  }

  searchTable(request: SearchRequest): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/productionTableSearchResults`, {
      tableName: request.tableName,
      row: request.criteria
    });
  }
} 
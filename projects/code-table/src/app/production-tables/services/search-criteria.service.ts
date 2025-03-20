import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchCriteriaRequest {
  tableName: string;
}

export interface SearchRequest {
  tableName: string;
  criteria: {
    serviceGroup?: string;
    capId?: string;
    capType?: string;
    serviceCode?: string;
    beginDate?: string;
    endDate?: string;
    active?: string;
    history?: boolean;
  }
}

export interface SearchCriteriaResponse {
  serviceGroups: string[];
  capIds: string[];
  capTypes: string[];
  serviceCodes: string[];
  active: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchCriteriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://168.60.227.116:8080';

  getSearchCriteria(tableName: string): Observable<SearchCriteriaResponse> {
    return this.http.post<SearchCriteriaResponse>(
      `${this.baseUrl}/productionTableSearchCriteria`,
      { tableName }
    );
  }

  searchTable(request: SearchRequest): Observable<any> {
    // TODO: Update endpoint when backend is ready
    return this.http.post(`${this.baseUrl}/searchProductionTable`, request);
  }
} 
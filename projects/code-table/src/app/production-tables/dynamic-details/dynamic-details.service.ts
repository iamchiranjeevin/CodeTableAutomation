import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicUpdateRequestBody } from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class DynamicDetailsService {
  private apiUrl = 'http://168.60.227.116:8080/productionTableDetails';

  constructor(private http: HttpClient) {}

  updateData(request: DynamicUpdateRequestBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, request);
  }
}
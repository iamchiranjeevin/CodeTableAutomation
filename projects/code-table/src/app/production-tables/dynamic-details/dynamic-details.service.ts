import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of, map, Observable } from 'rxjs';
import { UpdateRequestBody } from '../shared/types';

@Injectable({
  providedIn: 'root',
})

export class DynamicDetailsService {
    readonly #httpClient = inject(HttpClient);
    private apiUrl = 'http://168.60.227.116:8080/productionTableUpdate';

    updateProductionTableRow(requestBody: UpdateRequestBody): Observable<any> {
        return this.#httpClient.post(`${this.apiUrl}`, requestBody); 
      }
}
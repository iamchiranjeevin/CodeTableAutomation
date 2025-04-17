import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly httpClient = inject(HttpClient);

  getAllInProgressProjects() {
    return of();
  }
}

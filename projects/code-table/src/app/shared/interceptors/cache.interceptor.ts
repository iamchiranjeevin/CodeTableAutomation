import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: HttpResponse<any>, timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cacheKey = request.urlWithParams;
    const cachedResponse = this.cache.get(cacheKey);
    const now = Date.now();

    // Return cached response if it exists and is not expired
    if (cachedResponse && (now - cachedResponse.timestamp < this.CACHE_DURATION)) {
      return of(cachedResponse.response);
    }

    // If no cache or expired, make the request and cache the response
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, { response: event, timestamp: now });
        }
      })
    );
  }
} 
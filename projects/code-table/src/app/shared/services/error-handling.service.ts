import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse, context: string): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your network connection.';
    } else if (error.status === 401) {
      errorMessage = 'You are not authorized to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.error && typeof error.error.message === 'string') {
      errorMessage = error.error.message;
    } else if (typeof error.message === 'string') {
      errorMessage = error.message;
    }

    console.error(`Error in ${context}:`, error);
    
    this.snackBar.open(errorMessage, 'Dismiss', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });

    return throwError(() => new Error(errorMessage));
  }
} 
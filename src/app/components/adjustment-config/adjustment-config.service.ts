import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdjustmentConfig, AdjustmentType, AdjustmentConfigForm } from './adjustment-config';
import { ApiResponse } from '../shared/api-response';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentConfigService {
    private apiUrl = 'http://localhost:8080/api/adjustment-config';
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<any> {
      return this.http.get<any>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }

  getAllPaginated(page: number, size: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl + `?page=${page}&size=${size}`;
    return this.http.get<any>(url, { observe: 'response' });
  }  
  
  getById(id: number): Observable<ApiResponse<AdjustmentConfig>> {
    return this.http.get<ApiResponse<AdjustmentConfig>>(`${this.apiUrl}/${id}`);
  }
  
  create(adjustmentConfig: AdjustmentConfigForm): Observable<ApiResponse<AdjustmentConfigForm>> {
    return this.http.post<ApiResponse<AdjustmentConfigForm>>(this.apiUrl, adjustmentConfig, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  
  update(adjustmentConfig: AdjustmentConfigForm): Observable<ApiResponse<AdjustmentConfigForm>> {
    return this.http
      .put<ApiResponse<AdjustmentConfigForm>>(`${this.apiUrl}`, adjustmentConfig, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  
  delete(adjustmentConfigId: number): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${adjustmentConfigId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en la solicitud';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}

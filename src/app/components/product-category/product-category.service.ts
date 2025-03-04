import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../shared/api-response';
import { ProductCategory, ProductCategoryForm } from './product-category';
import { CategoryPathDTO } from './product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
    private apiUrl = 'http://localhost:8080/api/product-category';
    private apiUrlPaths = 'http://localhost:8080/api/product-category/path';
  
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
  
  getCategoryPaths(): Observable<CategoryPathDTO[]> {
    return this.http.get<{ status: number; messages: string[]; data: CategoryPathDTO[] }>(this.apiUrlPaths)
      .pipe(map(response => response.data)); // Extraemos solo "data"
  } 
  
  getById(id: number): Observable<ApiResponse<ProductCategory>> {
    return this.http.get<ApiResponse<ProductCategory>>(`${this.apiUrl}/${id}`);
  }
  
  create(payload: ProductCategoryForm): Observable<ApiResponse<ProductCategoryForm>> {
    return this.http.post<ApiResponse<ProductCategoryForm>>(this.apiUrl, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  
  update(payload: ProductCategoryForm): Observable<ApiResponse<ProductCategoryForm>> {
    return this.http
      .put<ApiResponse<ProductCategoryForm>>(`${this.apiUrl}`, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  
  delete(deleteId: number): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${deleteId}`)
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

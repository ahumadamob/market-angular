import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserForm } from './user';

export interface ApiResponse<T> {
  status: number;
  messages: {
    type: string;
    field?: string;
    content: string;
  }[];
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUsersPaginated(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }
  

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserForm): Observable<ApiResponse<UserForm>> {
    return this.http.post<ApiResponse<UserForm>>(this.apiUrl, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateUser(user: UserForm): Observable<ApiResponse<UserForm>> {
    return this.http
      .put<ApiResponse<UserForm>>(`${this.apiUrl}`, user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  deleteUser(userId: number): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${userId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
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
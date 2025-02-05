import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';

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

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
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
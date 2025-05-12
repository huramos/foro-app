import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/auth';

  constructor(private http: HttpClient) {}

  // 🔹 Autenticación de usuario con manejo de errores
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 🔹 Registro de nuevo usuario con manejo de errores
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 🔹 Manejo de errores global
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    
    if (error.status === 400) {
      errorMessage = 'Datos inválidos. Verifica el formulario.';
    } else if (error.status === 409) {
      errorMessage = 'El usuario ya existe. Intenta con otro nombre.';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
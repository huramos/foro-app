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

export interface RegisterResponse {
  message: string;
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
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 🔹 Manejo de errores global con tipado explícito
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado.';

    switch (error.status) {
      case 400:
        errorMessage = 'Datos inválidos. Verifica el formulario.';
        break;
      case 409:
        errorMessage = 'El usuario ya existe. Intenta con otro nombre.';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        break;
    }

    console.error(`⚠️ Error HTTP (${error.status}): ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // Puedes agregar otros campos según lo que devuelva el backend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta la URL base a la dirección y puerto en que se publica tu backend
  private baseUrl = 'http://localhost:8082/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  // Aquí podrías agregar métodos para register, recoverPassword, resetPassword, etc.
}
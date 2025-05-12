import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ Angular lo registrará como proveedor global
})
export class UserService {
  private apiUrl = 'http://localhost:8082/auth/user-profile'; // ✅ Asegúrate de que este endpoint existe en el backend

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?username=${username}`);
  }

  updateUserProfile(username: string, data: any): Observable<any> { // ✅ Se agrega `username` para asegurar la actualización correcta
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // ✅ Se agregan las cabeceras necesarias

    return this.http.put<any>(`${this.apiUrl}?username=${username}`, data, { headers }); // ✅ Se ajusta la ruta
  }
}
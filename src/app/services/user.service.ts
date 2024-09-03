import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Obtener el token del almacenamiento local
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('x-access-token', token ? token : '');
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Método para obtener un usuario por ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Método para crear un nuevo usuario
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: this.getHeaders() });
  }

  // Método para actualizar un usuario existente
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  // Método para eliminar un usuario
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`, { headers: this.getHeaders() });
  }

  private getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }



}

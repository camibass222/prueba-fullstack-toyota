import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jsonPlaceholderUrl = 'https://jsonplaceholder.typicode.com';
  private usuariosUrl = 'http://localhost:3001';
  private pedidosUrl = 'http://localhost:3002';
  private pagosUrl = 'http://localhost:3003';

  constructor(private http: HttpClient) {}

  // JSONPlaceholder API
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jsonPlaceholderUrl}/posts`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jsonPlaceholderUrl}/users`);
  }

  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jsonPlaceholderUrl}/todos`);
  }

  // Microservicios
  getUsuariosHealth(): Observable<any> {
    return this.http.get<any>(`${this.usuariosUrl}/health`);
  }

  getPedidosHealth(): Observable<any> {
    return this.http.get<any>(`${this.pedidosUrl}/health`);
  }

  getPagosHealth(): Observable<any> {
    return this.http.get<any>(`${this.pagosUrl}/health`);
  }
}
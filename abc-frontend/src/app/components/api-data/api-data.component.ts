import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-api-data',
  standalone: false,
  templateUrl: './api-data.component.html',
  styleUrls: ['./api-data.component.css']
})
export class ApiDataComponent implements OnInit {
  posts: any[] = [];
  users: any[] = [];
  todos: any[] = [];
  activeTab: string = 'posts';
  isLoading: boolean = false;
  error: string = '';

  microservicesStatus: any = {
    usuarios: { status: 'checking' },
    pedidos: { status: 'checking' },
    pagos: { status: 'checking' }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
    this.checkMicroservicesHealth();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.error = '';
    
    switch(tab) {
      case 'posts':
        if (this.posts.length === 0) this.loadPosts();
        break;
      case 'users':
        if (this.users.length === 0) this.loadUsers();
        break;
      case 'todos':
        if (this.todos.length === 0) this.loadTodos();
        break;
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.slice(0, 10);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar posts';
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.isLoading = false;
      }
    });
  }

  loadTodos(): void {
    this.isLoading = true;
    this.apiService.getTodos().subscribe({
      next: (data) => {
        this.todos = data.slice(0, 20);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar todos';
        this.isLoading = false;
      }
    });
  }

  checkMicroservicesHealth(): void {
    this.apiService.getUsuariosHealth().subscribe({
      next: (data) => this.microservicesStatus.usuarios = { status: 'online' },
      error: () => this.microservicesStatus.usuarios = { status: 'offline' }
    });

    this.apiService.getPedidosHealth().subscribe({
      next: (data) => this.microservicesStatus.pedidos = { status: 'online' },
      error: () => this.microservicesStatus.pedidos = { status: 'offline' }
    });

    this.apiService.getPagosHealth().subscribe({
      next: (data) => this.microservicesStatus.pagos = { status: 'online' },
      error: () => this.microservicesStatus.pagos = { status: 'offline' }
    });
  }
}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  get adminCount(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  get userCount(): number {
    return this.users.filter(u => u.role === 'user').length;
  }

  ngOnInit(): void {
    this.users = [
      { id: 1, username: 'admin', email: 'admin@abc.com', role: 'admin' },
      { id: 2, username: 'usuario', email: 'usuario@abc.com', role: 'user' },
      { id: 3, username: 'juan', email: 'juan@abc.com', role: 'user' },
      { id: 4, username: 'maria', email: 'maria@abc.com', role: 'user' }
    ];
  }
}
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<boolean>();
  
  menuItems: MenuItem[] = [
    { label: 'Usuarios', icon: 'bi-people-fill', route: '/dashboard/users', roles: ['admin', 'user'] },
    { label: 'Pedidos', icon: 'bi-box-seam-fill', route: '/dashboard/orders', roles: ['admin', 'user'] },
    { label: 'Pagos', icon: 'bi-credit-card-fill', route: '/dashboard/payments', roles: ['admin', 'user'] },
    { label: 'API Externa', icon: 'bi-globe2', route: '/dashboard/api-data', roles: ['admin', 'user'] },
    { label: 'Configuración', icon: 'bi-gear-fill', route: '/dashboard/settings', roles: ['admin'] },
    { label: 'Reportes', icon: 'bi-graph-up-arrow', route: '/dashboard/reports', roles: ['admin'] }
  ];

  filteredMenuItems: MenuItem[] = [];
  isCollapsed: boolean = false;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.filterMenuByRole();
    });
  }

  filterMenuByRole(): void {
    if (this.currentUser) {
      this.filteredMenuItems = this.menuItems.filter(item => 
        item.roles.includes(this.currentUser.role)
      );
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.menuToggle.emit(this.isCollapsed);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
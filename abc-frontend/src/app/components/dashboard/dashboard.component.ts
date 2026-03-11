import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sidebarCollapsed: boolean = false;

  constructor(public themeService: ThemeService) {}

  onMenuToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
}
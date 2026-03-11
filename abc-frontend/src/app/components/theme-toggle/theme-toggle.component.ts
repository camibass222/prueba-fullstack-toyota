import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  isDark: boolean = false;

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDark = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
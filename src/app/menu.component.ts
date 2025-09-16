// menu.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabService } from './tab.service';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users.component';
import { ReportsComponent } from './reports.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  
  template: `
    <ul class="space-y-2">
      <li><button (click)="open('dashboard', 'Dashboard', '/dashboard')">Dashboard</button></li>
      <li><button (click)="open('users','Users','/users')">Users</button></li>
      <li><button (click)="open('reports','Reports','/reports')">Reports</button></li>
    </ul>
  `,
})
export class MenuComponent {
  private tabService = inject(TabService);
  private router = inject(Router);

  open(id: string, title: string, route: string) {
    this.tabService.openTab({ id, title, route });
    this.router.navigateByUrl(route);
  }
}

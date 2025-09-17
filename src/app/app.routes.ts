import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users.component';
import { ReportsComponent } from './reports.component';

export const routes: Routes = [
  { path: 'home', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

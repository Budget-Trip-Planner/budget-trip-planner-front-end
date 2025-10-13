import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth/auth-guard';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Dashboard</h2>
    <p>Bienvenue ! (zone protégée)</p>
    <button (click)="logout()">Déconnexion</button>
  `
})
class DashboardComponent {
  logout() { localStorage.removeItem('bp_token'); location.href = '/auth/login'; }
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'auth/login' }
];

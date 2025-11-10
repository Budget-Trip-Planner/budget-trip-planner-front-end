import {Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {authGuard} from './core/auth/auth-guard';
import {Component} from '@angular/core';
import {HomeComponent} from './features/home/home.component';
import {ProposalsComponent} from './features/proposals/proposals.component';
import {UserProfileComponent} from './features/user-profile/user-profile.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {HeaderComponent} from './core/layout/header/header.component';
import {MainLayoutComponent} from './core/layout/main-layout/main-layout.component';
import {HistoryComponent} from './features/history/history.component';
import {ContactUsComponent} from './features/contact-us/contact-us.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login'},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'proposals', component: ProposalsComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'history', component: HistoryComponent},
  { path: 'contactUs', component: ContactUsComponent},

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'userProfile', component: UserProfileComponent },
    ]
  },

  { path: '**', redirectTo: 'auth/login'}
];



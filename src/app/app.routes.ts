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
import {FuturComponent} from './features/futur/futur.component';
import {FriendsComponent} from './features/friends/friends.component';
import {GroupsComponent} from './features/groups/groups.component';
import {MessageComponent} from './features/messages/messages.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login'},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/register', component: RegisterComponent},
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'userProfile',
        component: UserProfileComponent,
        data: { showSidebar: true }
      },
      {
        path: 'messages',
        component: MessageComponent,
        data: { showSidebar: false }
      },
      {
        path: 'friends',
        component: FriendsComponent,
        data: { showSidebar: false }
      },
      {
        path: 'groups',
        component: GroupsComponent,
        data: { showSidebar: false }
      },
      {
        path: 'VoyageAVenir',
        component: FuturComponent,
        data: { showSidebar: false }
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: {showSidebar: false},
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {showSidebar: false},
      },
      {
        path: 'proposals',
        component: ProposalsComponent,
        data: {showSidebar: false},
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {showSidebar: false},
      },
      {
        path: 'dashboard/:id',
        component: DashboardComponent,
        data: {showSidebar: false},
      },
      {
        path: 'contactUs',
        component: ContactUsComponent,
        data: {showSidebar: true},
      },
      {
        path: 'accueil',
        redirectTo: 'home',
        pathMatch: 'full',
        data: {showSidebar: false},
      },
    ]
  },

  { path: '**', redirectTo: 'home'}
];



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.css'
})
export class ProfileSidebarComponent {

  constructor() {}

  logout(): void {
    console.log('Déconnexion');
  }
}

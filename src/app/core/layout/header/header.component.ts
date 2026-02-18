import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  userImageUrl: string | null = null;
  defaultAvatar: string = '/profile-icon.png';
  isOpen = false;
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.userImageUrl = user.imageUrl;
      }
    });
  }

  toggleMenu(event?: MouseEvent) {
    event?.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

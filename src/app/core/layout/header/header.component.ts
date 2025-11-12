import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';

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

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.userImageUrl = user.imageUrl;
      }
    });
  }

}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {User, UserService, Location} from '../../core/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  defaultAvatar: string = '/profile-icon.png'

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = {...user};
    });
  }

  onSubmit() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe({
        next: (updatedUser) => {
          console.log('Données sauvegardées (simulation)', updatedUser);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    }
  }
}

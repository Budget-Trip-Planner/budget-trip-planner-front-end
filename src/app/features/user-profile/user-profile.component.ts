import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../core/services/user/user.service';

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

  // 👉 À remplacer par l'ID récupéré dans le token
  private readonly userId = 1;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    // 🔥 Charge le profil utilisateur depuis ton API
    this.userService.loadUser(this.userId).subscribe();

    // 🔥 Se met à jour dès que le service reçoit le user
    this.userService.currentUser$.subscribe((user: User | null) => {
      if (!user) {
        this.user = null;
        return;
      }

      // copie locale pour le formulaire
      this.user = { ...user };
    });
  }

  // 📌 Upload image locale
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];

    if (!file || !this.user) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      this.user!.imageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  // 📌 Envoi du PUT /api/users/:id/profile
  onSubmit(): void {
    if (!this.user) {
      return;
    }

    this.userService.updateUser(this.user, this.userId).subscribe({
      next: updatedUser => {
        console.log('Profil mis à jour', updatedUser);
        this.user = { ...updatedUser }; // refresh local
      },
      error: err => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

}

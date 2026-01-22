import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { User, UserService } from '../../core/services/user/user.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmDialogComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  user: User | null = null;
  private readonly userId = 1;

  constructor(
    public userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.loadUser(this.userId).subscribe();

    this.userService.currentUser$.subscribe((user: User | null) => {
      this.user = user ? { ...user } : null;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file || !this.user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      this.user!.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        message: 'Confirmer la mise à jour de votre profil ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.userService.updateUser(this.user!, this.userId).subscribe({
        next: updatedUser => {
          console.log('Profil mis à jour', updatedUser);
          this.user = { ...updatedUser };
        },
        error: err => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    });
  }
}

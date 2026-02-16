import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { TripRequest } from '../../core/models/home';
import { Router } from '@angular/router';
import { HomeService } from '../../core/home/home.service';
import { TripStoreService } from '../../core/services/trip-store.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../shared/components/info-dialog/info-dialog.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  budget!: number;
  duration!: number;
  departureCity!: string;
  preferences = ['Plage', 'Nature', 'Culture', 'Gastronomie', 'Shopping', 'Aventure', 'Bien-être', 'Histoire', 'Romantique', 'Croisière', 'Luxe', 'Famille', 'Festivals', 'Sport'];
  selectedPreferences: string[] = [];
  errorMessage: string = '';
  startDate!: string;

  private preferenceMap: Record<string, string> = {
    'Plage': 'beach',
    'Nature': 'nature',
    'Culture': 'culture',
    'Gastronomie': 'food',
    'Shopping': 'shopping',
    'Aventure': 'adventure',
    'Bien-être': 'wellness',
    'Bien-être': 'wellness',
    'Histoire': 'history',
    'Romantique': 'romantic',
    'Croisière': 'cruise',
    'Luxe': 'luxury',
    'Famille': 'family',
    'Festivals': 'festivals',
    'Sport': 'sport'
  };


  constructor(
  private router: Router,
  private homeService: HomeService,
  private tripStore: TripStoreService,
  private dialog: MatDialog) {}

  togglePreference(preference: string): void {
    const index = this.selectedPreferences.indexOf(preference);
    if (index >= 0) {
      this.selectedPreferences.splice(index, 1);
    } else {
      this.selectedPreferences.push(preference);
    }

    if (this.selectedPreferences.length > 3) {
      this.errorMessage = 'Vous devez choisir au maximum 3 préférences';
    } else {
      this.errorMessage = '';
    }
  }

  getTagColor(preference: string): string {
    const colorMap: { [key: string]: string } = {
      'Plage': 'tag-blue',
      'Nature': 'tag-green',
      'Culture': 'tag-yellow',
      'Gastronomie': 'tag-orange',
      'Shopping': 'tag-purple',
      'Aventure': 'tag-red',
      'Bien-être': 'tag-teal',
      'Histoire': 'tag-brown',
      'Romantique': 'tag-pink',
      'Croisière': 'tag-cyan',
      'Luxe': 'tag-gold',
      'Famille': 'tag-lime',
      'Festivals': 'tag-indigo',
      'Sport': 'tag-silver'
    };
    return colorMap[preference] || 'tag-gray';
  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }
  createTrip() {

    if (!this.budget || !this.duration || !this.departureCity?.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.budget <= 0) {
      this.errorMessage = 'Le budget doit être supérieur à 0 €';
      return;
    }

    if (this.duration <= 0) {
      this.errorMessage = 'La durée du voyage doit être d’au moins 1 jour';
      return;
    }

    this.errorMessage = '';

    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '420px',
      data: {
        title: 'Veuillez patienter',
        message: 'Création des propositions en cours...'
      },
      disableClose: true
    });

    const payload = {
      budget: Number(this.budget),
      duration: Number(this.duration),
      departureCity: this.departureCity.trim(),
      startDate: this.startDate || '2025-08-01',
      preferences: (this.selectedPreferences.length
          ? this.selectedPreferences
          : ['Plage', 'Culture', 'Gastronomie']
      )
        .map(p => this.preferenceMap[p])
        .filter(Boolean)
    };

    this.homeService.createTrip(payload as any).subscribe({

      next: (response) => {
        dialogRef.close();

        this.tripStore.setTrips(
          Array.isArray(response) ? response : [response]
        );

        this.router.navigate(['proposals']);
      },

      error: (error) => {
        dialogRef.close();

        console.error('Erreur lors de la création du voyage :', error);
        this.errorMessage = 'Impossible de créer les propositions pour le moment.';
      }

    });
  }


}

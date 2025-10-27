import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { TripRequest } from '../../core/models/home';
import { Router } from '@angular/router';
import { HomeService } from '../../core/home/home.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  startDate!: Date;

  constructor(private router: Router, private homeService: HomeService) { }
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
    if (!this.budget|| !this.duration|| !this.departureCity?.trim()) {
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
    
    const tripRequest: TripRequest = {
      budget: this.budget,
      duration: this.duration,
      departureCity: this.departureCity,
      startDate: this.startDate,
      preferences: this.selectedPreferences
    }

    this.homeService.createTrip(tripRequest).subscribe({
      next: (response) => {
        console.log(tripRequest);
        this.router.navigate(['proposals'], { state: { trips: response } });
      },
      error: (error) => {
        console.error('Erreur lors de la création du voyage :', error);
      }
    }
    );
  }


}

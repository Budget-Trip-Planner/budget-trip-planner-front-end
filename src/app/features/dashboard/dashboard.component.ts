import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

interface BudgetItem {
  label: string;
  montant: number;
  couleur: string;
}

interface Jour {
  titre: string;
  activites: string[];
}

interface Trip {
  destination: string;
  duree: number;
  budget: number;
  description: string;
  imageUrl: string;
  repartition: BudgetItem[];
  jours: Jour[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  trip: Trip | null = null;
  chartGradient = '';
  headerBackground = '';

  constructor(private router: Router) {}
   // Exemple d'appel API pour récupérer le voyage depuis un backend
    /*
    this.http.get<Trip>('https://mon-api.com/api/trip/rome').subscribe({
      next: (data) => {
        this.trip = data;
        this.updateChartGradient();
        this.updateHeaderBackground();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du voyage :', err);
      }
    });
    */
  ngOnInit(): void {
    this.trip = {
      destination: 'Rome',
      duree: 5,
      budget: 950,
      description: 'Séjour de 5 jours dans la capitale italienne',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg',
      repartition: [
        { label: 'Transports', montant: 237.5, couleur: '#48bb78' },
        { label: 'Hôtel', montant: 285, couleur: '#ecc94b' },
        { label: 'Restaurants', montant: 237.5, couleur: '#63b3ed' },
        { label: 'Activités', montant: 190, couleur: '#f56565' },
      ],
      jours: [
        { titre: 'Jour 1', activites: ['✈️ Vol', '🏨 Hôtel', '🍽️ Dîner'] },
        { titre: 'Jour 2', activites: ['🏛️ Musée', '🍝 Déjeuner', '🎭 Soirée'] },
        { titre: 'Jour 3', activites: ['⛲ Fontaine de Trevi', '🏛️ Panthéon', '🍦 Glace'] },
        { titre: 'Jour 4', activites: ['🏟️ Colisée', '🏛️ Forum Romain', '🍕 Pizza'] },
        { titre: 'Jour 5', activites: ['🛍️ Shopping', '✈️ Vol retour'] },
      ],
    };

    this.updateChartGradient();
    this.updateHeaderBackground();
  }

  updateChartGradient(): void {
    if (!this.trip) return;

    const total = this.trip.repartition.reduce((acc, item) => acc + item.montant, 0);
    let current = 0;
    const segments: string[] = [];

    for (const item of this.trip.repartition) {
      const start = (current / total) * 100;
      const end = ((current + item.montant) / total) * 100;
      segments.push(`${item.couleur} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
      current += item.montant;
    }

    this.chartGradient = `conic-gradient(${segments.join(', ')})`;
  }

  updateHeaderBackground(): void {
    if (!this.trip) return;
    this.headerBackground =
      `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), ` +
      `url("${this.trip.imageUrl}") center / cover no-repeat`;
  }

  goBack(): void {
    this.router.navigate(['/proposals']);
    //Ici charger le fichier qui ressortira la liste des propositions de voyages ou les choix de l'utilisateur'
  }
}

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
  const nav = this.router.getCurrentNavigation();
  const state = (nav?.extras.state || history.state) as { trips: any[] };

  if (state?.trips?.length) {
    const proposal = state.trips[0];

    this.trip = this.mapProposalToTrip(proposal);

    this.updateChartGradient();
    this.updateHeaderBackground();
  } else {
    console.warn('No trip data received');
  }
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
  }

  mapProposalToTrip(proposal: any): Trip {
    return {
      destination: proposal.destination.city,
      duree: proposal.durationDays,
      budget: proposal.budgetTotal,
      description: `Séjour de ${proposal.durationDays} jours à ${proposal.destination.city}`,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg',

      repartition: [
        {
          label: 'Transports',
          montant: proposal.expense.transportAmount,
          couleur: '#48bb78',
        },
        {
          label: 'Hôtel',
          montant: proposal.expense.hotelAmount,
          couleur: '#ecc94b',
        },
        {
          label: 'Restaurants',
          montant: proposal.expense.restaurantAmount,
          couleur: '#63b3ed',
        },
        {
          label: 'Activités',
          montant: proposal.expense.activitiesAmount,
          couleur: '#f56565',
        },
      ],

      jours: Object.entries(
        proposal.itineraries.reduce((acc: any, item: any) => {
          acc[item.dayNumber] ??= [];
          acc[item.dayNumber].push(item.activity);
          return acc;
        }, {})
      ).map(([day, acts]) => ({
        titre: `Jour ${day}`,
        activites: acts as string[],
      })),
    };
  }
}

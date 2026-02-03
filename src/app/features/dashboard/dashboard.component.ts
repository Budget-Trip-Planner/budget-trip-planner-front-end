import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TripRequest, TripResponse } from '../../core/models/home';
import { ExpensePayload, ItineraryPayload, ProposalPayload } from '../../core/models/proposal';
import { environment } from '../../../environments/environment';


interface BudgetItem {
  label: string;
  montant: number;
  couleur: string;
}

interface Jour {
  titre: string;
  activites: string[];
}

interface TripView {
  destination: string;
  duree: number;
  budget: number;
  description: string;
  imageUrl: string;
  repartition: BudgetItem[];
  jours: Jour[];
  startDate?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  trip: TripView | null = null;


  sourceTrip: TripResponse | null = null;
  searchCriteria: TripRequest | null = null;


  chartGradient = '';
  headerBackground = '';
  saving = false;
  statusMessage = '';

  private readonly budgetCategories = [
    { label: 'Transports', ratio: 0.25, couleur: '#48bb78' },
    { label: 'Hôtel', ratio: 0.3, couleur: '#ecc94b' }, // Modifié 'Hotel' -> 'Hôtel'
    { label: 'Restaurants', ratio: 0.2, couleur: '#63b3ed' },
    { label: 'Activités', ratio: 0.25, couleur: '#f56565' }, // Modifié 'Activites' -> 'Activités'
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();

    const state = (nav?.extras.state || history.state) as { trips?: any[], trip?: any, criteria?: any };

    // Logique de récupération : on prend le premier élément du tableau trips
    if (state?.trips && state.trips.length > 0) {
      this.sourceTrip = state.trips[0];
    } else if (state?.trip) {
      this.sourceTrip = state.trip;
    }

    this.searchCriteria = state?.criteria ?? null;

    if (!this.sourceTrip) {
      console.warn('Aucune donnée de voyage reçue');
      return;
    }


    this.trip = this.buildTripFromResponse(this.sourceTrip!, this.searchCriteria);

    this.updateChartGradient();
    this.updateHeaderBackground();
  }



  private buildTripFromResponse(response: TripResponse, criteria: TripRequest | null): TripView {
    const budget = response.estimatedCost ?? 0;
    const duration = response.durationDays && response.durationDays > 0 ? response.durationDays : 1;

    return {
      destination: response.destination,
      duree: duration,
      budget,
      description: this.buildDescription(response, criteria),
      imageUrl: response.image ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg',
      repartition: this.buildRepartition(budget),
      jours: this.buildJours(duration, criteria?.preferences, response.destination),
      startDate: this.normalizeDateString(response.startDate ?? criteria?.startDate),
    };
  }

  private buildDescription(response: TripResponse, criteria: TripRequest | null): string {
    const departure = criteria?.departureCity ? criteria.departureCity : 'votre ville';
    // Gestion propre des préférences
    const prefs = criteria?.preferences?.length ? criteria.preferences : [];
    const prefString = prefs.length > 0 ? prefs.slice(0, 3).join(', ') : 'un programme sur mesure';

    return `Séjour de ${response.durationDays || 1} jours à ${response.destination} depuis ${departure}. (Thèmes : ${prefString})`;
  }

  private buildRepartition(totalBudget: number): BudgetItem[] {
    const repartition: BudgetItem[] = [];
    if (totalBudget <= 0) return repartition;

    let remaining = totalBudget;
    this.budgetCategories.forEach((category, index) => {
      const isLast = index === this.budgetCategories.length - 1;
      const montant = isLast ? this.round2(remaining) : this.round2(totalBudget * category.ratio);
      remaining -= montant;
      repartition.push({ ...category, montant });
    });
    return repartition;
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private buildJours(duration: number, preferences: string[] | undefined, destination: string): Jour[] {
    const jours: Jour[] = [];
    for (let index = 0; index < duration; index++) {
      const joursActivites = [
        index === 0 ? `Arrivée à ${destination}` : 'Découverte locale',
        'Visite culturelle ou détente',
        'Dîner local'
      ];
      jours.push({ titre: `Jour ${index + 1}`, activites: joursActivites });
    }
    return jours;
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
    this.headerBackground = `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url("${this.trip.imageUrl}") center / cover no-repeat`;
  }

  saveTrip(): void {
    if (!this.trip || !this.sourceTrip) return;

    this.saving = true;
    this.statusMessage = '';


    const payload = this.buildProposalPayload();
    if(!payload) {
      this.saving = false;
      return;
    }


    this.http.post(`${environment.apiUrl}/voyages/proposal`, payload).subscribe({
      next: () => {
        this.statusMessage = 'Voyage enregistré avec succès !';
        this.saving = false;
        // Redirection vers l'historique après succès
        setTimeout(() => this.router.navigate(['/historique']), 1000);
      },
      error: (err) => {
        console.error('Erreur save:', err);
        this.statusMessage = 'Erreur lors de l\'enregistrement.';
        this.saving = false;
      }
    });
  }

  shareTrip(): void {
    alert('Lien de partage copié dans le presse-papier !');
  }

  private normalizeDateString(value?: string | Date): string | undefined {
    if (!value) return undefined;
    const date = typeof value === 'string' ? new Date(value) : value;
    return isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
  }

  private buildProposalPayload(): ProposalPayload | null {
    if (!this.sourceTrip || !this.trip) return null;
    return {
      objectType: 'users',
      destination: { city: this.sourceTrip.destination, country: this.sourceTrip.country || 'Unknown' },
      budgetTotal: this.trip.budget,
      durationDays: this.trip.duree,
      startDate: this.normalizeDateString(new Date()),

      expense: {
        transportAmount: this.trip.repartition[0].montant,
        hotelAmount: this.trip.repartition[1].montant,
        restaurantAmount: this.trip.repartition[2].montant,
        activitiesAmount: this.trip.repartition[3].montant,
        currency: 'EUR'
      },
      itineraries: []
    };
  }
}

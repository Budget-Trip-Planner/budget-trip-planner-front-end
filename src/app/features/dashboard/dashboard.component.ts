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
  missingState = false;
  saving = false;
  statusMessage = '';
  private readonly offlineMockSave = false; // basculer à true pour simuler l'enregistrement sans backend

  private readonly budgetCategories = [
    { label: 'Transports', ratio: 0.25, couleur: '#48bb78' },
    { label: 'Hotel', ratio: 0.3, couleur: '#ecc94b' },
    { label: 'Restaurants', ratio: 0.2, couleur: '#63b3ed' },
    { label: 'Activites', ratio: 0.25, couleur: '#f56565' },
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const state = window.history.state as {
      trip?: TripResponse;
      criteria?: TripRequest;
    };

    this.sourceTrip = state?.trip ?? null;
    this.searchCriteria = state?.criteria ?? null;

    if (!this.sourceTrip) {
      this.missingState = true;
      return;
    }

    this.trip = this.buildTripFromResponse(this.sourceTrip, this.searchCriteria);
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
      imageUrl:
        response.image ??
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg',
      repartition: this.buildRepartition(budget),
      jours: this.buildJours(duration, criteria?.preferences, response.destination),
      startDate: this.normalizeDateString(response.startDate ?? criteria?.startDate),
    };
  }

  private buildDescription(response: TripResponse, criteria: TripRequest | null): string {
    const departure = criteria?.departureCity ? criteria.departureCity : 'votre ville';
    const preferences = criteria?.preferences?.length
      ? criteria.preferences.slice(0, 3).join(', ')
      : 'un programme sur mesure';
    return (
      'Voyage de ' +
      (response.durationDays || 1) +
      ' jours vers ' +
      response.destination +
      ' depuis ' +
      departure +
      ' avec focus ' +
      preferences +
      '.'
    );
  }

  private buildRepartition(totalBudget: number): BudgetItem[] {
    const repartition: BudgetItem[] = [];

    if (totalBudget <= 0) {
      for (const category of this.budgetCategories) {
        repartition.push({ ...category, montant: 0 });
      }
      return repartition;
    }

    let remaining = totalBudget;

    this.budgetCategories.forEach((category, index) => {
      const isLast = index === this.budgetCategories.length - 1;
      const montant = isLast ? this.round2(remaining) : this.round2(totalBudget * category.ratio);
      remaining -= montant;
      repartition.push({
        label: category.label,
        montant,
        couleur: category.couleur,
      });
    });

    return repartition;
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private buildJours(duration: number, preferences: string[] | undefined, destination: string): Jour[] {
    const jours: Jour[] = [];

    for (let index = 0; index < duration; index++) {
      const pref = preferences && preferences.length ? preferences[index % preferences.length] : '';
      const activites = [
        index === 0 ? 'Arrivee et installation a ' + destination : 'Decouverte du quartier',
        pref ? 'Experience ' + pref : 'Programme libre',
        index === duration - 1 ? 'Derniere soiree et depart' : 'Soiree gastronomique',
      ];
      jours.push({
        titre: 'Jour ' + (index + 1),
        activites,
      });
    }

    return jours;
  }

  private normalizeDateString(value?: string | Date): string | undefined {
    if (!value) {
      return undefined;
    }
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date.toISOString().split('T')[0];
  }

  saveTrip(): void {
    if (!this.trip || !this.sourceTrip) {
      this.statusMessage = 'Selectionnez un voyage pour pouvoir l enregistrer.';
      return;
    }

    const payload = this.buildProposalPayload();
    if (!payload) {
      this.statusMessage = 'Les donnees sont incompletes pour enregistrer ce voyage.';
      return;
    }

    this.saving = true;
    this.statusMessage = '';

    if (this.offlineMockSave) {
      console.info('Mock save payload', payload);
      setTimeout(() => {
        this.statusMessage = 'Simulation : voyage enregistré (backend désactivé).';
        this.saving = false;
        this.router.navigate(['/history']);
      }, 600);
      return;
    }

    this.http.post(environment.apiUrl + '/voyages/proposal', payload).subscribe({
      next: () => {
        this.statusMessage = 'Voyage enregistre dans votre historique.';
        this.saving = false;
        this.router.navigate(['/history']);
      },
      error: (err) => {
        console.error('Erreur lors de l enregistrement du voyage', err);
        this.statusMessage = 'Impossible d enregistrer ce voyage, reessayez.';
        this.saving = false;
      },
    });
  }

  private buildProposalPayload(): ProposalPayload | null {
    if (!this.trip || !this.sourceTrip) {
      return null;
    }

    const startDate = this.normalizeDateString(this.sourceTrip.startDate ?? this.searchCriteria?.startDate);
    const destinationCountry = this.sourceTrip.country ?? 'France';

    const payload: ProposalPayload = {
      objectType: 'proposal',
      destination: {
        city: this.sourceTrip.destination,
        country: destinationCountry,
      },
      budgetTotal: this.trip.budget,
      durationDays: this.trip.duree,
      startDate,
      expense: this.buildExpensePayload(),
      itineraries: this.buildItineraryPayload(),
    };

    if (this.searchCriteria?.departureCity) {
      payload.departure = {
        city: this.searchCriteria.departureCity,
        country: 'France',
      };
    }

    return payload;
  }

  private buildExpensePayload(): ExpensePayload {
    const expense: ExpensePayload = {
      transportAmount: 0,
      hotelAmount: 0,
      restaurantAmount: 0,
      activitiesAmount: 0,
      currency: 'EUR',
    };

    if (!this.trip) {
      return expense;
    }

    this.trip.repartition.forEach((item) => {
      const key = item.label.toLowerCase();
      if (key.includes('transport')) {
        expense.transportAmount = item.montant;
      } else if (key.includes('hotel')) {
        expense.hotelAmount = item.montant;
      } else if (key.includes('restaurant')) {
        expense.restaurantAmount = item.montant;
      } else if (key.includes('activite')) {
        expense.activitiesAmount = item.montant;
      }
    });

    return expense;
  }

  private buildItineraryPayload(): ItineraryPayload[] {
    if (!this.trip) {
      return [];
    }

    return this.trip.jours.flatMap((jour, index) =>
      jour.activites
        .filter((activity) => activity && activity.trim().length > 0)
        .map((activity) => ({
          dayNumber: index + 1,
          activity,
        }))
    );
  }

  updateChartGradient(): void {
    if (!this.trip) {
      this.chartGradient = '';
      return;
    }

    const total = this.trip.repartition.reduce((acc, item) => acc + item.montant, 0);
    if (total === 0) {
      this.chartGradient = '';
      return;
    }

    let current = 0;
    const segments: string[] = [];

    for (const item of this.trip.repartition) {
      const start = (current / total) * 100;
      const end = ((current + item.montant) / total) * 100;
      segments.push(item.couleur + ' ' + start.toFixed(2) + '% ' + end.toFixed(2) + '%');
      current += item.montant;
    }

    this.chartGradient = 'conic-gradient(' + segments.join(', ') + ')';
  }

  updateHeaderBackground(): void {
    if (!this.trip) {
      this.headerBackground = '';
      return;
    }
    this.headerBackground =
      'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), ' +
      'url("' + this.trip.imageUrl + '") center / cover no-repeat';
  }

  goBack(): void {
    this.router.navigate(['/proposals']);
  }

  shareTrip(): void {
    this.statusMessage = 'Partage non implémenté – copie le lien ou prends une capture !';
  }
}

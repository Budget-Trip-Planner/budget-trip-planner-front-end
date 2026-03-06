import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ProposalFlightLeg,
  ProposalFlights,
  ProposalPayload,
  TripService
} from '../../core/services/trip/trip.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface BudgetItem {
  label: string;
  montant: number;
  couleur: string;
}

interface Jour {
  titre: string;
  activites: string[];
}

interface FlightDisplay {
  label: string;
  airline: string;
  flightNumber: string;
  departureCode: string;
  arrivalCode: string;
  departureDateTime: string;
  arrivalDateTime: string;
  duration: string;
  travelClass: string;
  stops: number;
}

interface Trip {
  destination: string;
  duree: number;
  hotel: string;
  budget: number;
  description: string;
  imageUrl: string;
  repartition: BudgetItem[];
  jours: Jour[];
  flights: FlightDisplay[];
  tips: string[];
}

type RightPanelView = 'jours' | 'conseils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  trip: Trip | null = null;
  chartGradient = '';
  headerBackground = '';

  canSave = false;
  isSaving = false;
  saveError = '';
  backRoute = '/proposals';

  showFlights = false;
  showBudgetDetails = false;
  rightPanelView: RightPanelView = 'jours';

  private proposalSource: any | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = (nav?.extras.state || history.state) as { trips?: any[] };

    if (state?.trips?.length) {
      this.proposalSource = state.trips[0];
      this.canSave = true;
      this.backRoute = '/proposals';
      this.applyProposal(this.proposalSource);
      return;
    }

    const voyageId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(voyageId) && voyageId > 0) {
      this.tripService.getTripDetailsWithFlights(voyageId).subscribe({
        next: proposal => {
          this.proposalSource = proposal;
          this.canSave = false;
          this.backRoute = '/history';
          this.applyProposal(proposal);
        },
        error: err => {
          console.error('Erreur lors de la recuperation du detail du voyage :', err);
        }
      });
      return;
    }

    console.warn('No trip data received');
  }

  saveTrip(): void {
    if (!this.canSave || !this.proposalSource || this.isSaving) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { message: 'Voulez-vous enregistrer ce voyage dans votre historique ?' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.isSaving = true;
      this.saveError = '';

      this.tripService.saveSelectedTrip(this.proposalSource).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/VoyageAVenir']);
        },
        error: err => {
          console.error('Erreur lors de lenregistrement du voyage :', err);
          this.isSaving = false;
          this.saveError = 'Impossible denregistrer le voyage pour le moment.';
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate([this.backRoute]);
  }

  toggleFlights(): void {
    this.showFlights = !this.showFlights;
  }

  toggleBudgetDetails(): void {
    this.showBudgetDetails = !this.showBudgetDetails;
  }

  showDays(): void {
    this.rightPanelView = 'jours';
  }

  showTips(): void {
    this.rightPanelView = 'conseils';
  }

  updateChartGradient(): void {
    if (!this.trip) {
      return;
    }

    const total = this.trip.repartition.reduce((acc, item) => acc + item.montant, 0);

    if (!total) {
      this.chartGradient = '#ddd';
      return;
    }

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
    if (!this.trip) {
      return;
    }

    this.headerBackground =
      `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), ` +
      `url("${this.trip.imageUrl}") center / cover no-repeat`;
  }

  private applyProposal(proposal: ProposalPayload | any): void {
    this.trip = this.mapProposalToTrip(proposal);
    this.showFlights = false;
    this.showBudgetDetails = false;
    this.rightPanelView = 'jours';
    this.updateChartGradient();
    this.updateHeaderBackground();
  }

  private mapProposalToTrip(proposal: any): Trip {
    const destination = this.getDestinationLabel(proposal?.destination);
    const duration = Number(proposal?.durationDays ?? proposal?.duration ?? proposal?.duree ?? 0);
    const budget = Number(proposal?.budgetTotal ?? proposal?.budget ?? 0);
    const hotel = proposal?.hotel ?? 'ibis budget';
    const expense = proposal?.expense ?? {};
    const itineraries = Array.isArray(proposal?.itineraries) ? proposal.itineraries : [];
    const tips = Array.isArray(proposal?.tips)
      ? proposal.tips.map((tip: any) => String(tip ?? '').trim()).filter(Boolean)
      : [];

    return {
      destination,
      duree: duration,
      hotel,
      budget,
      description: `Sejour de ${duration} jours a ${destination}`,
      imageUrl:
        proposal?.coverImage?.url ||
        proposal?.coverImageUrl ||
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg',
      repartition: [
        {
          label: 'Transports',
          montant: Number(expense.transportAmount ?? 0),
          couleur: '#48bb78',
        },
        {
          label: 'Hotel',
          montant: Number(expense.hotelAmount ?? 0),
          couleur: '#ecc94b',
        },
        {
          label: 'Restaurants',
          montant: Number(expense.restaurantAmount ?? 0),
          couleur: '#63b3ed',
        },
        {
          label: 'Activites',
          montant: Number(expense.activitiesAmount ?? 0),
          couleur: '#f56565',
        },
      ],
      jours: this.mapItinerariesToDays(itineraries),
      flights: this.mapFlightsToDisplay(proposal?.flights),
      tips
    };
  }

  private mapItinerariesToDays(itineraries: any[]): Jour[] {
    const activitiesByDay: Record<number, string[]> = {};

    for (const itinerary of itineraries) {
      const dayNumber = Number(itinerary?.dayNumber ?? itinerary?.day ?? 0);

      if (!dayNumber) {
        continue;
      }

      const rawActivity = String(itinerary?.activity ?? '');
      const activities = rawActivity
        .split('|')
        .map(activity => activity.trim())
        .filter(Boolean);

      activitiesByDay[dayNumber] ??= [];
      activitiesByDay[dayNumber].push(...activities);
    }

    return Object.entries(activitiesByDay)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([day, acts]) => ({
        titre: `Jour ${day}`,
        activites: acts,
      }));
  }

  private mapFlightsToDisplay(flights: ProposalFlights | null | undefined): FlightDisplay[] {
    if (!flights) {
      return [];
    }

    const items: FlightDisplay[] = [];

    if (flights.outbound) {
      items.push(this.mapFlightLeg('Aller', flights.outbound));
    }

    if (flights.return) {
      items.push(this.mapFlightLeg('Retour', flights.return));
    }

    return items;
  }

  private mapFlightLeg(label: string, leg: ProposalFlightLeg): FlightDisplay {
    return {
      label,
      airline: leg.airline,
      flightNumber: leg.flightNumber,
      departureCode: leg.departureAirport?.code ?? '',
      arrivalCode: leg.arrivalAirport?.code ?? '',
      departureDateTime: leg.departureDateTime,
      arrivalDateTime: leg.arrivalDateTime,
      duration: leg.duration,
      travelClass: leg.class,
      stops: Number(leg.stops ?? 0)
    };
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  getStopsLabel(stops: number): string {
    return stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`;
  }

  private getDestinationLabel(destination: any): string {
    if (!destination) {
      return '';
    }

    if (typeof destination === 'string') {
      return destination;
    }

    const city = destination.city ?? '';
    const country = destination.country ?? '';

    return [city, country].filter(Boolean).join(', ');
  }
}

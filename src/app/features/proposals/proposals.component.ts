import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripRequest, TripResponse } from '../../core/models/home';
import { TripStoreService } from '../../core/services/trip-store.service';

@Component({
  selector: 'app-proposals',
  imports: [CommonModule],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent {
  trips: TripResponse[] = [];
  missingStateMessage = '';
  searchCriteria: TripRequest | null = null;

  constructor(private router: Router, private tripStore: TripStoreService) {
    const storedTrips = this.tripStore.getTrips();
    if (storedTrips?.length) {
      this.trips = storedTrips as TripResponse[];
    }

    const state = window.history.state as {
      trips?: TripResponse[];
      criteria?: TripRequest;
    };

    if (state?.trips?.length) {
      this.trips = state.trips;
    }

    if (state?.criteria) {
      this.searchCriteria = state.criteria;
    }

    if (!this.trips.length) {
      this.missingStateMessage =
        'Vos propositions ne sont pas accessibles. Créez un voyage depuis la page d’accueil pour les générer.';
    }
  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }

  goHome() {
    this.router.navigate(['home']);
  }

  selectTrip(trip: TripResponse): void {
    this.router.navigate(['dashboard'], {
      state: {
        trip,
        criteria: this.searchCriteria,
      },
    });
  }
}

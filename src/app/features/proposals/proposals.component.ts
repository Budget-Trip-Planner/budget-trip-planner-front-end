import { Component } from '@angular/core';
import { Router } from '@angular/router';;
import { TripRequest, TripResponse } from '../../core/models/home';
import { CommonModule } from '@angular/common';

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

  constructor(private router : Router) {
    const state = window.history.state as {
      trips?: TripResponse[];
      criteria?: TripRequest;
    };

    if (state?.trips?.length) {
      this.trips = state.trips;
    } else {
      this.missingStateMessage =
        'Vos propositions ne sont pas accessibles : creez d\'abord un voyage depuis la page d\'accueil.';
    }

    if (state?.criteria) {
      this.searchCriteria = state.criteria;
    }
  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }

  selectTrip(trip: TripResponse) {
    this.router.navigate(['dashboard'], {
      state: {
        trip,
        criteria: this.searchCriteria,
      }
    });
  }

  goHome() {
    this.router.navigate(['home']);
  }

}

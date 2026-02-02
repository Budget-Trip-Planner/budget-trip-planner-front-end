import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripStoreService } from '../../core/services/trip-store.service';

@Component({
  selector: 'app-proposals',
  imports: [CommonModule],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent {
  trips: any[] = [];

  constructor(
    private router: Router,
    private tripStore: TripStoreService
  ) {
    const raw = this.tripStore.getTrips();

    this.trips = raw[0]?.proposals ?? raw;

    console.log('Trips normalisés:', this.trips);

  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }

  selectTrip(trip: any) {
    this.router.navigate(['dashboard'], { state: { trips: [trip] } });
  }
}

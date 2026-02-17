import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { TripCardComponent } from '../../shared/components/trip-card/trip-card.component';
import { TripService, Voyage } from '../../core/services/trip/trip.service';

@Component({
  selector: 'app-futur',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './futur.component.html',
  styleUrl: './futur.component.css'
})
export class FuturComponent {

  private tripService = inject(TripService);
  private router = inject(Router);

  // ✅ Stream : uniquement les voyages à venir
  readonly futurTrips$ = this.tripService.getPastTrips().pipe(
    map((trips: Voyage[]) => trips.filter(t => this.isFuturTrip(t.startDate))),
    catchError(err => {
      console.error("Erreur lors du chargement des voyages à venir :", err);
      return of([] as Voyage[]);
    }),
    shareReplay(1)
  );

  openTripDetails(trip: Voyage): void {
    if (!trip?.id) return;
    this.router.navigate(['/dashboard', trip.id]);
  }

  public isFuturTrip(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(dateString);
    tripDate.setHours(0, 0, 0, 0);

    return tripDate >= today;
  }
}

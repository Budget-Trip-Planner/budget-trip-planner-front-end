import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripCardComponent } from '../../shared/components/trip-card/trip-card.component';
import { TripService, Voyage } from '../../core/services/trip/trip.service';
import { map, shareReplay, catchError, of } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  private tripService = inject(TripService);
  private router = inject(Router);

  // ✅ Stream des voyages déjà filtrés "passés"
  readonly pastTrips$ = this.tripService.getPastTrips().pipe(
    map((trips: Voyage[]) => trips.filter(t => this.isPastTrip(t.startDate))),
    catchError(err => {
      console.error("Erreur lors du chargement de l'historique :", err);
      return of([] as Voyage[]);
    }),
    shareReplay(1)
  );

  openTripDetails(trip: Voyage): void {
    if (!trip?.id) return;
    this.router.navigate(['/dashboard', trip.id]);
  }

  // (tu peux garder cette méthode, elle sert au filtre)
  public isPastTrip(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(dateString);
    tripDate.setHours(0, 0, 0, 0);

    return tripDate < today;
  }
}

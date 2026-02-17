import { Component, OnInit } from '@angular/core';
import { TripCardComponent } from '../../shared/components/trip-card/trip-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService, Voyage } from '../../core/services/trip/trip.service';

@Component({
  selector: 'app-futur',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './futur.component.html',
  styleUrl: './futur.component.css'
})
export class FuturComponent implements OnInit{
  futurTrips: Voyage[] = [];


  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tripService.getFuturTrips().subscribe({
      next: trips => {
        this.futurTrips = trips;
      },
      error: err => {
        console.error('Erreur lors du chargement des futurs voyage:', err);
        this.futurTrips = [];
      }
    });

  }

  openTripDetails(trip: Voyage): void {
    if (!trip?.id) {
      return;
    }

    this.router.navigate(['/dashboard', trip.id]);
  }
  public isFuturTrip(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripDate = new Date(dateString);
    tripDate.setHours(0, 0, 0, 0);

    return tripDate > today;
  }

}

import { Component, OnInit } from '@angular/core';
import { TripCardComponent } from '../../shared/components/trip-card/trip-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService, Voyage } from '../../core/services/trip/trip.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  pastTrips: Voyage[] = [];

  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tripService.getPastTrips().subscribe({
      next: trips => {
        this.pastTrips = trips;
      },
      error: err => {
        console.error('Erreur lors du chargement de lhistorique :', err);
        this.pastTrips = [];
      }
    });
  }

  openTripDetails(trip: Voyage): void {
    if (!trip?.id) {
      return;
    }

    this.router.navigate(['/dashboard', trip.id]);
  }
}
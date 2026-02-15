import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Voyage } from '../../../core/services/trip/trip.service';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip: Voyage = {
    id: 0,
    objectType: 'users',
    objectId: 0,
    destination: '',
    budgetTotal: 0,
    durationDays: 0,
    startDate: '',
    coverImage: null
  };
  @Output() tripClick = new EventEmitter<Voyage>();

  onTripClick(): void {
    this.tripClick.emit(this.trip);
  }

  get destinationLabel(): string {
    if (!this.trip?.destination) {
      return '';
    }

    if (typeof this.trip.destination === 'string') {
      return this.trip.destination;
    }

    return this.trip.destination.city;
  }

  get coverImageUrl(): string {
    return this.trip?.coverImage?.url || 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80';
  }
}


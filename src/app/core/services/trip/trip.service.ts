import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CoverImage {
  id: number;
  url: string;
}

export interface Voyage {
  objectId: number;
  objectType: string;
  destination: string;
  budgetTotal: number;
  durationDays: number;
  startDate: string;
  coverImage: CoverImage;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private mockPastTrips: Voyage[] = [
    {
      objectId: 1,
      objectType: 'voyages',
      destination: 'Rome',
      budgetTotal: 950,
      durationDays: 5,
      startDate: '2025-04-10',
      coverImage: {
        id: 1,
        url: 'mock-images/rome.png'
      }
    },
    {
      objectId: 2,
      objectType: 'voyages',
      destination: 'Paris',
      budgetTotal: 950,
      durationDays: 5,
      startDate: '2025-04-10',
      coverImage: {
        id: 2,
        url: 'mock-images/paris.jpg'
      }
    }
  ];

  constructor() { }

  getPastTrips(): Observable<Voyage[]> {
    return of(this.mockPastTrips);
  }
}

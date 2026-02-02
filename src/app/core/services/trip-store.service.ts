import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripStoreService {
  private trips: any[] = [];

  setTrips(trips: any[]) {
    this.trips = trips;
  }

  getTrips(): any[] {
    return this.trips;
  }

  hasTrips(): boolean {
    return this.trips.length > 0;
  }
}

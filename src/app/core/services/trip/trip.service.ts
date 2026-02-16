import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/auth-service';

export interface Location {
  id?: number;
  city: string;
  country: string;
}

export interface CoverImage {
  id?: number;
  url: string;
}

export interface Expense {
  id?: number;
  transportAmount: number;
  hotelAmount: number;
  restaurantAmount: number;
  activitiesAmount: number;
  currency?: string;
}

export interface Itinerary {
  id?: number;
  dayNumber: number;
  activity: string;
}

export interface ProposalPayload {
  id?: number;
  objectType?: string;
  objectId?: number;
  departure?: Location | null;
  destination: Location;
  budgetTotal: number;
  durationDays: number;
  startDate?: string | null;
  coverImage?: CoverImage | null;
  expense?: Expense | null;
  itineraries?: Itinerary[];
}

export interface Voyage {
  id: number;
  objectType: string;
  objectId: number;
  departure?: Location | null;
  destination: Location | string;
  budgetTotal: number;
  durationDays: number;
  startDate: string;
  createdAt?: string;
  coverImage?: CoverImage | null;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getPastTrips(): Observable<Voyage[]> {
    const userId = this.authService.userId;

    if (!userId) {
      return of([]);
    }

    return this.http.get<Voyage[]>(`${environment.apiUrl}/users/${userId}/proposals`);
  }

  getTripDetails(voyageId: number): Observable<ProposalPayload> {
    return this.http.get<ProposalPayload>(`${environment.apiUrl}/voyages/${voyageId}`);
  }

  saveSelectedTrip(selectedProposal: any): Observable<Voyage> {
    const payload = this.buildSavePayload(selectedProposal);
    console.log('json:', payload)
    return this.http.post<Voyage>(`${environment.apiUrl}/proposals`, payload);
  }

  buildSavePayload(selectedProposal: any): ProposalPayload {
    const objectId = this.authService.userId ?? selectedProposal?.objectId;
    const coverImage = this.normalizeCoverImage(selectedProposal);

    return {
      objectType: 'users',
      objectId: objectId ?? undefined,
      departure: this.normalizeLocation(selectedProposal?.departure),
      destination: this.normalizeLocation(selectedProposal?.destination),
      budgetTotal: Number(selectedProposal?.budgetTotal ?? selectedProposal?.budget ?? 0),
      durationDays: Number(selectedProposal?.durationDays ?? selectedProposal?.duration ?? selectedProposal?.duree ?? 0),
      startDate: selectedProposal?.startDate ?? null,
      coverImage,
      expense: this.normalizeExpense(selectedProposal?.expense),
      itineraries: this.normalizeItineraries(selectedProposal?.itineraries)
    };
  }

  private normalizeLocation(location: any): Location {
    if (location && typeof location === 'object') {
      return {
        id: location.id,
        city: location.city ?? '',
        country: location.country ?? ''
      };
    }

    return {
      city: typeof location === 'string' ? location : '',
      country: ''
    };
  }

  private normalizeCoverImage(selectedProposal: any): CoverImage | null {
    const image = selectedProposal?.coverImage;

    if (image && typeof image === 'object' && typeof image.url === 'string') {
      return {
        id: image.id,
        url: image.url
      };
    }

    if (typeof selectedProposal?.coverImageUrl === 'string' && selectedProposal.coverImageUrl.trim()) {
      return { url: selectedProposal.coverImageUrl };
    }

    return null;
  }

  private normalizeExpense(expense: any): Expense | null {
    if (!expense || typeof expense !== 'object') {
      return null;
    }

    return {
      transportAmount: Number(expense.transportAmount ?? 0),
      hotelAmount: Number(expense.hotelAmount ?? 0),
      restaurantAmount: Number(expense.restaurantAmount ?? 0),
      activitiesAmount: Number(expense.activitiesAmount ?? 0),
      currency: expense.currency ?? 'EUR'
    };
  }

  private normalizeItineraries(itineraries: any): Itinerary[] {
    if (!Array.isArray(itineraries)) {
      return [];
    }

    return itineraries
      .filter((itinerary: any) => itinerary && itinerary.dayNumber !== undefined)
      .map((itinerary: any) => ({
        dayNumber: Number(itinerary.dayNumber),
        activity: String(itinerary.activity ?? '')
      }));
  }
}


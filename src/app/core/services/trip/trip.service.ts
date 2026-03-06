import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, map } from 'rxjs';
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

export interface FlightAirport {
  code: string;
  name: string;
}

export interface ProposalFlightLeg {
  airline: string;
  flightNumber: string;
  departureAirport: FlightAirport;
  arrivalAirport: FlightAirport;
  departureDateTime: string;
  arrivalDateTime: string;
  duration: string;
  class: string;
  stops: number;
}

export interface ProposalFlights {
  outbound?: ProposalFlightLeg | null;
  return?: ProposalFlightLeg | null;
  totalPrice?: number;
  currency?: string;
  passengers?: number;
  bookingClass?: string;
}

export interface FlightDTO {
  id?: number;
  direction: 'outbound' | 'return';
  airline: string;
  flightNumber: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  departureDateTime: string;
  arrivalDateTime: string;
  duration: string;
  class: string;
  stops: number;
  totalPrice?: number;
  currency?: string;
  passengers?: number;
  bookingClass?: string;
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
  hotel: string;
  itineraries?: Itinerary[];
  flights?: ProposalFlights | null;
  tips?: string[];
}

export interface Voyage {
  id: number;
  objectType: string;
  objectId: number;
  departure?: Location | null;
  destination: Location | string;
  hotel: string;
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

  getFuturTrips(): Observable<Voyage[]> {
    const userId = this.authService.userId;

    if (!userId) {
      return of([]);
    }

    return this.http.get<Voyage[]>(`${environment.apiUrl}/users/${userId}/proposals`);
  }

  getTripDetails(voyageId: number): Observable<ProposalPayload> {
    return this.http.get<ProposalPayload>(`${environment.apiUrl}/voyages/${voyageId}`);
  }

  getVoyageFlights(voyageId: number): Observable<FlightDTO[]> {
    return this.http.get<FlightDTO[]>(`${environment.apiUrl}/voyages/${voyageId}/flights`);
  }

  getTripDetailsWithFlights(voyageId: number): Observable<ProposalPayload> {
    return forkJoin({
      proposal: this.getTripDetails(voyageId),
      flights: this.getVoyageFlights(voyageId)
    }).pipe(
      map(({ proposal, flights }) => ({
        ...proposal,
        flights: this.mapFlightArrayToProposalFlights(flights)
      }))
    );
  }

  saveSelectedTrip(selectedProposal: any): Observable<Voyage> {
    const payload = this.buildSavePayload(selectedProposal);
    console.log('json:', payload);
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
      hotel: selectedProposal?.hotel ?? '',
      itineraries: this.normalizeItineraries(selectedProposal?.itineraries),
      flights: this.normalizeFlights(selectedProposal?.flights),
      tips: this.normalizeTips(selectedProposal?.tips)
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

  private normalizeFlights(flights: any): ProposalFlights | null {
    if (!flights || typeof flights !== 'object') {
      return null;
    }

    const outbound = this.normalizeFlightLeg(flights.outbound);
    const returnFlight = this.normalizeFlightLeg(flights.return);

    if (!outbound && !returnFlight) {
      return null;
    }

    return {
      outbound,
      return: returnFlight,
      totalPrice: Number(flights.totalPrice ?? flights.price ?? 0),
      currency: String(flights.currency ?? 'EUR'),
      passengers: Number(flights.passengers ?? 1),
      bookingClass: String(flights.bookingClass ?? flights.class ?? 'economy')
    };
  }

  private normalizeFlightLeg(leg: any): ProposalFlightLeg | null {
    if (!leg || typeof leg !== 'object') {
      return null;
    }

    return {
      airline: String(leg.airline ?? ''),
      flightNumber: String(leg.flightNumber ?? ''),
      departureAirport: {
        code: String(leg.departureAirport?.code ?? leg.departureAirportCode ?? ''),
        name: String(leg.departureAirport?.name ?? leg.departureAirportName ?? '')
      },
      arrivalAirport: {
        code: String(leg.arrivalAirport?.code ?? leg.arrivalAirportCode ?? ''),
        name: String(leg.arrivalAirport?.name ?? leg.arrivalAirportName ?? '')
      },
      departureDateTime: String(leg.departureDateTime ?? ''),
      arrivalDateTime: String(leg.arrivalDateTime ?? ''),
      duration: String(leg.duration ?? ''),
      class: String(leg.class ?? leg.bookingClass ?? 'economy'),
      stops: Number(leg.stops ?? 0)
    };
  }

  private normalizeTips(tips: any): string[] {
    if (!Array.isArray(tips)) {
      return [];
    }

    return tips
      .map(tip => String(tip ?? '').trim())
      .filter(Boolean);
  }

  private mapFlightArrayToProposalFlights(flights: FlightDTO[]): ProposalFlights | null {
    if (!Array.isArray(flights) || flights.length === 0) {
      return null;
    }

    const outbound = flights.find(flight => flight.direction === 'outbound');
    const returnFlight = flights.find(flight => flight.direction === 'return');

    return {
      outbound: outbound ? this.mapFlightDtoToLeg(outbound) : null,
      return: returnFlight ? this.mapFlightDtoToLeg(returnFlight) : null,
      totalPrice: flights.reduce((sum, flight) => sum + Number(flight.totalPrice ?? 0), 0),
      currency: flights.find(flight => flight.currency)?.currency ?? 'EUR',
      passengers: flights.find(flight => flight.passengers)?.passengers ?? 1,
      bookingClass: flights.find(flight => flight.bookingClass)?.bookingClass
        ?? flights.find(flight => flight.class)?.class
        ?? 'economy'
    };
  }

  private mapFlightDtoToLeg(flight: FlightDTO): ProposalFlightLeg {
    return {
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirport: {
        code: flight.departureAirportCode,
        name: flight.departureAirportName
      },
      arrivalAirport: {
        code: flight.arrivalAirportCode,
        name: flight.arrivalAirportName
      },
      departureDateTime: flight.departureDateTime,
      arrivalDateTime: flight.arrivalDateTime,
      duration: flight.duration,
      class: flight.class,
      stops: Number(flight.stops ?? 0)
    };
  }
}

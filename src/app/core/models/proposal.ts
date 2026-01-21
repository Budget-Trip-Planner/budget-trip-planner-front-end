export interface LocationPayload {
  id?: number;
  city: string;
  country: string;
}

export interface ExpensePayload {
  transportAmount: number;
  hotelAmount: number;
  restaurantAmount: number;
  activitiesAmount: number;
  currency: string;
}

export interface ItineraryPayload {
  dayNumber: number;
  activity: string;
}

export interface ProposalPayload {
  objectType?: string;
  objectId?: number;
  departure?: LocationPayload;
  destination: LocationPayload;
  budgetTotal: number;
  durationDays: number;
  startDate?: string;
  coverImage?: {
    id?: number;
    url: string;
    objectType?: string;
    objectId?: number;
  };
  expense?: ExpensePayload;
  itineraries?: ItineraryPayload[];
}

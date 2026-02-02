export interface Proposal {
  objectType: 'proposal';
  destination: { city: string; country: string };
  departure: { city: string; country: string };
  budgetTotal: number;
  durationDays: number;
  startDate: string;
  expense: {
    transportAmount: number;
    hotelAmount: number;
    restaurantAmount: number;
    activitiesAmount: number;
    currency: 'EUR';
  };
  itineraries: { dayNumber: number; activity: string }[];
  coverImageUrl?: string;
}

let proposals: Proposal[] = [
  {
    objectType: 'proposal',
    destination: { city: 'Rome', country: 'Italy' },
    departure: { city: 'Paris', country: 'France' },
    budgetTotal: 850,
    durationDays: 5,
    startDate: '2025-04-15',
    expense: {
      transportAmount: 220,
      hotelAmount: 290,
      restaurantAmount: 160,
      activitiesAmount: 180,
      currency: 'EUR'
    },
    itineraries: [
      { dayNumber: 1, activity: 'Arrivée & installation' },
      { dayNumber: 2, activity: 'Colisée & Forum' },
      { dayNumber: 3, activity: 'Vatican & Chapelle Sixtine' },
      { dayNumber: 4, activity: 'Panthéon & Fontaine de Trevi' },
      { dayNumber: 5, activity: 'Souvenirs & départ' }
    ]
  }
];

export function setProposalsFromApi(apiResponse: any) {
  if (Array.isArray(apiResponse) && apiResponse[0]?.proposals) {
    proposals = apiResponse[0].proposals;
  } else if (Array.isArray(apiResponse)) {
    proposals = apiResponse;
  } else {
    proposals = [apiResponse];
  }

  localStorage.setItem('proposals', JSON.stringify(proposals));

  console.log('MOCK UPDATED FROM API:', proposals);
}

export function getProposals(): Proposal[] {
  const saved = localStorage.getItem('proposals');
  if (saved) {
    return JSON.parse(saved);
  }
  return proposals;
}

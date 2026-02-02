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

export const PROPOSALS_MOCK: Proposal[] = [
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
    ],
    coverImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Collage_Rome.jpg/1280px-Collage_Rome.jpg'
  },

  {
    objectType: 'proposal',
    destination: { city: 'Prague', country: 'Czech Republic' },
    departure: { city: 'Paris', country: 'France' },
    budgetTotal: 700,
    durationDays: 4,
    startDate: '2025-09-18',
    expense: {
      transportAmount: 200,
      hotelAmount: 220,
      restaurantAmount: 120,
      activitiesAmount: 160,
      currency: 'EUR'
    },
    itineraries: [
      { dayNumber: 1, activity: 'Vieille ville (soirée)' },
      { dayNumber: 2, activity: 'Château de Prague' },
      { dayNumber: 3, activity: 'Pont Charles & croisière' },
      { dayNumber: 4, activity: 'Café & départ' }
    ],
    coverImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Prague_collage_2019.png/1200px-Prague_collage_2019.png'
  },

  {
    objectType: 'proposal',
    destination: { city: 'Athens', country: 'Greece' },
    departure: { city: 'Paris', country: 'France' },
    budgetTotal: 990,
    durationDays: 7,
    startDate: '2025-07-08',
    expense: {
      transportAmount: 260,
      hotelAmount: 420,
      restaurantAmount: 180,
      activitiesAmount: 130,
      currency: 'EUR'
    },
    itineraries: [
      { dayNumber: 1, activity: 'Plaka & centre' },
      { dayNumber: 2, activity: 'Acropole & musée' },
      { dayNumber: 3, activity: 'Agora & Monastiraki' },
      { dayNumber: 4, activity: 'Cap Sounion' },
      { dayNumber: 5, activity: 'Street food & shopping' },
      { dayNumber: 6, activity: 'Journée libre' },
      { dayNumber: 7, activity: 'Départ' }
    ],
    coverImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Athens_montage_L.png/1200px-Athens_montage_L.png'
  }
];

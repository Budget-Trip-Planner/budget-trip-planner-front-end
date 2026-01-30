export const PROPOSAL_MOCK = {
  objectType: 'proposal',
  destination: {
    city: 'Rome',
    country: 'Italy'
  },
  departure: {
    city: 'Paris',
    country: 'France'
  },
  budgetTotal: 850,
  durationDays: 5,
  startDate: '2025-04-15', 
  expense: {
    transportAmount: 212.5,
    hotelAmount: 255,
    restaurantAmount: 170,
    activitiesAmount: 212.5,
    currency: 'EUR'
  },
  itineraries: [
    { dayNumber: 1, activity: 'Arrivee et installation a Rome' },
    { dayNumber: 1, activity: 'Experience Culture' },
    { dayNumber: 1, activity: 'Soiree gastronomique' },
    { dayNumber: 2, activity: 'Decouverte du quartier' },
    { dayNumber: 2, activity: 'Experience Gastronomie' },
    { dayNumber: 2, activity: 'Soiree gastronomique' },
    { dayNumber: 3, activity: 'Visite du Colisee' },
    { dayNumber: 3, activity: 'Forum Romain' },
    { dayNumber: 4, activity: 'Vatican et Chapelle Sixtine' },
    { dayNumber: 4, activity: 'Place Saint-Pierre' },
    { dayNumber: 5, activity: 'Shopping et souvenirs' },
    { dayNumber: 5, activity: 'Depart' }
  ]
};

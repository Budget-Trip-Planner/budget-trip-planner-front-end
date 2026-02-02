export const PROPOSALS_MOCK = [
  {
    objectType: 'proposal',
    destination: { city: 'Rome', country: 'Italy' },
    budgetTotal: 850,
    durationDays: 5,
    startDate: '2025-04-15',
    expense: {
      transportAmount: 212.5,
      hotelAmount: 255,
      restaurantAmount: 170,
      activitiesAmount: 212.5,
      currency: 'EUR',
    },
    itineraries: [
      { dayNumber: 1, activity: 'Arrivée et installation à Rome' },
      { dayNumber: 1, activity: 'Balade dans le centre historique' },
      { dayNumber: 1, activity: 'Soirée gastronomique' },

      { dayNumber: 2, activity: 'Découverte du quartier Trastevere' },
      { dayNumber: 2, activity: 'Expérience gastronomie italienne' },
      { dayNumber: 2, activity: 'Fontaine de Trevi de nuit' },

      { dayNumber: 3, activity: 'Visite du Colisée' },
      { dayNumber: 3, activity: 'Forum Romain' },
      { dayNumber: 3, activity: 'Glace artisanale' },

      { dayNumber: 4, activity: 'Vatican et Chapelle Sixtine' },
      { dayNumber: 4, activity: 'Place Saint-Pierre' },
      { dayNumber: 4, activity: 'Shopping souvenirs' },

      { dayNumber: 5, activity: 'Marché local' },
      { dayNumber: 5, activity: 'Départ' },
    ],
  },

  {
    objectType: 'proposal',
    destination: { city: 'Barcelona', country: 'Spain' },
    budgetTotal: 780,
    durationDays: 4,
    startDate: '2025-05-10',
    expense: {
      transportAmount: 180,
      hotelAmount: 240,
      restaurantAmount: 160,
      activitiesAmount: 200,
      currency: 'EUR',
    },
    itineraries: [
      { dayNumber: 1, activity: 'Arrivée à Barcelone' },
      { dayNumber: 1, activity: 'Plage Barceloneta' },
      { dayNumber: 1, activity: 'Tapas le soir' },

      { dayNumber: 2, activity: 'Sagrada Familia' },
      { dayNumber: 2, activity: 'Parc Güell' },
      { dayNumber: 2, activity: 'Quartier gothique' },

      { dayNumber: 3, activity: 'Marché de la Boqueria' },
      { dayNumber: 3, activity: 'Montjuïc' },
      { dayNumber: 3, activity: 'Soirée rooftop' },

      { dayNumber: 4, activity: 'Shopping' },
      { dayNumber: 4, activity: 'Départ' },
    ],
  },

  {
    objectType: 'proposal',
    destination: { city: 'Lisbon', country: 'Portugal' },
    budgetTotal: 720,
    durationDays: 5,
    startDate: '2025-06-01',
    expense: {
      transportAmount: 200,
      hotelAmount: 220,
      restaurantAmount: 140,
      activitiesAmount: 160,
      currency: 'EUR',
    },
    itineraries: [
      { dayNumber: 1, activity: 'Arrivée à Lisbonne' },
      { dayNumber: 1, activity: 'Quartier Alfama' },
      { dayNumber: 1, activity: 'Dîner Fado' },

      { dayNumber: 2, activity: 'Tour de Belém' },
      { dayNumber: 2, activity: 'Pastéis de nata' },
      { dayNumber: 2, activity: 'Balade en tramway' },

      { dayNumber: 3, activity: 'LX Factory' },
      { dayNumber: 3, activity: 'Mirador Santa Catarina' },

      { dayNumber: 4, activity: 'Sintra (excursion)' },
      { dayNumber: 4, activity: 'Palais colorés' },

      { dayNumber: 5, activity: 'Derniers souvenirs' },
      { dayNumber: 5, activity: 'Départ' },
    ],
  },
];

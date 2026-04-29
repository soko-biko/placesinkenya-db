
import React from 'react';
import { Place, PlaceCategory, TourOperator, OperatorType, Event } from './types';

export const COLORS = {
  NAVY: '#0F172A',
  SAFARI: '#EA580C',
  GREEN: '#15803d',
  YELLOW: '#fbbf24',
  BEIGE: '#FCF6E5',
};

// Using the attached image logo
export const LOGO = (
  <img 
    src="/logo.png" 
    alt="PlacesInKenya" 
    className="w-10 h-10 object-contain"
    referrerPolicy="no-referrer"
  />
);

export const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'Maasai Mara Safari',
    category: PlaceCategory.SAFARI,
    description: 'Experience the Great Migration and Big Five in Kenya\'s premier game reserve',
    price: 35000,
    location: 'Narok County',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
    rating: 4.8,
    isTrending: true,
    tags: ['Safari', 'Wildlife', 'Big Five']
  },
  {
    id: '2',
    name: 'Diani Beach Resort',
    category: PlaceCategory.HANGOUT_SPOTS,
    description: 'Pristine white sand beaches with crystal clear waters. Ideal for relaxation and quiet reflection.',
    price: 8500,
    location: 'Kwale County',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    rating: 4.6,
    isTrending: true,
    tags: ['Beach', 'Water Sports', 'Relaxation']
  },
  {
    id: 'r1',
    name: 'Carnivore Restaurant',
    category: PlaceCategory.RESTAURANTS,
    description: 'A beast of a feast. Experience the ultimate nyama choma (roasted meat) experience in Nairobi.',
    price: 3500,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    rating: 4.7,
    isTrending: true,
    tags: ['Iconic Eats', 'Nyama Choma', 'Rooftop']
  },
  {
    id: 'r2',
    name: 'Mama Oliech Fish',
    category: PlaceCategory.RESTAURANTS,
    description: 'The legendary spot for authentic deep-fried Lake Victoria tilapia and ugali.',
    price: 800,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    rating: 4.5,
    isTrending: false,
    tags: ['Local Favourite', 'Fish', 'Authentic']
  },
  {
    id: 'ent1',
    name: 'The Alchemist Bar',
    category: PlaceCategory.ENTERTAINMENT,
    description: 'Creative hub with multiple bars, street food, and the best live music/DJs in Westlands.',
    price: 0,
    location: 'Westlands, Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2',
    rating: 4.6,
    isTrending: true,
    tags: ['Nightlife', 'Live Music', 'Arts']
  },
  {
    id: 'h1',
    name: 'Village Market Rooftop',
    category: PlaceCategory.HANGOUT_SPOTS,
    description: 'Sophisticated open-air space perfect for sunset drinks and meeting friends.',
    price: 0,
    location: 'Gigiri, Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    rating: 4.4,
    isTrending: false,
    tags: ['Hangout Spot', 'Rooftop', 'Social']
  },
  {
    id: 'o1',
    name: 'Ngong Hills Hiking Trail',
    category: PlaceCategory.OUTDOORS,
    description: 'Stunning ridge hike offering panoramic views of the Rift Valley and Nairobi skyline.',
    price: 200,
    location: 'Kajiado',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    rating: 4.5,
    isTrending: true,
    tags: ['Hiking', 'Outdoors', 'Views']
  },
  {
    id: 'a1',
    name: 'Savage Wilderness Rafting',
    category: PlaceCategory.ADVENTURES,
    description: 'World-class white water rafting on the Tana River. Adrenaline guaranteed.',
    price: 6500,
    location: 'Sagana',
    imageUrl: 'https://images.unsplash.com/photo-1530866495547-084978a5df97',
    rating: 4.9,
    isTrending: true,
    tags: ['Adventure', 'Rafting', 'Extreme']
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Weekend Rock Climbing',
    providerId: 'o1',
    providerName: 'Safari Kings Ltd',
    date: new Date().toISOString(),
    description: 'Join us for an intense rock climbing session in the Rift Valley.',
    price: 5000,
    location: 'Rift Valley',
    imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
    registrations: 45,
    category: PlaceCategory.ADVENTURES,
    totalCapacity: 60,
    bookedCapacity: 45
  },
  {
    id: 'e2',
    title: 'Nairobi Restaurant Week',
    providerId: 'o2',
    providerName: 'Foodie Tours',
    date: new Date(Date.now() + 86400000).toISOString(),
    description: 'A week long celebration of Nairobi\'s diverse culinary scene with special menus.',
    price: 2000,
    location: 'Various Restaurants, Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1550966842-28a1ea23685e',
    registrations: 120,
    category: PlaceCategory.RESTAURANTS,
    totalCapacity: 500,
    bookedCapacity: 120
  }
];

export const MOCK_OPERATORS: TourOperator[] = [
  {
    id: 'o1',
    name: 'Safari Kings Ltd',
    type: OperatorType.COMPANY,
    bio: 'Premier tour company with 15+ years experience in luxury safaris across Kenya',
    basePrice: 25000,
    rating: 4.7,
    specialties: ['Luxury', 'Photography', 'Private']
  },
  {
    id: 'o2',
    name: 'Coastal Adventures',
    type: OperatorType.COMPANY,
    bio: 'Specializing in beach excursions, water sports, and coastal cultural tours',
    basePrice: 8000,
    rating: 4.5,
    specialties: ['Snorkeling', 'Diving', 'Culture']
  },
  {
    id: 'o3',
    name: 'John Kamau',
    type: OperatorType.INDIVIDUAL,
    bio: 'Licensed tour guide and driver. Expert in Nairobi and Rift Valley destinations',
    basePrice: 5000,
    rating: 4.8,
    specialties: ['Day Trip', 'Local', 'Flexible']
  }
];

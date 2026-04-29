
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
    category: PlaceCategory.HANGOUT_SPOT,
    description: 'Pristine white sand beaches with crystal clear waters. Ideal for relaxation and quiet reflection.',
    price: 8500,
    location: 'Kwale County',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    rating: 4.6,
    isTrending: true,
    tags: ['Beach', 'Water Sports', 'Relaxation']
  },
  {
    id: '3',
    name: 'Karura Forest Walk',
    category: PlaceCategory.OUTDOOR_ADVENTURE,
    description: 'Urban forest sanctuary with waterfalls and nature trails. Perfect for hiking and nature walks.',
    price: 1500,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    rating: 4.4,
    isTrending: false,
    tags: ['Walking', 'Nature', 'Nairobi']
  },
  {
    id: '4',
    name: 'Hell\'s Gate Adventures',
    category: PlaceCategory.OUTDOOR_ADVENTURE,
    description: 'Cycle and hike through dramatic cliffs and geothermal features. Experience rock climbing and cycling.',
    price: 4500,
    location: 'Nakuru County',
    imageUrl: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e',
    rating: 4.7,
    isTrending: true,
    tags: ['Cycling', 'Hiking', 'Adventure']
  },
  {
    id: '5',
    name: 'Giraffe Centre',
    category: PlaceCategory.OUTDOOR_ADVENTURE,
    description: 'Get up close with endangered Rothschild giraffes in a natural setting.',
    price: 2000,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50',
    rating: 4.5,
    isTrending: false,
    tags: ['Giraffes', 'Wildlife', 'Education']
  },
  {
    id: '6',
    name: 'Lamu Old Town',
    category: PlaceCategory.HANGOUT_SPOT,
    description: 'UNESCO World Heritage Swahili settlement with rich history and relaxing alleys.',
    price: 12000,
    location: 'Lamu County',
    imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
    rating: 4.3,
    isTrending: false,
    tags: ['History', 'Culture', 'Swahili']
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
    category: PlaceCategory.OUTDOOR_ADVENTURE,
    totalCapacity: 60,
    bookedCapacity: 45
  },
  {
    id: 'e2',
    title: 'Sunset Beach Party',
    providerId: 'o2',
    providerName: 'Coastal Adventures',
    date: new Date(Date.now() + 86400000).toISOString(),
    description: 'A relaxing sunset party at Diani Beach with local DJs.',
    price: 2000,
    location: 'Diani Beach',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    registrations: 120,
    category: PlaceCategory.RESTAURANT_CLUB,
    totalCapacity: 200,
    bookedCapacity: 120
  },
  {
    id: 'e3',
    title: 'Ngong Hills Hiking',
    providerId: 'o3',
    providerName: 'John Kamau',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: 'Breathtaking hike across the Ngong Hills with a certified guide.',
    price: 1500,
    location: 'Ngong Hills',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    registrations: 30,
    category: PlaceCategory.OUTDOOR_ADVENTURE,
    totalCapacity: 50,
    bookedCapacity: 30
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

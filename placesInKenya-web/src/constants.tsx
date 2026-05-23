
import React from 'react';
import { Place, PlaceCategory, TourOperator, OperatorType, Event } from './types';

export const COLORS = {
  NAVY: '#0D1B2A',
  SAFARI: '#E8621A',
  CREAM: '#F5EFE6',
  OFF_WHITE: '#FAFAF8',
  DARK: '#1A1A1A',
};

// Using the attached image logo
export const LOGO = (
  <img 
    src="https://lh3.googleusercontent.com/d/1G9iYeJQ4q67zu7dBwjXm9BTz_boLAzco" 
    alt="PlacesInKenya" 
    className="h-14 w-14 object-contain -ml-3.5 -mr-4 shrink-0"
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
    isVerified: true,
    tags: ['Safari', 'Wildlife', 'Big Five'],
    ownerId: 'admin',
    bookingLink: 'https://wa.me/254700000000'
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
    tags: ['Beach', 'Water Sports', 'Relaxation'],
    ownerId: 'admin',
    bookingLink: 'https://wa.me/254700111222'
  },
  {
    id: 'r1',
    name: 'Carnivore Restaurant',
    category: PlaceCategory.RESTAURANT,
    description: 'A beast of a feast. Experience the ultimate nyama choma (roasted meat) experience in Nairobi.',
    price: 3500,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    rating: 4.7,
    isTrending: true,
    isVerified: true,
    tags: ['Iconic Eats', 'Nyama Choma', 'Rooftop'],
    ownerId: 'admin',
    bookingLink: 'https://www.carnivore.co.ke/reservations'
  },
  {
    id: 'r2',
    name: 'Mama Oliech Fish',
    category: PlaceCategory.RESTAURANT,
    description: 'The legendary spot for authentic deep-fried Lake Victoria tilapia and ugali.',
    price: 800,
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    rating: 4.5,
    isTrending: false,
    tags: ['Local Favourite', 'Fish', 'Authentic'],
    ownerId: 'admin',
    bookingLink: 'https://wa.me/254700333444'
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
    tags: ['Nightlife', 'Live Music', 'Arts'],
    ownerId: 'admin',
    bookingLink: 'https://alchemist.co.ke/events'
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
    tags: ['Hangout Spot', 'Rooftop', 'Social'],
    ownerId: 'admin',
    bookingLink: 'https://villagemarket-kenya.com/rooftop'
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
    isVerified: true,
    tags: ['Hiking', 'Outdoors', 'Views'],
    ownerId: 'admin',
    bookingLink: 'https://www.kws.go.ke/content/ngong-hills-forest-reserve'
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
    isVerified: true,
    tags: ['Adventure', 'Rafting', 'Extreme'],
    ownerId: 'admin',
    bookingLink: 'https://savagewilderness.org/rafting'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Weekend Rock Climbing',
    providerId: 'o1',
    providerName: 'Safari Kings Ltd',
    date: new Date().toISOString(),
    description: 'Join us for an intense rock climbing session in the Rift Valley. Perfect for both beginners and intermediate climbers.',
    price: 5000,
    location: 'Hell\'s Gate, Naivasha',
    imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
    registrations: 45,
    category: 'ADVENTURES',
    totalCapacity: 60,
    bookedCapacity: 45,
    organizer: {
      logo: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ef4',
      bio: 'Safari Kings is dedicated to bringing you the best outdoor adventures in Kenya.',
      rating: 4.8
    },
    gallery: [
      'https://images.unsplash.com/photo-1531256456073-f14df716611d',
      'https://images.unsplash.com/photo-1530103043960-ef38714df716'
    ],
    mapsLink: 'https://maps.app.goo.gl/Naivasha123',
    interestedCount: 245,
    bookingLink: 'https://wa.me/254711122233'
  },
  {
    id: 'e2',
    title: 'Nairobi Wine Festival',
    providerId: 'o2',
    providerName: 'The Social House',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: 'An evening of blind tastings, gourmet pairings, and live jazz under the stars at Nairobi\'s premier boutique hotel.',
    price: 4500,
    location: 'Lavington, Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
    registrations: 120,
    category: 'FOOD_DRINK',
    totalCapacity: 500,
    bookedCapacity: 485,
    organizer: {
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      bio: 'Curating the most sophisticated social experiences in the city.',
      rating: 4.9
    },
    gallery: [
      'https://images.unsplash.com/photo-1528495127394-d2089f67a36c',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20'
    ],
    mapsLink: 'https://maps.app.goo.gl/Nairobi123',
    interestedCount: 1205,
    bookingLink: 'https://wa.me/254722333444'
  }
];

export const MOCK_OPERATORS: TourOperator[] = [
  {
    id: 'o1',
    name: 'Safari Kings Ltd',
    type: OperatorType.COMPANY,
    bio: 'Premier tour company with 15+ years experience in luxury safaris across East Africa.',
    basePrice: 25000,
    rating: 4.8,
    reviewsCount: 1240,
    specialties: ['Luxury Safari', 'Big Five Photography', 'Honeymoon Packages'],
    location: 'Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09',
    isVerified: true,
    bookingLink: 'https://www.safarikings.com/book'
  },
  {
    id: 'o2',
    name: 'Coastal Adventures',
    type: OperatorType.COMPANY,
    bio: 'Specializing in beach excursions, deep-sea diving, and Diani cultural boat tours.',
    basePrice: 8500,
    rating: 4.6,
    reviewsCount: 850,
    specialties: ['Diving', 'Deep Sea Fishing', 'Wasini Island Tours'],
    location: 'Mombasa',
    imageUrl: 'https://images.unsplash.com/photo-1544621150-d4fdac46386b',
    isVerified: true,
    bookingLink: 'https://wa.me/254711222333'
  },
  {
    id: 'g1',
    name: 'Samuel Maina',
    type: OperatorType.INDIVIDUAL,
    title: 'Certified Bronze Guide (KPSGA)',
    bio: 'Born and raised in Narok, I have 10 years experience tracking lions and leopards in the Mara.',
    basePrice: 12000,
    rating: 4.9,
    reviewsCount: 320,
    tripsCompleted: 450,
    specialties: ['Wildlife Tracking', 'Bird Watching', 'Maasai Culture'],
    location: 'Maasai Mara',
    languages: ['English', 'Swahili', 'Maasai'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    isVerified: true,
    bookingLink: 'mailto:samuel@maraguides.co.ke'
  },
  {
    id: 'g2',
    name: 'Wanjiku Njeri',
    type: OperatorType.INDIVIDUAL,
    title: 'Adventure & Hiking Specialist',
    bio: 'Specializing in Mt. Kenya climbs and Aberdare forest hikes. Safety and summit success prioritized.',
    basePrice: 7500,
    rating: 4.7,
    reviewsCount: 180,
    tripsCompleted: 210,
    specialties: ['Mountain Climbing', 'Forest Trekking', 'Camping'],
    location: 'Nanyuki',
    languages: ['English', 'Swahili', 'French'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    isVerified: true,
    bookingLink: 'mailto:wanjiku@adventures.co.ke'
  },
  {
    id: 'o3',
    name: 'Rift Valley Flyovers',
    type: OperatorType.COMPANY,
    bio: 'Balloon safaris and helicopter tours over the dramatic Great Rift Valley landscapes.',
    basePrice: 45000,
    rating: 4.9,
    reviewsCount: 420,
    specialties: ['Air Safaris', 'Hot Air Balloon', 'Aerial Photography'],
    location: 'Naivasha',
    imageUrl: 'https://images.unsplash.com/photo-1540759786422-c60d5ecd5707',
    isVerified: true,
    bookingLink: 'https://wa.me/254722333444'
  }
];

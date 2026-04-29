
export enum PlaceCategory {
  SAFARI = 'SAFARI',
  HANGOUT_SPOT = 'HANGOUT_SPOT',
  OUTDOOR_ADVENTURE = 'OUTDOOR_ADVENTURE',
  EATS_ENT = 'EATS_ENT'
}

export enum OperatorType {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
  RESTAURANT = 'RESTAURANT',
  CLUB = 'CLUB',
  RECREATIONAL = 'RECREATIONAL'
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  location: string;
  rating: number;
  imageUrl: string;
  isTrending: boolean;
  price?: number;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  providerId: string;
  providerName: string;
  date: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  registrations: number;
  category: PlaceCategory;
  totalCapacity: number;
  bookedCapacity: number;
}

export interface TourOperator {
  id: string;
  name: string;
  type: OperatorType;
  bio: string;
  basePrice: number;
  rating: number;
  totalRatings?: number;
  specialties?: string[];
}

export interface User {
  uid: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
}

export interface SavedItem {
  id: string;
  placeId: string;
  addedAt: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  places: string[];
  startDate: string;
  endDate: string;
  notes: string;
  createdAt: any;
}

export interface Rating {
  id: string;
  userId: string;
  placeId?: string;
  operatorId?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface PendingProvider {
  id: string;
  name: string;
  type: OperatorType;
  bio: string;
  basePrice: number;
  email: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: any;
}

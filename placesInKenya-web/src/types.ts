
export enum PlaceCategory {
  RESTAURANT = 'RESTAURANT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HANGOUT_SPOTS = 'HANGOUT_SPOTS',
  OUTDOORS = 'OUTDOORS',
  SAFARI = 'SAFARI',
  ADVENTURES = 'ADVENTURES',
  HOTEL = 'HOTEL',
  EXPERIENCE = 'EXPERIENCE'
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
  isVerified?: boolean;
  price?: number;
  tags?: string[];
  ownerId: string;
  reviewsCount?: number;
  numRatings?: number;
  bookingLink?: string;
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
  category: string;
  totalCapacity: number;
  bookedCapacity: number;
  organizer?: {
    logo: string;
    bio: string;
    rating: number;
  };
  gallery?: string[];
  mapsLink?: string;
  interestedCount?: number;
  bookingLink?: string;
}

export interface TourOperator {
  id: string;
  name: string;
  type: OperatorType;
  bio: string;
  basePrice: number;
  rating: number;
  totalRatings?: number;
  reviewsCount?: number;
  specialties?: string[];
  location?: string;
  languages?: string[];
  imageUrl?: string;
  isVerified?: boolean;
  tripsCompleted?: number;
  title?: string; // e.g. "Licensed Safari Guide"
  bookingLink?: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  persona?: 'TRAVELER' | 'LOCAL_EXPLORER' | 'BUSINESS_OWNER';
  photoURL?: string;
  savedPlaces?: string[];
  reviews?: string[];
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export interface SavedItem {
  id: string;
  placeId: string;
  addedAt: string;
  plannedDate?: string;
  isEvent?: boolean;
  completed?: boolean;
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

export interface Registration {
  id?: string;
  type: 'OPERATOR' | 'GUIDE' | 'RESTAURANT' | 'HOTEL' | 'EXPERIENCE' | 'CREATOR';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_NEEDED';
  submittedAt: any; // Firestore Timestamp or Date
  businessName: string;
  email: string;
  phone: string;
  description: string;
  details: {
    regNumber?: string;
    address?: string;
    services?: string[];
    priceRange?: string;
    yearsOfExperience?: number;
    languages?: string[];
    specialties?: string[];
    areasOperated?: string;
    legalName?: string;
    licenseNumber?: string;
    websiteUrl?: string;
    bookingLink?: string;
    latitude?: number;
    longitude?: number;
  };
  documents: {
    logoUrl?: string;
    photos: string[];
    certificateUrl?: string;
    profilePhotoUrl?: string;
    licenseUrl?: string;
  };
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: any;
}

export interface PendingProvider {
  id: string;
  type: string;
  submittedAt?: any;
  businessName?: string;
  name?: string;
  description?: string;
  bio?: string;
  basePrice: number;
  email: string;
  phone: string;
  documents?: {
    logoUrl?: string;
    certificateUrl?: string;
    certificateName?: string;
    photos?: string[];
    attachedFiles?: Array<{
      id: string;
      name: string;
      size: string;
      type: string;
      dataUrl: string;
      category?: string;
    }>;
  };
}


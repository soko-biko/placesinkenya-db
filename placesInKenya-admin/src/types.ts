
export interface Place {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  price: number;
  rating: number;
  featured?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  ownerId?: string;
  tags?: string[];
  reviewsCount?: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt?: any;
}

export interface TourOperator {
  id: string;
  name: string;
  type: string;
  bio: string;
  basePrice: number;
  imageUrl?: string;
  verified: boolean;
  featured?: boolean;
  email?: string;
  phone?: string;
  rating?: number;
  specialties?: string[];
  location?: string;
}

export interface Guide {
  id: string;
  name: string;
  title?: string;
  type?: string;
  bio: string;
  basePrice?: number;
  imageUrl?: string;
  verified: boolean;
  featured?: boolean;
  email?: string;
  phone?: string;
  rating?: number;
  languages?: string[];
  location?: string;
  specialties?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  price: number;
  imageUrl: string;
  category: string;
  providerId?: string;
  providerName?: string;
  totalCapacity?: number;
  bookedCapacity?: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured?: boolean;
  bookingLink?: string;
  mapsLink?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: any;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storagePath: string;
  downloadURL: string;
  contentType: string;
  size: number;
  uploadedAt: any;
  uploadedBy?: string;
  altText?: string;
  caption?: string;
  associatedEntityType?: string;
  associatedEntityId?: string;
  featured?: boolean;
  tags?: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  adminUid: string;
  adminEmail?: string;
  targetType: string;
  targetId?: string;
  timestamp: any;
  details?: Record<string, any>;
}

export interface Registration {
  id?: string;
  type: 'OPERATOR' | 'GUIDE' | 'RESTAURANT' | 'HOTEL' | 'EXPERIENCE' | 'CREATOR' | 'SHOPPING';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_NEEDED';
  submittedAt: any;
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

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'USER' | 'ADMIN';
  createdAt: any;
  persona?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroSearchPlaceholder: string;
  eventsTitle: string;
  eventsSubtitle: string;
  eventsBgImage: string;
  partnerTitle: string;
  partnerSubtitle: string;
  partnerBgImage: string;
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  aboutText?: string;
  footerText?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroTitle: 'Discover Kenya’s Most',
  heroTitleHighlight: 'Extraordinary Places',
  heroSubtitle: 'From boutique eco-lodges in the Mara to hidden coastal hideaways, curate your ultimate Kenyan experience with verified local specialists.',
  heroBgImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop',
  heroSearchPlaceholder: 'Search destinations, wildlife, experiences, or regions...',
  eventsTitle: 'UPCOMING EXPERIENCES',
  eventsSubtitle: 'Exclusive group departures, seasonal migrations, and local cultural festivals.',
  eventsBgImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2000&auto=format&fit=crop',
  partnerTitle: 'BECOME A VERIFIED PARTNER',
  partnerSubtitle: 'Join Kenya’s premier platform for boutique safari operators, local guides, and unique stays.',
  partnerBgImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=2000&auto=format&fit=crop',
  siteName: 'Places in Kenya',
  siteTagline: 'Curated Kenyan Discoveries',
  contactEmail: 'concierge@placesinkenya.com',
  contactPhone: '+254 700 000 000',
  aboutText: 'Places in Kenya is the authoritative digital platform showcasing curated destinations, authentic local tour operators, and licensed private guides across Kenya.',
  footerText: '© 2026 Places in Kenya. All Rights Reserved.'
};


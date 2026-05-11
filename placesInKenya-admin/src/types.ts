
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
}

export interface TourOperator {
  id: string;
  name: string;
  type: string;
  bio: string;
  basePrice: number;
  imageUrl?: string;
  verified: boolean;
}

export interface Registration {
  id?: string;
  type: 'OPERATOR' | 'GUIDE' | 'RESTAURANT' | 'HOTEL' | 'EXPERIENCE' | 'CREATOR';
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
}

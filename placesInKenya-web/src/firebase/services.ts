
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './config';
import { Place, TourOperator, PendingProvider, Event, SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroTitle: "Experience the",
  heroTitleHighlight: "Majesty",
  heroSubtitle: "A curated collective of the most authentic destinations in the heart of Africa.",
  heroBgImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  heroSearchPlaceholder: "Search by name, location, or experience...",
  eventsTitle: "Ways to Experience Kenya",
  eventsSubtitle: "A sequence of scheduled prestige events, from athletic safaris to jazz festivals in the city.",
  eventsBgImage: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d",
  partnerTitle: "Represent a Kenyan Destination or Tour Service?",
  partnerSubtitle: "Join our exclusive verified provider directory.",
  partnerBgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  siteName: "PlacesInKenya",
  siteTagline: "Curated Discovery Platform",
  contactEmail: "concierge@placesinkenya.com",
  contactPhone: "+254 700 000 000"
};


enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  const isPermissionDenied = 
    (error && typeof error === 'object' && 'code' in error && (error as any).code === 'permission-denied') ||
    (error instanceof Error && (error.message.includes('permission-denied') || error.message.toLowerCase().includes('insufficient permissions')));

  if (isPermissionDenied) {
    throw new Error(JSON.stringify(errInfo));
  }
}

// ========== PLACES SERVICES ==========
export const placesService = {
  // Get all places with optional filters
  getAll: async (filters: { category?: string; isTrending?: boolean } = {}) => {
    const path = 'places';
    try {
      let q = query(collection(db, path));
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters.isTrending) {
        q = query(q, where('isTrending', '==', true));
      }
      
      q = query(q, orderBy('rating', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  
  // Get trending places
  getTrending: async () => {
    const path = 'places';
    try {
      const q = query(
        collection(db, path), 
        where('isTrending', '==', true),
        orderBy('rating', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  
  // Get single place
  getById: async (id: string) => {
    const path = `places/${id}`;
    try {
      const docRef = doc(db, 'places', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Place) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },
  
  // Create place (admin only)
  create: async (data: Partial<Place>) => {
    const path = 'places';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  
  // Update place (admin only)
  update: async (id: string, data: Partial<Place>) => {
    const path = `places/${id}`;
    try {
      const docRef = doc(db, 'places', id);
      await updateDoc(docRef, data as any);
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  
  // Delete place (admin only)
  delete: async (id: string) => {
    const path = `places/${id}`;
    try {
      await deleteDoc(doc(db, 'places', id));
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== EVENTS SERVICES ==========
export const eventsService = {
  // Get all events
  getAll: async () => {
    const path = 'events';
    try {
      const q = query(collection(db, path), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // Create event
  create: async (data: Partial<Event>) => {
    const path = 'events';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Update event
  update: async (id: string, data: Partial<Event>) => {
    const path = `events/${id}`;
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, data as any);
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Delete event
  delete: async (id: string) => {
    const path = `events/${id}`;
    try {
      await deleteDoc(doc(db, 'events', id));
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== PROVIDERS SERVICES ==========
export const providersService = {
  // Get all providers
  getAll: async () => {
    const path = 'providers';
    try {
      const q = query(collection(db, path), orderBy('rating', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourOperator));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  
  // Get single provider
  getById: async (id: string) => {
    const path = `providers/${id}`;
    try {
      const docRef = doc(db, 'providers', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as TourOperator) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },
  
  // Create provider
  create: async (data: Partial<TourOperator>) => {
    const path = 'providers';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        rating: data.rating || 5.0,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Update provider
  update: async (id: string, data: Partial<TourOperator>) => {
    const path = `providers/${id}`;
    try {
      const docRef = doc(db, 'providers', id);
      await updateDoc(docRef, data as any);
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Delete provider
  delete: async (id: string) => {
    const path = `providers/${id}`;
    try {
      await deleteDoc(doc(db, 'providers', id));
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== PENDING PROVIDERS SERVICES ==========
export const pendingProvidersService = {
  // Get all pending applications
  getAll: async () => {
    const path = 'registrations';
    try {
      const q = query(
        collection(db, path), 
        where('status', '==', 'PENDING'),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  
  // Submit application
  create: async (data: any) => {
    const path = 'registrations';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        status: 'PENDING',
        submittedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  
  // Approve application
  approve: async (id: string) => {
    const path = `registrations/${id}`;
    try {
      const docRef = doc(db, 'registrations', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) throw new Error('Application not found');
      
      const data = docSnap.data() as any;
      
      // Create provider
      const provider = await providersService.create({
        name: data.businessName || data.name,
        type: data.type,
        bio: data.description || data.bio,
        basePrice: data.details?.priceRange === 'LUXURY' ? 50000 : 15000,
        bookingLink: data.details?.bookingLink
      });
      
      // Update pending status
      await updateDoc(docRef, { 
        status: 'APPROVED',
        reviewedAt: serverTimestamp()
      });
      
      return provider;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  
  // Reject application
  reject: async (id: string) => {
    const path = `registrations/${id}`;
    try {
      const docRef = doc(db, 'registrations', id);
      await updateDoc(docRef, { status: 'REJECTED' });
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

// ========== SITE SETTINGS SERVICE ==========
export const siteSettingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    const path = 'site_config/main';
    try {
      const docRef = doc(db, 'site_config', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        const merged = { ...DEFAULT_SITE_SETTINGS, ...data };
        localStorage.setItem('places_site_settings', JSON.stringify(merged));
        return merged;
      }
    } catch (error) {
      console.warn('Could not fetch site settings from Firestore, using local fallback:', error);
    }

    // LocalStorage fallback
    const cached = localStorage.getItem('places_site_settings');
    if (cached) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
      } catch (e) {
        console.error(e);
      }
    }

    return DEFAULT_SITE_SETTINGS;
  },

  updateSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const path = 'site_config/main';
    const current = await siteSettingsService.getSettings();
    const updated = { ...current, ...settings };

    // Always update local storage for immediate feedback
    localStorage.setItem('places_site_settings', JSON.stringify(updated));

    try {
      const docRef = doc(db, 'site_config', 'main');
      await setDoc(docRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.warn('Failed to persist site settings to Firestore, saved to local cache:', error);
    }

    return updated;
  }
};


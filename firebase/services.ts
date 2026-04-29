
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Place, TourOperator, PendingProvider } from '../types';

// ========== PLACES SERVICES ==========
export const placesService = {
  // Get all places with optional filters
  getAll: async (filters: { category?: string; isTrending?: boolean } = {}) => {
    let q = query(collection(db, 'places'));
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.isTrending) {
      q = query(q, where('isTrending', '==', true));
    }
    
    q = query(q, orderBy('rating', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
  },
  
  // Get trending places
  getTrending: async () => {
    const q = query(
      collection(db, 'places'), 
      where('isTrending', '==', true),
      orderBy('rating', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
  },
  
  // Get single place
  getById: async (id: string) => {
    const docRef = doc(db, 'places', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Place) : null;
  },
  
  // Create place (admin only)
  create: async (data: Partial<Place>) => {
    const docRef = await addDoc(collection(db, 'places'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  },
  
  // Update place (admin only)
  update: async (id: string, data: Partial<Place>) => {
    const docRef = doc(db, 'places', id);
    await updateDoc(docRef, data as any);
    return { id, ...data };
  },
  
  // Delete place (admin only)
  delete: async (id: string) => {
    await deleteDoc(doc(db, 'places', id));
    return { success: true };
  }
};

// ========== PROVIDERS SERVICES ==========
export const providersService = {
  // Get all providers
  getAll: async () => {
    const q = query(collection(db, 'providers'), orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourOperator));
  },
  
  // Get single provider
  getById: async (id: string) => {
    const docRef = doc(db, 'providers', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as TourOperator) : null;
  },
  
  // Create provider (used during approval)
  create: async (data: Partial<TourOperator>) => {
    const docRef = await addDoc(collection(db, 'providers'), {
      ...data,
      rating: 0,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  }
};

// ========== PENDING PROVIDERS SERVICES ==========
export const pendingProvidersService = {
  // Get all pending applications
  getAll: async () => {
    const q = query(
      collection(db, 'pendingProviders'), 
      where('status', '==', 'PENDING'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingProvider));
  },
  
  // Submit application
  create: async (data: Partial<PendingProvider>) => {
    const docRef = await addDoc(collection(db, 'pendingProviders'), {
      ...data,
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  },
  
  // Approve application
  approve: async (id: string) => {
    const docRef = doc(db, 'pendingProviders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) throw new Error('Application not found');
    
    const data = docSnap.data() as PendingProvider;
    
    // Create provider
    const provider = await providersService.create({
      name: data.name,
      type: data.type,
      bio: data.bio,
      basePrice: data.basePrice
    });
    
    // Update pending status
    await updateDoc(docRef, { status: 'APPROVED' });
    
    return provider;
  },
  
  // Reject application
  reject: async (id: string) => {
    const docRef = doc(db, 'pendingProviders', id);
    await updateDoc(docRef, { status: 'REJECTED' });
    return { success: true };
  }
};

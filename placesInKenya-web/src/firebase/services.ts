
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
import { db, auth } from './config';
import { Place, TourOperator, PendingProvider } from '../types';

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
  
  // Create provider (used during approval)
  create: async (data: Partial<TourOperator>) => {
    const path = 'providers';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        rating: 0,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
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

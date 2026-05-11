
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
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db, auth } from './config';
import { Place, TourOperator, Registration, AppUser } from '../types';

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
  throw new Error(JSON.stringify(errInfo));
}

export const placesService = {
  getAll: async () => {
    const path = 'places';
    try {
      const q = query(collection(db, path), orderBy('rating', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  create: async (data: Partial<Place>) => {
    const path = 'places';
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
  },
  update: async (id: string, data: Partial<Place>) => {
    const path = `places/${id}`;
    try {
      await updateDoc(doc(db, 'places', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  delete: async (id: string) => {
    const path = `places/${id}`;
    try {
      await deleteDoc(doc(db, 'places', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

export const operatorsService = {
  getAll: async () => {
    const path = 'operators';
    try {
      const q = query(collection(db, path), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  create: async (data: any) => {
    const path = 'operators';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        verified: false,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  update: async (id: string, data: any) => {
    const path = `operators/${id}`;
    try {
      await updateDoc(doc(db, 'operators', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

export const registrationsService = {
  getPending: async () => {
    const path = 'registrations';
    try {
      const q = query(
        collection(db, path), 
        where('status', '==', 'PENDING'),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  getAllByStatus: async (status: Registration['status']) => {
    const path = 'registrations';
    try {
      const q = query(
        collection(db, path), 
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  updateStatus: async (id: string, status: Registration['status'], adminNotes?: string) => {
    const path = `registrations/${id}`;
    try {
      const updateData: any = { status, reviewedAt: serverTimestamp() };
      if (adminNotes) updateData.adminNotes = adminNotes;
      await updateDoc(doc(db, 'registrations', id), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  approveAndPublish: async (id: string, adminId: string) => {
    const path = `registrations/${id}`;
    try {
      const docRef = doc(db, 'registrations', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Registration not found');
      const data = docSnap.data() as Registration;
      
      // 1. Update registration status
      await updateDoc(docRef, { 
        status: 'APPROVED', 
        reviewedBy: adminId, 
        reviewedAt: serverTimestamp() 
      });
      
      // 2. Create listing in operators or guides
      const collectionName = data.type === 'GUIDE' ? 'guides' : 'operators';
      const listingPath = `${collectionName}/${id}`;
      await setDoc(doc(db, collectionName, id), {
        name: data.businessName,
        type: data.type,
        bio: data.description,
        email: data.email,
        phone: data.phone,
        details: data.details,
        imageUrl: data.documents.logoUrl || data.documents.profilePhotoUrl,
        verified: true,
        registeredAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

export const usersService = {
  getAll: async () => {
    const path = 'users';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};


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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from './config';
import { 
  Place, 
  TourOperator, 
  Guide,
  Event,
  Category,
  MediaAsset,
  AuditLog,
  Registration, 
  AppUser,
  SiteSettings,
  DEFAULT_SITE_SETTINGS
} from '../types';

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
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ========== AUDIT LOG SERVICE ==========
export const auditLogService = {
  logAction: async (action: string, targetType: string, targetId?: string, details?: Record<string, any>) => {
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const log: AuditLog = {
        id: logId,
        action,
        adminUid: auth.currentUser?.uid || 'system',
        adminEmail: auth.currentUser?.email || 'admin@placesinkenya.com',
        targetType,
        targetId: targetId || '',
        timestamp: new Date().toISOString(),
        details: details || {}
      };
      await setDoc(doc(db, 'audit_logs', logId), log);
    } catch (err) {
      console.warn('Audit logging error:', err);
    }
  },
  getRecentLogs: async () => {
    try {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    } catch (err) {
      return [];
    }
  }
};

// ========== PLACES SERVICE ==========
export const placesService = {
  getAll: async () => {
    const path = 'places';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  getById: async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'places', id));
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Place) : null;
    } catch (e) {
      return null;
    }
  },
  create: async (data: Partial<Place>) => {
    const path = 'places';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        rating: data.rating || 4.5,
        status: data.status || 'PUBLISHED',
        ownerId: auth.currentUser?.uid || 'admin',
        createdAt: serverTimestamp()
      });
      await auditLogService.logAction('CREATE_PLACE', 'Place', docRef.id, { name: data.name });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  update: async (id: string, data: Partial<Place>) => {
    const path = `places/${id}`;
    try {
      await updateDoc(doc(db, 'places', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      await auditLogService.logAction('UPDATE_PLACE', 'Place', id, { name: data.name });
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  delete: async (id: string) => {
    const path = `places/${id}`;
    try {
      await deleteDoc(doc(db, 'places', id));
      await auditLogService.logAction('DELETE_PLACE', 'Place', id);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== TOUR OPERATORS SERVICE ==========
export const operatorsService = {
  getAll: async () => {
    const path = 'operators';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourOperator));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  create: async (data: Partial<TourOperator>) => {
    const path = 'operators';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        verified: data.verified ?? true,
        createdAt: serverTimestamp()
      });
      await auditLogService.logAction('CREATE_OPERATOR', 'TourOperator', docRef.id, { name: data.name });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  update: async (id: string, data: Partial<TourOperator>) => {
    const path = `operators/${id}`;
    try {
      await updateDoc(doc(db, 'operators', id), data);
      await auditLogService.logAction('UPDATE_OPERATOR', 'TourOperator', id, { name: data.name });
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  delete: async (id: string) => {
    const path = `operators/${id}`;
    try {
      await deleteDoc(doc(db, 'operators', id));
      await auditLogService.logAction('DELETE_OPERATOR', 'TourOperator', id);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== PRIVATE GUIDES SERVICE ==========
export const guidesService = {
  getAll: async () => {
    const path = 'guides';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guide));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  create: async (data: Partial<Guide>) => {
    const path = 'guides';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        verified: data.verified ?? true,
        createdAt: serverTimestamp()
      });
      await auditLogService.logAction('CREATE_GUIDE', 'Guide', docRef.id, { name: data.name });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  update: async (id: string, data: Partial<Guide>) => {
    const path = `guides/${id}`;
    try {
      await updateDoc(doc(db, 'guides', id), data);
      await auditLogService.logAction('UPDATE_GUIDE', 'Guide', id, { name: data.name });
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  delete: async (id: string) => {
    const path = `guides/${id}`;
    try {
      await deleteDoc(doc(db, 'guides', id));
      await auditLogService.logAction('DELETE_GUIDE', 'Guide', id);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== EVENTS SERVICE ==========
export const eventsService = {
  getAll: async () => {
    const path = 'events';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
  create: async (data: Partial<Event>) => {
    const path = 'events';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        status: data.status || 'PUBLISHED',
        createdAt: serverTimestamp()
      });
      await auditLogService.logAction('CREATE_EVENT', 'Event', docRef.id, { title: data.title });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  update: async (id: string, data: Partial<Event>) => {
    const path = `events/${id}`;
    try {
      await updateDoc(doc(db, 'events', id), data);
      await auditLogService.logAction('UPDATE_EVENT', 'Event', id, { title: data.title });
      return { id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  delete: async (id: string) => {
    const path = `events/${id}`;
    try {
      await deleteDoc(doc(db, 'events', id));
      await auditLogService.logAction('DELETE_EVENT', 'Event', id);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

// ========== CATEGORIES SERVICE ==========
export const categoriesService = {
  getAll: async () => {
    const path = 'categories';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      return [];
    }
  },
  create: async (data: Partial<Category>) => {
    const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
    const catId = slug;
    const cat: Category = {
      id: catId,
      name: data.name || '',
      slug,
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      displayOrder: data.displayOrder || 1,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'categories', catId), cat, { merge: true });
    await auditLogService.logAction('CREATE_CATEGORY', 'Category', catId, { name: data.name });
    return cat;
  },
  update: async (id: string, data: Partial<Category>) => {
    await updateDoc(doc(db, 'categories', id), data as any);
    await auditLogService.logAction('UPDATE_CATEGORY', 'Category', id, { name: data.name });
  },
  delete: async (id: string) => {
    // Safety check if places belong to this category
    const q = query(collection(db, 'places'), where('category', '==', id));
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error(`Cannot delete category "${id}" because ${snap.size} place(s) are currently associated with it.`);
    }
    await deleteDoc(doc(db, 'categories', id));
    await auditLogService.logAction('DELETE_CATEGORY', 'Category', id);
  }
};

// ========== MEDIA LIBRARY SERVICE ==========
export const mediaService = {
  getAll: async () => {
    const path = 'media';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaAsset));
    } catch (error) {
      return [];
    }
  },
  upload: async (file: File, metadata?: Partial<MediaAsset>): Promise<MediaAsset> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `media/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const assetId = `med_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
    const asset: MediaAsset = {
      id: assetId,
      filename: file.name,
      storagePath,
      downloadURL,
      contentType: file.type || 'image/jpeg',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: auth.currentUser?.email || 'admin',
      altText: metadata?.altText || file.name.replace(/\.[^/.]+$/, ''),
      caption: metadata?.caption || '',
      tags: metadata?.tags || [],
      associatedEntityType: metadata?.associatedEntityType || 'general',
      associatedEntityId: metadata?.associatedEntityId || ''
    };

    await setDoc(doc(db, 'media', assetId), asset);
    await auditLogService.logAction('UPLOAD_MEDIA', 'MediaAsset', assetId, { filename: file.name });
    return asset;
  },
  updateMetadata: async (id: string, metadata: Partial<MediaAsset>) => {
    await updateDoc(doc(db, 'media', id), metadata as any);
  },
  delete: async (id: string, storagePath?: string) => {
    try {
      if (storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef).catch(e => console.warn('Storage object delete warning:', e));
      }
      await deleteDoc(doc(db, 'media', id));
      await auditLogService.logAction('DELETE_MEDIA', 'MediaAsset', id);
      return true;
    } catch (e) {
      console.error('Failed to delete media asset:', e);
      throw e;
    }
  }
};

// ========== REGISTRATIONS / APPROVAL SERVICE ==========
export const registrationsService = {
  getPending: async () => {
    const path = 'registrations';
    try {
      const q = query(
        collection(db, path), 
        where('status', '==', 'PENDING')
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
        where('status', '==', status)
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
      const updateData: any = { status, reviewedAt: new Date().toISOString() };
      if (adminNotes) updateData.adminNotes = adminNotes;
      await updateDoc(doc(db, 'registrations', id), updateData);
      await auditLogService.logAction('UPDATE_REGISTRATION_STATUS', 'Registration', id, { status, adminNotes });
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
      
      // Update registration status
      await updateDoc(docRef, { 
        status: 'APPROVED', 
        reviewedBy: adminId, 
        reviewedAt: new Date().toISOString() 
      });
      
      // Determine collection type
      if (data.type === 'GUIDE') {
        await setDoc(doc(db, 'guides', id), {
          name: data.businessName,
          title: 'Licensed Guide',
          bio: data.description,
          email: data.email,
          phone: data.phone,
          details: data.details,
          imageUrl: data.documents.logoUrl || data.documents.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          verified: true,
          registeredAt: new Date().toISOString()
        }, { merge: true });
      } else if (data.type === 'OPERATOR') {
        await setDoc(doc(db, 'operators', id), {
          name: data.businessName,
          type: 'COMPANY',
          bio: data.description,
          email: data.email,
          phone: data.phone,
          details: data.details,
          imageUrl: data.documents.logoUrl || 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
          verified: true,
          registeredAt: new Date().toISOString()
        }, { merge: true });
      } else {
        // Place / Business (RESTAURANT, HOTEL, EXPERIENCE, SHOPPING, etc.)
        await setDoc(doc(db, 'places', id), {
          name: data.businessName,
          description: data.description,
          category: data.type === 'SHOPPING' ? 'SHOPPING' : (data.type as any),
          location: data.details?.address || 'Kenya',
          imageUrl: data.documents.logoUrl || data.documents.photos?.[0] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
          ownerId: adminId,
          price: 0,
          rating: 5.0,
          isVerified: true,
          status: 'PUBLISHED',
          bookingLink: data.details?.bookingLink || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
      
      await auditLogService.logAction('APPROVE_REGISTRATION', 'Registration', id, { businessName: data.businessName, type: data.type });
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

// ========== USERS SERVICE ==========
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
  },
  updateRole: async (uid: string, role: 'USER' | 'ADMIN') => {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      await auditLogService.logAction('UPDATE_USER_ROLE', 'User', uid, { newRole: role });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

// ========== SITE SETTINGS SERVICE ==========
export const siteSettingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const docSnap = await getDoc(doc(db, 'site_config', 'main'));
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        const merged = { ...DEFAULT_SITE_SETTINGS, ...data };
        localStorage.setItem('places_site_settings', JSON.stringify(merged));
        return merged;
      }
    } catch (error) {
      console.warn('Could not fetch site settings from Firestore, using fallback:', error);
    }

    const cached = localStorage.getItem('places_site_settings');
    if (cached) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
      } catch (e) {}
    }

    return DEFAULT_SITE_SETTINGS;
  },

  updateSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const current = await siteSettingsService.getSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      heroBgImage: (settings.heroBgImage ?? current.heroBgImage ?? '').trim(),
      eventsBgImage: (settings.eventsBgImage ?? current.eventsBgImage ?? '').trim(),
      partnerBgImage: (settings.partnerBgImage ?? current.partnerBgImage ?? '').trim(),
    };
    localStorage.setItem('places_site_settings', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'site_config', 'main'), { ...updated, updatedAt: new Date().toISOString() }, { merge: true });
      await auditLogService.logAction('UPDATE_SITE_SETTINGS', 'SiteConfig', 'main', { updatedFields: Object.keys(settings) });
    } catch (error) {
      console.warn('Failed to persist site settings to Firestore:', error);
    }

    return updated;
  }
};


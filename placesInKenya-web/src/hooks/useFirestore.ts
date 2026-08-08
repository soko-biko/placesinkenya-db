
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc,
  query, 
  where, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Place, TourOperator, Itinerary, Event, SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../firebase/services';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const cached = localStorage.getItem('places_site_settings');
    if (cached) {
      try { return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) }; } catch (e) {}
    }
    return DEFAULT_SITE_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'site_config', 'main');
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          const merged = { ...DEFAULT_SITE_SETTINGS, ...data };
          setSettings(merged);
          localStorage.setItem('places_site_settings', JSON.stringify(merged));
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading };
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

export const usePlaces = (filters: { category?: string } = {}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, 'places'));
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    q = query(q, orderBy('rating', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Place));
        setPlaces(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'places');
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters.category]);

  return { places, loading, error };
};

export const useTrendingPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'places'),
      where('isTrending', '==', true),
      orderBy('rating', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Place));
        setPlaces(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'places');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { places, loading };
};

export const useOperators = () => {
  const [operators, setOperators] = useState<TourOperator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'providers'), orderBy('rating', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TourOperator));
        setOperators(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'providers');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { operators, loading };
};

export const useItineraries = (userId: string | undefined) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Itinerary));
        setItineraries(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'itineraries');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { itineraries, loading };
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Event));
        setEvents(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'events');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { events, loading };
};

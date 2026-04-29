
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Place, TourOperator, Itinerary } from '../types';

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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Place));
      setPlaces(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { places, loading };
};

export const useOperators = () => {
  const [operators, setOperators] = useState<TourOperator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'providers'), orderBy('rating', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TourOperator));
      setOperators(data);
      setLoading(false);
    });

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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Itinerary));
      setItineraries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { itineraries, loading };
};

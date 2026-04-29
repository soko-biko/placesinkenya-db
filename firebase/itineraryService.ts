
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Itinerary, Rating } from '../types';

// ========== ITINERARY SERVICES ==========
export const itineraryService = {
  // Create new itinerary
  create: async (userId: string, data: Partial<Itinerary>) => {
    const docRef = await addDoc(collection(db, 'itineraries'), {
      userId,
      name: data.name,
      places: data.places || [], // Array of place IDs
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes || '',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  },

  // Add place to itinerary
  addPlace: async (itineraryId: string, placeId: string) => {
    const docRef = doc(db, 'itineraries', itineraryId);
    const itinerary = await getDoc(docRef);
    if (!itinerary.exists()) return;
    const places = itinerary.data().places || [];
    
    await updateDoc(docRef, {
      places: [...places, placeId]
    });
  },

  // Remove place from itinerary
  removePlace: async (itineraryId: string, placeId: string) => {
    const docRef = doc(db, 'itineraries', itineraryId);
    const itinerary = await getDoc(docRef);
    if (!itinerary.exists()) return;
    const places = itinerary.data().places || [];
    
    await updateDoc(docRef, {
      places: places.filter((id: string) => id !== placeId)
    });
  },

  // Delete itinerary
  delete: async (itineraryId: string) => {
    await deleteDoc(doc(db, 'itineraries', itineraryId));
  }
};

// ========== RATING SERVICES ==========
export const ratingService = {
  // Submit rating for a place
  submitPlaceRating: async (userId: string, placeId: string, data: { rating: number; comment: string }) => {
    // Add rating to ratings collection
    const ratingRef = await addDoc(collection(db, 'ratings'), {
      userId,
      placeId,
      rating: data.rating, // 1-5
      comment: data.comment || '',
      createdAt: serverTimestamp()
    });

    // Recalculate place average rating
    await ratingService.recalculatePlaceRating(placeId);
    
    return { id: ratingRef.id };
  },

  // Submit rating for an operator
  submitOperatorRating: async (userId: string, operatorId: string, data: { rating: number; comment: string }) => {
    // Add rating to ratings collection
    const ratingRef = await addDoc(collection(db, 'ratings'), {
      userId,
      operatorId,
      rating: data.rating, // 1-5
      comment: data.comment || '',
      createdAt: serverTimestamp()
    });

    // Recalculate operator average rating
    await ratingService.recalculateOperatorRating(operatorId);
    
    return { id: ratingRef.id };
  },

  // Recalculate average rating for a place
  recalculatePlaceRating: async (placeId: string) => {
    const q = query(collection(db, 'ratings'), where('placeId', '==', placeId));
    const snapshot = await getDocs(q);
    
    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    // Update place rating
    await updateDoc(doc(db, 'places', placeId), {
      rating: avgRating,
      totalRatings: ratings.length
    });
  },

  // Recalculate average rating for an operator
  recalculateOperatorRating: async (operatorId: string) => {
    const q = query(collection(db, 'ratings'), where('operatorId', '==', operatorId));
    const snapshot = await getDocs(q);
    
    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    // Update operator rating
    await updateDoc(doc(db, 'providers', operatorId), {
      rating: avgRating,
      totalRatings: ratings.length
    });
  },

  // Get ratings for a place
  getPlaceRatings: async (placeId: string) => {
    const q = query(collection(db, 'ratings'), where('placeId', '==', placeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating));
  },

  // Check if user has rated a place
  hasUserRated: async (userId: string, placeId: string) => {
    const q = query(
      collection(db, 'ratings'), 
      where('userId', '==', userId),
      where('placeId', '==', placeId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
};

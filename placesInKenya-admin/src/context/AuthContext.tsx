
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AppUser } from '../types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['bikowrld21@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const email = firebaseUser.email?.toLowerCase() || '';
        const isMasterEmail = ADMIN_EMAILS.includes(email);

        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUser;
            if (isMasterEmail && userData.role !== 'ADMIN') {
              const updatedData = { ...userData, role: 'ADMIN' as const };
              await setDoc(userRef, updatedData, { merge: true });
              setAppUser(updatedData);
            } else {
              setAppUser(userData);
            }
          } else {
            const newProfile: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || email.split('@')[0],
              role: isMasterEmail ? 'ADMIN' : 'ADMIN', // Grant admin access for managing the application
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newProfile, { merge: true });
            setAppUser(newProfile);
          }
        } catch (err) {
          console.error("Auth role check failed:", err);
          // Fallback in-memory profile if Firestore network issue
          setAppUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Admin User',
            role: 'ADMIN',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = !!user && (appUser?.role === 'ADMIN' || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())));

  return (
    <AuthContext.Provider value={{ user, appUser, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


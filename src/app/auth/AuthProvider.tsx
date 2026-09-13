import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { firebaseAuth, firebaseConfigured } from '@/lib/firebase/firebase';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(firebaseAuth ? 'loading' : 'unauthenticated');

  useEffect(() => {
    if (!firebaseAuth) return;

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  const value: AuthContextValue = {
    user,
    status,
    signIn: async (email, password) => {
      if (!firebaseAuth || !firebaseConfigured) {
        throw new Error('Firebase Authentication is not configured.');
      }
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    },
    resetPassword: async (email) => {
      if (!firebaseAuth || !firebaseConfigured) {
        throw new Error('Firebase Authentication is not configured.');
      }
      await sendPasswordResetEmail(firebaseAuth, email);
    },
    logout: async () => {
      if (firebaseAuth) await signOut(firebaseAuth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The provider and its hook intentionally share one auth context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useEffect, useState, ReactNode } from 'react';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  role: 'admin' | 'pharmacist' | 'patient' | null;
}

// Create a context with a default value of `undefined`.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'admin' | 'pharmacist' | 'patient' | null>(null);

  useEffect(() => {
    // Immediately fetch the session to set the initial state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      const userRole = (currentUser?.user_metadata?.role as AuthContextType['role']) ?? (currentUser ? 'patient' : null);
      setRole(userRole);
      setLoading(false);

      // Set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          const newCurrentUser = session?.user ?? null;
          setUser(newCurrentUser);
          const newUserRole = (newCurrentUser?.user_metadata?.role as AuthContextType['role']) ?? (newCurrentUser ? 'patient' : null);
          setRole(newUserRole);
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = { session, user, loading, role, signOut };

  // Do not render children until the initial loading is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
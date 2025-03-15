'use client';

import { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

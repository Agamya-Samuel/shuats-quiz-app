'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AddressData } from '@/types/user';

// Define a more specific type for the user object for clarity
export interface UserContextData {
  userId: number;
  role: 'user' | 'superadmin' | 'admin';
  // User specific fields
  name?: string;
  email?: string;
  school?: string;
  mobile?: string;
  rollno?: string;
  branch?: string;
  address?: AddressData;
  // Admin and SuperAdmin specific fields
  username?: string;
  picture?: string; // Added for Google Sign-In user
}

interface CookieContextType {
  token: string | null;
  user: UserContextData | null;
  updateUser: (userData: UserContextData | null) => void; // Function to update user state
}

export const CookieContext = createContext<CookieContextType | null>(null);

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

export const CookieProvider = ({
  children,
  token: initialToken, // Renamed for clarity
  user: initialUser, // Renamed for clarity
}: PropsWithChildren<{
  token: string | undefined;
  user: UserContextData | null; // Use the more specific type
}>) => {
  const [currentUser, setCurrentUser] = useState<UserContextData | null>(
    initialUser,
  );
  const [currentToken, setCurrentToken] = useState<string | null>(
    initialToken || null,
  );

  // Effect to update state if initial props change (e.g., after server-side redirect or full refresh)
  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    setCurrentToken(initialToken || null);
  }, [initialToken]);

  const updateUser = (userData: UserContextData | null) => {
    setCurrentUser(userData);
    // Potentially update token here too if login also returns a new token string to store client-side
    // For now, assuming token is mainly managed by httpOnly cookie set by server
  };

  const providerValue = useMemo(
    () => ({
      token: currentToken,
      user: currentUser,
      updateUser,
    }),
    [currentToken, currentUser], // Dependencies are currentToken and currentUser
  );

  return (
    <CookieContext.Provider value={providerValue}>
      {children}
    </CookieContext.Provider>
  );
};

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  profileImage: string;
  coverImage: string;
  isAffiliate: any;
  clientID: number;
  clientName: string | null;
  email: string;
  contactNumber: string | null;
  address: string | null;
  emailVerified: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = `https://ontap-creatives-website.vercel.app/api/auth/me`;
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Also store basic user info in localStorage for quick access (not sensitive data)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify({
        id: userData.clientID,
        name: userData.clientName,
        email: userData.email
      }));
    }
  };

  const logout = async () => {
    try {
      const url = `https://ontap-creatives-website.vercel.app/api/auth/logout`;
      await fetch(url, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
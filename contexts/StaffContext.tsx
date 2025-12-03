"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StaffPermissions {
  viewDashboard: boolean;
  viewOrders: boolean;
  viewClients: boolean;
  viewAffiliates: boolean;
  addProducts: boolean;
  changeContent: boolean;
  addOffers: boolean;
  role: string | null;
  staffID?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface StaffContextState {
  permissions: StaffPermissions | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const StaffContext = createContext<StaffContextState>({
  permissions: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  logout: async () => {},
  refreshSession: async () => {},
});

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchStaffPermissions = async () => {
    try {
      console.log('Fetching staff permissions...');
      
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/staff/me' 
        : 'https://ontap-creatives-website.vercel.app/api/staff/me';
      
      const res = await fetch(apiUrl, {
        credentials: 'include', // Important: include cookies
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Staff API Response status:', res.status);
      
      if (res.status === 401) {
        console.log('Unauthorized - staff session expired');
        setPermissions(null);
        setIsAuthenticated(false);
        setError('Session expired - Please log in');
        
        // Clear any local session data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('staff-session');
        }
      } else if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      } else {
        const data = await res.json();
        console.log('Staff data received:', data);
        
        setPermissions({
          viewDashboard: data.viewDashboard,
          viewOrders: data.viewOrders,
          viewClients: data.viewClients,
          viewAffiliates: data.viewAffiliates,
          addProducts: data.addProducts,
          changeContent: data.changeContent,
          addOffers: data.addOffers,
          role: data.role,
          staffID: data.staffID,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
        setIsAuthenticated(true);
        setError(null);
        
        // Store basic info in localStorage for quick access
        if (typeof window !== 'undefined') {
          localStorage.setItem('staff-session', JSON.stringify({
            staffID: data.staffID,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            role: data.role,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch staff permissions:", error);
      setPermissions(null);
      setIsAuthenticated(false);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffPermissions();
  }, []);

  const logout = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/staff/logout' 
        : 'https://ontap-creatives-website.vercel.app/api/staff/logout';
      
      await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setPermissions(null);
      setIsAuthenticated(false);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('staff-session');
        localStorage.removeItem('ontap::adminRoleSession');
      }
      
      // Redirect to admin login
      window.location.href = '/admin';
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    await fetchStaffPermissions();
  };

  return (
    <StaffContext.Provider value={{ 
      permissions, 
      loading, 
      error, 
      isAuthenticated, 
      logout,
      refreshSession 
    }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

export default StaffContext;
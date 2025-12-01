"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the staff permissions
interface StaffPermissions {
  viewDashboard: boolean;
  viewOrders: boolean;
  viewClients: boolean;
  viewAffiliates: boolean;
  addProducts: boolean;
  changeContent: boolean;
  addOffers: boolean;
  role: string | null;
}

// Define the context state
interface StaffContextState {
  permissions: StaffPermissions | null;
  loading: boolean;
}

// Create the context with a default value
const StaffContext = createContext<StaffContextState>({
  permissions: null,
  loading: true,
});

// Create a provider component
export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffPermissions = async () => {
      try {
        const res = await fetch('https://ontap-creatives-website.vercel.app/api/staff/me');
        if (res.ok) {
          const data = await res.json();
          setPermissions({
            viewDashboard: data.viewDashboard,
            viewOrders: data.viewOrders,
            viewClients: data.viewClients,
            viewAffiliates: data.viewAffiliates,
            addProducts: data.addProducts,
            changeContent: data.changeContent,
            addOffers: data.addOffers,
            role: data.role,
          });
        } else {
          // Failed to fetch, likely not a staff member, or token expired
          setPermissions(null);
        }
      } catch (error) {
        console.error("Failed to fetch staff permissions:", error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffPermissions();
  }, []);

  return (
    <StaffContext.Provider value={{ permissions, loading }}>
      {children}
    </StaffContext.Provider>
  );
};

// Create a custom hook to use the StaffContext
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

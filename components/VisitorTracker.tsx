"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useUser } from '@/contexts/UserContext';
import Cookies from './SaveCookies';

export default function VisitorTracker() {
  const [visitorUUID, setVisitorUUID] = useState<string>('');
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const visitorInitializedRef = useRef<boolean>(false);
  
  const { location, loading: locationLoading, requestLocation } = useLocationTracking();
  const { startSession, endSession, trackPageView } = useVisitorTracking(visitorUUID);
  const { user } = useUser();

  // Cookie utility functions
  const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieString = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = cookieString;
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  /**
   * Initialize visitor in database with location data
   */
  const initializeVisitorInDB = useCallback(async (uuid: string, locationData: typeof location) => {
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/visitor/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorUUID: uuid,
          userAgent: navigator.userAgent,
          geoData: locationData && locationData.latitude && locationData.longitude ? {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            city: locationData.city,
            country: locationData.country,
            region: locationData.region
          } : undefined
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to initialize visitor:', error);
    }
  }, []);

  /**
   * Save visitor location to database and start session
   */
  const saveVisitorLocation = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      await initializeVisitorInDB(visitorUUID, location);
      
      await startSession({
        locationCaptured: !!(location?.latitude && location?.longitude),
        latitude: location?.latitude,
        longitude: location?.longitude,
        locationMethod: location?.method || null,
        city: location?.city,
        country: location?.country,
        region: location?.region
      });
    } catch (error) {
      console.error('Failed to save visitor location:', error);
      // Still try to start session without location
      await startSession({ locationCaptured: false });
    }
  }, [visitorUUID, location, startSession, initializeVisitorInDB]);

  /**
   * Initialize visitor - get UUID and check cookies
   */
  const initializeVisitor = useCallback(async () => {
    if (visitorInitializedRef.current) return;
    visitorInitializedRef.current = true;

    let uuid = getCookie('visitorUUID');
    
    if (!uuid) {
      uuid = generateUUID();
      setCookie('visitorUUID', uuid, 365);
    }
    
    setVisitorUUID(uuid);

    const cookiesAccepted = getCookie('cookiesAccepted');
    
    if (!cookiesAccepted) {
      // Show cookie consent - location will be requested when they accept
      setShowCookies(true);
    } else {
      // Cookies already accepted, request location immediately
      // This will ask for GPS permission, then fallback to IP if denied
      requestLocation();
    }
  }, [requestLocation]);

  /**
   * Handle cookie acceptance
   */
  const handleAcceptCookies = useCallback(async (email?: string) => {
    try {
      // Set cookies accepted
      setCookie('cookiesAccepted', 'true', 365);

      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }

      setShowCookies(false);

      // Now request location (will ask for GPS permission)
      requestLocation();

      // Location will be saved via the useEffect hook below
      
    } catch (error) {
      // Even if there's an error, accept cookies and continue
      setCookie('cookiesAccepted', 'true', 365);
      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }
      setShowCookies(false);
      
      // Still try to initialize visitor without location
      await initializeVisitorInDB(visitorUUID, null);
      await startSession({ 
        cookiesAccepted: true,
        marketingEmails: !!email,
        emailProvided: !!email,
        locationCaptured: false
      });
    }
  }, [requestLocation, visitorUUID, initializeVisitorInDB, startSession]);

  // Initialize on mount - only run once
  useEffect(() => {
    setIsMounted(true);
    
    const init = async () => {
      await initializeVisitor();
    };
    
    init();

    return () => {
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Track page view when user logs in
  useEffect(() => {
    if (user && visitorUUID && isMounted) {
      trackPageView({
        userLoggedIn: true,
        clientID: user.clientID,
        email: user.email
      });
    }
  }, [user, visitorUUID, isMounted, trackPageView]);

  // When location is obtained after cookies accepted, save it
  useEffect(() => {
    const cookiesAccepted = getCookie('cookiesAccepted');
    if (location && cookiesAccepted && visitorUUID && !locationLoading && !initializedRef.current) {
      saveVisitorLocation();
    }
  }, [location, visitorUUID, locationLoading, saveVisitorLocation]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {showCookies && (
        <Cookies 
          setShowCookies={setShowCookies} 
          onAccept={handleAcceptCookies}
        />
      )}
    </>
  );
}

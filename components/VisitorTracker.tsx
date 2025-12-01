"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useUser } from '@/contexts/UserContext';
import Cookies from './SaveCookies';
<<<<<<< HEAD
=======
import { useToast } from '@/hooks/useToast';

// Types for better type safety
interface EnhancedLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
  accuracy: 'high' | 'medium' | 'low' | 'very-low';
  accuracy_radius?: number;
  source: string;
  confidence: number;
  isp?: string;
  timezone?: string;
}
>>>>>>> ebf4a206820da091b50990d7f9eb3550ad0230a6

export default function VisitorTracker() {
  const [visitorUUID, setVisitorUUID] = useState<string>('');
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const visitorInitializedRef = useRef<boolean>(false);
  
  const { location, loading: locationLoading, requestLocation } = useLocationTracking();
  const { startSession, endSession, trackPageView } = useVisitorTracking(visitorUUID);
  const { user } = useUser();
<<<<<<< HEAD
=======
  const { toast, showToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    initializeVisitor();

    return () => {
      endSession();
    };
  }, [visitorUUID]);

  useEffect(() => {
    if (user && visitorUUID && isMounted) {
      trackPageView({
        userLoggedIn: true,
        clientID: user.clientID,
        email: user.email
      });
    }
  }, [user, visitorUUID, isMounted]);

  // Primary method: Use your own API route (no CORS issues)
  const getLocationViaAPI = async (): Promise<EnhancedLocation | null> => {
    try {
      const response = await fetch('/api/geolocation/ip');
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country,
        region: data.region,
        accuracy: 'medium',
        accuracy_radius: 10000,
        source: data.source || 'api',
        confidence: 0.7,
        isp: data.isp,
        timezone: data.timezone
      };
    } catch (error) {
      return null;
    }
  };

  // Fallback: Simple IP geolocation with CORS-friendly services only
  const getEnhancedLocation = async (): Promise<EnhancedLocation | null> => {
    // First try our own API (no CORS issues)
    const apiLocation = await getLocationViaAPI();
    if (apiLocation) {
      return apiLocation;
    }

    // Fallback: Try only reliable, CORS-friendly services
    const fallbackServices = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        mapper: (data: any) => ({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          region: data.region,
          isp: data.org,
          timezone: data.timezone
        })
      },
      {
        name: 'ipwhois',
        url: 'https://ipwho.is/',
        mapper: (data: any) => ({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country,
          region: data.region,
          isp: data.connection?.isp,
          timezone: data.timezone?.id
        })
      }
    ];

    try {
      // Try services sequentially to avoid overwhelming
      for (const service of fallbackServices) {
        try {
          const response = await fetchWithTimeout(service.url, 3000);
          if (!response.ok) continue;
          
          const data = await response.json();
          const mappedData = service.mapper(data);
          
          if (mappedData.latitude && mappedData.longitude) {
            return {
              latitude: mappedData.latitude,
              longitude: mappedData.longitude,
              city: mappedData.city,
              country: mappedData.country,
              region: mappedData.region,
              accuracy: 'medium',
              accuracy_radius: 10000,
              source: service.name,
              confidence: 0.6,
              isp: mappedData.isp,
              timezone: mappedData.timezone
            };
          }
        } catch (error) {
          // Continue to next service
          continue;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Helper function for fetch with timeout
  const fetchWithTimeout = (url: string, timeout: number = 5000): Promise<Response> => {
    return Promise.race([
      fetch(url),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  const initializeVisitor = async () => {
    let uuid = getCookie('visitorUUID');
    if (!uuid) {
      uuid = generateUUID();
      setCookie('visitorUUID', uuid, 365);
    }
    setVisitorUUID(uuid);

    const cookiesAccepted = getCookie('cookiesAccepted');
    
    if (!cookiesAccepted) {
      setShowCookies(true);
      // Don't request location until cookies are accepted
    } else {
      // Only get location and start session after cookies are accepted AND UUID is set
      if (!userLocation) {
        const enhancedLocation = await getEnhancedLocation();
        if (enhancedLocation) {
          setUserLocation(enhancedLocation);
        }
      }
      
      // Wait for UUID to be set in state before initializing
      setTimeout(async () => {
        await initializeVisitorInDB(uuid, userLocation);
        await startSession({
          locationCaptured: !!userLocation,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          locationAccuracy: userLocation?.accuracy || 'unknown',
          locationConfidence: userLocation?.confidence,
          locationSource: userLocation?.source
        });
      }, 100);
    }
  };

  const initializeVisitorInDB = async (uuid: string, location: EnhancedLocation | null) => {
    try {
      const response = await fetch('/api/visitor/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorUUID: uuid,
          userAgent: navigator.userAgent,
          geoData: location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city,
            country: location.country,
            region: location.region,
            accuracy: location.accuracy,
            accuracy_radius: location.accuracy_radius,
            source: location.source,
            confidence: location.confidence,
            isp: location.isp,
            timezone: location.timezone
          } : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
    }
  };

  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      // Try enhanced IP-based location as fallback
      const enhancedLocation = await getEnhancedLocation();
      if (enhancedLocation) {
        setUserLocation(enhancedLocation);
      }
      return;
    }

    // Check if permission was previously denied
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          const enhancedLocation = await getEnhancedLocation();
          if (enhancedLocation) {
            setUserLocation(enhancedLocation);
          }
          return;
        }
      } catch (error) {
        // Continue to try geolocation
      }
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ 
          latitude, 
          longitude, 
          accuracy: 'high',
          accuracy_radius: accuracy,
          source: 'gps',
          confidence: 0.95
        });
      },
      async (error) => {
        // Try enhanced IP-based location as fallback
        const enhancedLocation = await getEnhancedLocation();
        if (enhancedLocation) {
          setUserLocation(enhancedLocation);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleAcceptCookies = async (email?: string) => {
    try {
      // Set cookies accepted
      setCookie('cookiesAccepted', 'true', 365);
      
      // If we don't have any location yet, try enhanced IP-based as final fallback
      let finalLocation = userLocation;
      if (!finalLocation) {
        finalLocation = await getEnhancedLocation();
        if (finalLocation) {
          setUserLocation(finalLocation);
        }
      }

      // Initialize visitor with enhanced location data
      await initializeVisitorInDB(visitorUUID, finalLocation);
      
      // Start session with enhanced location info
      await startSession({
        cookiesAccepted: true,
        marketingEmails: !!email,
        emailProvided: !!email,
        locationCaptured: !!finalLocation,
        latitude: finalLocation?.latitude,
        longitude: finalLocation?.longitude,
        locationAccuracy: finalLocation?.accuracy || 'none',
        locationConfidence: finalLocation?.confidence,
        locationSource: finalLocation?.source,
        city: finalLocation?.city,
        country: finalLocation?.country,
        region: finalLocation?.region,
        isp: finalLocation?.isp
      });

      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }

      setShowCookies(false);
    } catch (error) {
      setCookie('cookiesAccepted', 'true', 365);
      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }
      setShowCookies(false);
    }
  };
>>>>>>> ebf4a206820da091b50990d7f9eb3550ad0230a6

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

"use client";

import { useEffect, useState } from 'react';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useUser } from '@/contexts/UserContext';
import Cookies from './SaveCookies';

export default function VisitorTracker() {
  const [visitorUUID, setVisitorUUID] = useState<string>('');
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ 
    latitude: number; 
    longitude: number;
    accuracy?: string;
    city?: string;
    country?: string;
  } | null>(null);
  const { startSession, endSession, trackPageView } = useVisitorTracking(visitorUUID);
  const { user } = useUser();

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

  // IP-based location fallback
  const getApproximateLocation = async () => {
    try {
      console.log('🔍 Getting approximate location via IP...');
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        console.log('🔍 Approximate location obtained:', {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name
        });
        
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          accuracy: 'low' // Indicate this is approximate
        };
      }
      return null;
    } catch (error) {
      console.log('🔍 Failed to get approximate location:', error);
      return null;
    }
  };

  const initializeVisitor = async () => {
    let uuid = getCookie('visitorUUID');
    if (!uuid) {
      uuid = generateUUID();
      setCookie('visitorUUID', uuid, 365);
    }
    setVisitorUUID(uuid);

    const cookiesAccepted = getCookie('cookiesAccepted');
    console.log('Cookies accepted status:', cookiesAccepted);
    
    if (!cookiesAccepted) {
      console.log('Showing cookies banner for new visitor');
      setShowCookies(true);
      requestUserLocation(); // Try precise location first
    } else {
      console.log('Cookies already accepted, initializing visitor and starting session');
      // If we don't have precise location, try approximate
      if (!userLocation) {
        const approxLocation = await getApproximateLocation();
        if (approxLocation) {
          setUserLocation(approxLocation);
        }
      }
      await initializeVisitorInDB(uuid, userLocation);
      await startSession({
        locationCaptured: !!userLocation,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        locationAccuracy: userLocation?.accuracy || 'unknown'
      });
    }
  };

  const initializeVisitorInDB = async (uuid: string, location: { latitude: number; longitude: number; accuracy?: string; city?: string; country?: string } | null) => {
    try {
      console.log('🔍 Initializing visitor in DB with location:', location);
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
            country: location.country
          } : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('🔍 Visitor initialized with location:', result);
        return result;
      } else {
        console.error('🔍 Failed to initialize visitor with location');
      }
    } catch (error) {
      console.error('🔍 Error initializing visitor with location:', error);
    }
  };

  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      // Try IP-based location as fallback
      const approxLocation = await getApproximateLocation();
      if (approxLocation) {
        setUserLocation(approxLocation);
      }
      return;
    }

    // Check if permission was previously denied
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          console.log('Location permanently denied by user, using IP-based location');
          const approxLocation = await getApproximateLocation();
          if (approxLocation) {
            setUserLocation(approxLocation);
          }
          return;
        }
      } catch (error) {
        console.log('Permission query not supported, proceeding with location request');
      }
    }

    console.log('Requesting precise location permission...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Precise user location obtained:', { latitude, longitude });
        setUserLocation({ 
          latitude, 
          longitude, 
          accuracy: 'high' // Indicate precise GPS location
        });
      },
      async (error) => {
        console.log('Precise location failed:', error.message);
        
        // Try IP-based location as fallback
        const approxLocation = await getApproximateLocation();
        if (approxLocation) {
          console.log('Using approximate location as fallback');
          setUserLocation(approxLocation);
        } else {
          console.log('No location data available');
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
    console.log('User accepted cookies with email:', email);
    console.log('User location at acceptance:', userLocation);
    
    try {
      // Set cookies accepted
      setCookie('cookiesAccepted', 'true', 365);
      
      // If we don't have any location yet, try IP-based as final fallback
      let finalLocation = userLocation;
      if (!finalLocation) {
        finalLocation = await getApproximateLocation();
        if (finalLocation) {
          setUserLocation(finalLocation);
        }
      }

      // Initialize visitor with available location data
      await initializeVisitorInDB(visitorUUID, finalLocation);
      
      // Start session with location info
      await startSession({
        cookiesAccepted: true,
        marketingEmails: !!email,
        emailProvided: !!email,
        locationCaptured: !!finalLocation,
        latitude: finalLocation?.latitude,
        longitude: finalLocation?.longitude,
        locationAccuracy: finalLocation?.accuracy || 'none',
        city: finalLocation?.city,
        country: finalLocation?.country
      });

      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }

      setShowCookies(false);
    } catch (error) {
      console.error('Error in handleAcceptCookies:', error);
      setCookie('cookiesAccepted', 'true', 365);
      if (email) {
        setCookie('marketingEmails', 'true', 365);
      }
      setShowCookies(false);
    }
  };

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
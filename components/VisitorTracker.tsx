"use client";

import { useEffect, useState } from 'react';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useUser } from '@/contexts/UserContext';
import Cookies from './SaveCookies';
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

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

interface GeolocationService {
  name: string;
  url: string;
  token?: string;
  mapper: (data: any) => Partial<EnhancedLocation>;
}

interface GeolocationResult {
  service: string;
  success: boolean;
  data?: Partial<EnhancedLocation>;
  error?: string;
}

export default function VisitorTracker() {
  const [visitorUUID, setVisitorUUID] = useState<string>('');
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<EnhancedLocation | null>(null);
  const { startSession, endSession, trackPageView } = useVisitorTracking(visitorUUID);
  const { user } = useUser();
  const { toast, showToast } = useToast();

  // Enhanced IP geolocation services configuration
  const geolocationServices: GeolocationService[] = [
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/json/',
      mapper: (data) => ({
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
      name: 'ip-api.com',
      url: 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query',
      mapper: (data) => ({
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        country: data.country,
        region: data.regionName,
        isp: data.isp,
        timezone: data.timezone
      })
    },
    {
      name: 'ipwhois',
      url: 'https://ipwho.is/',
      mapper: (data) => ({
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

  // Enhanced IP-based location with multiple services
  const getEnhancedLocation = async (): Promise<EnhancedLocation | null> => {
    
    try {
      // Try all services in parallel with timeout
      const locationPromises = geolocationServices.map(async (service): Promise<GeolocationResult> => {
        try {
          const response = await fetchWithTimeout(service.url, 5000);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return {
            service: service.name,
            success: true,
            data: service.mapper(data)
          };
        } catch (error) {
          return {
            service: service.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const results = await Promise.all(locationPromises);
      
      const successfulResults = results
        .filter((result): result is GeolocationResult & { success: true; data: Partial<EnhancedLocation> } => 
          result.success && result.data !== undefined && result.data.latitude !== undefined && result.data.longitude !== undefined
        )
        .map(result => result.data);

      if (successfulResults.length === 0) {
        return null;
      }

      // Use consensus algorithm to find the best location
      const bestLocation = calculateBestLocation(successfulResults);
      return bestLocation;

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

  // Consensus algorithm to find the most accurate location
  const calculateBestLocation = (locations: Partial<EnhancedLocation>[]): EnhancedLocation => {
    if (locations.length === 1) {
      const location = locations[0];
      return {
        latitude: location.latitude!,
        longitude: location.longitude!,
        city: location.city,
        country: location.country,
        region: location.region,
        accuracy: 'medium',
        accuracy_radius: 10000,
        source: 'ip-single',
        confidence: 0.7,
        isp: location.isp,
        timezone: location.timezone
      };
    }

    // Group locations by proximity (within 0.1 degrees ~11km)
    const locationGroups: Partial<EnhancedLocation>[][] = [];
    
    locations.forEach(location => {
      let addedToGroup = false;
      
      for (const group of locationGroups) {
        const groupAvg = calculateGroupCenter(group);
        const distance = calculateDistance(
          groupAvg.latitude, groupAvg.longitude,
          location.latitude!, location.longitude!
        );
        
        if (distance < 0.1) { // ~11km radius
          group.push(location);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        locationGroups.push([location]);
      }
    });

    // Find the largest group (consensus)
    const largestGroup = locationGroups.reduce((largest, group) => 
      group.length > largest.length ? group : largest, locationGroups[0]
    );

    // Calculate center of the consensus group
    const center = calculateGroupCenter(largestGroup);
    
    // Determine accuracy based on consensus and data quality
    const accuracy = determineAccuracy(largestGroup, center);
    const confidence = Math.min(0.95, 0.5 + (largestGroup.length * 0.15));
    
    // Use the most detailed location data from the consensus group
    const bestData = largestGroup.reduce((best, current) => {
      const currentScore = calculateDataQualityScore(current);
      const bestScore = calculateDataQualityScore(best);
      return currentScore > bestScore ? current : best;
    }, largestGroup[0]);

    return {
      latitude: center.latitude,
      longitude: center.longitude,
      city: bestData.city,
      country: bestData.country,
      region: bestData.region,
      accuracy: accuracy.level,
      accuracy_radius: accuracy.radius,
      source: `ip-consensus-${largestGroup.length}`,
      confidence: confidence,
      isp: bestData.isp,
      timezone: bestData.timezone
    };
  };

  // Helper functions for consensus algorithm
  const calculateGroupCenter = (group: Partial<EnhancedLocation>[]): { latitude: number; longitude: number } => {
    const avgLat = group.reduce((sum, loc) => sum + loc.latitude!, 0) / group.length;
    const avgLon = group.reduce((sum, loc) => sum + loc.longitude!, 0) / group.length;
    return { latitude: avgLat, longitude: avgLon };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Simple Euclidean distance for small areas (good enough for consensus)
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
  };

  const calculateDataQualityScore = (location: Partial<EnhancedLocation>): number => {
    let score = 0;
    if (location.city) score += 2;
    if (location.region) score += 1;
    if (location.country) score += 1;
    if (location.isp) score += 1;
    if (location.timezone) score += 1;
    return score;
  };

  const determineAccuracy = (group: Partial<EnhancedLocation>[], center: { latitude: number; longitude: number }) => {
    const groupSize = group.length;
    
    // Calculate spread of the group
    const maxDistance = Math.max(...group.map(loc => 
      calculateDistance(center.latitude, center.longitude, loc.latitude!, loc.longitude!)
    ));

    if (groupSize >= 2 && maxDistance < 0.01) { // ~1.1km spread
      return { level: 'high' as const, radius: 5000 }; // ~5km radius
    } else if (groupSize >= 2 && maxDistance < 0.05) { // ~5.5km spread
      return { level: 'medium' as const, radius: 15000 }; // ~15km radius
    } else if (groupSize >= 2) {
      return { level: 'medium' as const, radius: 25000 }; // ~25km radius
    } else {
      return { level: 'low' as const, radius: 50000 }; // ~50km radius
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
    
    if (!cookiesAccepted) {
      setShowCookies(true);
      requestUserLocation();
    } else {
      if (!userLocation) {
        const enhancedLocation = await getEnhancedLocation();
        if (enhancedLocation) {
          setUserLocation(enhancedLocation);
        }
      }
      await initializeVisitorInDB(uuid, userLocation);
      await startSession({
        locationCaptured: !!userLocation,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        locationAccuracy: userLocation?.accuracy || 'unknown',
        locationConfidence: userLocation?.confidence,
        locationSource: userLocation?.source
      });
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
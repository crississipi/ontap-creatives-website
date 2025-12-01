// hooks/useLocationTracking.ts
import { useState, useCallback, useRef } from 'react';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  city?: string;
  region?: string;
  country?: string;
  method: 'gps' | 'ip' | null;
  error: string | null;
}

interface UseLocationTracking {
  location: LocationData | null;
  loading: boolean;
  requestLocation: () => Promise<void>;
}

/**
 * Clean location tracking hook that:
 * 1. Asks for GPS permission first
 * 2. Falls back to IP geolocation if denied/not available
 * 3. Returns location data and loading state
 */
export const useLocationTracking = (): UseLocationTracking => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isRequestingRef = useRef<boolean>(false);

  /**
   * Request GPS location from browser
   */
  const getGPSLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Reverse geocoding to get city/region/country (optional enhancement)
          // For now, we'll just return coordinates
          resolve({
            latitude,
            longitude,
            method: 'gps',
            error: null
          });
        },
        (error) => {
          // User denied or error occurred
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  /**
   * Get location from IP address
   */
  const getIPLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      const response = await fetch('/api/geolocation/ip');
      
      if (!response.ok) {
        throw new Error('IP location failed');
      }

      const data = await response.json();
      
      if (data.error) {
        return null;
      }

      return {
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        city: data.city,
        region: data.region,
        country: data.country,
        method: 'ip',
        error: null
      };
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * Request location - tries GPS first, then IP fallback
   */
  const requestLocation = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequestingRef.current) return;
    
    isRequestingRef.current = true;
    setLoading(true);

    try {
      // Step 1: Try GPS location first
      const gpsLocation = await getGPSLocation();
      
      if (gpsLocation) {
        // GPS location obtained successfully
        setLocation(gpsLocation);
        setLoading(false);
        isRequestingRef.current = false;
        return;
      }

      // Step 2: Fallback to IP geolocation
      const ipLocation = await getIPLocation();
      
      if (ipLocation) {
        setLocation(ipLocation);
      } else {
        // Failed to get any location
        setLocation({
          latitude: null,
          longitude: null,
          method: null,
          error: 'Failed to determine location'
        });
      }
    } catch (error) {
      setLocation({
        latitude: null,
        longitude: null,
        method: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  }, [getGPSLocation, getIPLocation]);

  return {
    location,
    loading,
    requestLocation
  };
};


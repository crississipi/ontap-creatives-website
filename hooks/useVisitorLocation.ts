// hooks/useVisitorLocation.ts
import { useState, useEffect } from 'react';

interface VisitorLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  method: 'gps' | 'ip' | null;
}

export const useVisitorLocation = () => {
  const [location, setLocation] = useState<VisitorLocation>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
    method: null
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        // First try to get GPS location
        const gpsLocation = await getGPSLocation();
        if (gpsLocation) {
          setLocation({
            ...gpsLocation,
            loading: false,
            method: 'gps'
          });
          return;
        }

        // Fallback to IP-based location
        const ipLocation = await getIPLocation();
        setLocation({
          ...ipLocation,
          loading: false,
          method: ipLocation.latitude ? 'ip' : null
        });
      } catch (error) {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to get location'
        }));
      }
    };

    getLocation();
  }, []);

  return location;
};

const getGPSLocation = (): Promise<VisitorLocation> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: false,
        error: 'Geolocation not supported',
        method: null
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          method: 'gps'
        });
      },
      (error) => {
        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          loading: false,
          error: error.message,
          method: null
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

const getIPLocation = async (): Promise<VisitorLocation> => {
  try {
    const response = await fetch('/api/geolocation/ip');
    if (!response.ok) throw new Error('IP location failed');
    
    const data = await response.json();
    
    return {
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      accuracy: null, // IP location doesn't have accuracy
      loading: false,
      error: data.error || null,
      method: 'ip'
    };
  } catch (error) {
    return {
      latitude: null,
      longitude: null,
      accuracy: null,
      loading: false,
      error: 'IP location failed',
      method: null
    };
  }
};
import { useRef, useEffect } from 'react'

interface SessionMetadata {
  [key: string]: any
}

interface VisitorTrackingHook {
  startSession: (metadata?: SessionMetadata) => Promise<boolean>
  endSession: () => Promise<void>
  trackPageView: (metadata?: SessionMetadata) => Promise<void>
}

// Cookie utility
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const useVisitorTracking = (visitorUUID: string): VisitorTrackingHook => {
  const sessionStartTime = useRef<number | null>(null)
  const currentSessionId = useRef<number | null>(null)
  const isTracking = useRef<boolean>(false)

  // End session when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStartTime.current && currentSessionId.current) {
        const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
        const sessionData = {
          sessionID: currentSessionId.current,
          dateLeft: new Date().toISOString(),
          duration: duration
        }
        
        navigator.sendBeacon('/api/visit-session/end', JSON.stringify(sessionData))
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionStartTime.current && currentSessionId.current) {
        endSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (sessionStartTime.current) {
        endSession()
      }
    }
  }, [])

  const startSession = async (metadata: SessionMetadata = {}): Promise<boolean> => {
    const cookiesAccepted = getCookie('cookiesAccepted')
    
    if (!cookiesAccepted || !visitorUUID) {
      return false;
    }

    sessionStartTime.current = Date.now()

    const sessionData = {
      visitorUUID
    }

    try {
      const response = await fetch('/api/visit-session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      })

      if (response.ok) {
        const result = await response.json()
        
        currentSessionId.current = result.sessionID
        isTracking.current = true
        return true;
      } else {
        const errorText = await response.text();
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  const endSession = async (): Promise<void> => {
    if (!sessionStartTime.current || !currentSessionId.current) {
      return;
    }

    const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000)

    const sessionData = {
      sessionID: currentSessionId.current,
      dateLeft: new Date().toISOString(),
      duration: duration
    }

    try {
      const beaconSent = navigator.sendBeacon('/api/visit-session/end', JSON.stringify(sessionData))
      
      if (!beaconSent) {
        await fetch('/api/visit-session/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
          keepalive: true
        })
      }
      
      sessionStartTime.current = null
      currentSessionId.current = null
      isTracking.current = false
    } catch (error) {
    }
  }

  const trackPageView = async (metadata: SessionMetadata = {}): Promise<void> => {
    const cookiesAccepted = getCookie('cookiesAccepted')
    if (!cookiesAccepted || !visitorUUID) {
      return;
    }

    if (!sessionStartTime.current) {
      await startSession(metadata)
    }
    // For now, we just ensure session is started
    // No need to update session on every page view since we track by day
  }

  return {
    startSession,
    endSession,
    trackPageView
  }
}
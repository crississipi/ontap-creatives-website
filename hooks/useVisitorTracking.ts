import { useRef, useEffect } from 'react'

interface SessionMetadata {
  [key: string]: any
}

interface VisitorTrackingHook {
  startSession: (metadata?: SessionMetadata) => Promise<boolean>
  endSession: () => Promise<void>
  trackPageView: (metadata?: SessionMetadata) => Promise<void>
}

export const useVisitorTracking = (visitorUUID: string): VisitorTrackingHook => {
  const sessionStartTime = useRef<number | null>(null)
  const currentSessionId = useRef<number | null>(null)
  const isTracking = useRef<boolean>(false)

  // End session when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStartTime.current && currentSessionId.current) {
        console.log('🔍 Page unloading, ending session via sendBeacon');
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
        console.log('🔍 Page hidden, ending session');
        endSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (sessionStartTime.current) {
        console.log('🔍 Component unmounting, ending session');
        endSession()
      }
    }
  }, [])

  const startSession = async (metadata: SessionMetadata = {}): Promise<boolean> => {
    const cookiesAccepted = getCookie('cookiesAccepted')
    console.log('🔍 startSession called - cookiesAccepted:', cookiesAccepted, 'visitorUUID:', visitorUUID);
    
    if (!cookiesAccepted || !visitorUUID) {
      console.log('🔍 Cannot start session - missing cookies acceptance or visitorUUID');
      return false;
    }

    sessionStartTime.current = Date.now()

    const sessionData = {
      visitorUUID,
      pageUrl: window.location.href,
      pageTitle: document.title,
      metadata
    }

    console.log('🔍 Sending session data to API:', sessionData);

    try {
      const response = await fetch('/api/visit-session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      })

      console.log('🔍 API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json()
        console.log('🔍 API response data:', result);
        
        currentSessionId.current = result.sessionID
        isTracking.current = true
        console.log('🔍 Session started successfully:', result.sessionID)
        return true;
      } else {
        const errorText = await response.text();
        console.error('🔍 API error response:', errorText);
        return false;
      }
    } catch (error) {
      console.error('🔍 Failed to start session:', error)
      return false;
    }
  }

  const endSession = async (): Promise<void> => {
    if (!sessionStartTime.current || !currentSessionId.current) {
      console.log('🔍 No active session to end');
      return;
    }

    const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
    console.log('🔍 Ending session, duration:', duration, 'seconds');

    const sessionData = {
      sessionID: currentSessionId.current,
      dateLeft: new Date().toISOString(),
      duration: duration
    }

    try {
      const beaconSent = navigator.sendBeacon('/api/visit-session/end', JSON.stringify(sessionData))
      console.log('🔍 sendBeacon result:', beaconSent);
      
      if (!beaconSent) {
        await fetch('/api/visit-session/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
          keepalive: true
        })
        console.log('🔍 Fallback fetch completed');
      }

      console.log('🔍 Session ended successfully');
      
      sessionStartTime.current = null
      currentSessionId.current = null
      isTracking.current = false
    } catch (error) {
      console.error('🔍 Failed to end session:', error)
    }
  }

  const trackPageView = async (metadata: SessionMetadata = {}): Promise<void> => {
    const cookiesAccepted = getCookie('cookiesAccepted')
    if (!cookiesAccepted || !visitorUUID) {
      console.log('🔍 Cannot track page view - missing cookies or visitorUUID');
      return;
    }

    if (!sessionStartTime.current) {
      console.log('🔍 No active session, starting new one for page view');
      await startSession(metadata)
    } else {
      console.log('🔍 Updating existing session with new page view');
      const sessionData = {
        sessionID: currentSessionId.current,
        pageUrl: window.location.href,
        pageTitle: document.title,
        metadata: { ...metadata, pageView: true }
      }

      try {
        await fetch('/api/visit-session/update-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData)
        })
        console.log('🔍 Page view tracked successfully');
      } catch (error) {
        console.error('🔍 Failed to update session:', error)
      }
    }
  }

  return {
    startSession,
    endSession,
    trackPageView
  }
}

// Cookie utility function
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
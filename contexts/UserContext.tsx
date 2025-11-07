"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  clientID: number
  clientName: string
  email: string
  contactNumber: number
  address: string
}

interface UserContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  loading: boolean
  updateVisitorClient: (clientID: number) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    try {
      // First check localStorage for quick access
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        
        // Update visitor record with clientID when session is restored
        await updateVisitorClient(userData.clientID)
        
        setLoading(false)
        return
      }

      // If no localStorage, check server session
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Update visitor record with clientID
          await updateVisitorClient(data.user.clientID)
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const login = async (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Update visitor record with clientID when user logs in
    await updateVisitorClient(userData.clientID)
  }

  const updateVisitorClient = async (clientID: number): Promise<void> => {
    try {
      const visitorUUID = getCookie('visitorUUID')
      if (visitorUUID) {
        const response = await fetch('/api/visitor/update-client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorUUID,
            clientID
          })
        })
      }
    } catch (error) {
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
    } finally {
      // Always clear client-side state
      setUser(null)
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Clear service worker caches if exists
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      // Force reload to clear any React state
      setTimeout(() => {
        window.location.href = '/' // Redirect to home instead of reload
      }, 100)
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading, updateVisitorClient }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Cookie utility function
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
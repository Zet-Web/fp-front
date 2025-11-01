
import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, authReady } from '@/lib/supabase'
import { Profile } from '@/types/profile'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  // Fetch user profile from profiles table using session from context
  const fetchUserProfile = async (userId: string, sessionToUse: Session) => {
    setProfileLoading(true)
    let profileFetched = false

    // Try to load from local storage first for immediate UI update
    const cachedProfile = localStorage.getItem(`profile_${userId}`)
    if (cachedProfile) {
      try {
        const parsedProfile = JSON.parse(cachedProfile)
        setProfile(parsedProfile)
        console.log('[useAuth] Profile loaded from cache - username:', parsedProfile.username || 'no username')
      } catch (e) {
        console.warn('[useAuth] Failed to parse cached profile, removing bad cache:', e)
        localStorage.removeItem(`profile_${userId}`)
      }
    }

    try {
      if (!sessionToUse?.access_token) {
        console.error('[useAuth] ERROR: No access token available')
        setProfile(null)
        setProfileLoading(false)
        return
      }

      console.log('[useAuth] Making fetch request with provided session token...')
      // Make a request to the Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-auth-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToUse.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        console.error('[useAuth] ERROR: Edge Function returned error:', response.status, errorData.error)
        setProfile(null)
        setProfileLoading(false)
        return
      }

      const data = await response.json()
      setProfile(data)
      profileFetched = true

      // Save to cache for future use
      localStorage.setItem(`profile_${userId}`, JSON.stringify(data))
      console.log('[useAuth] Profile cached for user:', userId)

    } catch (error) {
      console.error('[useAuth] EXCEPTION: Failed to fetch profile:', error)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    let isSubscribed = true

    const initAuth = async () => {
      try {
        console.log('[Auth Init] Starting initial session hydration')
        const initialSession = await authReady

        if (!isSubscribed) return

        if (initialSession) {
          console.log('[Auth Init] Initial session hydrated: Active session')
          setSession(initialSession)
          setUser(initialSession.user)
          await fetchUserProfile(initialSession.user.id, initialSession)
        } else {
          console.log('[Auth Init] No initial session found')
          setSession(null)
          setUser(null)
          setProfile(null)
        }

        setInitialLoadComplete(true)
        console.log('[Auth Init] Initial session loaded from authReady')
      } catch (error) {
        console.error('[Auth Init] Error during auth initialization:', error)
        setInitialLoadComplete(true)
      }
    }

    initAuth()

    // Listen for auth changes (but don't call getSession again)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isSubscribed) return

        console.log('[useAuth] Auth state change:', event)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('[useAuth] User signed in')
            setSession(newSession)
            setUser(newSession?.user ?? null)
            // Fetch profile for newly signed in user
            if (newSession?.user) {
              (async () => {
                await fetchUserProfile(newSession.user.id, newSession)
              })()
            }
            break
          case 'SIGNED_OUT':
            console.log('[useAuth] User signed out')
            setSession(null)
            setUser(null)
            setProfile(null)
            break
          case 'TOKEN_REFRESHED':
            console.log('[useAuth] Token refreshed')
            setSession(newSession)
            setUser(newSession?.user ?? null)
            break
          case 'USER_UPDATED':
            console.log('[useAuth] User updated')
            setSession(newSession)
            setUser(newSession?.user ?? null)
            break
          default:
            setSession(newSession)
            setUser(newSession?.user ?? null)
            break
        }
      }
    )

    return () => {
      isSubscribed = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    // Clear cached profile data on sign out
    if (user?.id) {
      localStorage.removeItem(`profile_${user.id}`)
      
    }
    
    console.log('[useAuth] Initiating sign out...')
    
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[useAuth] Error signing out:', error)
    } else {
   
    }
  }

  // Derive loading state - loading until initial load completes OR while fetching profile
  const loading = !initialLoadComplete || (!!user && profileLoading)

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}

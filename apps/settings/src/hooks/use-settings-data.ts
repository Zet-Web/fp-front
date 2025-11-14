import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface UserSettings {
  timezone: string
  theme_mode: 'light' | 'dark' | 'system'
}

interface SettingsState {
  settings: UserSettings | null
  isLoading: boolean
  error: string | null
  hasUnsavedChanges: boolean
}

interface TimezoneOption {
  value: string
  label: string
  region: string
  city: string
  offset: string
}

// Filter out confusing or administrative timezone identifiers
function isUserFriendlyTimezone(ianaId: string): boolean {
  // Filter out administrative/legacy timezones
  const excludePrefixes = ['Etc/', 'SystemV/', 'posix/', 'right/']
  const excludeExact = [
    'EST', 'HST', 'MST', 'PST', 'CST', 'AST', 'BST', 'CDT', 'EDT', 'MDT', 'PDT',
    'Eire', 'GB', 'GMT', 'Israel', 'Jamaica', 'ROC', 'W-SU', 'WET', 'Zulu',
    'EST5EDT', 'CST6CDT', 'MST7MDT', 'PST8PDT'
  ]
  
  // Check if timezone starts with excluded prefixes
  if (excludePrefixes.some(prefix => ianaId.startsWith(prefix))) {
    return false
  }
  
  // Check if timezone is in excluded exact matches
  if (excludeExact.includes(ianaId)) {
    return false
  }
  
  return true
}

// Generate user-friendly timezone labels using native Intl API
function getFriendlyTimezoneLabel(ianaId: string): TimezoneOption {
  try {
    const now = new Date()
    
    // Get UTC offset using Intl.DateTimeFormat
    const offsetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaId,
      timeZoneName: 'longOffset'
    })
    const offsetParts = offsetFormatter.formatToParts(now)
    const offsetPart = offsetParts.find(part => part.type === 'timeZoneName')
    const offset = offsetPart ? offsetPart.value.replace('GMT', 'UTC') : 'UTC+00:00'
    
    // Extract region and city from IANA ID
    const parts = ianaId.split('/')
    const region = parts.length >= 2 ? parts[0] : 'Unknown'
    const city = parts.length >= 2 ? parts[parts.length - 1].replace(/_/g, ' ') : ianaId
    
    // Create user-friendly label: "Region (City) UTC±XX:XX"
    const label = `${ianaId} ${offset}`
    
    return {
      value: ianaId,
      label,
      region,
      city,
      offset
    }
  } catch (error) {
    console.warn(`Failed to process timezone ${ianaId}:`, error)
    return {
      value: ianaId,
      label: ianaId,
      region: 'Unknown',
      city: ianaId,
      offset: '+00:00'
    }
  }
}

export function useSettingsData(session: Session | null) {
  const [settingsState, setSettingsState] = useState<SettingsState>({
    settings: null,
    isLoading: true,
    error: null,
    hasUnsavedChanges: false
  })

  const [allTimezones, setAllTimezones] = useState<TimezoneOption[]>([])

  useEffect(() => {
    const initializeSettingsData = async () => {
      try {
        console.log('🚀 [Settings] Initializing settings data...')
        
        // Generate timezone list using native browser API
        if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
          try {
            const timezoneNames = Intl.supportedValuesOf('timeZone')
            const filteredTimezones = timezoneNames
              .filter(isUserFriendlyTimezone)
              .map(getFriendlyTimezoneLabel)
              .sort((a, b) => a.label.localeCompare(b.label))
            
            setAllTimezones(filteredTimezones)
            console.log(`✅ [Settings] Generated ${filteredTimezones.length} user-friendly timezones`)
          } catch (error) {
            console.warn('⚠️ [Settings] Failed to generate timezone list:', error)
            // Fallback to basic list
            setAllTimezones([
              { value: 'UTC', label: 'UTC (Coordinated Universal Time) UTC+00:00', region: 'UTC', city: 'UTC', offset: '+00:00' },
              { value: 'America/New_York', label: 'America (New York) UTC-05:00', region: 'America', city: 'New York', offset: '-05:00' },
              { value: 'Europe/London', label: 'Europe (London) UTC+00:00', region: 'Europe', city: 'London', offset: '+00:00' }
            ])
          }
        } else {
          console.warn('⚠️ [Settings] Intl.supportedValuesOf not available, using fallback timezone list')
          setAllTimezones([
            { value: 'UTC', label: 'UTC (Coordinated Universal Time) UTC+00:00', region: 'UTC', city: 'UTC', offset: '+00:00' },
            { value: 'America/New_York', label: 'America (New York) UTC-05:00', region: 'America', city: 'New York', offset: '-05:00' },
            { value: 'Europe/London', label: 'Europe (London) UTC+00:00', region: 'Europe', city: 'London', offset: '+00:00' }
          ])
        }

        console.log('📡 [Settings] About to fetch user settings...')
        // Fetch real user settings from Supabase
        await fetchUserSettings(session)

      } catch (error) {
        console.error('❌ [Settings] Failed to initialize settings data:', error)
        setSettingsState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize settings system'
        }))
      }
    }

    initializeSettingsData()
  }, [session])

  const fetchUserSettings = async (session: Session | null) => {
    try {
      console.log('🔍 [Settings] Starting fetchUserSettings with provided session')

      if (!session?.user) {
        console.warn('⚠️ [Settings] No authenticated user found')
        setSettingsState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Please log in to access settings'
        }))
        return
      }

      console.log('🔍 [Settings] User authenticated, calling SQL function...')

      // Call SQL function to fetch settings
      const { data, error } = await supabase
        .rpc('get_user_settings')

      console.log('🔍 [Settings] RPC response:', { data, error })

      if (error) {
        console.error('❌ [Settings] RPC returned error:', error)
        throw new Error(error.message || 'Failed to fetch settings')
      }

      if (!data || data.length === 0) {
        console.error('❌ [Settings] No settings data received')
        setSettingsState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No settings data received'
        }))
        return
      }

      console.log('✅ [Settings] Successfully fetched settings:', data[0])

      // Update settings state with fetched data
      const userSettings: UserSettings = {
        timezone: data[0].timezone || 'UTC',
        theme_mode: (data[0].theme_mode as 'light' | 'dark' | 'system') || 'system'
      }

      console.log('✅ [Settings] Processed user settings:', userSettings)

      setSettingsState(prev => ({
        ...prev,
        settings: userSettings,
        isLoading: false,
        error: null
      }))

    } catch (error) {
      console.error('❌ [Settings] Failed to fetch user settings:', error)
      setSettingsState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load settings'
      }))
    }
  }

  const updateSettings = (updatedData: Partial<UserSettings>) => {
    if (settingsState.settings) {
      const newSettings = { ...settingsState.settings, ...updatedData }
      
      // Update local state
      setSettingsState(prev => ({
        ...prev,
        settings: newSettings,
        hasUnsavedChanges: true
      }))
    }
  }

  const saveChanges = async (session: Session | null) => {
    if (!settingsState.settings) {
      throw new Error('No settings to save')
    }

    try {
      if (!session?.user) {
        throw new Error('Authentication required to save settings')
      }

      // Call SQL function to update settings
      const { data, error } = await supabase
        .rpc('update_user_settings', {
          p_timezone: settingsState.settings.timezone,
          p_theme_mode: settingsState.settings.theme_mode
        })

      if (error) {
        throw new Error(error.message || 'Failed to save settings')
      }

      console.log('Settings saved successfully:', data)
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    } finally {
      // Re-fetch settings from database to reset to last saved state
      await fetchUserSettings(session)
      setSettingsState(prev => ({
        ...prev,
        hasUnsavedChanges: false
      }))
    }
  }

  const resetChanges = async (session: Session | null) => {
    // Re-fetch settings from database to reset to last saved state
    await fetchUserSettings(session)
    setSettingsState(prev => ({
      ...prev,
      hasUnsavedChanges: false
    }))
  }

  return {
    ...settingsState,
    allTimezones,
    updateSettings,
    saveChanges,
    resetChanges
  }
}
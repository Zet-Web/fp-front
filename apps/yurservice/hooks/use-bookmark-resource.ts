// Hook for managing YurService resource bookmarks with optimistic updates

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface UseBookmarkResourceReturn {
  savedResourceIds: Set<number>
  isLoading: boolean
  toggleBookmark: (resourceId: number) => Promise<void>
}

export function useBookmarkResource(): UseBookmarkResourceReturn {
  const { user } = useAuth()
  const { toast } = useToast()
  const [savedResourceIds, setSavedResourceIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const fetchSavedResources = useCallback(async () => {
    if (!user) {
      setSavedResourceIds(new Set())
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_saved_yurservice')
        .select('resource_id')
        .eq('user_id', user.id)

      if (error) throw error

      const ids = new Set(data?.map(item => item.resource_id) || [])
      setSavedResourceIds(ids)
    } catch (error) {
      console.error('Failed to fetch saved resources:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchSavedResources()
  }, [fetchSavedResources])

  const toggleBookmark = useCallback(async (resourceId: number) => {
    const isSaved = savedResourceIds.has(resourceId)

    setSavedResourceIds(prev => {
      const next = new Set(prev)
      if (isSaved) {
        next.delete(resourceId)
      } else {
        next.add(resourceId)
      }
      return next
    })

    if (!user) {
      toast({
        title: isSaved ? "Resource removed" : "Resource saved",
        description: isSaved
          ? "Resource has been removed from your saved list (test mode)"
          : "Resource has been added to your saved list (test mode)",
      })
      return
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('user_saved_yurservice')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId)

        if (error) throw error

        toast({
          title: "Resource removed",
          description: "Resource has been removed from your saved list",
        })
      } else {
        const { error } = await supabase
          .from('user_saved_yurservice')
          .insert({
            user_id: user.id,
            resource_id: resourceId,
          })

        if (error) throw error

        toast({
          title: "Resource saved",
          description: "Resource has been added to your saved list",
        })
      }
    } catch (error) {
      setSavedResourceIds(prev => {
        const next = new Set(prev)
        if (isSaved) {
          next.add(resourceId)
        } else {
          next.delete(resourceId)
        }
        return next
      })

      toast({
        title: "Failed to update",
        description: "Could not update your saved resources. Please try again.",
        variant: "destructive",
      })

      console.error('Failed to toggle bookmark:', error)
    }
  }, [user, savedResourceIds, toast])

  return {
    savedResourceIds,
    isLoading,
    toggleBookmark,
  }
}

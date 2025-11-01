// Hook for fetching YurService resources and regions from database

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { YurServiceResource, Region } from '../types/database'

interface UseYurServiceDataReturn {
  resources: YurServiceResource[]
  regions: Region[]
  isLoading: boolean
  error: string | null
}

export function useYurServiceData(): UseYurServiceDataReturn {
  const [resources, setResources] = useState<YurServiceResource[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        const [resourcesResult, regionsResult] = await Promise.all([
          supabase
            .from('app_yurservice_list')
            .select(`
              *,
              region:list_region(*)
            `)
            .order('order', { ascending: false, nullsFirst: false })
            .order('title', { ascending: true }),
          supabase
            .from('list_region')
            .select('*')
            .order('name', { ascending: true })
        ])

        if (resourcesResult.error) {
          throw new Error(resourcesResult.error.message)
        }

        if (regionsResult.error) {
          throw new Error(regionsResult.error.message)
        }

        setResources(resourcesResult.data || [])
        setRegions(regionsResult.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching YurService data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { resources, regions, isLoading, error }
}

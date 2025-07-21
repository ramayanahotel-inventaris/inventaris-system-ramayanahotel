"use client"

import { useEffect, useRef } from "react"

interface DataSyncOptions {
  refreshData: () => Promise<void>
  intervalMs: number
  enabled: boolean
}

export function useDataSync({ refreshData, intervalMs, enabled }: DataSyncOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Set up periodic sync - default to 30 minutes (1800000ms)
    const syncInterval = intervalMs || 1800000 // 30 minutes default

    intervalRef.current = setInterval(() => {
      refreshData()
    }, syncInterval)

    // Sync when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refreshData, intervalMs, enabled])
}

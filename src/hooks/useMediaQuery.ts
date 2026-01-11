import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
  }

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  return useSyncExternalStore(subscribe, getSnapshot)
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)')
}

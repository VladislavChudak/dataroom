import { useEffect, useMemo } from 'react'

export function useObjectUrl(blob: Blob | null | undefined) {
  const url = useMemo(() => {
    if (!blob) return null
    return URL.createObjectURL(blob)
  }, [blob])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  return url
}

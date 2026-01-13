import { useState, useCallback, useRef } from 'react'
import { useFileUpload } from './useFileUpload'

interface UseFileDropZoneProps {
  dataroomId: string
  folderId: string
  enabled?: boolean
}

export function useFileDropZone({ dataroomId, folderId, enabled = true }: UseFileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const { handleFiles: uploadFiles } = useFileUpload({ dataroomId, folderId })

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!enabled) return
      await uploadFiles(files)
    },
    [enabled, uploadFiles]
  )

  const handleDragEnter = useCallback(
    (e: Event) => {
      const dragEvent = e as globalThis.DragEvent
      dragEvent.preventDefault()
      dragEvent.stopPropagation()

      if (!enabled) return

      // Check if dragging files (not text or other data)
      if (dragEvent.dataTransfer?.types.includes('Files')) {
        dragCounterRef.current++
        if (dragCounterRef.current === 1) {
          setIsDragging(true)
        }
      }
    },
    [enabled]
  )

  const handleDragLeave = useCallback(
    (e: Event) => {
      const dragEvent = e as globalThis.DragEvent
      dragEvent.preventDefault()
      dragEvent.stopPropagation()

      if (!enabled) return

      dragCounterRef.current--
      if (dragCounterRef.current === 0) {
        setIsDragging(false)
      }
    },
    [enabled]
  )

  const handleDragOver = useCallback(
    (e: Event) => {
      const dragEvent = e as globalThis.DragEvent
      dragEvent.preventDefault()
      dragEvent.stopPropagation()

      if (!enabled) return

      // Set the drop effect to indicate this is a copy operation
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.dropEffect = 'copy'
      }
    },
    [enabled]
  )

  const handleDrop = useCallback(
    async (e: Event) => {
      const dragEvent = e as globalThis.DragEvent
      dragEvent.preventDefault()
      dragEvent.stopPropagation()

      if (!enabled) return

      dragCounterRef.current = 0
      setIsDragging(false)

      const files = dragEvent.dataTransfer?.files
      if (files && files.length > 0) {
        await handleFiles(files)
      }
    },
    [enabled, handleFiles]
  )

  // Set up event listeners on mount
  const setupDropZone = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled) return

      element.addEventListener('dragenter', handleDragEnter)
      element.addEventListener('dragleave', handleDragLeave)
      element.addEventListener('dragover', handleDragOver)
      element.addEventListener('drop', handleDrop)

      return () => {
        element.removeEventListener('dragenter', handleDragEnter)
        element.removeEventListener('dragleave', handleDragLeave)
        element.removeEventListener('dragover', handleDragOver)
        element.removeEventListener('drop', handleDrop)
      }
    },
    [enabled, handleDragEnter, handleDragLeave, handleDragOver, handleDrop]
  )

  return {
    isDragging,
    setupDropZone,
    handleFiles,
  }
}

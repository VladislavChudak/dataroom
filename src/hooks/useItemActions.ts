import { useState } from 'react'
import type { Folder, FileMetadata } from '@/repo/types'

type ItemAction = {
  type: 'rename' | 'delete'
  item: Folder | FileMetadata
  itemType: 'folder' | 'file'
} | null

export function useItemActions() {
  const [action, setAction] = useState<ItemAction>(null)
  const [viewingFile, setViewingFile] = useState<string | null>(null)

  const handleRename = (item: Folder | FileMetadata, itemType: 'folder' | 'file') => {
    setAction({ type: 'rename', item, itemType })
  }

  const handleDelete = (item: Folder | FileMetadata, itemType: 'folder' | 'file') => {
    setAction({ type: 'delete', item, itemType })
  }

  const handleView = (fileId: string) => {
    setViewingFile(fileId)
  }

  const clearAction = () => {
    setAction(null)
  }

  const clearViewingFile = () => {
    setViewingFile(null)
  }

  return {
    action,
    viewingFile,
    handleRename,
    handleDelete,
    handleView,
    clearAction,
    clearViewingFile,
  }
}

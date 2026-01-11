import { useDeleteFolder, useDeleteFile, useCountFolderContents } from '../../hooks/useExplorer'
import type { Folder, FileMetadata } from '@/repo/types'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ActionButton } from '@/components/ui/action-button'
import { AlertTriangle } from 'lucide-react'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Folder | FileMetadata
  itemType: 'folder' | 'file'
  dataroomId: string
  folderId: string
}

export function DeleteDialog({
  open,
  onOpenChange,
  item,
  itemType,
  dataroomId,
  folderId,
}: DeleteDialogProps) {
  const deleteFolder = useDeleteFolder()
  const deleteFile = useDeleteFile()

  const { data: count } = useCountFolderContents(itemType === 'folder' ? item.id : '')

  console.log('count', count)

  const handleDelete = () => {
    if (itemType === 'folder') {
      const folder = item as Folder
      deleteFolder.mutate(
        {
          folderId: folder.id,
          dataroomId,
          parentId: folder.parentId || '',
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      deleteFile.mutate(
        {
          fileId: item.id,
          dataroomId,
          folderId,
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    }
  }

  const isPending = deleteFolder.isPending || deleteFile.isPending

  const getDescription = () => {
    if (itemType === 'file') {
      return `This will permanently delete "${item.name}".`
    }

    if (!count) {
      return `This will permanently delete this folder and all its contents.`
    }

    const parts = []

    // Include the folder being deleted in the count
    const totalFolders = count.folders + 1

    if (totalFolders > 1) {
      parts.push(`${totalFolders} folders`)
    }

    if (count.files > 0) {
      parts.push(`${count.files} ${count.files === 1 ? 'file' : 'files'}`)
    }

    if (parts.length === 0) {
      return `This will permanently delete this folder.`
    }

    return `This will permanently delete ${parts.join(' and ')}.`
  }

  const description = getDescription()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {description} This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <ActionButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              handleDelete()
            }}
            isLoading={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Delete
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

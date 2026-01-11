import { useState } from 'react'
import { useRenameFolder, useRenameFile } from '../../hooks/useExplorer'
import type { Folder, FileMetadata } from '@/repo/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ActionButton } from '@/components/ui/action-button'

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Folder | FileMetadata
  itemType: 'folder' | 'file'
  dataroomId: string
  folderId: string
}

export function RenameDialog({
  open,
  onOpenChange,
  item,
  itemType,
  dataroomId,
  folderId,
}: RenameDialogProps) {
  const [name, setName] = useState(item.name)
  const renameFolder = useRenameFolder()
  const renameFile = useRenameFile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || name === item.name) {
      onOpenChange(false)
      return
    }

    if (itemType === 'folder') {
      const folder = item as Folder
      renameFolder.mutate(
        {
          folderId: folder.id,
          name: name.trim(),
          dataroomId,
          parentId: folder.parentId || '',
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      renameFile.mutate(
        {
          fileId: item.id,
          name: name.trim(),
          dataroomId,
          folderId,
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    }
  }

  const isPending = renameFolder.isPending || renameFile.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]" key={item.id}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
            <DialogDescription>Enter a new name for this {itemType}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={255}
              onFocus={(e) => {
                // Select filename without extension
                const dotIndex = e.target.value.lastIndexOf('.')
                if (dotIndex > 0) {
                  e.target.setSelectionRange(0, dotIndex)
                } else {
                  e.target.select()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <ActionButton
              type="submit"
              disabled={!name.trim() || name === item.name}
              isLoading={isPending}
            >
              Save
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { useCreateFolder } from '../../hooks/useExplorer'
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

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataroomId: string
  parentId: string
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  dataroomId,
  parentId,
}: CreateFolderDialogProps) {
  const [name, setName] = useState('')
  const createFolder = useCreateFolder()

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('')
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createFolder.mutate(
      { dataroomId, parentId, name: name.trim() },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>Create a new folder to organize your files</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Untitled folder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={255}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createFolder.isPending}
            >
              Cancel
            </Button>
            <ActionButton type="submit" disabled={!name.trim()} isLoading={createFolder.isPending}>
              Create
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

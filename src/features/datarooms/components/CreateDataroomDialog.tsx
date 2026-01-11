import { useState } from 'react'
import { useCreateDataroom } from '../hooks/useDatarooms'
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

interface CreateDataroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDataroomDialog({ open, onOpenChange }: CreateDataroomDialogProps) {
  const [name, setName] = useState('')
  const createDataroom = useCreateDataroom()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createDataroom.mutate(name.trim(), {
      onSuccess: () => {
        setName('')
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Dataroom</DialogTitle>
            <DialogDescription>Create a new dataroom to organize your documents</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Dataroom name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={100}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createDataroom.isPending}
            >
              Cancel
            </Button>
            <ActionButton
              className="min-w-24"
              type="submit"
              disabled={!name.trim()}
              isLoading={createDataroom.isPending}
            >
              Create
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

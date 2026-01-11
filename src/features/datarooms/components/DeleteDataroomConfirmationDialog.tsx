import { useGetDataroomById, useDeleteDataroom } from '../hooks/useDatarooms'
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

interface DeleteDataroomConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataroomId: string
}

export function DeleteDataroomConfirmationDialog({
  open,
  onOpenChange,
  dataroomId,
}: DeleteDataroomConfirmationDialogProps) {
  const { data: dataroom } = useGetDataroomById(dataroomId)
  const deleteDataroom = useDeleteDataroom()

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    deleteDataroom.mutate(dataroomId, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const { isPending } = deleteDataroom

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <AlertDialogTitle>Delete {dataroom?.name}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            This will permanently delete this dataroom and all its folders and files. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <ActionButton
            onClick={(e) => handleDelete(e)}
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

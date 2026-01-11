import type { Folder, FileMetadata } from '@/repo/types'
import { RenameDialog } from '@/features/explorer/components/dialogs/RenameDialog'
import { DeleteDialog } from '@/features/explorer/components/dialogs/DeleteDialog'
import { PdfViewerDialog } from '@/features/explorer/components/dialogs/PdfViewerDialog'

interface ItemActionsDialogsProps {
  action: {
    type: 'rename' | 'delete'
    item: Folder | FileMetadata
    itemType: 'folder' | 'file'
  } | null
  viewingFile: string | null
  dataroomId: string
  folderId: string
  onClearAction: () => void
  onClearViewingFile: () => void
}

export function ItemActionsDialogs({
  action,
  viewingFile,
  dataroomId,
  folderId,
  onClearAction,
  onClearViewingFile,
}: ItemActionsDialogsProps) {
  return (
    <>
      {action?.type === 'rename' && (
        <RenameDialog
          open={true}
          onOpenChange={(open) => !open && onClearAction()}
          item={action.item}
          itemType={action.itemType}
          dataroomId={dataroomId}
          folderId={folderId}
        />
      )}

      {action?.type === 'delete' && (
        <DeleteDialog
          open={true}
          onOpenChange={(open) => !open && onClearAction()}
          item={action.item}
          itemType={action.itemType}
          dataroomId={dataroomId}
          folderId={folderId}
        />
      )}

      {viewingFile && <PdfViewerDialog fileId={viewingFile} onClose={onClearViewingFile} />}
    </>
  )
}

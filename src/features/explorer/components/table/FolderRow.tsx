import { memo } from 'react'
import { Folder as FolderIcon } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import { ItemContextMenu } from '../shared/ItemContextMenu'
import { useCalculateFileSize } from '../../hooks/useExplorer'
import { formatBytes } from '@/lib/format'
import type { Folder } from '@/repo/types'

interface FolderRowProps {
  folder: Folder
  dataroomId: string
  onNavigate: (folderId: string) => void
  onRename: () => void
  onDelete: () => void
}

export const FolderRow = memo(function FolderRow({
  folder,
  onNavigate,
  onRename,
  onDelete,
}: FolderRowProps) {
  const { data: fileSize } = useCalculateFileSize(folder.id)

  return (
    <TableRow
      className="table-row-hover cursor-pointer"
      onDoubleClick={() => onNavigate(folder.id)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <FolderIcon className="h-5 w-5 flex-shrink-0 text-[var(--folder-blue)]" />
          <span className="truncate">{folder.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">You</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(folder.updatedAt)}</TableCell>
      <TableCell className="text-muted-foreground">{formatBytes(fileSize || 0)}</TableCell>
      <TableCell>
        <ItemContextMenu item={folder} itemType="folder" onRename={onRename} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  )
})

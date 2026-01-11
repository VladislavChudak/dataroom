import { memo } from 'react'
import { FileText } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatBytes, formatDate } from '@/lib/format'
import { ItemContextMenu } from '../shared/ItemContextMenu'
import type { FileMetadata } from '@/repo/types'

interface FileRowProps {
  file: FileMetadata
  onView: () => void
  onRename: () => void
  onDelete: () => void
}

export const FileRow = memo(function FileRow({ file, onView, onRename, onDelete }: FileRowProps) {
  return (
    <TableRow className="table-row-hover cursor-pointer" onDoubleClick={onView}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 flex-shrink-0 text-[var(--file-red)]" />
          <span className="truncate">{file.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">You</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(file.updatedAt)}</TableCell>
      <TableCell className="text-muted-foreground">{formatBytes(file.size)}</TableCell>
      <TableCell>
        <ItemContextMenu
          item={file}
          itemType="file"
          onRename={onRename}
          onDelete={onDelete}
          onView={onView}
        />
      </TableCell>
    </TableRow>
  )
})

import { memo } from 'react'
import { File, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { formatBytes } from '@/lib/format'
import type { FileMetadata } from '@/repo/types'

interface MobileFileCardProps {
  file: FileMetadata
  onView: () => void
  onRename: () => void
  onDelete: () => void
}

export const MobileFileCard = memo(function MobileFileCard({
  file,
  onView,
  onRename,
  onDelete,
}: MobileFileCardProps) {
  return (
    <div className="bg-card hover:bg-accent/50 rounded-lg border p-3 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 cursor-pointer items-start gap-3" onClick={onView}>
          <File className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
})

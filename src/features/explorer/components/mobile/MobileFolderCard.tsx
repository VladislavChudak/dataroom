import { memo } from 'react'
import { Folder as FolderIcon, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import type { Folder } from '@/repo/types'

interface MobileFolderCardProps {
  folder: Folder
  onNavigate: () => void
  onRename: () => void
  onDelete: () => void
}

export const MobileFolderCard = memo(function MobileFolderCard({
  folder,
  onNavigate,
  onRename,
  onDelete,
}: MobileFolderCardProps) {
  return (
    <div className="bg-card hover:bg-accent/50 rounded-lg border p-3 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 cursor-pointer items-start gap-3" onClick={onNavigate}>
          <FolderIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{folder.name}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

import { MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Folder, FileMetadata } from '@/repo/types'

interface ItemContextMenuProps {
  item: Folder | FileMetadata
  itemType: 'folder' | 'file'
  onRename: () => void
  onDelete: () => void
  onView?: () => void
}

export function ItemContextMenu({ itemType, onRename, onDelete, onView }: ItemContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {itemType === 'file' && onView && (
          <>
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={onRename}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

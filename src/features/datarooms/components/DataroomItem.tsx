import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Dataroom } from '@/repo/types'
import { Folder, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataroomItemProps {
  dataroom: Dataroom
  isActive?: boolean
  onDelete: (dataroomId: string) => void
}

export const DataroomItem = memo(function DataroomItem({ dataroom, isActive, onDelete }: DataroomItemProps) {
  return (
    <div className="flex items-center justify-between">
      <Link to={`/dataroom/${dataroom.id}`} className="flex-1">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 font-normal',
            isActive &&
              'bg-sidebar-accent text-sidebar-accent-foreground border-l-primary border-l-2'
          )}
        >
          <Folder className="h-4 w-4 text-[var(--folder-blue)]" />
          <span className="truncate">{dataroom.name}</span>
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground h-9 w-9 flex-shrink-0"
        onClick={() => onDelete(dataroom.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
})

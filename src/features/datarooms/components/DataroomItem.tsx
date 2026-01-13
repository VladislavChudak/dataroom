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
  totalDatarooms: number
}

export const DataroomItem = memo(function DataroomItem({
  dataroom,
  isActive,
  onDelete,
  totalDatarooms,
}: DataroomItemProps) {
  const showDeleteButton = totalDatarooms > 1

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(dataroom.id)
  }

  return (
    <div className="group relative w-full">
      <Link to={`/dataroom/${dataroom.id}`} className="block w-full">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 font-normal',
            isActive &&
              'bg-sidebar-accent text-sidebar-accent-foreground border-l-primary border-l-2'
          )}
        >
          <Folder className="h-4 w-4 text-[var(--folder-blue)]" />
          <span className="w-[70%] truncate text-left">{dataroom.name}</span>
        </Button>
      </Link>
      {showDeleteButton && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground absolute top-0 right-0 h-9 w-9"
          onClick={(e) => handleDelete(e)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
})

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatarooms } from '../hooks/useDatarooms'
import { Home, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateDataroomDialog } from './CreateDataroomDialog'
import { DeleteDataroomConfirmationDialog } from './DeleteDataroomConfirmationDialog'
import { DataroomItem } from './DataroomItem'
import { NewDataroomButton } from './NewDataroomButton'

interface DataroomSidebarProps {
  activeDataroomId?: string
  isOpen?: boolean
  onClose?: () => void
}

export function DataroomSidebar({
  activeDataroomId,
  isOpen = true,
  onClose,
}: DataroomSidebarProps) {
  const { data: datarooms, isLoading } = useDatarooms()
  const [showCreate, setShowCreate] = useState(false)
  const [dataroomToDelete, setDataroomToDelete] = useState<string | null>(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('dataroom-sidebar')
      const target = e.target as Node
      if (sidebar && !sidebar.contains(target) && window.innerWidth < 1024) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        id="dataroom-sidebar"
        className={`border-border bg-sidebar fixed inset-y-0 left-0 z-50 flex h-full w-60 flex-col border-r transition-transform duration-300 lg:relative ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 lg:hidden">
          <h2 className="text-sm font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <NewDataroomButton onClick={() => setShowCreate(true)} />

        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            <Link to="/" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>

            <Separator className="my-3" />

            <div className="text-muted-foreground px-3 py-2 text-xs font-semibold">
              MY DATAROOMS
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : (
              datarooms?.map((dataroom) => (
                <div key={dataroom.id} onClick={onClose}>
                  <DataroomItem
                    dataroom={dataroom}
                    isActive={activeDataroomId === dataroom.id}
                    onDelete={setDataroomToDelete}
                    totalDatarooms={datarooms.length}
                  />
                </div>
              ))
            )}

            <Separator className="my-3" />
          </div>
        </nav>

        {dataroomToDelete && (
          <DeleteDataroomConfirmationDialog
            open={!!dataroomToDelete}
            onOpenChange={(open) => !open && setDataroomToDelete(null)}
            dataroomId={dataroomToDelete}
          />
        )}
        <CreateDataroomDialog open={showCreate} onOpenChange={setShowCreate} />
      </aside>
    </>
  )
}

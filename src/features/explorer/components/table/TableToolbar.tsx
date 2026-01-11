import { FolderPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadButton } from '../shared/UploadButton'

interface TableToolbarProps {
  dataroomId: string
  folderId: string
  onCreateFolder: () => void
}

export function TableToolbar({ dataroomId, folderId, onCreateFolder }: TableToolbarProps) {
  return (
    <div className="mb-3 flex items-center gap-2 md:mb-4">
      <Button
        onClick={onCreateFolder}
        size="sm"
        variant="outline"
        className="h-8 gap-2 text-xs md:h-9 md:text-sm"
      >
        <FolderPlus className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <span className="xs:inline hidden">New Folder</span>
        <span className="xs:hidden">New</span>
      </Button>
      <UploadButton dataroomId={dataroomId} folderId={folderId}>
        <Button size="sm" className="h-8 gap-2 text-xs md:h-9 md:text-sm">
          <Upload className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Upload
        </Button>
      </UploadButton>
    </div>
  )
}

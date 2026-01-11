import { Folder as FolderIcon, FolderPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadButton } from './UploadButton'

interface EmptyStateProps {
  dataroomId: string
  folderId: string
  onCreateFolder: () => void
}

export function EmptyState({ dataroomId, folderId, onCreateFolder }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-6 md:p-8">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24">
        <FolderIcon className="text-muted-foreground h-10 w-10 md:h-12 md:w-12" />
      </div>
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold md:text-xl">This folder is empty</h3>
        <p className="text-muted-foreground mb-4 px-4 text-xs md:mb-6 md:text-sm">
          Get started by creating a folder or uploading files
        </p>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row md:gap-3">
          <Button onClick={onCreateFolder} className="w-full gap-2 sm:w-auto">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <UploadButton dataroomId={dataroomId} folderId={folderId}>
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </UploadButton>
        </div>
      </div>
    </div>
  )
}

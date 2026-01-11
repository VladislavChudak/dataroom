import { useNavigate } from 'react-router-dom'
import type { Folder, FileMetadata } from '@/repo/types'
import { MobileFolderCard } from './MobileFolderCard'
import { MobileFileCard } from './MobileFileCard'

interface MobileItemsListProps {
  dataroomId: string
  folders: Folder[]
  files: FileMetadata[]
  onFolderRename: (folder: Folder) => void
  onFolderDelete: (folder: Folder) => void
  onFileView: (fileId: string) => void
  onFileRename: (file: FileMetadata) => void
  onFileDelete: (file: FileMetadata) => void
}

export function MobileItemsList({
  dataroomId,
  folders,
  files,
  onFolderRename,
  onFolderDelete,
  onFileView,
  onFileRename,
  onFileDelete,
}: MobileItemsListProps) {
  const navigate = useNavigate()

  return (
    <div className="mt-2 space-y-2">
      {folders.map((folder) => (
        <MobileFolderCard
          key={folder.id}
          folder={folder}
          onNavigate={() => navigate(`/dataroom/${dataroomId}/folder/${folder.id}`)}
          onRename={() => onFolderRename(folder)}
          onDelete={() => onFolderDelete(folder)}
        />
      ))}

      {files.map((file) => (
        <MobileFileCard
          key={file.id}
          file={file}
          onView={() => onFileView(file.id)}
          onRename={() => onFileRename(file)}
          onDelete={() => onFileDelete(file)}
        />
      ))}
    </div>
  )
}

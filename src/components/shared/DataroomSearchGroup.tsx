import { useNavigate } from 'react-router-dom'
import type { Folder, FileMetadata } from '@/repo/types'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FolderRow } from '@/features/explorer/components/table/FolderRow'
import { FileRow } from '@/features/explorer/components/table/FileRow'
import { MobileItemsList } from '@/features/explorer/components/mobile/MobileItemsList'
import { useIsDesktop } from '@/hooks/useMediaQuery'

interface DataroomSearchGroupProps {
  dataroomId: string
  dataroomName: string
  folders: Folder[]
  files: FileMetadata[]
  onFolderRename: (folder: Folder) => void
  onFolderDelete: (folder: Folder) => void
  onFileView: (fileId: string) => void
  onFileRename: (file: FileMetadata) => void
  onFileDelete: (file: FileMetadata) => void
}

export function DataroomSearchGroup({
  dataroomId,
  dataroomName,
  folders,
  files,
  onFolderRename,
  onFolderDelete,
  onFileView,
  onFileRename,
  onFileDelete,
}: DataroomSearchGroupProps) {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const totalItems = folders.length + files.length

  return (
    <div className="mb-4 md:mb-6">
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {dataroomName}
        </Badge>
        <span className="text-muted-foreground text-xs">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Desktop Table View - Only render on desktop */}
      {isDesktop ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Name</TableHead>
              <TableHead className="w-[160px]">Owner</TableHead>
              <TableHead className="w-[140px]">Modified</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[48px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                dataroomId={dataroomId}
                onNavigate={(folderId) => navigate(`/dataroom/${dataroomId}/folder/${folderId}`)}
                onRename={() => onFolderRename(folder)}
                onDelete={() => onFolderDelete(folder)}
              />
            ))}

            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onView={() => onFileView(file.id)}
                onRename={() => onFileRename(file)}
                onDelete={() => onFileDelete(file)}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        /* Mobile Card View - Only render on mobile */
        <MobileItemsList
          dataroomId={dataroomId}
          folders={folders}
          files={files}
          onFolderRename={onFolderRename}
          onFolderDelete={onFolderDelete}
          onFileView={onFileView}
          onFileRename={onFileRename}
          onFileDelete={onFileDelete}
        />
      )}
    </div>
  )
}

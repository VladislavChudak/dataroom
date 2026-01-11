import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Folder, FileMetadata } from '@/repo/types'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateFolderDialog } from '../dialogs/CreateFolderDialog'
import { FolderRow } from './FolderRow'
import { FileRow } from './FileRow'
import { EmptyState } from '../shared/EmptyState'
import { TableToolbar } from './TableToolbar'
import { MobileItemsList } from '../mobile/MobileItemsList'
import { useItemActions } from '@/hooks/useItemActions'
import { ItemActionsDialogs } from '@/components/shared/ItemActionsDialogs'
import { useIsDesktop } from '@/hooks/useMediaQuery'

interface ItemsTableProps {
  dataroomId: string
  folderId: string
  folders: Folder[]
  files: FileMetadata[]
}

export function ItemsTable({ dataroomId, folderId, folders, files }: ItemsTableProps) {
  const navigate = useNavigate()
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const isDesktop = useIsDesktop()
  const {
    action,
    viewingFile,
    handleRename,
    handleDelete,
    handleView,
    clearAction,
    clearViewingFile,
  } = useItemActions()

  const isEmpty = folders.length === 0 && files.length === 0

  if (isEmpty) {
    return (
      <>
        <EmptyState
          dataroomId={dataroomId}
          folderId={folderId}
          onCreateFolder={() => setShowCreateFolder(true)}
        />
        <CreateFolderDialog
          open={showCreateFolder}
          onOpenChange={setShowCreateFolder}
          dataroomId={dataroomId}
          parentId={folderId}
        />
      </>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-4">
        <TableToolbar
          dataroomId={dataroomId}
          folderId={folderId}
          onCreateFolder={() => setShowCreateFolder(true)}
        />

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
                  onRename={() => handleRename(folder, 'folder')}
                  onDelete={() => handleDelete(folder, 'folder')}
                />
              ))}

              {files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onView={() => handleView(file.id)}
                  onRename={() => handleRename(file, 'file')}
                  onDelete={() => handleDelete(file, 'file')}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <MobileItemsList
            dataroomId={dataroomId}
            folders={folders}
            files={files}
            onFolderRename={(folder) => handleRename(folder, 'folder')}
            onFolderDelete={(folder) => handleDelete(folder, 'folder')}
            onFileView={handleView}
            onFileRename={(file) => handleRename(file, 'file')}
            onFileDelete={(file) => handleDelete(file, 'file')}
          />
        )}
      </div>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        dataroomId={dataroomId}
        parentId={folderId}
      />

      <ItemActionsDialogs
        action={action}
        viewingFile={viewingFile}
        dataroomId={dataroomId}
        folderId={folderId}
        onClearAction={clearAction}
        onClearViewingFile={clearViewingFile}
      />
    </div>
  )
}

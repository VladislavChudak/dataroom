import { useState, useMemo, useRef, useEffect } from 'react'
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
import { sortFolderContents, type SortConfig, type SortField } from '@/lib/sorting'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFileDropZone } from '@/hooks/useFileDropZone'
import { FileDropOverlay } from '@/components/shared/FileDropOverlay'

interface ItemsTableProps {
  dataroomId: string
  folderId: string
  folders: Folder[]
  files: FileMetadata[]
}

export function ItemsTable({ dataroomId, folderId, folders, files }: ItemsTableProps) {
  const navigate = useNavigate()
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' })
  const isDesktop = useIsDesktop()
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const {
    action,
    viewingFile,
    handleRename,
    handleDelete,
    handleView,
    clearAction,
    clearViewingFile,
  } = useItemActions()

  // Set up drag and drop file upload
  const { isDragging, setupDropZone } = useFileDropZone({
    dataroomId,
    folderId,
    enabled: true,
  })

  // Setup drop zone on mount
  useEffect(() => {
    return setupDropZone(dropZoneRef.current)
  }, [setupDropZone])

  // Sort folders and files together based on current sort config
  const sortedItems = useMemo(
    () => sortFolderContents(folders, files, sortConfig),
    [folders, files, sortConfig]
  )

  const isEmpty = folders.length === 0 && files.length === 0

  // Handle column header click to change sorting
  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Render sort icon for column headers
  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />
    }
    return sortConfig.order === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    )
  }

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
    <div ref={dropZoneRef} className="flex-1 overflow-auto">
      <FileDropOverlay isVisible={isDragging} />
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
                <TableHead className="w-[50%]">
                  <Button
                    variant="ghost"
                    className="-ml-3 h-8 px-2 font-medium hover:bg-transparent lg:px-3"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {renderSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="w-[160px]">Owner</TableHead>
                <TableHead className="w-[140px]">
                  <Button
                    variant="ghost"
                    className="-ml-3 h-8 px-2 font-medium hover:bg-transparent lg:px-3"
                    onClick={() => handleSort('modified')}
                  >
                    Modified
                    {renderSortIcon('modified')}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    className="-ml-3 h-8 px-2 font-medium hover:bg-transparent lg:px-3"
                    onClick={() => handleSort('size')}
                  >
                    Size
                    {renderSortIcon('size')}
                  </Button>
                </TableHead>
                <TableHead className="w-[48px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) =>
                item.type === 'folder' ? (
                  <FolderRow
                    key={`folder-${item.item.id}`}
                    folder={item.item}
                    dataroomId={dataroomId}
                    onNavigate={(folderId) =>
                      navigate(`/dataroom/${dataroomId}/folder/${folderId}`)
                    }
                    onRename={() => handleRename(item.item, 'folder')}
                    onDelete={() => handleDelete(item.item, 'folder')}
                  />
                ) : (
                  <FileRow
                    key={`file-${item.item.id}`}
                    file={item.item}
                    onView={() => handleView(item.item.id)}
                    onRename={() => handleRename(item.item, 'file')}
                    onDelete={() => handleDelete(item.item, 'file')}
                  />
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <MobileItemsList
            dataroomId={dataroomId}
            sortedItems={sortedItems}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
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

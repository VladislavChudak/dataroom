import { useQuery } from '@tanstack/react-query'
import { repository } from '@/repo/indexedDbRepo'
import type { Folder, FileMetadata } from '@/repo/types'
import { EmptySearchState } from '@/components/shared/EmptySearchState'
import { DataroomSearchGroup } from '@/components/shared/DataroomSearchGroup'
import { useItemActions } from '@/hooks/useItemActions'
import { ItemActionsDialogs } from '@/components/shared/ItemActionsDialogs'

interface SearchResultsProps {
  dataroomId: string
  currentFolderId: string
  folders: Folder[]
  files: FileMetadata[]
  searchQuery: string
}

export function SearchResults({ folders, files, searchQuery }: SearchResultsProps) {
  const {
    action,
    viewingFile,
    handleRename,
    handleDelete,
    handleView,
    clearAction,
    clearViewingFile,
  } = useItemActions()

  // Fetch all datarooms to show names
  const { data: datarooms } = useQuery({
    queryKey: ['datarooms'],
    queryFn: () => repository.listDatarooms(),
  })

  const isEmpty = folders.length === 0 && files.length === 0

  if (isEmpty) {
    return <EmptySearchState searchQuery={searchQuery} />
  }

  const totalResults = folders.length + files.length
  const dataroomMap = new Map(datarooms?.map((d) => [d.id, d.name]))

  // Group results by dataroom
  const groupedResults = new Map<string, { folders: Folder[]; files: FileMetadata[] }>()

  folders.forEach((folder) => {
    if (!groupedResults.has(folder.dataroomId)) {
      groupedResults.set(folder.dataroomId, { folders: [], files: [] })
    }
    groupedResults.get(folder.dataroomId)!.folders.push(folder)
  })

  files.forEach((file) => {
    if (!groupedResults.has(file.dataroomId)) {
      groupedResults.set(file.dataroomId, { folders: [], files: [] })
    }
    groupedResults.get(file.dataroomId)!.files.push(file)
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-3 md:p-4">
        <div className="text-muted-foreground mb-3 text-xs md:text-sm">
          Found {totalResults} {totalResults === 1 ? 'item' : 'items'} matching "{searchQuery}"
          across all datarooms
        </div>

        {Array.from(groupedResults.entries()).map(([drId, { folders, files }]) => (
          <DataroomSearchGroup
            key={drId}
            dataroomId={drId}
            dataroomName={dataroomMap.get(drId) || 'Unknown Dataroom'}
            folders={folders}
            files={files}
            onFolderRename={(folder) => handleRename(folder, 'folder')}
            onFolderDelete={(folder) => handleDelete(folder, 'folder')}
            onFileView={handleView}
            onFileRename={(file) => handleRename(file, 'file')}
            onFileDelete={(file) => handleDelete(file, 'file')}
          />
        ))}
      </div>

      <ItemActionsDialogs
        action={action}
        viewingFile={viewingFile}
        dataroomId={
          action?.itemType === 'folder'
            ? (action.item as Folder).dataroomId
            : action?.itemType === 'file'
              ? (action.item as FileMetadata).dataroomId
              : ''
        }
        folderId={
          action?.itemType === 'folder'
            ? (action.item as Folder).parentId || ''
            : action?.itemType === 'file'
              ? (action.item as FileMetadata).folderId
              : ''
        }
        onClearAction={clearAction}
        onClearViewingFile={clearViewingFile}
      />
    </div>
  )
}

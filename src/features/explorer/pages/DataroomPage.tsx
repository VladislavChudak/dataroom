import { useParams, useOutletContext } from 'react-router-dom'
import { useFolderContents, useSearchAllDatarooms } from '../hooks/useExplorer'
import { useQuery } from '@tanstack/react-query'
import { repository } from '@/repo/indexedDbRepo'
import { Breadcrumbs } from '../components/navigation/Breadcrumbs'
import { ItemsTable } from '../components/table/ItemsTable'
import { SearchResults } from '../components/search/SearchResults'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

interface OutletContext {
  searchQuery: string
}

export function DataroomPage() {
  const { dataroomId, folderId } = useParams<{ dataroomId: string; folderId?: string }>()
  const { searchQuery } = useOutletContext<OutletContext>()

  // Get dataroom to find root folder
  const { data: dataroom } = useQuery({
    queryKey: ['dataroom', dataroomId],
    queryFn: () => repository.getDataroomById(dataroomId!),
    enabled: !!dataroomId,
  })

  const currentFolderId = folderId || dataroom?.rootFolderId || ''

  const {
    data: contents,
    isLoading,
    error,
    refetch,
  } = useFolderContents(dataroomId || '', currentFolderId)

  // Use global search across all datarooms
  const { data: searchResults, isLoading: isSearching } = useSearchAllDatarooms(searchQuery)

  const isSearchMode = searchQuery.trim().length > 0

  if (!dataroomId) return null

  if (error) {
    return (
      <ErrorState
        title="Error loading folder"
        message={(error as Error).message}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="flex h-full flex-col">
      {!isSearchMode && <Breadcrumbs dataroomId={dataroomId} folderId={currentFolderId} />}

      {isSearchMode ? (
        isSearching ? (
          <LoadingSkeleton />
        ) : (
          <SearchResults
            dataroomId={dataroomId}
            currentFolderId={currentFolderId}
            folders={searchResults?.folders || []}
            files={searchResults?.files || []}
            searchQuery={searchQuery}
          />
        )
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : (
        <ItemsTable
          dataroomId={dataroomId}
          folderId={currentFolderId}
          folders={contents?.folders || []}
          files={contents?.files || []}
        />
      )}
    </div>
  )
}

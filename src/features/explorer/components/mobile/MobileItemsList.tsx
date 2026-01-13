import { useNavigate } from 'react-router-dom'
import type { Folder, FileMetadata } from '@/repo/types'
import { MobileFolderCard } from './MobileFolderCard'
import { MobileFileCard } from './MobileFileCard'
import { type SortConfig, type ItemWithType } from '@/lib/sorting'
import { SortDropdown } from '@/components/shared/SortDropdown'

interface MobileItemsListProps {
  dataroomId: string
  sortedItems: ItemWithType[]
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
  onFolderRename: (folder: Folder) => void
  onFolderDelete: (folder: Folder) => void
  onFileView: (fileId: string) => void
  onFileRename: (file: FileMetadata) => void
  onFileDelete: (file: FileMetadata) => void
}

export function MobileItemsList({
  dataroomId,
  sortedItems,
  sortConfig,
  onSortChange,
  onFolderRename,
  onFolderDelete,
  onFileView,
  onFileRename,
  onFileDelete,
}: MobileItemsListProps) {
  const navigate = useNavigate()

  return (
    <div className="mt-2 space-y-2">
      <SortDropdown
        sortConfig={sortConfig}
        onSortChange={onSortChange}
        itemCount={sortedItems.length}
      />

      {sortedItems.map((item) =>
        item.type === 'folder' ? (
          <MobileFolderCard
            key={`folder-${item.item.id}`}
            folder={item.item}
            onNavigate={() => navigate(`/dataroom/${dataroomId}/folder/${item.item.id}`)}
            onRename={() => onFolderRename(item.item)}
            onDelete={() => onFolderDelete(item.item)}
          />
        ) : (
          <MobileFileCard
            key={`file-${item.item.id}`}
            file={item.item}
            onView={() => onFileView(item.item.id)}
            onRename={() => onFileRename(item.item)}
            onDelete={() => onFileDelete(item.item)}
          />
        )
      )}
    </div>
  )
}

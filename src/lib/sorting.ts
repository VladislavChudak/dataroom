import type { Folder, FileMetadata } from '@/repo/types'

export type SortField = 'name' | 'modified' | 'size'
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  order: SortOrder
}

export type ItemWithType = { type: 'folder'; item: Folder } | { type: 'file'; item: FileMetadata }

/**
 * Sorts folders and files together as a unified list based on the specified field and order
 */
export function sortFolderContents(
  folders: Folder[],
  files: FileMetadata[],
  config: SortConfig
): ItemWithType[] {
  // Combine folders and files into a single array with type markers
  const combined: ItemWithType[] = [
    ...folders.map((folder) => ({ type: 'folder' as const, item: folder })),
    ...files.map((file) => ({ type: 'file' as const, item: file })),
  ]

  // Sort the combined array
  combined.sort((a, b) => {
    let comparison = 0

    switch (config.field) {
      case 'name':
        comparison = a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' })
        break
      case 'modified':
        comparison = a.item.updatedAt.getTime() - b.item.updatedAt.getTime()
        break
      case 'size': {
        // Folders are treated as size 0
        const aSize = a.type === 'file' ? a.item.size : 0
        const bSize = b.type === 'file' ? b.item.size : 0
        comparison = aSize - bSize
        break
      }
    }

    return config.order === 'asc' ? comparison : -comparison
  })

  return combined
}

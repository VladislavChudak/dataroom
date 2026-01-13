import { describe, it, expect } from 'vitest'
import { sortFolderContents } from './sorting'
import type { Folder, FileMetadata } from '@/repo/types'

describe('Sorting utilities', () => {
  const mockFolders: Folder[] = [
    {
      id: '1',
      dataroomId: 'dr1',
      parentId: null,
      name: 'Zebra',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: '2',
      dataroomId: 'dr1',
      parentId: null,
      name: 'Apple',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      dataroomId: 'dr1',
      parentId: null,
      name: 'Mango',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-01'),
    },
  ]

  const mockFiles: FileMetadata[] = [
    {
      id: 'f1',
      dataroomId: 'dr1',
      folderId: 'folder1',
      name: 'document.pdf',
      mime: 'application/pdf',
      size: 5000,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: 'f2',
      dataroomId: 'dr1',
      folderId: 'folder1',
      name: 'image.jpg',
      mime: 'image/jpeg',
      size: 2000,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'f3',
      dataroomId: 'dr1',
      folderId: 'folder1',
      name: 'archive.zip',
      mime: 'application/zip',
      size: 10000,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-01'),
    },
  ]

  describe('sortFolderContents', () => {
    it('should sort folders and files together by name', () => {
      const result = sortFolderContents(mockFolders, mockFiles, { field: 'name', order: 'asc' })

      // When sorted by name: Apple (folder), archive.zip (file), document.pdf (file), image.jpg (file), Mango (folder), Zebra (folder)
      expect(result).toHaveLength(6)
      expect(result[0].type).toBe('folder')
      expect(result[0].item.name).toBe('Apple')
      expect(result[1].type).toBe('file')
      expect(result[1].item.name).toBe('archive.zip')
      expect(result[2].type).toBe('file')
      expect(result[2].item.name).toBe('document.pdf')
      expect(result[3].type).toBe('file')
      expect(result[3].item.name).toBe('image.jpg')
      expect(result[4].type).toBe('folder')
      expect(result[4].item.name).toBe('Mango')
      expect(result[5].type).toBe('folder')
      expect(result[5].item.name).toBe('Zebra')
    })

    it('should sort folders and files together by modified date', () => {
      const result = sortFolderContents(mockFolders, mockFiles, {
        field: 'modified',
        order: 'asc',
      })

      // Oldest to newest: Mango folder (Jan 1), archive.zip (Jan 1), Apple folder (Jan 2), image.jpg (Jan 2), Zebra folder (Jan 3), document.pdf (Jan 3)
      expect(result).toHaveLength(6)
      expect(result[0].item.name).toBe('Mango')
      expect(result[1].item.name).toBe('archive.zip')
      expect(result[2].item.name).toBe('Apple')
      expect(result[3].item.name).toBe('image.jpg')
      expect(result[4].item.name).toBe('Zebra')
      expect(result[5].item.name).toBe('document.pdf')
    })

    it('should not mutate original arrays', () => {
      const originalFolders = [...mockFolders]
      const originalFiles = [...mockFiles]

      sortFolderContents(mockFolders, mockFiles, { field: 'name', order: 'desc' })

      expect(mockFolders).toEqual(originalFolders)
      expect(mockFiles).toEqual(originalFiles)
    })

    it('should handle empty arrays', () => {
      const result = sortFolderContents([], [], { field: 'name', order: 'asc' })
      expect(result).toEqual([])
    })

    it('should handle arrays with single items', () => {
      const result = sortFolderContents([mockFolders[0]], [mockFiles[0]], {
        field: 'name',
        order: 'asc',
      })
      expect(result).toHaveLength(2)
    })

    it('should mix folders and files when sorting by name', () => {
      // Create folders and files with names that would intermix
      const folders: Folder[] = [
        { ...mockFolders[0], name: 'Beta' },
        { ...mockFolders[1], name: 'Delta' },
      ]
      const files: FileMetadata[] = [
        { ...mockFiles[0], name: 'Alpha.txt' },
        { ...mockFiles[1], name: 'Charlie.txt' },
        { ...mockFiles[2], name: 'Echo.txt' },
      ]

      const result = sortFolderContents(folders, files, { field: 'name', order: 'asc' })

      // Expected order: Alpha.txt, Beta, Charlie.txt, Delta, Echo.txt
      expect(result).toHaveLength(5)
      expect(result[0].item.name).toBe('Alpha.txt')
      expect(result[0].type).toBe('file')
      expect(result[1].item.name).toBe('Beta')
      expect(result[1].type).toBe('folder')
      expect(result[2].item.name).toBe('Charlie.txt')
      expect(result[2].type).toBe('file')
      expect(result[3].item.name).toBe('Delta')
      expect(result[3].type).toBe('folder')
      expect(result[4].item.name).toBe('Echo.txt')
      expect(result[4].type).toBe('file')
    })

    it('should handle case-insensitive sorting', () => {
      const folders: Folder[] = [{ ...mockFolders[0], name: 'ZEBRA' }]
      const files: FileMetadata[] = [
        { ...mockFiles[0], name: 'apple.txt' },
        { ...mockFiles[1], name: 'MaNgO.txt' },
      ]
      const result = sortFolderContents(folders, files, { field: 'name', order: 'asc' })
      expect(result[0].item.name).toBe('apple.txt')
      expect(result[1].item.name).toBe('MaNgO.txt')
      expect(result[2].item.name).toBe('ZEBRA')
    })
  })
})

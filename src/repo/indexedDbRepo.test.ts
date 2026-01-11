import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db } from '@/lib/db'
import { repository as indexedDbRepo } from './indexedDbRepo'
import type { Dataroom, Folder } from './types'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    datarooms: {
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      get: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
    },
    folders: {
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      get: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
    },
    files: {
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      get: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
    },
    transaction: vi.fn(() => {
      return async (callback: () => Promise<void>) => {
        return await callback()
      }
    }),
  },
}))

describe('IndexedDBRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listDatarooms', () => {
    it('should return all datarooms ordered by creation date', async () => {
      const mockDatarooms: Dataroom[] = [
        {
          id: 'dr-1',
          name: 'Dataroom 1',
          rootFolderId: 'f-1',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'dr-2',
          name: 'Dataroom 2',
          rootFolderId: 'f-2',
          createdAt: new Date('2024-01-02'),
        },
      ]

      vi.mocked(db.datarooms.toArray).mockResolvedValue(mockDatarooms)

      const result = await indexedDbRepo.listDatarooms()

      expect(result).toEqual(mockDatarooms)
      expect(db.datarooms.orderBy).toHaveBeenCalledWith('createdAt')
      expect(db.datarooms.reverse).toHaveBeenCalled()
    })
  })

  describe('getDataroomById', () => {
    it('should return a dataroom by id', async () => {
      const mockDataroom: Dataroom = {
        id: 'dr-1',
        name: 'Test Dataroom',
        rootFolderId: 'f-1',
        createdAt: new Date('2024-01-01'),
      }

      vi.mocked(db.datarooms.get).mockResolvedValue(mockDataroom)

      const result = await indexedDbRepo.getDataroomById('dr-1')

      expect(result).toEqual(mockDataroom)
      expect(db.datarooms.get).toHaveBeenCalledWith('dr-1')
    })

    it('should return undefined for non-existent dataroom', async () => {
      vi.mocked(db.datarooms.get).mockResolvedValue(undefined)

      const result = await indexedDbRepo.getDataroomById('non-existent')

      expect(result).toBeUndefined()
    })
  })

  describe('createDataroom', () => {
    it('should create a new dataroom with root folder', async () => {
      vi.mocked(db.datarooms.toArray).mockResolvedValue([])
      vi.mocked(db.datarooms.add).mockResolvedValue('test-id-123')
      vi.mocked(db.folders.add).mockResolvedValue('test-folder-id')

      const result = await indexedDbRepo.createDataroom('New Dataroom')

      expect(result.name).toBe('New Dataroom')
      expect(result.id).toBe('test-id-123')
      expect(result.rootFolderId).toBeTruthy()
      // Verify transaction was used
      expect(db.transaction).toHaveBeenCalled()
    })

    it('should throw error if dataroom name already exists', async () => {
      const existingDataroom: Dataroom = {
        id: 'dr-1',
        name: 'Existing',
        rootFolderId: 'f-1',
        createdAt: new Date(),
      }

      vi.mocked(db.datarooms.toArray).mockResolvedValue([existingDataroom])

      await expect(indexedDbRepo.createDataroom('Existing')).rejects.toThrow(
        'A dataroom with this name already exists'
      )
    })
  })

  describe('getFolderContents', () => {
    it('should return folders and files for a given folder', async () => {
      const mockFolders: Folder[] = [
        {
          id: 'f-1',
          dataroomId: 'dr-1',
          parentId: 'f-root',
          name: 'Folder A',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'f-2',
          dataroomId: 'dr-1',
          parentId: 'f-root',
          name: 'Folder B',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const mockFiles = [
        {
          id: 'file-1',
          dataroomId: 'dr-1',
          folderId: 'f-root',
          name: 'document.pdf',
          mime: 'application/pdf',
          size: 1024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(db.folders.toArray).mockResolvedValue(mockFolders)
      vi.mocked(db.files.toArray).mockResolvedValue(mockFiles)

      const result = await indexedDbRepo.getFolderContents({
        dataroomId: 'dr-1',
        folderId: 'f-root',
      })

      expect(result.folders).toHaveLength(2)
      expect(result.files).toHaveLength(1)
      expect(result.folders[0].name).toBe('Folder A')
    })

    it('should sort folders and files alphabetically', async () => {
      const mockFolders: Folder[] = [
        {
          id: 'f-2',
          dataroomId: 'dr-1',
          parentId: 'f-root',
          name: 'Z Folder',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'f-1',
          dataroomId: 'dr-1',
          parentId: 'f-root',
          name: 'A Folder',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(db.folders.toArray).mockResolvedValue(mockFolders)
      vi.mocked(db.files.toArray).mockResolvedValue([])

      const result = await indexedDbRepo.getFolderContents({
        dataroomId: 'dr-1',
        folderId: 'f-root',
      })

      expect(result.folders[0].name).toBe('A Folder')
      expect(result.folders[1].name).toBe('Z Folder')
    })
  })

  describe('getFolderPath', () => {
    it('should return the full path of folders from root to target', async () => {
      const mockRootFolder: Folder = {
        id: 'f-root',
        dataroomId: 'dr-1',
        parentId: null,
        name: 'Root',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockSubFolder: Folder = {
        id: 'f-sub',
        dataroomId: 'dr-1',
        parentId: 'f-root',
        name: 'Subfolder',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.folders.get)
        .mockResolvedValueOnce(mockSubFolder)
        .mockResolvedValueOnce(mockRootFolder)

      const result = await indexedDbRepo.getFolderPath('f-sub')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('f-root')
      expect(result[1].id).toBe('f-sub')
    })

    it('should return single folder for root-level folder', async () => {
      const mockFolder: Folder = {
        id: 'f-root',
        dataroomId: 'dr-1',
        parentId: null,
        name: 'Root',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.folders.get).mockResolvedValue(mockFolder)

      const result = await indexedDbRepo.getFolderPath('f-root')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('f-root')
    })
  })

  describe('createFolder', () => {
    it('should create a new folder', async () => {
      vi.mocked(db.folders.toArray).mockResolvedValue([])

      const result = await indexedDbRepo.createFolder({
        dataroomId: 'dr-1',
        parentId: 'f-root',
        name: 'New Folder',
      })

      expect(result.name).toBe('New Folder')
      expect(result.dataroomId).toBe('dr-1')
      expect(result.parentId).toBe('f-root')
      expect(db.folders.add).toHaveBeenCalled()
    })

    it('should throw error if folder name already exists in parent', async () => {
      const existingFolder: Folder = {
        id: 'f-1',
        dataroomId: 'dr-1',
        parentId: 'f-root',
        name: 'Existing',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.folders.toArray).mockResolvedValue([existingFolder])

      await expect(
        indexedDbRepo.createFolder({
          dataroomId: 'dr-1',
          parentId: 'f-root',
          name: 'Existing',
        })
      ).rejects.toThrow('A folder with this name already exists')
    })
  })
})

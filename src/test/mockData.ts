import type { Dataroom, Folder, FileMetadata, FileWithBlob } from '@/repo/types'

/**
 * Mock data factory for testing
 */

export function createMockDataroom(overrides?: Partial<Dataroom>): Dataroom {
  return {
    id: 'dataroom-1',
    name: 'Test Dataroom',
    rootFolderId: 'folder-root',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function createMockFolder(overrides?: Partial<Folder>): Folder {
  return {
    id: 'folder-1',
    dataroomId: 'dataroom-1',
    parentId: null,
    name: 'Test Folder',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function createMockFile(overrides?: Partial<FileMetadata>): FileMetadata {
  return {
    id: 'file-1',
    dataroomId: 'dataroom-1',
    folderId: 'folder-1',
    name: 'test-document.pdf',
    mime: 'application/pdf',
    size: 1024000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function createMockFileWithBlob(overrides?: Partial<FileWithBlob>): FileWithBlob {
  const mockBlob = new Blob(['test content'], { type: 'application/pdf' })
  return {
    ...createMockFile(overrides),
    data: mockBlob,
    ...overrides,
  }
}

export const mockDatarooms: Dataroom[] = [
  createMockDataroom({ id: 'dr-1', name: 'Sales Documents', rootFolderId: 'f-root-1' }),
  createMockDataroom({ id: 'dr-2', name: 'Legal Files', rootFolderId: 'f-root-2' }),
  createMockDataroom({ id: 'dr-3', name: 'HR Records', rootFolderId: 'f-root-3' }),
]

export const mockFolders: Folder[] = [
  createMockFolder({ id: 'f-root-1', dataroomId: 'dr-1', name: 'Root', parentId: null }),
  createMockFolder({ id: 'f-1', dataroomId: 'dr-1', name: 'Q1 2024', parentId: 'f-root-1' }),
  createMockFolder({ id: 'f-2', dataroomId: 'dr-1', name: 'Q2 2024', parentId: 'f-root-1' }),
  createMockFolder({ id: 'f-3', dataroomId: 'dr-1', name: 'Reports', parentId: 'f-1' }),
]

export const mockFiles: FileMetadata[] = [
  createMockFile({ id: 'file-1', folderId: 'f-1', name: 'sales-report.pdf', size: 2048000 }),
  createMockFile({ id: 'file-2', folderId: 'f-1', name: 'forecast.pdf', size: 1536000 }),
  createMockFile({ id: 'file-3', folderId: 'f-3', name: 'monthly-analysis.pdf', size: 3072000 }),
]

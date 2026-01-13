import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import type { DataroomRepository } from './repository'
import type { Dataroom, Folder, FileMetadata, FolderContents, FileWithBlob } from './types'
import { generateUniqueFileName } from '@/lib/format'

class IndexedDBRepository implements DataroomRepository {
  // Dataroom operations
  async listDatarooms(): Promise<Dataroom[]> {
    return await db.datarooms.orderBy('createdAt').reverse().toArray()
  }

  async getDataroomById(id: string): Promise<Dataroom | undefined> {
    return await db.datarooms.get(id)
  }

  async createDataroom(name: string): Promise<Dataroom> {
    const existingDatarooms = await this.listDatarooms()

    if (existingDatarooms.some((d) => d.name === name)) {
      throw new Error('A dataroom with this name already exists')
    }

    const id = nanoid()
    const rootFolderId = nanoid()
    const now = new Date()

    const dataroom: Dataroom = {
      id,
      name,
      rootFolderId,
      createdAt: now,
    }

    const rootFolder: Folder = {
      id: rootFolderId,
      dataroomId: id,
      parentId: null,
      name: 'Root',
      createdAt: now,
      updatedAt: now,
    }

    await db.transaction('rw', db.datarooms, db.folders, async () => {
      await db.datarooms.add(dataroom)
      await db.folders.add(rootFolder)
    })

    return dataroom
  }

  async deleteDataroom(id: string): Promise<void> {
    await db.transaction('rw', db.datarooms, db.folders, db.files, async () => {
      await db.folders.where('dataroomId').equals(id).delete()
      await db.files.where('dataroomId').equals(id).delete()
      await db.datarooms.delete(id)
    })
  }

  // Folder operations
  async getFolderContents(args: { dataroomId: string; folderId: string }): Promise<FolderContents> {
    const folders = await db.folders
      .where('[dataroomId+parentId]')
      .equals([args.dataroomId, args.folderId])
      .toArray()

    const files = await db.files
      .where('[dataroomId+folderId]')
      .equals([args.dataroomId, args.folderId])
      .toArray()

    // Sort: folders first, then alphabetically
    folders.sort((a, b) => a.name.localeCompare(b.name))
    files.sort((a, b) => a.name.localeCompare(b.name))

    return { folders, files }
  }

  async getFolder(folderId: string): Promise<Folder | undefined> {
    return await db.folders.get(folderId)
  }

  async getFolderPath(folderId: string): Promise<Folder[]> {
    const path: Folder[] = []
    let currentId: string | null = folderId

    while (currentId) {
      const folder: Folder | undefined = await db.folders.get(currentId)
      if (!folder) break
      path.unshift(folder)
      currentId = folder.parentId
    }

    return path
  }

  async createFolder(args: {
    dataroomId: string
    parentId: string
    name: string
  }): Promise<Folder> {
    // Check for duplicate names in the same parent
    const existingFolders = await db.folders
      .where('[dataroomId+parentId]')
      .equals([args.dataroomId, args.parentId])
      .toArray()

    this.checkDuplicateName(existingFolders, args.name)

    const now = new Date()
    const folder: Folder = {
      id: nanoid(),
      dataroomId: args.dataroomId,
      parentId: args.parentId,
      name: args.name,
      createdAt: now,
      updatedAt: now,
    }

    await db.folders.add(folder)
    return folder
  }

  async renameFolder(args: { folderId: string; name: string }): Promise<void> {
    const folder = await db.folders.get(args.folderId)
    if (!folder) throw new Error('Folder not found')

    // Check for duplicate names in the same parent
    const siblings = await db.folders
      .where('[dataroomId+parentId]')
      .equals([folder.dataroomId, folder.parentId || ''])
      .toArray()

    this.checkDuplicateName(siblings, args.name, args.folderId)

    await db.folders.update(args.folderId, {
      name: args.name,
      updatedAt: new Date(),
    })
  }

  async deleteFolderCascade(args: { folderId: string }): Promise<void> {
    // Get all descendant folders recursively
    const descendantIds = await this.getAllDescendantFolderIds(args.folderId)
    descendantIds.push(args.folderId)

    await db.transaction('rw', db.folders, db.files, async () => {
      // Delete all files in these folders
      for (const folderId of descendantIds) {
        await db.files.where('folderId').equals(folderId).delete()
      }
      // Delete all folders
      await db.folders.bulkDelete(descendantIds)
    })
  }

  private async getAllDescendantFolderIds(folderId: string): Promise<string[]> {
    const children = await db.folders.where('parentId').equals(folderId).toArray()
    const allIds: string[] = []

    for (const child of children) {
      allIds.push(child.id)
      const descendants = await this.getAllDescendantFolderIds(child.id)
      allIds.push(...descendants)
    }

    return allIds
  }

  private checkDuplicateName(
    items: Array<{ id?: string; name: string }>,
    name: string,
    excludeId?: string
  ): void {
    const existingNames = items
      .filter((item) => !excludeId || item.id !== excludeId)
      .map((item) => item.name.toLowerCase())

    if (existingNames.includes(name.toLowerCase())) {
      throw new Error('An item with this name already exists')
    }
  }

  async countFolderContents(folderId: string): Promise<{ folders: number; files: number }> {
    const descendantIds = await this.getAllDescendantFolderIds(folderId)

    const folders = descendantIds.length // Count all nested folders (excluding the parent being deleted)
    let files = 0

    // Count files in the parent folder
    const parentFiles = await db.files.where('folderId').equals(folderId).count()
    files += parentFiles

    // Count files in all descendant folders
    for (const id of descendantIds) {
      const count = await db.files.where('folderId').equals(id).count()
      files += count
      console.log('count', count)
    }

    return { folders, files }
  }

  async calculateFileSize(folderId: string): Promise<number> {
    const descendantIds = await this.getAllDescendantFolderIds(folderId)

    const parentFiles = await db.files.where('folderId').equals(folderId).toArray()
    let totalSize = 0

    for (const file of parentFiles) {
      totalSize += file.size
    }

    for (const id of descendantIds) {
      const files = await db.files.where('folderId').equals(id).toArray()
      for (const file of files) {
        totalSize += file.size
      }
    }

    return totalSize
  }

  // File operations
  async uploadFile(args: {
    dataroomId: string
    folderId: string
    file: File
  }): Promise<FileMetadata> {
    const existingFiles = await db.files
      .where('[dataroomId+folderId]')
      .equals([args.dataroomId, args.folderId])
      .toArray()

    const existingNames = existingFiles.map((f) => f.name)
    const uniqueName = generateUniqueFileName(args.file.name, existingNames)

    const now = new Date()
    const fileWithBlob: FileWithBlob = {
      id: nanoid(),
      dataroomId: args.dataroomId,
      folderId: args.folderId,
      name: uniqueName,
      mime: args.file.type,
      size: args.file.size,
      data: args.file,
      createdAt: now,
      updatedAt: now,
    }

    await db.files.add(fileWithBlob)

    // Return without blob
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...metadata } = fileWithBlob
    return metadata
  }

  async getFile(fileId: string): Promise<FileMetadata | undefined> {
    const file = await db.files.get(fileId)
    if (!file) return undefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...metadata } = file
    return metadata
  }

  async getFileBlob(fileId: string): Promise<Blob> {
    const file = await db.files.get(fileId)
    if (!file) throw new Error('File not found')
    return file.data
  }

  async renameFile(args: { fileId: string; name: string }): Promise<void> {
    const file = await db.files.get(args.fileId)
    if (!file) throw new Error('File not found')

    // Check for duplicate names in the same folder
    const siblings = await db.files
      .where('[dataroomId+folderId]')
      .equals([file.dataroomId, file.folderId])
      .toArray()

    this.checkDuplicateName(siblings, args.name, args.fileId)

    await db.files.update(args.fileId, {
      name: args.name,
      updatedAt: new Date(),
    })
  }

  async deleteFile(args: { fileId: string }): Promise<void> {
    await db.files.delete(args.fileId)
  }

  // Search
  async searchAllDatarooms(query: string): Promise<FolderContents> {
    if (!query.trim()) {
      return { folders: [], files: [] }
    }

    const searchTerm = query.toLowerCase()

    // Search all folders
    const allFolders = await db.folders.toArray()
    const matchingFolders = allFolders.filter((folder) =>
      folder.name.toLowerCase().includes(searchTerm)
    )

    // Search all files
    const allFiles = await db.files.toArray()
    const matchingFiles = allFiles.filter((file) => file.name.toLowerCase().includes(searchTerm))

    // Sort results alphabetically
    matchingFolders.sort((a, b) => a.name.localeCompare(b.name))
    matchingFiles.sort((a, b) => a.name.localeCompare(b.name))

    // Return without blob data for files
    const filesMetadata = matchingFiles.map(({ ...metadata }) => metadata)

    return {
      folders: matchingFolders,
      files: filesMetadata,
    }
  }
}

export const repository = new IndexedDBRepository()

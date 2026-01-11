import type { Dataroom, Folder, FileMetadata, FolderContents } from './types'

export interface DataroomRepository {
  // Dataroom operations
  listDatarooms(): Promise<Dataroom[]>
  getDataroomById(id: string): Promise<Dataroom | undefined>
  createDataroom(name: string): Promise<Dataroom>
  deleteDataroom(id: string): Promise<void>

  // Folder operations
  getFolderContents(args: { dataroomId: string; folderId: string }): Promise<FolderContents>
  getFolder(folderId: string): Promise<Folder | undefined>
  getFolderPath(folderId: string): Promise<Folder[]>
  createFolder(args: { dataroomId: string; parentId: string; name: string }): Promise<Folder>
  renameFolder(args: { folderId: string; name: string }): Promise<void>
  deleteFolderCascade(args: { folderId: string }): Promise<void>
  countFolderContents(folderId: string): Promise<{ folders: number; files: number }>
  calculateFileSize(folderId: string): Promise<number>

  // File operations
  uploadFile(args: { dataroomId: string; folderId: string; file: File }): Promise<FileMetadata>
  getFile(fileId: string): Promise<FileMetadata | undefined>
  getFileBlob(fileId: string): Promise<Blob>
  renameFile(args: { fileId: string; name: string }): Promise<void>
  deleteFile(args: { fileId: string }): Promise<void>

  // Search operations
  searchAllDatarooms(query: string): Promise<FolderContents>
}

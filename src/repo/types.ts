export interface Dataroom {
  id: string
  name: string
  rootFolderId: string
  createdAt: Date
}

export interface Folder {
  id: string
  dataroomId: string
  parentId: string | null
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface FileMetadata {
  id: string
  dataroomId: string
  folderId: string
  name: string
  mime: string
  size: number
  createdAt: Date
  updatedAt: Date
}

export interface FileWithBlob extends FileMetadata {
  data: Blob
}

export interface FolderContents {
  folders: Folder[]
  files: FileMetadata[]
}

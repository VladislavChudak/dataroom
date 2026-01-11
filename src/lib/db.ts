import Dexie, { type EntityTable } from 'dexie'
import type { Dataroom, Folder, FileWithBlob } from '@/repo/types'

const db = new Dexie('DataroomDB') as Dexie & {
  datarooms: EntityTable<Dataroom, 'id'>
  folders: EntityTable<Folder, 'id'>
  files: EntityTable<FileWithBlob, 'id'>
}

// Schema declaration
db.version(1).stores({
  datarooms: 'id, name, createdAt',
  folders: 'id, dataroomId, parentId, name, [dataroomId+parentId]',
  files: 'id, dataroomId, folderId, name, size, [dataroomId+folderId]',
})

export { db }

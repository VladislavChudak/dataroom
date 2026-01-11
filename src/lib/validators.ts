import { z } from 'zod'

export const dataroomSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')),
})

export const folderSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'Folder name is required')
        .max(255, 'Folder name must be less than 255 characters')
    ),
})

export const fileSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'File name is required')
        .max(255, 'File name must be less than 255 characters')
    ),
})

export type DataroomInput = z.infer<typeof dataroomSchema>
export type FolderInput = z.infer<typeof folderSchema>
export type FileInput = z.infer<typeof fileSchema>

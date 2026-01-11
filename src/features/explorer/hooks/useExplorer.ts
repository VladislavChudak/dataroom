import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { repository } from '@/repo/indexedDbRepo'
import { createMutation } from '@/lib/mutationFactory'

// Query hooks

/**
 * Fetches the contents (folders and files) of a specific folder within a dataroom.
 * Results are sorted alphabetically with folders appearing before files.
 *
 * @param dataroomId - The ID of the dataroom containing the folder
 * @param folderId - The ID of the folder to fetch contents for
 * @returns Query result containing arrays of folders and files in the specified folder
 */
export function useFolderContents(dataroomId: string, folderId: string) {
  return useQuery({
    queryKey: ['folderContents', dataroomId, folderId],
    queryFn: () => repository.getFolderContents({ dataroomId, folderId }),
    enabled: !!dataroomId && !!folderId,
  })
}

/**
 * Fetches the full path from root to a specific folder, useful for breadcrumb navigation.
 * Returns an ordered array of folders representing the hierarchy.
 *
 * @param folderId - The ID of the folder to get the path for
 * @returns Query result containing an array of folders from root to the specified folder
 */
export function useFolderPath(folderId: string) {
  return useQuery({
    queryKey: ['folderPath', folderId],
    queryFn: () => repository.getFolderPath(folderId),
    enabled: !!folderId,
  })
}

/**
 * Counts the total number of folders and files within a folder (including nested contents).
 * Used primarily for delete confirmation dialogs to show the cascade impact.
 *
 * @param folderId - The ID of the folder to count contents for
 * @returns Query result containing counts of folders and files
 */
export function useCountFolderContents(folderId: string) {
  return useQuery({
    queryKey: ['folderCount', folderId],
    queryFn: () => repository.countFolderContents(folderId),
    enabled: !!folderId,
  })
}

export function useCalculateFileSize(folderId: string) {
  return useQuery({
    queryKey: ['fileSize', folderId],
    queryFn: () => repository.calculateFileSize(folderId),
    enabled: !!folderId,
  })
}

/**
 * Fetches the binary blob data for a specific file, typically for viewing or downloading.
 * Note: Blob data is not cached to avoid stale blob URL issues.
 *
 * @param fileId - The ID of the file to fetch blob data for, or null if no file is selected
 * @returns Query result containing the file blob data
 */
export function useFileBlob(fileId: string | null) {
  return useQuery({
    queryKey: ['fileBlob', fileId],
    queryFn: () => repository.getFileBlob(fileId!),
    enabled: !!fileId,
    // Don't cache blobs to avoid stale blob URL issues
    gcTime: 0, // Garbage collect immediately when query is no longer in use
    staleTime: 0, // Always refetch to get fresh blob
  })
}

/**
 * Searches across all datarooms for folders and files matching the query string.
 * Search is case-insensitive and matches partial names. Results use placeholder data
 * to prevent flickering during search updates.
 *
 * @param query - The search term to match against folder and file names
 * @returns Query result containing matching folders and files across all datarooms
 */
export function useSearchAllDatarooms(query: string) {
  return useQuery({
    queryKey: ['searchAll', query],
    queryFn: () => repository.searchAllDatarooms(query),
    enabled: !!query.trim(),
    placeholderData: keepPreviousData,
  })
}

// Mutation hooks using factory

/**
 * Creates a new folder within a parent folder.
 * Validates that no duplicate folder names exist in the same parent.
 *
 * @returns Mutation hook for creating folders
 */
export const useCreateFolder = createMutation({
  mutationFn: (args: { dataroomId: string; parentId: string; name: string }) =>
    repository.createFolder(args),
  invalidateKeys: (variables) => [
    ['folderContents', variables.dataroomId, variables.parentId],
    ['folderCount', variables.parentId],
    ['fileSize', variables.parentId],
  ],
  successMessage: 'Folder created',
  errorMessage: 'Failed to create folder',
})

/**
 * Renames an existing folder.
 * Validates that no duplicate folder names exist in the same parent.
 *
 * @returns Mutation hook for renaming folders
 */
export const useRenameFolder = createMutation({
  mutationFn: (args: { folderId: string; name: string; dataroomId: string; parentId: string }) =>
    repository.renameFolder({ folderId: args.folderId, name: args.name }),
  invalidateKeys: (variables) => [
    ['folderContents', variables.dataroomId, variables.parentId],
    ['folderPath'],
  ],
  successMessage: 'Folder renamed',
  errorMessage: 'Failed to rename folder',
})

/**
 * Deletes a folder and all its contents recursively (cascade delete).
 * All nested folders and files within will be permanently removed.
 *
 * @returns Mutation hook for deleting folders
 */
export const useDeleteFolder = createMutation({
  mutationFn: (args: { folderId: string; dataroomId: string; parentId: string }) =>
    repository.deleteFolderCascade({ folderId: args.folderId }),
  invalidateKeys: (variables) => [
    ['folderContents', variables.dataroomId, variables.parentId],
    ['folderCount', variables.parentId],
    ['fileSize', variables.parentId],
  ],
  successMessage: 'Folder deleted',
  errorMessage: 'Failed to delete folder',
})

/**
 * Uploads a file to a specific folder within a dataroom.
 * Automatically handles duplicate file names by appending (1), (2), etc.
 * Shows a success toast with the file name.
 *
 * @returns Mutation hook for uploading files
 */
export const useUploadFile = createMutation({
  mutationFn: (args: { dataroomId: string; folderId: string; file: File }) =>
    repository.uploadFile(args),
  invalidateKeys: (variables) => [
    ['folderContents', variables.dataroomId, variables.folderId],
    ['folderCount', variables.folderId],
    ['fileSize', variables.folderId],
  ],
  successMessage: (file) => `Uploaded: ${file.name}`,
  errorMessage: 'Failed to upload file',
})

/**
 * Renames an existing file.
 * Validates that no duplicate file names exist in the same folder.
 *
 * @returns Mutation hook for renaming files
 */
export const useRenameFile = createMutation({
  mutationFn: (args: { fileId: string; name: string; dataroomId: string; folderId: string }) =>
    repository.renameFile({ fileId: args.fileId, name: args.name }),
  invalidateKeys: (variables) => [['folderContents', variables.dataroomId, variables.folderId]],
  successMessage: 'File renamed',
  errorMessage: 'Failed to rename file',
})

/**
 * Deletes a file permanently from the dataroom.
 *
 * @returns Mutation hook for deleting files
 */
export const useDeleteFile = createMutation({
  mutationFn: (args: { fileId: string; dataroomId: string; folderId: string }) =>
    repository.deleteFile({ fileId: args.fileId }),
  invalidateKeys: (variables) => [
    ['folderContents', variables.dataroomId, variables.folderId],
    ['folderCount', variables.folderId],
    ['fileSize', variables.folderId],
  ],
  successMessage: 'File deleted',
  errorMessage: 'Failed to delete file',
})

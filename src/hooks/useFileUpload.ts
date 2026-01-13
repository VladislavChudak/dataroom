import { useUploadFile } from '@/features/explorer/hooks/useExplorer'
import { toast } from 'sonner'

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

// Warn if total upload would exceed 4GB (80% of typical 5GB quota)
const STORAGE_WARNING_THRESHOLD = 4 * 1024 * 1024 * 1024

interface UseFileUploadProps {
  dataroomId: string
  folderId: string
}

export function useFileUpload({ dataroomId, folderId }: UseFileUploadProps) {
  const uploadFile = useUploadFile()

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: `${file.name} is not a PDF file` }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `${file.name} is too large (max 50MB). File size: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
      }
    }

    if (file.size === 0) {
      return { valid: false, error: `${file.name} is empty` }
    }

    return { valid: true }
  }

  const checkStorageQuota = async (totalSize: number): Promise<boolean> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const usage = estimate.usage || 0
        const quota = estimate.quota || STORAGE_WARNING_THRESHOLD

        const projectedUsage = usage + totalSize

        if (projectedUsage > quota) {
          toast.error('Not enough storage space. Please delete some files.')
          return false
        }

        if (projectedUsage > STORAGE_WARNING_THRESHOLD && projectedUsage <= quota) {
          toast.warning('Storage space is running low')
        }
      } catch {
        // Storage API not available or quota check failed - continue with upload
      }
    }
    return true
  }

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    if (fileArray.length === 0) return

    // Validate all files first
    const validFiles: File[] = []
    let totalSize = 0

    for (const file of fileArray) {
      const validation = validateFile(file)
      if (!validation.valid) {
        toast.error(validation.error!)
        continue
      }
      validFiles.push(file)
      totalSize += file.size
    }

    if (validFiles.length === 0) {
      return
    }

    // Check storage quota
    const hasSpace = await checkStorageQuota(totalSize)
    if (!hasSpace) {
      return
    }

    // Show upload started message for multiple files
    if (validFiles.length > 1) {
      toast.info(`Uploading ${validFiles.length} files...`)
    }

    // Upload valid files
    for (const file of validFiles) {
      uploadFile.mutate({ dataroomId, folderId, file })
    }
  }

  return {
    handleFiles,
    validateFile,
    checkStorageQuota,
    isUploading: uploadFile.isPending,
  }
}

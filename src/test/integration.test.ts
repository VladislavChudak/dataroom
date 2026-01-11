import { describe, it, expect, vi } from 'vitest'
import { formatBytes, formatDate, generateUniqueFileName, validateFileName } from '@/lib/format'

describe('Integration: File naming and validation', () => {
  it('should generate valid unique filenames', () => {
    const existingFiles = ['report.pdf', 'report (1).pdf', 'report (2).pdf']

    // Generate a unique name
    const newName = generateUniqueFileName('report.pdf', existingFiles)
    expect(newName).toBe('report (3).pdf')

    // Validate the generated name
    const validation = validateFileName(newName)
    expect(validation.valid).toBe(true)
  })

  it('should handle file upload workflow with duplicate names', () => {
    const existingFiles: string[] = []

    // First upload - no conflict
    const file1 = 'document.pdf'
    const uniqueName1 = generateUniqueFileName(file1, existingFiles)
    expect(uniqueName1).toBe('document.pdf')
    existingFiles.push(uniqueName1)

    // Second upload - same name, should get (1)
    const file2 = 'document.pdf'
    const uniqueName2 = generateUniqueFileName(file2, existingFiles)
    expect(uniqueName2).toBe('document (1).pdf')
    existingFiles.push(uniqueName2)

    // Third upload - same name, should get (2)
    const file3 = 'document.pdf'
    const uniqueName3 = generateUniqueFileName(file3, existingFiles)
    expect(uniqueName3).toBe('document (2).pdf')
    existingFiles.push(uniqueName3)

    // All names should be valid
    existingFiles.forEach((name) => {
      const validation = validateFileName(name)
      expect(validation.valid).toBe(true)
    })

    expect(existingFiles).toHaveLength(3)
  })

  it('should reject invalid characters but accept valid unique names', () => {
    // Try to create a file with invalid characters
    const invalidName = 'file<name>.pdf'
    const validation1 = validateFileName(invalidName)
    expect(validation1.valid).toBe(false)

    // Try with valid name
    const validName = 'file-name.pdf'
    const validation2 = validateFileName(validName)
    expect(validation2.valid).toBe(true)

    // Generate unique name should preserve validity
    const uniqueName = generateUniqueFileName(validName, [validName])
    const validation3 = validateFileName(uniqueName)
    expect(validation3.valid).toBe(true)
    expect(uniqueName).toBe('file-name (1).pdf')
  })
})

describe('Integration: File metadata formatting', () => {
  it('should format file metadata consistently', () => {
    const fileMetadata = {
      name: 'quarterly-report.pdf',
      size: 2048000, // ~2 MB
      createdAt: new Date('2024-01-15T10:00:00Z'),
    }

    // Format size
    const formattedSize = formatBytes(fileMetadata.size)
    expect(formattedSize).toMatch(/MB/)

    // Validate name
    const validation = validateFileName(fileMetadata.name)
    expect(validation.valid).toBe(true)

    // Format date (with fake timers)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))

    const formattedDate = formatDate(fileMetadata.createdAt)
    expect(formattedDate).toMatch(/hour/)

    vi.useRealTimers()
  })

  it('should handle zero-size files gracefully', () => {
    const emptyFileSize = formatBytes(0)
    expect(emptyFileSize).toBe('—')

    const tinyFile = formatBytes(1)
    expect(tinyFile).toBe('1 Bytes')
  })
})

describe('Integration: Batch file operations', () => {
  it('should handle batch upload with multiple files', () => {
    const uploadQueue = [
      'report.pdf',
      'report.pdf', // duplicate
      'analysis.pdf',
      'report.pdf', // another duplicate
      'summary.pdf',
    ]

    const existingFiles: string[] = []
    const processedFiles: { original: string; final: string; size: number }[] = []

    uploadQueue.forEach((fileName, index) => {
      const uniqueName = generateUniqueFileName(fileName, existingFiles)
      const validation = validateFileName(uniqueName)

      expect(validation.valid).toBe(true)

      existingFiles.push(uniqueName)
      processedFiles.push({
        original: fileName,
        final: uniqueName,
        size: 1024000 * (index + 1),
      })
    })

    // Verify the results
    expect(existingFiles).toHaveLength(5)
    expect(existingFiles[0]).toBe('report.pdf')
    expect(existingFiles[1]).toBe('report (1).pdf')
    expect(existingFiles[2]).toBe('analysis.pdf')
    expect(existingFiles[3]).toBe('report (2).pdf')
    expect(existingFiles[4]).toBe('summary.pdf')

    // All files should have valid formatted sizes
    processedFiles.forEach((file) => {
      const formattedSize = formatBytes(file.size)
      expect(formattedSize).not.toBe('—')
      expect(formattedSize).toMatch(/KB|MB|GB/)
    })
  })

  it('should handle files with various extensions', () => {
    const files = ['document.pdf', 'archive.tar.gz', 'image.png', 'README', 'script.js']

    files.forEach((file) => {
      const validation = validateFileName(file)
      expect(validation.valid).toBe(true)

      const uniqueName = generateUniqueFileName(file, [file])
      expect(uniqueName).not.toBe(file)

      const validation2 = validateFileName(uniqueName)
      expect(validation2.valid).toBe(true)
    })
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateUniqueFileName, validateFileName, formatBytes, formatDate } from './format'

describe('generateUniqueFileName', () => {
  it('should return the original name if no conflicts exist', () => {
    const result = generateUniqueFileName('document.pdf', [])
    expect(result).toBe('document.pdf')
  })

  it('should append (1) for first duplicate', () => {
    const result = generateUniqueFileName('document.pdf', ['document.pdf'])
    expect(result).toBe('document (1).pdf')
  })

  it('should increment counter for multiple duplicates', () => {
    const existingNames = ['document.pdf', 'document (1).pdf', 'document (2).pdf']
    const result = generateUniqueFileName('document.pdf', existingNames)
    expect(result).toBe('document (3).pdf')
  })

  it('should handle files without extensions', () => {
    const result = generateUniqueFileName('README', ['README'])
    expect(result).toBe('README (1)')
  })

  it('should handle files with multiple dots', () => {
    const result = generateUniqueFileName('archive.tar.gz', ['archive.tar.gz'])
    expect(result).toBe('archive.tar (1).gz')
  })

  it('should find next available number even with gaps', () => {
    const existingNames = ['file.pdf', 'file (1).pdf', 'file (3).pdf']
    const result = generateUniqueFileName('file.pdf', existingNames)
    expect(result).toBe('file (2).pdf')
  })

  it('should handle large counter numbers', () => {
    const existingNames = Array.from({ length: 100 }, (_, i) =>
      i === 0 ? 'doc.pdf' : `doc (${i}).pdf`
    )
    const result = generateUniqueFileName('doc.pdf', existingNames)
    expect(result).toBe('doc (100).pdf')
  })
})

describe('validateFileName', () => {
  it('should accept valid file names', () => {
    const validNames = ['document.pdf', 'My File 2024.pdf', 'report_final.pdf', 'data-analysis.pdf']

    validNames.forEach((name) => {
      const result = validateFileName(name)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  it('should reject empty or whitespace-only names', () => {
    const emptyNames = ['', '   ', '\t', '\n']

    emptyNames.forEach((name) => {
      const result = validateFileName(name)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name is required')
    })
  })

  it('should reject names that are too long', () => {
    const longName = 'a'.repeat(256)
    const result = validateFileName(longName)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Name is too long (max 255 characters)')
  })

  it('should accept names at maximum length', () => {
    const maxName = 'a'.repeat(255)
    const result = validateFileName(maxName)
    expect(result.valid).toBe(true)
  })

  it('should reject names with invalid characters', () => {
    const invalidNames = [
      'file<name>.pdf',
      'file>name.pdf',
      'file:name.pdf',
      'file"name.pdf',
      'file/name.pdf',
      'file\\name.pdf',
      'file|name.pdf',
      'file?name.pdf',
      'file*name.pdf',
      'file\x00name.pdf', // null character
    ]

    invalidNames.forEach((name) => {
      const result = validateFileName(name)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name contains invalid characters')
    })
  })
})

describe('formatBytes', () => {
  it('should return em dash for zero bytes', () => {
    expect(formatBytes(0)).toBe('—')
  })

  it('should format bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 Bytes')
    expect(formatBytes(1023)).toBe('1023 Bytes')
  })

  it('should format kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(2048)).toBe('2 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
  })

  it('should format megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(2097152)).toBe('2 MB')
    expect(formatBytes(5242880)).toBe('5 MB')
  })

  it('should format gigabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1 GB')
    expect(formatBytes(2147483648)).toBe('2 GB')
  })

  it('should round to 2 decimal places', () => {
    expect(formatBytes(1536000)).toBe('1.46 MB')
    expect(formatBytes(1234567)).toBe('1.18 MB')
  })
})

describe('formatDate', () => {
  const now = new Date('2024-01-15T12:00:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return "Just now" for dates within the last minute', () => {
    const recent = new Date('2024-01-15T11:59:30Z')
    expect(formatDate(recent)).toBe('Just now')
  })

  it('should return minutes ago for dates within the last hour', () => {
    const date1 = new Date('2024-01-15T11:59:00Z')
    expect(formatDate(date1)).toBe('1 minute ago')

    const date30 = new Date('2024-01-15T11:30:00Z')
    expect(formatDate(date30)).toBe('30 minutes ago')
  })

  it('should return hours ago for dates within the last 24 hours', () => {
    const date1 = new Date('2024-01-15T11:00:00Z')
    expect(formatDate(date1)).toBe('1 hour ago')

    const date5 = new Date('2024-01-15T07:00:00Z')
    expect(formatDate(date5)).toBe('5 hours ago')
  })

  it('should return "Yesterday" for dates 1 day ago', () => {
    const yesterday = new Date('2024-01-14T12:00:00Z')
    expect(formatDate(yesterday)).toBe('Yesterday')
  })

  it('should return days ago for dates within the last week', () => {
    const date3 = new Date('2024-01-12T12:00:00Z')
    expect(formatDate(date3)).toBe('3 days ago')
  })

  it('should return formatted date for older dates in same year', () => {
    const oldDate = new Date('2024-01-01T12:00:00Z')
    const result = formatDate(oldDate)
    expect(result).toMatch(/Jan 1/)
    expect(result).not.toMatch(/2024/)
  })

  it('should include year for dates in different year', () => {
    const oldDate = new Date('2023-01-01T12:00:00Z')
    const result = formatDate(oldDate)
    expect(result).toMatch(/Jan 1/)
    expect(result).toMatch(/2023/)
  })
})

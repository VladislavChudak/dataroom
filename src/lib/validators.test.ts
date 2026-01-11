import { describe, it, expect } from 'vitest'
import { dataroomSchema, folderSchema, fileSchema } from './validators'

describe('dataroomSchema', () => {
  it('should accept valid dataroom names', () => {
    const validNames = [
      { name: 'My Dataroom' },
      { name: 'Sales 2024' },
      { name: 'A' },
      { name: 'a'.repeat(100) }, // max length
    ]

    validNames.forEach((input) => {
      const result = dataroomSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  it('should trim whitespace from names', () => {
    const result = dataroomSchema.parse({ name: '  My Dataroom  ' })
    expect(result.name).toBe('My Dataroom')
  })

  it('should reject empty names', () => {
    const result = dataroomSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('should reject whitespace-only names after trimming', () => {
    const result = dataroomSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('should reject names that are too long', () => {
    const longName = 'a'.repeat(101)
    const result = dataroomSchema.safeParse({ name: longName })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be less than 100 characters')
    }
  })
})

describe('folderSchema', () => {
  it('should accept valid folder names', () => {
    const validNames = [
      { name: 'Documents' },
      { name: 'Q1 2024' },
      { name: 'My Folder (1)' },
      { name: 'a'.repeat(255) }, // max length
    ]

    validNames.forEach((input) => {
      const result = folderSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  it('should trim whitespace from folder names', () => {
    const result = folderSchema.parse({ name: '  Reports  ' })
    expect(result.name).toBe('Reports')
  })

  it('should reject empty folder names', () => {
    const result = folderSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Folder name is required')
    }
  })

  it('should reject folder names that are too long', () => {
    const longName = 'a'.repeat(256)
    const result = folderSchema.safeParse({ name: longName })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Folder name must be less than 255 characters')
    }
  })
})

describe('fileSchema', () => {
  it('should accept valid file names', () => {
    const validNames = [
      { name: 'document.pdf' },
      { name: 'report_final.pdf' },
      { name: 'file-2024.pdf' },
      { name: 'a'.repeat(255) }, // max length
    ]

    validNames.forEach((input) => {
      const result = fileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  it('should trim whitespace from file names', () => {
    const result = fileSchema.parse({ name: '  document.pdf  ' })
    expect(result.name).toBe('document.pdf')
  })

  it('should reject empty file names', () => {
    const result = fileSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('File name is required')
    }
  })

  it('should reject file names that are too long', () => {
    const longName = 'a'.repeat(256)
    const result = fileSchema.safeParse({ name: longName })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('File name must be less than 255 characters')
    }
  })
})

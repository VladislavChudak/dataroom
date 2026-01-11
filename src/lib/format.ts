/**
 * Generates a unique filename by appending (1), (2), etc. if name exists
 * Example: "Report.pdf" -> "Report (1).pdf" -> "Report (2).pdf"
 */
export function generateUniqueFileName(name: string, existingNames: string[]): string {
  if (!existingNames.includes(name)) {
    return name
  }

  const nameSet = new Set(existingNames)
  const extMatch = name.match(/^(.+)(\.[^.]+)$/)

  if (!extMatch) {
    // No extension
    let counter = 1
    while (nameSet.has(`${name} (${counter})`)) {
      counter++
    }
    return `${name} (${counter})`
  }

  const [, baseName, ext] = extMatch
  let counter = 1

  while (nameSet.has(`${baseName} (${counter})${ext}`)) {
    counter++
  }

  return `${baseName} (${counter})${ext}`
}

/**
 * Validates a filename
 */
export function validateFileName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }

  if (name.length > 255) {
    return { valid: false, error: 'Name is too long (max 255 characters)' }
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Format file size in bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '—'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format date to relative time or absolute date
 */
export function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

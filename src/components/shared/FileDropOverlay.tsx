import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropOverlayProps {
  isVisible: boolean
}

export function FileDropOverlay({ isVisible }: FileDropOverlayProps) {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm transition-opacity',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="border-primary bg-background/95 flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-12 shadow-lg">
        <div className="bg-primary/10 rounded-full p-6">
          <Upload className="text-primary h-12 w-12" />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold">Drop files to upload</p>
          <p className="text-muted-foreground mt-1 text-sm">PDF files only, max 50MB each</p>
        </div>
      </div>
    </div>
  )
}

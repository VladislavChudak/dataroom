import { useEffect } from 'react'
import { useFileBlob } from '../../hooks/useExplorer'
import { useObjectUrl } from '@/hooks/useObjectUrl'
import { X, Download, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfViewerDialogProps {
  fileId: string
  onClose: () => void
}

export function PdfViewerDialog({ fileId, onClose }: PdfViewerDialogProps) {
  const { data: blob, isLoading, error } = useFileBlob(fileId)
  const blobUrl = useObjectUrl(blob)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when dialog is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between bg-black/50 p-2 md:p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 text-white hover:bg-white/10 md:h-10 md:w-10"
        >
          <X className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="h-9 w-9 text-white hover:bg-white/10 md:h-10 md:w-10"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden p-2 md:p-8">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 className="h-8 w-8 animate-spin md:h-12 md:w-12" />
            <p className="text-sm md:text-base">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 px-4 text-white">
            <AlertCircle className="text-destructive h-8 w-8 md:h-12 md:w-12" />
            <p className="text-center text-sm md:text-base">Failed to load PDF</p>
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        )}

        {blobUrl && (
          <object
            data={blobUrl}
            type="application/pdf"
            className="h-full w-full max-w-6xl rounded-md md:rounded-lg"
          >
            <div className="flex flex-col items-center gap-4 px-4 text-white">
              <p className="text-center text-sm md:text-base">Cannot display PDF in browser</p>
              <Button variant="outline" disabled size="sm">
                Download PDF
              </Button>
            </div>
          </object>
        )}
      </div>
    </div>
  )
}

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'

interface UploadButtonProps {
  dataroomId: string
  folderId: string
  children: ReactNode
}

export function UploadButton({ dataroomId, folderId, children }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { handleFiles } = useFileUpload({ dataroomId, folderId })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    await handleFiles(files)

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <>
      <div onClick={() => inputRef.current?.click()} className="w-full sm:w-auto">
        {children}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  )
}

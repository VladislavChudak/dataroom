import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <AlertCircle className="text-destructive h-12 w-12" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  )
}

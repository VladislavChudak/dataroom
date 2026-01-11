import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NewDataroomButtonProps {
  onClick: () => void
}

export function NewDataroomButton({ onClick }: NewDataroomButtonProps) {
  return (
    <div className="p-4">
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full gap-2 shadow-sm"
        onClick={onClick}
      >
        <Plus className="h-5 w-5" />
        New
      </Button>
    </div>
  )
}

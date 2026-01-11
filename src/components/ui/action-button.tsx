import { Button, buttonVariants } from '@/components/ui/button'
import { type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface ActionButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <Button className="min-w-24" ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : children}
      </Button>
    )
  }
)

ActionButton.displayName = 'ActionButton'

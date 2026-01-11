interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'square' | 'rounded'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-lg',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-16 w-16 text-3xl',
}

const variantClasses = {
  square: 'rounded-md',
  rounded: 'rounded-2xl',
}

export function AppLogo({ size = 'md', variant = 'rounded', className = '' }: AppLogoProps) {
  return (
    <div
      className={`bg-primary text-primary-foreground flex items-center justify-center font-bold ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      D
    </div>
  )
}

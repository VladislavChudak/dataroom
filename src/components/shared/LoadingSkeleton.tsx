import { Skeleton } from '@/components/ui/skeleton'

interface LoadingSkeletonProps {
  count?: number
  className?: string
}

export function LoadingSkeleton({ count = 8, className = 'h-12 w-full' }: LoadingSkeletonProps) {
  return (
    <div className="flex-1 space-y-2 p-4">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  )
}

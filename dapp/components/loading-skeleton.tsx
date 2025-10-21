import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-gray-700", className)} {...props} />
}

export function TokenPurchaseSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress Bar Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Current Price Skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-4 w-24 mx-auto" />
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-3 w-20 mx-auto" />
      </div>

      {/* Currency Buttons Skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Input Skeleton */}
        <Skeleton className="h-10 w-full" />

        {/* Token Calculation Skeleton */}
        <Skeleton className="h-4 w-48 mx-auto" />

        {/* Buy Button Skeleton */}
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Additional Info Skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-3 w-64 mx-auto" />
        <Skeleton className="h-3 w-56 mx-auto" />
      </div>
    </div>
  )
}

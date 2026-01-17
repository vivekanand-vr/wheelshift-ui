import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RolesListViewSkeletonProps {
  count?: number;
}

export function RolesListViewSkeleton({
  count = 6,
}: RolesListViewSkeletonProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Middle section */}
            <div className="hidden items-center gap-4 md:flex">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Right section */}
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="hidden h-9 w-32 rounded sm:block" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

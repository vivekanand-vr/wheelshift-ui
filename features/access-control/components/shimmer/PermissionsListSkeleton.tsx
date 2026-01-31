import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PermissionsListSkeletonProps {
  count?: number;
}

export function PermissionsListSkeleton({
  count = 8,
}: PermissionsListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="flex flex-col p-4">
          {/* Resource Header */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* Permissions List */}
          <div className="flex-1 space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="rounded-lg border p-2.5">
                <div className="mb-1 flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-1 h-3 w-3/4" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

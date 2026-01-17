import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RoleCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-8 shrink-0 rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Stats Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>

          {/* Manage Button */}
          <Skeleton className="h-9 w-full rounded" />
        </div>
      </div>
    </Card>
  );
}

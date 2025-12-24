import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const WidgetSkeleton = () => {
  return (
    <Card className="p-6">
      <Skeleton className="mb-4 h-6 w-32" />
      <Skeleton className="mb-2 h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </Card>
  );
};

export const StatCardSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  );
};

export const ChartSkeleton = () => {
  return (
    <Card className="p-6">
      <Skeleton className="mb-6 h-6 w-32" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 flex-1" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export const ListSkeleton = () => {
  return (
    <Card className="p-6">
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

export function EmployeePermissionsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="border-muted bg-card flex items-start justify-between rounded-lg border px-4 py-3"
        >
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

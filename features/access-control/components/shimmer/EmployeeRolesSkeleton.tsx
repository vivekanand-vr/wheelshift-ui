import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeRolesSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="mt-2 h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

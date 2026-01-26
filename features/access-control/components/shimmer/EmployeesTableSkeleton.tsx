import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeesTableSkeletonProps {
  count?: number;
}

export function EmployeesTableSkeleton({
  count = 6,
}: EmployeesTableSkeletonProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="hidden px-6 py-3 text-left md:table-cell">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="hidden px-6 py-3 text-left lg:table-cell">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="hidden px-6 py-3 text-left xl:table-cell">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="px-6 py-3 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...Array(count)].map((_, i) => (
              <tr key={i}>
                {/* Employee Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </td>

                {/* Position */}
                <td className="hidden px-6 py-4 md:table-cell">
                  <Skeleton className="h-6 w-24" />
                </td>

                {/* Department */}
                <td className="hidden px-6 py-4 lg:table-cell">
                  <Skeleton className="h-6 w-28" />
                </td>

                {/* Status */}
                <td className="hidden px-6 py-4 xl:table-cell">
                  <Skeleton className="h-6 w-16" />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <Skeleton className="ml-auto h-9 w-32" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

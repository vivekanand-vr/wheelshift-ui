import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmployeeRoleDialogSkeletonProps {
  open: boolean;
}

export function EmployeeRoleDialogSkeleton({
  open,
}: EmployeeRoleDialogSkeletonProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-48" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="bg-accent/50 flex items-center gap-3 rounded-lg border p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          {/* Roles List */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-12" />
            </div>
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Skeleton className="mt-0.5 h-4 w-4 rounded" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="mt-2 h-5 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="bg-muted/50 flex justify-end gap-3 border-t pt-4">
          <Skeleton className="h-10 w-20" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

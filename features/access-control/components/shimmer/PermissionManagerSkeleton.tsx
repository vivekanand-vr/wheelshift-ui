import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PermissionManagerSkeletonProps {
  open: boolean;
}

export function PermissionManagerSkeleton({
  open,
}: PermissionManagerSkeletonProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col p-0">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle>
            <Skeleton className="h-6 w-64" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden px-6">
          {/* Search */}
          <div className="relative shrink-0 py-4">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Available Permissions List */}
          <div className="flex flex-1 flex-col overflow-hidden pt-2">
            <div className="mb-3 flex shrink-0 items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <ScrollArea className="-mx-6 flex-1 px-6">
              <div className="space-y-6 pr-4 pb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    {/* Resource Header */}
                    <div className="flex items-center gap-2 py-2">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="ml-auto h-5 w-8 rounded-full" />
                    </div>
                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 gap-2 pl-8 md:grid-cols-2">
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <Skeleton className="mt-0.5 h-4 w-4 rounded" />
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-3.5 w-3.5 rounded" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="bg-muted/50 flex shrink-0 justify-end gap-3 border-t px-6 py-4">
          <Skeleton className="h-10 w-20" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

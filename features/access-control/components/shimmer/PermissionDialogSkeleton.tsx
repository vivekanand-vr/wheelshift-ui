import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface PermissionDialogSkeletonProps {
  open: boolean;
}

export function PermissionDialogSkeleton({
  open,
}: PermissionDialogSkeletonProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-40" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resource */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Permission Name Preview */}
          <div className="rounded-lg border p-3">
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

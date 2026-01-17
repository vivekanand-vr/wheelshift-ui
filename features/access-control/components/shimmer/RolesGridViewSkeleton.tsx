import { RoleCardSkeleton } from "./RoleCardSkeleton";

interface RolesGridViewSkeletonProps {
  count?: number;
}

export function RolesGridViewSkeleton({
  count = 6,
}: RolesGridViewSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <RoleCardSkeleton key={i} />
      ))}
    </div>
  );
}

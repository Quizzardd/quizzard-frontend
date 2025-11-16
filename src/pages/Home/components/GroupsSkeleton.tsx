import GroupCardSkeleton from "./GroupCardSkeleton";

export function GroupsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <GroupCardSkeleton key={i} />
      ))}
    </div>
  );
}

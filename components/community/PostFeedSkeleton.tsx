export function PostFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-40 bg-muted animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}

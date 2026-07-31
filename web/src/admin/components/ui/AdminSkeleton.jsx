export function AdminRowSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-4">
          <div className="h-11 w-11 shrink-0 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/4 rounded bg-gray-200" />
            <div className="h-3 w-1/6 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </>
  );
}

export function AdminCardSkeleton({ className = "h-48" }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />;
}

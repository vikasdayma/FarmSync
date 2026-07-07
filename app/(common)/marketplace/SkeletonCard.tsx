export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-green-100 animate-pulse shadow-sm">
      <div className="h-48 bg-green-50" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-green-100 rounded w-3/4" />
        <div className="h-3 bg-green-100 rounded w-full" />
        <div className="h-3 bg-green-100 rounded w-1/2" />
        <div className="h-8 bg-green-100 rounded-xl mt-2" />
      </div>
    </div>
  )
}
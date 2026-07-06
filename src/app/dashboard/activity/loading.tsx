export default function ActivityLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-8 w-32 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-48 bg-slate-100 rounded mb-8" />
      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

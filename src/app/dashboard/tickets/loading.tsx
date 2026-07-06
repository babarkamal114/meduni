export default function TicketsLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-8 w-36 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-64 bg-slate-100 rounded mb-8" />
      <div className="grid sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-teal-50 rounded-full" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-3 w-28 bg-slate-100 rounded" />
              <div className="h-9 w-28 bg-slate-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

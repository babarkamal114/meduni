export default function AdminModulesLoading(): React.ReactElement {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-28 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-28 bg-slate-100 rounded-lg" />
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <div className="border-b border-black/5 bg-slate-50/80 px-4 py-3 flex gap-4">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-14 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-black/5 last:border-0">
            <div className="h-4 w-48 bg-slate-100 rounded flex-1" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
            <div className="h-4 w-10 bg-slate-100 rounded" />
            <div className="h-8 w-32 bg-slate-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

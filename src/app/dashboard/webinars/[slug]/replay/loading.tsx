export default function ReplayLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-4 w-32 bg-slate-100 rounded mb-6" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="rounded-xl bg-slate-100 aspect-video mb-4" />
          <div className="h-7 w-72 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-slate-100 rounded" />
        </div>
        <aside className="space-y-4">
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
          </div>
        </aside>
      </div>
    </div>
  );
}

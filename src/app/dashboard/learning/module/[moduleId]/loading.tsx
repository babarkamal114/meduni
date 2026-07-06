export default function ModuleLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-4 w-36 bg-slate-100 rounded mb-6" />
      <div className="mb-8">
        <div className="h-3 w-16 bg-teal-50 rounded-full mb-2" />
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-100 rounded mb-4" />
        <div className="flex items-center gap-4">
          <div className="h-2 flex-1 max-w-xs bg-slate-100 rounded-full" />
          <div className="h-3 w-12 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-teal-100 rounded-md mt-4" />
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="h-6 w-16 bg-slate-200 rounded mb-5" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-4">
              <div className="h-10 w-10 bg-slate-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

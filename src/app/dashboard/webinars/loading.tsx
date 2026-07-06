export default function WebinarsLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-8 w-40 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-64 bg-slate-100 rounded mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[20px] overflow-hidden border border-slate-200 bg-white">
            <div className="h-36 bg-gradient-to-br from-slate-200 to-slate-100" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

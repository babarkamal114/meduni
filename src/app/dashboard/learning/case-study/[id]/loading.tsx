export default function CaseStudyLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[800px] animate-pulse">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="h-4 w-36 bg-slate-100 rounded" />
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-20 bg-amber-50 rounded-full mb-3" />
      <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-80 bg-slate-100 rounded mb-8" />
      <div className="rounded-2xl border border-black/5 bg-white p-6 space-y-5">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
          <div className="h-4 w-4/6 bg-slate-100 rounded" />
        </div>
        <div className="space-y-3 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-xl border border-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

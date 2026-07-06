export default function CertificatesLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-8 w-44 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-60 bg-slate-100 rounded mb-8" />
      <div className="grid sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
            <div className="h-5 w-16 bg-teal-50 rounded-full" />
            <div className="h-6 w-full bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="flex gap-3">
              <div className="h-9 w-24 bg-slate-50 rounded-lg" />
              <div className="h-9 w-24 bg-slate-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

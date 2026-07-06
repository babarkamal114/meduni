export default function SettingsLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px] animate-pulse">
      <div className="h-8 w-32 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-56 bg-slate-100 rounded mb-8" />
      <div className="max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-slate-100 rounded" />
            <div className="h-11 w-full bg-slate-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 bg-slate-100 rounded" />
            <div className="h-11 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

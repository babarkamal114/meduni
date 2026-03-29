export default function DashboardWebinarDetailLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px] animate-pulse">
      <div className="h-8 w-32 rounded bg-slate-200 mb-6" />
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="h-36 sm:h-40 bg-slate-200" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-24 rounded-full bg-slate-100" />
          </div>
          <div className="h-8 w-full max-w-md rounded bg-slate-200" />
          <div className="space-y-3">
            <div className="h-4 w-48 rounded bg-slate-100" />
            <div className="h-4 w-56 rounded bg-slate-100" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
          <div className="rounded-xl bg-slate-50 p-6 flex justify-between items-center">
            <div className="h-6 w-24 rounded bg-slate-200" />
            <div className="h-10 w-28 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

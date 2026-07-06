export default function LessonLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px] animate-pulse">
      <div className="h-4 w-32 bg-slate-100 rounded mb-6" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="h-3 w-3 bg-slate-100 rounded-full" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
        <div className="h-7 w-72 bg-slate-200 rounded-lg mb-6" />
        <div className="rounded-xl bg-slate-100 aspect-video mb-6" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
          <div className="h-4 w-4/6 bg-slate-100 rounded" />
        </div>
        <div className="mt-6 pt-6 border-t border-black/5">
          <div className="h-9 w-36 bg-slate-100 rounded-md" />
        </div>
      </div>
      <nav className="flex items-center justify-between pt-6 border-t border-black/5">
        <div className="h-8 w-24 bg-slate-100 rounded" />
        <div className="h-4 w-28 bg-slate-100 rounded" />
        <div className="h-8 w-20 bg-slate-100 rounded" />
      </nav>
    </div>
  );
}

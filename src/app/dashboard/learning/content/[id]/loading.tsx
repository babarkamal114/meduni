export default function ContentLoading(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px] animate-pulse">
      <div className="h-4 w-36 bg-slate-100 rounded mb-6" />
      <div className="h-5 w-20 bg-teal-50 rounded-full mb-3" />
      <div className="h-8 w-72 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-96 bg-slate-100 rounded mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-5/6 bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

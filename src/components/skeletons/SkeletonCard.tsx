export const SkeletonCard = () => {
  return (
    <div
      className={`
        relative
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/60 rounded-xl
        overflow-hidden
        shadow-sm
        p-5
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-700 rounded-2xl ring-1 ring-inset ring-slate-600 animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-7 bg-slate-700 rounded animate-pulse" />
            <div className="w-16 h-4 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
      </div>

      <div className="mb-6 space-y-3">
        <div className="w-32 h-8 bg-slate-700 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
          <div className="w-20 h-5 bg-slate-700 rounded animate-pulse" />
          <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
          <div className="w-16 h-5 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-700/50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-12 h-3 bg-slate-700 rounded animate-pulse" />
            <div className="w-16 h-4 bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

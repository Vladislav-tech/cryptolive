interface SkeletonTableProps {
  count?: number;
}

export const SkeletonTable = ({ count = 9 }: SkeletonTableProps) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/30">
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-12 sticky left-0 z-30"></th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider sticky left-12 z-30 min-w-35 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">Name</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-30">Price</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-35">24h Change</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h High</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h Low</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h Vol</th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-30">Last 7 days</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-3 sticky left-0 z-30 bg-slate-900">
                  <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
                </td>
                <td className="px-3 sticky left-12 z-30 bg-slate-900 min-w-35 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg animate-pulse shrink-0 overflow-hidden" />
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-slate-700 rounded animate-pulse" />
                      <div className="w-12 h-3 bg-slate-700 rounded animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-3 min-w-30">
                  <div className="w-24 h-5 bg-slate-700 rounded animate-pulse" />
                </td>
                <td className="px-3 min-w-35">
                  <div className="w-28 h-5 bg-slate-700 rounded animate-pulse" />
                </td>
                <td className="px-3 min-w-25">
                  <div className="w-20 h-5 bg-slate-700 rounded animate-pulse" />
                </td>
                <td className="px-3 min-w-25">
                  <div className="w-20 h-5 bg-slate-700 rounded animate-pulse" />
                </td>
                <td className="px-3 min-w-25">
                  <div className="w-16 h-5 bg-slate-700 rounded animate-pulse" />
                </td>
                <td className="px-3 min-w-30">
                  <div className="w-full h-10 bg-slate-700 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

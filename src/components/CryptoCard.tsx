import { TrendingUp, TrendingDown, Activity } from 'lucide-react';



export const CryptoCard = () => {
  const isPositive = 1;
  const symbolName = 'BTC';

  return (
    <div
      className={`
        group relative
        bg-glass-bg backdrop-blur-md
        border border-glass-border
        rounded-2xl overflow-hidden
        shadow-2xl shadow-black/40
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-xl
        ${isPositive ? 'hover:shadow-glow-emerald' : 'hover:shadow-glow-rose'}
      `}
    >
      {/* Очень лёгкий градиент-оверлей для глубины */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center
                backdrop-blur-sm transition-colors
                ${isPositive 
                  ? 'bg-emerald-500/10 border-emerald-400/20' 
                  : 'bg-rose-500/10 border-rose-400/20'}
                border
              `}
            >
              <Activity className={`w-7 h-7 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-slate-50 transition-colors">
                {symbolName}
              </h3>
              <p className="text-sm text-slate-400">USDT</p>
            </div>
          </div>

          <div
            className={`
              flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
              backdrop-blur-sm
              ${isPositive 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20' 
                : 'bg-rose-500/15 text-rose-300 border-rose-400/20'}
              border transition-all group-hover:scale-105
            `}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>1%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-4xl font-extrabold text-white tracking-tight">
              100
            </p>
            <p className={`
              text-base font-medium mt-1.5 tracking-wide
              ${isPositive ? 'text-emerald-400' : 'text-rose-400'}
            `}>
              + USD
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/5">
            <div>
              <p className="text-xs text-slate-400 mb-1.5">High</p>
              <p className="text-base font-semibold text-slate-200">$2</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Low</p>
              <p className="text-base font-semibold text-slate-200">3</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Vol (K)</p>
              <p className="text-base font-semibold text-slate-200">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
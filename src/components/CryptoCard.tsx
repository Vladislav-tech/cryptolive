import { TrendingUp, TrendingDown, Heart, ArrowUp, ArrowDown, BarChart3, LoaderCircle } from 'lucide-react';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';
import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';

interface CryptoCardProps {
  crypto: CryptoData;
  isFav: boolean;
}

const IMG_BASE_URL = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color';
const IMG_PLACEHOLDER_URL = 'https://placehold.co/56x56/334155/94a3b8?text=';

const CryptoCardComponent = ({ crypto, isFav }: CryptoCardProps) => {
  const isPositive = parseFloat(crypto.priceChangePercent) >= 0;
  const symbolName = crypto.symbol.replace('USDT', '');
  const navigate = useNavigate({ from: '/' });

  const { mutate: toggleFavorite, isPending } = useFavoriteToggle(
    crypto.symbol.toLowerCase(),
    isFav,
    () => navigate({ to: '/favorites' })
  );

  const handleToggleFav = () => toggleFavorite();

  const trendColor = isPositive ? 'emerald' : 'rose';
  const borderClass = `border-l-4 border-l-${trendColor}-600/80`;

  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0' : num.toLocaleString('en-US');
  };

  return (
    <div
      className={`
        relative
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/60 rounded-xl
        overflow-hidden
        shadow-sm
        transition-all duration-200
        hover:bg-slate-700/70 hover:border-slate-600/80
        ${borderClass}
      `}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-700 rounded-2xl ring-1 ring-inset ring-slate-600 flex-shrink-0 overflow-hidden">
              <img
                src={`${IMG_BASE_URL}/${symbolName.toLowerCase()}.png`}
                alt={symbolName}
                loading="lazy"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${IMG_PLACEHOLDER_URL}${symbolName.slice(0, 3)}`;
                }}
              />
            </div>

            <div>
              <h3 className="text-[26px] font-bold text-white tracking-tight">
                {symbolName}
              </h3>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">
                {crypto.symbol}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFav}
            disabled={isPending}
            className="p-2 -m-2 rounded-full hover:bg-slate-600/40 transition-colors cursor-pointer"
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            title={isPending ? 'Updating favorites status' : isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isPending ? <LoaderCircle className="w-6 h-6 animate-spin text-slate-400" /> : (<Heart
              className={`w-6 h-6 transition-colors duration-200 ${isFav
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-400 hover:text-rose-400'
                }`}
            />)}

          </button>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-semibold text-white tabular-nums font-mono tracking-tighter">
            ${formatNumber(crypto.price)}
          </p>

          <div className={`mt-3 flex items-center gap-2 text-lg font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span>{crypto.priceChange} USD</span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="font-semibold font-mono">
              {isPositive ? '+' : ''}{crypto.priceChangePercent}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-auto pt-5 border-t border-slate-700/50 text-sm">
          <div className="flex items-center gap-1.5">
            <ArrowUp className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-slate-500 text-xs font-medium">High</p>
              <p className="font-semibold text-slate-200 mt-0.5">${formatNumber(crypto.high)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4 text-rose-400" />
            <div>
              <p className="text-slate-500 text-xs font-medium">Low</p>
              <p className="font-semibold text-slate-200 mt-0.5">${formatNumber(crypto.low)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <div>
              <p className="text-slate-500 text-xs font-medium">Vol 24h</p>
              <p className="font-semibold text-slate-200 mt-0.5">{formatNumber(crypto.volume)}K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function areEqual(prevProps: CryptoCardProps, nextProps: CryptoCardProps) {
  return (
    prevProps.crypto.symbol === nextProps.crypto.symbol &&
    prevProps.crypto.price === nextProps.crypto.price &&
    prevProps.crypto.priceChange === nextProps.crypto.priceChange &&
    prevProps.crypto.priceChangePercent === nextProps.crypto.priceChangePercent &&
    prevProps.crypto.volume === nextProps.crypto.volume &&
    prevProps.crypto.high === nextProps.crypto.high &&
    prevProps.crypto.low === nextProps.crypto.low &&
    prevProps.crypto.lastUpdate === nextProps.crypto.lastUpdate
  );
}

export const CryptoCard = memo(CryptoCardComponent, areEqual);
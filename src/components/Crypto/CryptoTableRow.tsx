import { TrendingUp, TrendingDown, Heart, LoaderCircle } from 'lucide-react';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';
import { memo, useCallback } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { usePriceHistoryQuery } from '@/hooks/usePriceHistory';
import { MiniChart } from '@/components/MiniChart';
import { getCoinGeckoId } from '@/utils/mapCoinName';
import { capitalize } from '@/utils/capitalize';

interface CryptoTableProps {
  cryptos: CryptoData[];
  favorites: string[];
}

interface CryptoTableRowProps {
  crypto: CryptoData;
  isFav: boolean;
}

const IMG_BASE_URL = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color';
const IMG_PLACEHOLDER_URL = 'https://placehold.co/32x32/334155/94a3b8?text=';

const CryptoTableRow = ({ crypto, isFav }: CryptoTableRowProps) => {
  const isPositive = parseFloat(crypto.priceChangePercent) >= 0;
  const symbolName = crypto.symbol.replace('USDT', '');
  const navigate = useNavigate({ from: '/' });

  const { data: priceHistory = [] } = usePriceHistoryQuery(
    crypto.symbol.replace('USDT', '').toLowerCase() + 'usdt',
    7
  );

  const isPositiveWeek = priceHistory.length > 0
    ? priceHistory[priceHistory.length - 1].price >= priceHistory[0].price
    : parseFloat(crypto.priceChangePercent) >= 0;

  const { mutate: toggleFavorite, isPending } = useFavoriteToggle(
    crypto.symbol.toLowerCase(),
    isFav,
    () => navigate({ to: '/favorites' })
  );

  const handleToggleFav = useCallback(() => toggleFavorite(), [toggleFavorite]);

  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0' : num.toLocaleString('en-US');
  };

  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group">
      <td className="px-3 sticky left-0 z-30 bg-slate-900  group-hover:bg-slate-800/30">
        <button
          type="button"
          onClick={handleToggleFav}
          disabled={isPending}
          className="p-1.5 rounded-full hover:bg-slate-600/40 transition-colors cursor-pointer"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isPending ? 'Updating favorites status' : isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isPending ? (
            <LoaderCircle className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'
                }`}
            />
          )}
        </button>
      </td>
      <td className="px-3 sticky left-12 z-30 bg-slate-900 group-hover:bg-slate-800/30 min-w-35 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
      <Link to="/coins/$coin" params={{ coin: getCoinGeckoId(crypto.symbol)}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden">
            <img
              src={`${IMG_BASE_URL}/${symbolName.toLowerCase()}.png`}
              alt={symbolName}
              loading="lazy"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${IMG_PLACEHOLDER_URL}${symbolName.slice(0, 3)}`;
              }}
            />
          </div>
          <div className="shrink-0">
            <p className="font-semibold text-white whitespace-nowrap">{capitalize(getCoinGeckoId(symbolName))}</p>
            <p className="text-xs text-slate-400 font-medium whitespace-nowrap">{crypto.symbol}</p>
          </div>
        </div>
        </Link>
      </td>
      <td className="px-3 min-w-30">
        <p className="font-mono text-white font-bold whitespace-nowrap">${formatNumber(crypto.price)}</p>
      </td>
      <td className="px-3 min-w-35">
        <div className={`flex items-center gap-1.5 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 shrink-0" /> : <TrendingDown className="w-4 h-4 shrink-0" />}
          <span className="whitespace-nowrap">{crypto.priceChange} USD</span>
          <span className="text-slate-500 mx-0.5 shrink-0">•</span>
          <span className="font-mono whitespace-nowrap">{isPositive ? '+' : ''}{crypto.priceChangePercent}%</span>
        </div>
      </td>
      <td className="px-3 min-w-25">
        <p className="font-mono text-slate-200 whitespace-nowrap">${formatNumber(crypto.high)}</p>
      </td>
      <td className="px-3 min-w-25">
        <p className="font-mono text-slate-200 whitespace-nowrap">${formatNumber(crypto.low)}</p>
      </td>
      <td className="px-3 min-w-25">
        <p className="font-mono text-slate-200 whitespace-nowrap">{formatNumber(crypto.volume)}K</p>
      </td>
      <td className="px-3 min-w-50">
        <MiniChart data={priceHistory} isPositive={isPositiveWeek} />
      </td>
    </tr>
  );
};

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every(item => setA.has(item));
};

const areEqual = (prevProps: CryptoTableProps, nextProps: CryptoTableProps) => {
  if (prevProps.cryptos.length !== nextProps.cryptos.length) return false;
  if (!arraysEqual(prevProps.favorites, nextProps.favorites)) return false;

  for (let i = 0; i < prevProps.cryptos.length; i++) {
    const prev = prevProps.cryptos[i];
    const next = nextProps.cryptos[i];
    if (
      prev.symbol !== next.symbol ||
      prev.price !== next.price ||
      prev.priceChange !== next.priceChange ||
      prev.priceChangePercent !== next.priceChangePercent ||
      prev.volume !== next.volume ||
      prev.high !== next.high ||
      prev.low !== next.low ||
      prev.lastUpdate !== next.lastUpdate
    ) {
      return false;
    }
  }

  return true;
};

const CryptoTableComponent = ({ cryptos, favorites }: CryptoTableProps) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/30">
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-12 sticky left-0 z-30"></th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider sticky left-12 z-30  min-w-35 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">Name</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-30">Price</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-35">24h Change</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h High</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h Low</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-25">24h Vol</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-50">Last 7 days</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => {
              const isFav = favorites?.includes(crypto.symbol.toLowerCase()) ?? false;
              return <CryptoTableRow key={crypto.symbol} crypto={crypto} isFav={isFav} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CryptoTable = memo(CryptoTableComponent, areEqual);

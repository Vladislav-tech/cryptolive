import { TrendingUp, TrendingDown, Heart, LoaderCircle } from 'lucide-react';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';
import { memo, useCallback, useState, useEffect } from 'react';
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
  isMobile?: boolean;
}

const IMG_BASE_URL = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color';
const IMG_PLACEHOLDER_URL = 'https://placehold.co/32x32/334155/94a3b8?text=';

const CryptoTableRow = ({ crypto, isFav, isMobile = false }: CryptoTableRowProps) => {
  const isPositive = parseFloat(crypto.priceChangePercent) >= 0;
  const symbolName = crypto.symbol.replace('USDT', '');
  const navigate = useNavigate({ from: '/' });
  const [expanded, setExpanded] = useState(false);

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

  const handleToggleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  }, [toggleFavorite]);

  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0' : num.toLocaleString('en-US');
  };

  const formatCompact = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  if (isMobile) {
    return (
      <div className="border-b border-slate-700/50 last:border-0">
        <div 
          className="p-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleFav}
              disabled={isPending}
              className="p-1.5 rounded-full hover:bg-slate-600/40 transition-colors shrink-0"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isPending ? (
                <LoaderCircle className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <Heart
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
              )}
            </button>
            
            <Link 
              to="/coins/$coin" 
              params={{ coin: getCoinGeckoId(crypto.symbol) }}
              className="flex items-center gap-3 flex-1"
              onClick={(e) => e.stopPropagation()}
            >
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
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white truncate">
                    {capitalize(getCoinGeckoId(symbolName))}
                  </p>
                  <p className="font-mono text-white font-bold ml-2">
                    ${formatNumber(crypto.price)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-400 font-medium">
                    {crypto.symbol}
                  </p>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    <span className="text-xs font-medium">
                      {isPositive ? '+' : ''}{crypto.priceChangePercent}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {expanded && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm border-t border-slate-700/30 pt-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">24h Change</p>
                <p className={`font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {crypto.priceChange} USD
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">24h High</p>
                <p className="font-mono text-white">${formatNumber(crypto.high)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">24h Low</p>
                <p className="font-mono text-white">${formatNumber(crypto.low)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">24h Volume</p>
                <p className="font-mono text-white">{formatCompact(crypto.volume)}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-xs text-slate-400 mb-2">Last 7 days</p>
                <div className="h-16">
                  <MiniChart data={priceHistory} isPositive={isPositiveWeek} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group">
      <td className="px-3 sticky left-0 z-30 bg-slate-900 group-hover:bg-slate-800/30">
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
              className={`w-4 h-4 transition-colors duration-200 ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'
              }`}
            />
          )}
        </button>
      </td>
      <td className="px-3 sticky left-12 z-30 bg-slate-900 group-hover:bg-slate-800/30 min-w-35 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
        <Link to="/coins/$coin" params={{ coin: getCoinGeckoId(crypto.symbol) }}>
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
      <td className="px-3 min-w-30">
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-700/50">
          {cryptos.map((crypto) => {
            const isFav = favorites?.includes(crypto.symbol.toLowerCase()) ?? false;
            return (
              <CryptoTableRow 
                key={crypto.symbol} 
                crypto={crypto} 
                isFav={isFav}
                isMobile={true}
              />
            );
          })}
        </div>
      </div>
    );
  }

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
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-white uppercase tracking-wider min-w-50">Last 7 days</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => {
              const isFav = favorites?.includes(crypto.symbol.toLowerCase()) ?? false;
              return <CryptoTableRow key={crypto.symbol} crypto={crypto} isFav={isFav} isMobile={false} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CryptoTable = memo(CryptoTableComponent, areEqual);
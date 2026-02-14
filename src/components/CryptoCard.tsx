import { TrendingUp, TrendingDown, Heart, Star } from 'lucide-react';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';
import { memo, useState } from 'react';
import { useGetFav } from '@/hooks/useGetFav';
import { useAddFav } from '@/hooks/useAddFav';
import { useRemoveFav } from '@/hooks/useRemoveFav';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';


interface CryptoCardProps {
  crypto: CryptoData;
}

export const CryptoCard = memo(({ crypto }: CryptoCardProps) => {
  const isPositive = parseFloat(crypto.priceChangePercent) >= 0;
  const symbolName = crypto.symbol.replace('USDT', '');
  const navigate = useNavigate({ from: '/'})

  const favorites = useGetFav();
  const [isFav, setIsFav] = useState<boolean>(
    favorites?.includes(crypto.symbol.toLowerCase()) ?? false
  );

const handleToggleFav = () => {

  const symbolName = crypto.symbol.replace('USDT', '');

  if (isFav) {
    useRemoveFav(crypto.symbol);
    setIsFav(false);

    toast.success(`Remove from favorites`, {
      description: `${symbolName} is not your favorite any more`,
      duration: 3200,

    });
  } else {
    useAddFav(crypto.symbol);
    setIsFav(true);

    toast.success(`Add to favorites`, {
      description: `${symbolName} now is on you favorites`,
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      duration: 4000,
      action: {
        label: 'Open',
        onClick: () => navigate({ to: '/favorites'}), 
      },
    });
  }
};


  const trendColor = isPositive ? 'emerald' : 'rose';
  const borderClass = `border-l-4 border-l-${trendColor}-600/80`;
  const textChangeClass = `text-${trendColor}-400`;
  const iconColor = `text-${trendColor}-500`;


  const gradientClass = isPositive
    ? 'bg-gradient-to-r from-emerald-950/10 via-emerald-950/3 to-transparent'
    : 'bg-gradient-to-r from-rose-950/10 via-rose-950/3 to-transparent';

  return (
    <div
      className={`
        relative
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/60 rounded-xl
        overflow-hidden
        shadow-sm
        transition-colors duration-200
        hover:bg-slate-700/60 hover:border-slate-600/80
        ${borderClass}
        ${gradientClass}
      `}
    >
      <div className="p-5 flex flex-col h-full relative z-10">

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {symbolName}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              {crypto.symbol}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleFav}
            className="p-2 -m-2 rounded-full hover:bg-slate-600/40 transition-colors"
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`
                w-6 h-6 transition-colors duration-200
                ${isFav
                  ? `fill-rose-500 text-rose-500`
                  : `text-slate-400 hover:text-rose-400`}
              `}
            />
          </button>
        </div>


        <div className="mb-5">
          <p className="text-4xl font-black text-white tabular-nums leading-none">
            ${crypto.price}
          </p>

          <div className={`mt-3 flex items-center gap-2.5 text-lg font-medium ${textChangeClass}`}>
            {isPositive ? (
              <TrendingUp className={`w-5 h-5 ${iconColor}`} />
            ) : (
              <TrendingDown className={`w-5 h-5 ${iconColor}`} />
            )}
            <span>{crypto.priceChange} USD</span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="font-semibold">
              {isPositive ? '+' : ''}{crypto.priceChangePercent}%
            </span>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-4 mt-auto pt-4 border-t border-slate-700/50 text-sm">
          <div>
            <p className="text-slate-500 text-xs font-medium">High</p>
            <p className="font-semibold text-slate-200 mt-0.5">${crypto.high}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Low</p>
            <p className="font-semibold text-slate-200 mt-0.5">${crypto.low}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Vol (24h)</p>
            <p className="font-semibold text-slate-200 mt-0.5">{crypto.volume}K</p>
          </div>
        </div>
      </div>
    </div>
  );
});
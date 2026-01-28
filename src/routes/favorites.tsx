import { ConnectionStatus } from '@/components/ConnectionStatus';
import { CryptoCard } from '@/components/CryptoCard';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { useGetFav } from '@/hooks/useGetFav';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export const Route = createFileRoute('/favorites')({
    component: Favorites,
});

function Favorites() {
    const symbols = useGetFav() ?? [];
    const { cryptoData, isConnected, error } = useCryptoWebSocket(symbols);

    const isLoading = !isConnected || cryptoData.length === 0;
    const hasFavorites = symbols.length > 0;


    const sortedCryptoData = useMemo(() => {
        return [...cryptoData].sort((a, b) =>
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        );
    }, [cryptoData]);

    return (
        <div className="space-y-6 mb-8">
            <ConnectionStatus isConnected={isConnected} error={error} />


            {!hasFavorites && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">

                    <div className="
            relative mb-8
            w-24 h-24 rounded-2xl
            bg-slate-800/40 backdrop-blur-md
            border border-slate-700/50
            flex items-center justify-center
            shadow-lg shadow-black/20
          ">
                        <Star
                            className="w-12 h-12 text-yellow-500 stroke-[1.5]"
                        />

                        <div className="
              absolute inset-0 
              bg-yellow-500/5 rounded-2xl blur-xl 
              opacity-60
            " />
                    </div>

                    <h2 className="
            text-3xl sm:text-4xl font-bold 
            text-white tracking-tight mb-4
          ">
                        Your favorites list is empty
                    </h2>

                    <p className="
            text-lg text-slate-400 max-w-md mx-auto mb-10
            leading-relaxed
          ">

                        Add the coins you want to track in real time.
                        They will be displayed here with current prices and changes.
                    </p>

                    <Link
                        to="/"
                        className="
              inline-flex items-center gap-3 
              px-8 py-4
              bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600
              hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500
              rounded-xl text-white font-semibold text-lg
              shadow-xl shadow-indigo-500/20
              transition-all duration-300 
              hover:shadow-2xl hover:shadow-indigo-500/30
              hover:scale-[1.02]
              active:scale-[0.98]
            "
                    >
                        <TrendingUp className="w-6 h-6" />
                        Go to the list of all coins
                    </Link>

                    <p className="mt-8 text-sm text-slate-500">
                        Click <Heart className="inline w-4 h-4 text-rose-400 fill-rose-400" />
                        next to any coin to add it here
                    </p>
                </div>
            )}

            {hasFavorites && isLoading && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100/10 rounded-full mb-6 backdrop-blur-sm border border-blue-500/20">
                        <TrendingUp className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-slate-300 text-lg font-medium">
                        Loading your favorite coins...
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                        Connecting to Binance WebSocket
                    </p>
                </div>
            )}


            {hasFavorites && !isLoading && cryptoData.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                            Favorites ({cryptoData.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedCryptoData.map((crypto) => (
                            <CryptoCard key={crypto.symbol} crypto={crypto} />
                        ))}
                    </div>
                </>
            )}

            {hasFavorites && !isLoading && cryptoData.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-lg">Data not yet available</p>
                    <p className="text-sm mt-2">Check your connection or try again later</p>
                </div>
            )}
        </div>
    );
}
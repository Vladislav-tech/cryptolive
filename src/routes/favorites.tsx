import { getFavorites } from '@/api/favoritesApi';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import {CryptoCardList} from '@/components/Crypto';
import { SkeletonTable } from '@/components/skeletons';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { FAVORITES_QUERY_KEY } from '@/utils/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export const Route = createFileRoute('/favorites')({
    component: Favorites,
});

function Favorites() {
    const { auth } = Route.useRouteContext();
    const { data: favorites = [], } = useQuery({
        queryKey: FAVORITES_QUERY_KEY,
        queryFn: getFavorites,
        select: (data) => data?.data?.favorites ?? [],
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
        enabled: auth.isAuthenticated,
    });

    if (!auth.isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Heart className="mx-auto w-12 h-12 text-rose-500" />
                    <h1 className="text-3xl font-bold text-white">
                        Please sign in
                    </h1>
                    <p className="text-slate-400">
                        Log in to access your favorites list
                    </p>
                    <Link to="/login" search={{ redirect: '/favorites' }} className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    const { cryptoData, isConnected, error } = useCryptoWebSocket(favorites);

    const isLoading = !isConnected || cryptoData.length === 0;
    const hasFavorites = favorites.length > 0;

    const sortedCryptoData = useMemo(() => {
        const favoritesSet = new Set(favorites.map(favorite => favorite.toLowerCase()));
        const filtered = cryptoData.filter(crypto =>
            favoritesSet.has(crypto.symbol.toLowerCase())
        );
        return [...filtered].sort((a, b) =>
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        );
    }, [cryptoData, favorites]);

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
                    <SkeletonTable count={6} />
                </div>
            )}

            {hasFavorites && !isLoading && cryptoData.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                            Favorites ({favorites.length})
                        </h2>
                    </div>
                    <CryptoCardList cryptos={sortedCryptoData} favorites={favorites} />
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
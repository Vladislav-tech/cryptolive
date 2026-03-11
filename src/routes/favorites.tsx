import { getFavorites } from '@/api/favoritesApi';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import {CryptoCardList} from '@/components/Crypto';
import { SkeletonTable } from '@/components/skeletons';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { FAVORITES_QUERY_KEY } from '@/utils/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart, Star, Plus } from 'lucide-react';
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
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-5">
                    <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                        <Heart className="w-10 h-10 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Please sign in
                    </h1>
                    <p className="text-slate-400 max-w-sm">
                        Log in to access your favorites list and track your preferred coins
                    </p>
                    <Link
                        to="/login"
                        search={{ redirect: '/favorites' }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                    >
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
        <div className="space-y-6">
            <ConnectionStatus isConnected={isConnected} error={error} />
            
            {!hasFavorites && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                            <Star className="w-10 h-10 text-slate-500" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3">
                        No favorites yet
                    </h2>
                    
                    <p className="text-slate-400 max-w-md mb-8">
                        Add coins to your favorites to track them in real time.
                        They will appear here with current prices and changes.
                    </p>
                    
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Browse coins
                    </Link>

                    <p className="mt-8 text-sm text-slate-500 flex items-center gap-1.5">
                        Click <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        next to any coin to add it here
                    </p>
                </div>
            )}

            {hasFavorites && isLoading && (
                <div className="text-center py-8">
                    <SkeletonTable count={6} />
                </div>
            )}

            {hasFavorites && !isLoading && cryptoData.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <Star className="w-5 h-5 text-yellow-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                                Favorites
                            </h2>
                            <span className="px-2.5 py-1 bg-slate-700/50 rounded-full text-sm text-slate-400">
                                {favorites.length}
                            </span>
                        </div>
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
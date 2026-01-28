import { ConnectionStatus } from '@/components/ConnectionStatus';
import { CryptoCard } from '@/components/CryptoCard';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { useGetFav } from '@/hooks/useGetFav';
import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/favorites')({
    component: Favorites,
})

function Favorites() {
    const symbols = useGetFav();
    const { cryptoData, isConnected, error } = useCryptoWebSocket(symbols);

    useEffect(() => {
        console.log('fav data')
    }, [cryptoData]);

    return (
        <div className="space-y-6 mb-8">
            <ConnectionStatus isConnected={isConnected} error={error} />
            {(cryptoData.length === 0 && symbols?.length !== 0) && isConnected && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                    <p className="text-gray-600 text-lg">Loading cryptocurrency data...</p>
                </div>
            )}

            {symbols?.length === 0 && <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No cryptocurrencies in your favorites</p>
            </div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cryptoData.map(crypto => (
                    <div key={crypto.symbol}>
                        <CryptoCard crypto={crypto} />
                    </div>
                ))}
            </div>
        </div>
    )
}

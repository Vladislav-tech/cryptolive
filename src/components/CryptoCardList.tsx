import { CryptoCard } from './CryptoCard';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';

interface CryptoCardListProps {
    cryptos: CryptoData[];
    favorites?: string[];
}

const CryptoCardList = ({ cryptos, favorites }: CryptoCardListProps) => {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cryptos.map(crypto => {
                const isFav = favorites?.includes(crypto.symbol.toLowerCase()) ?? false;
                return (
                    <li key={crypto.symbol}>
                        <CryptoCard crypto={crypto} isFav={isFav} />
                    </li>
                );
            })}
        </ul>
    )
}

export default CryptoCardList;

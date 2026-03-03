import { CryptoTable } from '@/components/Crypto/CryptoTableRow';
import type { CryptoData } from '@/hooks/useCryptoWebSocket';

interface CryptoCardListProps {
    cryptos: CryptoData[];
    favorites?: string[];
}

export const CryptoCardList = ({ cryptos, favorites }: CryptoCardListProps) => {
    return (
        <CryptoTable cryptos={cryptos}  favorites={favorites || []} />
    )
}

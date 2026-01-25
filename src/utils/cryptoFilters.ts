import type { CryptoData } from "@/hooks/useCryptoWebSocket";
import { type SortOption, type FilterOption, type SortType } from "@/components/FilterBar";

export const filterCryptos = (
    cryptos: CryptoData[],
    searchTerm: string,
    filterBy: FilterOption
): CryptoData[] => {
    let filtered = cryptos;

    if (searchTerm) {
        const search = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(crypto => crypto.symbol.toLowerCase().trim().includes(search));
    }

    switch (filterBy) {
        case 'gainers':
            filtered = filtered.filter(crypto => parseFloat(crypto.priceChangePercent) > 0);
            break;

        case 'losers':
            filtered = filtered.filter(crypto => parseFloat(crypto.priceChangePercent) < 0);
            break;
        default:
            break;
    }

    return filtered;
};

export const sortCryptos = (crypto: CryptoData[], sortBy: SortOption, sortType: SortType): CryptoData[] => {
    const sorted = [...crypto];

    switch (sortBy) {
        case 'name':
            sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
            break;
        case 'price':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'change':
            sorted.sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));
            break;
        case 'volume':
            sorted.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
            break;
        default:
            break;
    }

    return sortType === 'asc' ? sorted : sorted.reverse();
}
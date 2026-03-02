import { ConnectionStatus } from '@/components/ConnectionStatus';
import { FilterBar, type FilterOption, type SortOption, type SortType } from '@/components/FilterBar';
import { SearchBar } from '@/components/SearchBar';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { filterCryptos, sortCryptos } from '@/utils/cryptoFilters';
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '@/api/favoritesApi';
import { FAVORITES_QUERY_KEY } from '@/utils/queryKeys';
import { SkeletonList } from '@/components/skeletons';
import CryptoCardList from '@/components/CryptoCardList';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { auth } = Route.useRouteContext();
  const { cryptoData, isConnected, error } = useCryptoWebSocket();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [sortType, setSortType] = useState<SortType>('asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const { data: favorites = [] } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
    select: (data) => data?.data?.favorites || [],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    enabled: auth.isAuthenticated

  });

  const isLoading = !isConnected || cryptoData.length === 0;

  const processedCryptos = useMemo(() => {
    const filtered = filterCryptos(cryptoData, searchTerm, filterBy);
    return sortCryptos(filtered, sortBy, sortType);
  }, [cryptoData, searchTerm, sortBy, filterBy]);

  return (
    <div className="space-y-6 mb-8">
      <ConnectionStatus isConnected={isConnected} error={error} />
      <div
        className="
    bg-glass-bg backdrop-blur-md
    border border-glass-border
    rounded-2xl shadow-2xl shadow-black/30
    p-6 space-y-6
    transition-all duration-300
  "
      >
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSortType={setSortType}
          sortType={sortType}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />
      </div>


      {processedCryptos.length === 0 && cryptoData.length > 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No cryptocurrencies found matching your filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterBy('all');
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {isLoading ? <SkeletonList count={6} /> : <CryptoCardList cryptos={processedCryptos} favorites={favorites} />}

    </div>

  );
}

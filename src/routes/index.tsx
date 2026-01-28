import { ConnectionStatus } from '@/components/ConnectionStatus';
import { CryptoCard } from '@/components/CryptoCard';
import { FilterBar, type FilterOption, type SortOption, type SortType } from '@/components/FilterBar';
import { SearchBar } from '@/components/SearchBar';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { filterCryptos, sortCryptos } from '@/utils/cryptoFilters';
import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { cryptoData, isConnected, error } = useCryptoWebSocket();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [sortType, setSortType] = useState<SortType>('asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

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

      {cryptoData.length === 0 && isConnected && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg">Loading cryptocurrency data...</p>
        </div>
      )}

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedCryptos.map(crypto => (
          <div key={crypto.symbol}>
            <CryptoCard crypto={crypto} />
          </div>
        ))}
      </div>
    </div>

  );
}

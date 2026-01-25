import { ConnectionStatus } from '@/components/ConnectionStatus';
import { CryptoCard } from '@/components/CryptoCard';
import { FilterBar } from '@/components/FilterBar';
import { SearchBar } from '@/components/SearchBar';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="space-y-6 mb-8">
      <ConnectionStatus isConnected={false} error={null} />

      <div
        className="
    bg-glass-bg backdrop-blur-md
    border border-glass-border
    rounded-2xl shadow-2xl shadow-black/30
    p-6 space-y-6
    transition-all duration-300
  "
      >
        <SearchBar value={''} onChange={() => { }} />
        <FilterBar
          sortBy={'name'}
          onSortChange={() => { }}
          filterBy={'all'}
          onFilterChange={() => { }}
        />


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CryptoCard />
      </div>
    </div>

  );
}

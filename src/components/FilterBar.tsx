import { Filter, ArrowUpDown } from 'lucide-react';

export type SortOption = 'name' | 'price' | 'change' | 'volume';
export type FilterOption = 'all' | 'gainers' | 'losers';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export const FilterBar = ({ sortBy, onSortChange, filterBy, onFilterChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2 flex-1">
        <Filter className="text-gray-600 w-5 h-5" />
        <select
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="all">All Coins</option>
          <option value="gainers">Top Gainers</option>
          <option value="losers">Top Losers</option>
        </select>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <ArrowUpDown className="text-gray-600 w-5 h-5" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="change">Sort by Change %</option>
          <option value="volume">Sort by Volume</option>
        </select>
      </div>
    </div>
  );
};

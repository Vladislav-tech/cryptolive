import { Filter, ArrowUpDown, MoveUp, MoveDown } from 'lucide-react';
import React from 'react';


export type SortOption = 'name' | 'price' | 'change' | 'volume';
export type SortType = 'asc' | 'desc';
export type FilterOption = 'all' | 'gainers' | 'losers';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSortType: (sortType: SortType) => void;
  sortType: string;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const FilterBarComponent = ({
  sortBy,
  onSortChange,
  onSortType,
  sortType,
  filterBy,
  onFilterChange,
}: FilterBarProps) => {
  const isAsc = sortType === 'asc';

return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      <div className="flex-1 min-w-0">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1.5">
          <Filter className="w-4 h-4" />
          View
        </label>

        <div className="inline-flex bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-lg p-1 shadow-sm">
          {(['all', 'gainers', 'losers'] as const).map((option) => {
            const isActive = filterBy === option;
            return (
              <button
                key={option}
                onClick={() => onFilterChange(option)}
                className={
                  isActive
                    ? 'px-4 py-2 text-sm font-medium rounded-md bg-slate-700/80 text-white shadow-sm transition-all duration-200'
                    : 'px-4 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all duration-200'
                }
              >
                {option === 'all' ? 'All' : option === 'gainers' ? 'Gainers' : 'Losers'}
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex-1 min-w-0">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1.5">
          <ArrowUpDown className="w-4 h-4" />
          Sort by
        </label>

        <div className="flex items-center gap-2">

          <div className="inline-flex bg-slate-800/50 backdrop-blur-lg border border-slate-700/60 rounded-lg p-1">
            <button
              onClick={() => onSortType('asc')}
              className={
                isAsc
                  ? 'p-2 rounded-md bg-slate-700/80 text-white transition-colors'
                  : 'p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-colors'
              }
              aria-label="Sort ascending"
            >
              <MoveUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSortType('desc')}
              className={
                !isAsc
                  ? 'p-2 rounded-md bg-slate-700/80 text-white transition-colors'
                  : 'p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-colors'
              }
              aria-label="Sort descending"
            >
              <MoveDown className="w-4 h-4" />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="
              flex-1 px-4 py-3
              bg-slate-800/50 backdrop-blur-lg
              border border-slate-700/60 rounded-lg
              text-slate-100
              focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
              transition-all duration-200
              cursor-pointer
              hover:border-slate-600/80
            "
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="change">Change %</option>
            <option value="volume">Volume</option>
          </select>
        </div>
      </div>
    </div>
  );
};

function areEqual(prevProps: FilterBarProps, nextProps: FilterBarProps) {
  return (
    prevProps.sortBy === nextProps.sortBy &&
    prevProps.sortType === nextProps.sortType &&
    prevProps.filterBy === nextProps.filterBy
  );
}

export const FilterBar = React.memo(FilterBarComponent, areEqual);
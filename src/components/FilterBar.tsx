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
    <div className="flex flex-col sm:flex-row gap-5 items-stretch">
      <div className="flex-1 min-w-0">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Filter className="w-4 h-4" />
          View
        </label>
        <div className="inline-flex bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1 shadow-lg shadow-black/10">
          {(['all', 'gainers', 'losers'] as const).map((option) => {
            const isActive = filterBy === option;
            return (
              <button
                key={option}
                onClick={() => onFilterChange(option)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg 
                  transition-all duration-200 ease-out
                  ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-500/90 to-indigo-500/90 shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                  }
                `}
              >
                {option === 'all' ? 'All' : option === 'gainers' ? 'Gainers' : 'Losers'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort by
        </label>
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1 shadow-lg shadow-black/10">
            <button
              onClick={() => onSortType('asc')}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${isAsc 
                  ? 'text-white bg-gradient-to-r from-blue-500/90 to-indigo-500/90 shadow-md shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'}
              `}
              aria-label="Sort ascending"
            >
              <MoveUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSortType('desc')}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${!isAsc 
                  ? 'text-white bg-gradient-to-r from-blue-500/90 to-indigo-500/90 shadow-md shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'}
              `}
              aria-label="Sort descending"
            >
              <MoveDown className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="
                w-full pl-4 pr-10 py-3
                bg-slate-800/80 backdrop-blur-xl
                border border-slate-700/50 rounded-xl
                text-slate-100 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                transition-all duration-200
                appearance-none cursor-pointer
                hover:border-slate-600/80
                shadow-lg shadow-black/10
              "
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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

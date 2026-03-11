import { Filter, ArrowUpDown, TrendingUp, TrendingDown, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { memo, useRef, useEffect } from 'react';

export type SortOption = 'name' | 'price' | 'change' | 'volume';
export type SortType = 'asc' | 'desc';
export type FilterOption = 'all' | 'gainers' | 'losers';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSortType: (sortType: SortType) => void;
  sortType: SortType;
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll('button');
    const activeIndex = Array.from(buttons).findIndex(
      btn => btn.dataset.value === filterBy
    );

    if (activeIndex === -1) return;

    const activeBtn = buttons[activeIndex] as HTMLElement;
    const { offsetLeft, offsetWidth } = activeBtn;

    sliderRef.current.style.transform = `translateX(${offsetLeft}px)`;
    sliderRef.current.style.width = `${offsetWidth}px`;
  }, [filterBy]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-4">

      {/* Filter Tabs */}
      <div
        ref={containerRef}
        className="relative inline-flex bg-slate-700/50 border border-slate-600/50 rounded-lg p-1 overflow-hidden"
      >
        <div
          ref={sliderRef}
          className="absolute inset-y-1 left-0 bg-slate-600 rounded-md transition-all duration-300 ease-out"
          style={{ transform: 'translateX(0px)', width: '0px' }}
        />

        {(['all', 'gainers', 'losers'] as const).map((option) => {
          const isActive = filterBy === option;
          const isGainers = option === 'gainers';
          const isLosers = option === 'losers';

          let icon = <Filter className="w-3.5 h-3.5" />;
          if (isGainers) icon = <TrendingUp className="w-3.5 h-3.5" />;
          if (isLosers) icon = <TrendingDown className="w-3.5 h-3.5" />;

          return (
            <button
              key={option}
              data-value={option}
              onClick={() => onFilterChange(option)}
              className={`
                relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}
              `}
            >
              <span className={isGainers ? 'text-emerald-400' : isLosers ? 'text-rose-400' : ''}>
                {icon}
              </span>
              <span className="hidden sm:inline">{option === 'all' ? 'All' : option === 'gainers' ? 'Gainers' : 'Losers'}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative inline-flex items-center">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-lg pl-9 pr-10 py-2 text-sm text-slate-300 focus:outline-none focus:border-slate-600 hover:border-slate-600 transition-colors cursor-pointer min-w-[140px]"
          >
            <option value="price">Price</option>
            <option value="change">Change %</option>
            <option value="volume">Volume</option>
            <option value="name">Name</option>
          </select>
          <ArrowUpDown className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <ChevronDown className="absolute right-3 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        <button
          onClick={() => onSortType(isAsc ? 'desc' : 'asc')}
          className={`
            p-2 rounded-lg border border-slate-700/50 bg-slate-800/40
            hover:bg-slate-700/50 hover:border-slate-600
            active:scale-95 transition-all duration-200
            flex items-center justify-center w-9 h-9 cursor-pointer
            ${isAsc ? 'text-emerald-400' : 'text-rose-400'}
          `}
          title={isAsc ? 'Sort ascending' : 'Sort descending'}
        >
          {isAsc ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

function areEqual(prev: FilterBarProps, next: FilterBarProps) {
  return (
    prev.sortBy === next.sortBy &&
    prev.sortType === next.sortType &&
    prev.filterBy === next.filterBy
  );
}

export const FilterBar = memo(FilterBarComponent, areEqual);
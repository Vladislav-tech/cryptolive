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
    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center flex-wrap">

      <div 
        ref={containerRef}
        className="relative inline-flex bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1 shadow-sm overflow-hidden"
      >

        <div
          ref={sliderRef}
          className={`
            absolute inset-y-1 left-0 
            bg-linear-to-r from-blue-600/80 to-indigo-600/80 
            rounded-lg transition-all duration-300 ease-out
            shadow-md shadow-indigo-500/20
          `}
          style={{ transform: 'translateX(0px)', width: '0px' }}
        />

        {(['all', 'gainers', 'losers'] as const).map((option) => {
          const isActive = filterBy === option;

          let icon = null;
          let label = '';

          if (option === 'all') {
            label = 'All';
            icon = <Filter className="w-4 h-4" />;
          } else if (option === 'gainers') {
            label = 'Gainers';
            icon = <TrendingUp className="w-4 h-4" />;
          } else {
            label = 'Losers';
            icon = <TrendingDown className="w-4 h-4" />;
          }

          return (
            <button
              key={option}
              data-value={option}
              onClick={() => onFilterChange(option)}
              className={`
                relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative inline-flex items-center">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={`
              appearance-none bg-slate-800/60 backdrop-blur-sm
              border border-slate-700/60 rounded-xl
              pl-9 pr-10 py-2.5 text-sm text-slate-200
              focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
              hover:border-slate-600/80 transition-all duration-200
              cursor-pointer min-w-[160px]
            `}
          >
            <option value="price">Price</option>
            <option value="change">Change %</option>
            <option value="volume">Volume</option>
            <option value="name">Name</option>
          </select>

          <div className="absolute left-3 pointer-events-none">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
          </div>

          <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => onSortType(isAsc ? 'desc' : 'asc')}
          className={`
            p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60
            hover:bg-slate-700/80 hover:border-slate-600/80
            active:scale-95 transition-all duration-200
            flex items-center justify-center w-10 h-10
            ${isAsc ? 'text-emerald-400' : 'text-rose-400'}
          `}
          title={isAsc ? 'Sort ascending' : 'Sort descending'}
        >
          {isAsc ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
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
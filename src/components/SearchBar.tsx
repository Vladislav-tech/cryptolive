import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search cryptocurrency (BTC, ETH...)"
        className={`
          w-full pl-12 pr-5 py-3.5
          bg-slate-800/40 backdrop-blur-xl
          border border-slate-700/60 rounded-xl
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-800/60
          transition-all duration-200
          shadow-sm hover:shadow-md hover:border-slate-600/80
        `}
      />

      <div className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
    </div>
  );
};
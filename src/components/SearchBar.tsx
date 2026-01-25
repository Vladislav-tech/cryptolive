import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search cryptocurrency..."
                className="
w-full pl-12 pr-5 py-3.5
    bg-slate-900/40 backdrop-blur-sm
    border border-white/10
    text-slate-100 placeholder-slate-500
    rounded-xl text-base
    focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
    transition-all duration-200
  "
            />
        </div>
    );
};

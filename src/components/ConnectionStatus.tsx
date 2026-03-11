import { WifiOff, AlertCircle, RadioTower } from 'lucide-react';
import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

const ConnectionStatusComponent = ({ isConnected, error }: ConnectionStatusProps) => {

  let status: 'success' | 'warning' | 'error' = 'warning';
  let icon = <WifiOff className="w-4 h-4" />;
  let bgClass = 'bg-slate-800/50';
  let borderClass = 'border-slate-700';
  let textColor = 'text-slate-300';
  let label = 'Connecting';
  let desc = 'Establishing connection';

  if (error) {
    status = 'error';
    icon = <AlertCircle className="w-4 h-4" />;
    bgClass = 'bg-rose-950/20';
    borderClass = 'border-rose-800/50';
    textColor = 'text-rose-400';
    label = 'Connection Error';
    desc = error;
  } else if (isConnected) {
    status = 'success';
    icon = <RadioTower className="w-4 h-4" />;
    bgClass = 'bg-emerald-950/20';
    borderClass = 'border-emerald-800/50';
    textColor = 'text-emerald-400';
    label = 'Live Updates';
    desc = 'Real-time data from Binance';
  }

  return (
    <div
      className={`
        ${bgClass} backdrop-blur
        border ${borderClass}
        rounded-lg
        px-3 py-2.5 flex items-center gap-3
        transition-colors duration-200
        mt-4
      `}
    >
      <div className={`shrink-0 ${textColor}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${textColor}`}>{label}</p>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
      </div>

      {isConnected && !error && (
        <div className="flex items-center gap-0.5 shrink-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 bg-emerald-500 rounded-full animate-pulse"
              style={{
                height: `${i * 3 + 4}px`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ConnectionStatus = React.memo(ConnectionStatusComponent);
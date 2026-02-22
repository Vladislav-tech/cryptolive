import { WifiOff, AlertCircle, RadioTower } from 'lucide-react';
import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

const ConnectionStatusComponent = ({ isConnected, error }: ConnectionStatusProps) => {

  let status: 'success' | 'warning' | 'error' = 'warning';
  let icon = <WifiOff  className="w-5 h-5" />;
  let bgClass = 'bg-slate-800/50';
  let borderClass = 'border-l-4 border-l-amber-600/80';
  let textColor = 'text-amber-400';
  let label = 'Connecting...';
  let desc = 'Establishing WebSocket connection';

  if (error) {
    status = 'error';
    icon = <AlertCircle className="w-5 h-5" />;
    bgClass = 'bg-slate-800/50';
    borderClass = 'border-l-4 border-l-rose-600/80';
    textColor = 'text-rose-400';
    label = 'Connection Error';
    desc = error;
  } else if (isConnected) {
    status = 'success';
    icon = <RadioTower className="w-5 h-5" color="green"/>;
    borderClass = 'border-l-4 border-l-emerald-600/80';
    textColor = 'text-emerald-400';
    label = 'Live Updates Active';
    desc = 'Real-time data from Binance';
  }

  return (
    <div
      className={`
        relative
        ${bgClass} backdrop-blur-lg
        border border-slate-700/60 ${borderClass}
        rounded-xl
        p-4 flex items-center gap-4
        shadow-sm
        transition-colors duration-200
        hover:bg-slate-700/60 hover:border-slate-600/80
      `}
    >

      <div className="shrink-0">
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${status === 'success' ? 'bg-emerald-950/20' : ''}
            ${status === 'warning' ? 'bg-amber-950/20' : ''}
            ${status === 'error' ? 'bg-rose-950/20' : ''}
          `}
        >
          {icon}
        </div>
      </div>


      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold ${textColor}`}>{label}</p>
        <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
      </div>


      {isConnected && !error && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-end gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`
                  w-1 bg-emerald-500/70 rounded-full
                  animate-pulse
                `}
                style={{
                  height: `${i * 5}px`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ConnectionStatus = React.memo(ConnectionStatusComponent);
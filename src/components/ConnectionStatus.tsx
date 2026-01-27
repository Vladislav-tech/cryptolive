import { Wifi, WifiOff, AlertCircle, RadioTower } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export const ConnectionStatus = ({ isConnected, error }: ConnectionStatusProps) => {
  if (error) {
    return (
      <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-4 flex items-center gap-3 shadow-lg shadow-rose-100/50">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-400 rounded-full opacity-20 blur-sm"></div>
          <AlertCircle className="relative w-6 h-6 text-rose-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-900">Connection Error</p>
          <p className="text-xs text-rose-700 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${
      isConnected 
        ? 'from-emerald-50 to-teal-100 border-emerald-200 shadow-lg shadow-emerald-100/50' 
        : 'from-amber-50 to-orange-100 border-amber-200 shadow-lg shadow-amber-100/50'
    } border rounded-xl p-4 flex items-center gap-3`}>
      <div className="relative">
        <div className={`absolute inset-0 rounded-full opacity-20 blur-sm ${
          isConnected ? 'bg-emerald-400' : 'bg-amber-400'
        }`}></div>
        {isConnected ? (
          <RadioTower className="relative w-6 h-6 text-emerald-600" />
        ) : (
          <WifiOff className="relative w-6 h-6 text-amber-600" />
        )}
      </div>
      <div>
        <p className={`text-sm font-semibold ${
          isConnected ? 'text-emerald-900' : 'text-amber-900'
        }`}>
          {isConnected ? 'Live Updates Active' : 'Connecting...'}
        </p>
        <p className={`text-xs mt-0.5 ${
          isConnected ? 'text-emerald-700' : 'text-amber-700'
        }`}>
          {isConnected ? 'Real-time data from Binance' : 'Establishing WebSocket connection'}
        </p>
      </div>
      {isConnected && (
        <div className="ml-auto flex items-center gap-1">
          <div className="flex items-end space-x-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-emerald-400 to-emerald-500 rounded-full"
                style={{ height: `${i * 4}px` }}
              />
            ))}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></div>
        </div>
      )}
    </div>
  );
};
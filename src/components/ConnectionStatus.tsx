import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export const ConnectionStatus = ({ isConnected, error }: ConnectionStatusProps) => {
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-rose-900">Connection Error</p>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
    } border rounded-xl p-4 flex items-center gap-3`}>
      {isConnected ? (
        <>
          <Wifi className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Live Updates Active</p>
            <p className="text-xs text-emerald-700">Real-time data from Binance</p>
          </div>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Connecting...</p>
            <p className="text-xs text-amber-700">Establishing WebSocket connection</p>
          </div>
        </>
      )}
    </div>
  );
};

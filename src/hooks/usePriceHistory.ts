import { useQuery } from '@tanstack/react-query';
import { PRICE_HISTORY_QUERY_KEY } from '@/utils/queryKeys';
import { MINUTE } from '@/utils/constants';

export interface PricePoint {
  time: number;
  price: number;
}

const HISTORIC_DATA_URL = 'https://api.binance.com/api/v3/klines?symbol';

const fetchPriceHistory = async (symbol: string, days: number): Promise<PricePoint[]> => {
  const interval = days === 1 ? '15m' : '1d';
  const limit = days === 1 ? 96 : days * 2;

  const response = await fetch(
    `${HISTORIC_DATA_URL}=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }

  const data = await response.json();

  return data.map((item: string[]) => ({
    time: parseInt(item[0]),
    price: parseFloat(item[4]),
  }));
};

export const usePriceHistoryQuery = (symbol: string, days: number = 7) => {
  return useQuery({
    queryKey: PRICE_HISTORY_QUERY_KEY(symbol, days),
    queryFn: () => fetchPriceHistory(symbol, days),
    staleTime: MINUTE * 5,
    gcTime: MINUTE * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
};


export const FAVORITES_QUERY_KEY = ['favorites'] as const;
export const USER_QUERY_KEY = ['userInfo'] as const;
export const PRICE_HISTORY_QUERY_KEY = (symbol: string, days: number) => 
  ['priceHistory', symbol, days] as const;
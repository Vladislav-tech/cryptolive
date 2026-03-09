export const TICKER_TO_COINGECKO: Readonly<Record<string, string>> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'SHIB': 'shiba-inu',
    'LTC': 'litecoin',
    'TRX': 'tron',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'ETC': 'ethereum-classic',
    'XLM': 'stellar',
    'NEAR': 'near',
    'ALGO': 'algorand',
};

export const getCoinGeckoId = (ticker: string): string => {
    const symbol = ticker.replace('USDT', '').toUpperCase();
    return TICKER_TO_COINGECKO[symbol] || '';
};

export const getTickerFromCoinGeckoId = (coingeckoId: string): string | null => {
    const reverseMap = Object.entries(TICKER_TO_COINGECKO).reduce(
        (acc, [ticker, id]) => {
            acc[id] = ticker;
            return acc;
        },
        {} as Record<string, string>
    );
    return reverseMap[coingeckoId] || null;
};

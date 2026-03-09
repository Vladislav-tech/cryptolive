import axios from "axios";

export interface CryptoDetail {
    id: string;
    symbol: string;
    name: string;
    description: {
        en?: string
    };
    image: {
        thumb: string;
        small: string;
        large: string;
    }
    market_data: {
        current_price: {
            usd: number;
        }
        market_cap?: {
            usd: number;
        }
        total_volume?: {
            usd: number;
        }
        circulating_supply?: number;
        total_supply?: number;
        max_supply?: number;
        ath?: {
            usd: number;
        }
        atl?: {
            usd: number;
        }
        price_change_percentage_24h?: number;
        price_change_percentage_7d?: number;
        price_change_percentage_30d?: number;
        price_change_percentage_1y?: number;
        high_24h?: {
            usd: number;
        }
        low_24h?: {
            usd: number;
        }
    }
    links?: {
        homepage?: string[];
        twitter_screen_name?: string;
        telegram_channel_identifier?: string;
        subreddit_url?: string;
        repos_url?: {
            github?: string[];
        }
    }
    genesis_date?: string;
    hashing_algorithm?: string;
    categories?: string[];
}

export interface CryptoDetailReturn {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    description: string;
    image: string;
    market_cap?: number;
    total_volume?: number;
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    ath?: number;
    atl?: number;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    price_change_percentage_1y?: number;
    high_24h?: number;
    low_24h?: number;
    links?: {
        homepage?: string[];
        twitter_screen_name?: string;
        telegram_channel_identifier?: string;
        subreddit_url?: string;
        repos_url?: {
            github?: string[];
        }
    }
    genesis_date?: string;
    hashing_algorithm?: string;
    categories?: string[];
}

export interface HistoricalData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';

export const fetchCryptoDetail = async (id: string): Promise<CryptoDetailReturn> => {
    const response = await axios.get<CryptoDetail>(`${COINGECKO_API}/${id}?localization=false&tickers=false`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch cryptocurrency details');
    }

    const data = response.data;

    return {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        current_price: data.market_data.current_price.usd,
        market_cap: data.market_data.market_cap?.usd,
        total_volume: data.market_data.total_volume?.usd,
        circulating_supply: data.market_data.circulating_supply,
        total_supply: data.market_data.total_supply,
        max_supply: data.market_data.max_supply,
        ath: data.market_data.ath?.usd,
        atl: data.market_data.atl?.usd,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data.price_change_percentage_7d,
        price_change_percentage_30d: data.market_data.price_change_percentage_30d,
        price_change_percentage_1y: data.market_data.price_change_percentage_1y,
        high_24h: data.market_data.high_24h?.usd,
        low_24h: data.market_data.low_24h?.usd,
        links: data.links,
        genesis_date: data.genesis_date,
        hashing_algorithm: data.hashing_algorithm,
        categories: data.categories,
        description: data.description?.en ?? '',
        image: data.image.large,
    }
}

export const fetchHistoricalData = async (id: string) => {
    const response = await axios.get<HistoricalData>(`${COINGECKO_API}/${id}/market_chart?vs_currency=usd&days=7&interval=daily`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch cryptocurrency details');
    }

    return response.data;
}

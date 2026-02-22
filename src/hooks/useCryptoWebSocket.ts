import { useEffect, useState, useCallback, useRef, useMemo } from 'react';

export interface CryptoData {
    symbol: string;
    price: string;
    priceChange: string;
    priceChangePercent: string;
    volume: string;
    high: string;
    low: string;
    lastUpdate: number;
}

type CryptoHashTable = Map<string, CryptoData>;

const defaultSymbols = [
    'btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'adausdt',
    'dogeusdt', 'solusdt', 'dotusdt', 'maticusdt', 'shibusdt',
    'ltcusdt', 'trxusdt', 'avaxusdt', 'linkusdt', 'uniusdt',
    'atomusdt', 'etcusdt', 'xlmusdt', 'nearusdt', 'algousdt'
] as const;

const WEB_SOCKET_URL = 'wss://stream.binance.com:9443/stream?streams=';


const BATCH_TIMEOUT = 50;

export const useCryptoWebSocket = (symbols: readonly string[] = defaultSymbols) => {
    const [cryptoData, setCryptoData] = useState<CryptoHashTable>(new Map());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const mapRef = useRef<CryptoHashTable>(new Map());
    const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pendingUpdatesRef = useRef<Map<string, CryptoData>>(new Map());

    useEffect(() => {
        mapRef.current = cryptoData;
    }, [cryptoData]);

    const flushBatchUpdates = useCallback(() => {
        if (pendingUpdatesRef.current.size > 0) {
            setCryptoData(prev => {
                const newMap = new Map(prev);
                for (const [symbol, data] of pendingUpdatesRef.current) {
                    newMap.set(symbol, data);
                }
                pendingUpdatesRef.current.clear();
                return newMap;
            });
        }
    }, []);

    const cryptoList = useMemo(() => {
        return Array.from(cryptoData.values());
    }, [cryptoData]);

    useEffect(() => {
        const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
        const ws = new WebSocket(`${WEB_SOCKET_URL}${streams}`);

        ws.onopen = () => {
            setIsConnected(true);
            setError(null);
        }

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                const data = response.data;

                if (data) {
                    const cryptoEntry: CryptoData = {
                        symbol: data.s,
                        price: parseFloat(data.c).toFixed(2),
                        priceChange: parseFloat(data.p).toFixed(2),
                        priceChangePercent: parseFloat(data.P).toFixed(2),
                        volume: (parseFloat(data.v) / 1000).toFixed(2),
                        high: parseFloat(data.h).toFixed(2),
                        low: parseFloat(data.l).toFixed(2),
                        lastUpdate: Date.now()
                    };

                    
                    pendingUpdatesRef.current.set(data.s, cryptoEntry);

                   
                    if (batchTimerRef.current) {
                        clearTimeout(batchTimerRef.current);
                    }

                    batchTimerRef.current = setTimeout(flushBatchUpdates, BATCH_TIMEOUT);
                }
            } catch (error) {
                console.error(error);
            }
        };

        ws.onerror = () => {
            setError('Error');
            setIsConnected(false);
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('closed')
        };

        return () => {
            if (batchTimerRef.current) {
                clearTimeout(batchTimerRef.current);
            }
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }
    }, [flushBatchUpdates]);

    return {
        cryptoData: cryptoList,
        isConnected,
        error
    }
}
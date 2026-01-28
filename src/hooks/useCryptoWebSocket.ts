import { useEffect, useState, useCallback } from 'react';

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
];


export const useCryptoWebSocket = (symbols: string[] = defaultSymbols) => {
    const [cryptoData, setCryptoData] = useState<CryptoHashTable>(new Map());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {


        const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        ws.onopen = () => {
            setIsConnected(true);
            setError(null);
        }

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                const data = response.data;

                if (data) {
                    setCryptoData(prev => {
                        const newMap = new Map(prev);
                        newMap.set(data.s, {
                            symbol: data.s,
                            price: parseFloat(data.c).toFixed(2),
                            priceChange: parseFloat(data.p).toFixed(2),
                            priceChangePercent: parseFloat(data.P).toFixed(2),
                            volume: (parseFloat(data.v) / 1000).toFixed(2),
                            high: parseFloat(data.h).toFixed(2),
                            low: parseFloat(data.l).toFixed(2),
                            lastUpdate: Date.now()
                        });

                        return newMap;

                    })
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
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }
    }, []);

    const getCryptoList = useCallback(() => {
        return Array.from(cryptoData.values());
    }, [cryptoData]);

    return {
        cryptoData: getCryptoList(),
        isConnected,
        error
    }
}
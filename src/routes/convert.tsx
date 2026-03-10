import { fetchSimplePrice } from '@/api/coingecko';
import { MINUTE } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRightLeft, LoaderCircle, Clock } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/convert')({
    component: RouteComponent,
})

// later will be more currency
const CURRENCY_OPTIONS = [
    { value: 'usd', label: 'USD', symbol: '$' },
    { value: 'eur', label: 'EUR', symbol: '€' },
    { value: 'rub', label: 'RUB', symbol: '₽' },
] as const;

// add later real data coins
const COIN_OPTIONS = [
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'solana', label: 'Solana' },
    { value: 'litecoin', label: 'Litecoin' },
    { value: 'ripple', label: 'XRP' },
    { value: 'dogecoin', label: 'Doge' },
    { value: 'stellar', label: 'Stellar' },
    { value: 'bitcoin-cash', label: 'Bitcoin Cash' },
] as const;

const COIN_NAMES = Object.fromEntries(
    COIN_OPTIONS.map(coin => [coin.value, coin.label])
) as Readonly<Record<typeof COIN_OPTIONS[number]['value'], string>>;

const CURRENCY_SYMBOLS = Object.fromEntries(
    CURRENCY_OPTIONS.map(currency => [currency.value, currency.symbol])
) as Readonly<Record<typeof CURRENCY_OPTIONS[number]['value'], string>>;


function RouteComponent() {
    const [amount, setAmount] = useState('1');
    const [coin, setCoin] = useState<(typeof COIN_OPTIONS)[number]['value']>('bitcoin');
    const [currency, setCurrency] = useState<(typeof CURRENCY_OPTIONS)[number]['value']>('usd');

    const calculateTotal = (quantity: number, price: number) => quantity * price;

    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value)
    }

    const handleChangeCoin = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCoin(event.target.value as typeof coin)
    }

    const handleChangeCurrency = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(event.target.value as typeof currency);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['shortCoinInfo', coin, currency],
        queryFn: () => fetchSimplePrice(coin, currency),
        staleTime: MINUTE * 15,
        gcTime: MINUTE * 20,
    })

    const convertedAmount = data?.[coin]?.[currency]
        ? calculateTotal(+amount, data[coin][currency]).toFixed(2)
        : '0.00';

    const lastUpdatedAt = data?.[coin]?.last_updated_at;

    const formatLastUpdated = (timestamp: number | undefined) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    const exchangeRate = () =>  data?.[coin]?.[currency] || 0;
    
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-text-primary text-3xl font-semibold text-center mb-2">
                    Cryptocurrency Converter
                </h1>
                <p className="text-slate-400 text-sm text-center">
                    Real-time exchange rates
                </p>
            </div>

            <div className="bg-bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-slate-700/50">
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                            Amount
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChangeAmount}
                                value={amount}
                                type="number"
                                min="0"
                                step="any"
                                placeholder="1"
                                className="w-full pl-4 pr-5 py-3.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-100 text-base placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="relative space-y-2">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                            From
                        </label>
                        <select
                            value={coin}
                            onChange={handleChangeCoin}
                            className="w-full appearance-none bg-slate-800/50 border border-slate-700/60 rounded-xl pl-4 pr-10 py-3.5 text-base text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 cursor-pointer"
                        >
                            {COIN_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-9.5 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative space-y-2">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                            To
                        </label>
                        <select
                            value={currency}
                            onChange={handleChangeCurrency}
                            className="w-full appearance-none bg-slate-800/50 border border-slate-700/60 rounded-xl pl-4 pr-10 py-3.5 text-base text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 cursor-pointer"
                        >
                            {CURRENCY_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-9.5 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="text-center">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 text-slate-400">
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Loading rate...</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-baseline justify-center gap-1 flex-wrap">
                                    <span className="text-4xl font-semibold text-text-primary">
                                        {CURRENCY_SYMBOLS[currency]}{convertedAmount}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium uppercase">
                                        {currency}
                                    </span>
                                </div>
                                {!isLoading && data?.[coin] && (
                                    <p className="text-slate-500 text-xs mt-3">
                                        1 {COIN_NAMES[coin]} = {CURRENCY_SYMBOLS[currency]}{exchangeRate()} {currency.toUpperCase()}                                    </p>
                                )}
                                {lastUpdatedAt && (
                                    <p className="text-slate-500 text-xs mt-2 flex items-center justify-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        <span>Last updated: {formatLastUpdated(lastUpdatedAt)}</span>
                                    </p>
                                )}
                            </>
                        )}
                        {isError && (
                            <div className="text-red-500 text-sm mt-2">
                                Error: {error?.message || 'Failed to load rate'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

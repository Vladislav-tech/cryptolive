import { fetchCryptoDetail, fetchHistoricalData } from '@/api/coingecko'
import type { CoinDataType, RawCoinDataType } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Brush } from 'recharts';
import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  LoaderCircle,
  Globe,
  Twitter,
  Send,
  MessageCircle,
  Github,
  TrendingUp,
  Activity,
  Calendar,
  Hash,
  Heart,
  Share2,
  Bookmark,
  Star,
  Zap,
  BarChart3,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { FAVORITES_QUERY_KEY } from '@/utils/queryKeys';
import { getFavorites } from '@/api/favoritesApi';

export const Route = createFileRoute('/coins/$coin')({
  component: RouteComponent,
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price < 1 ? 6 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};

function RouteComponent() {
  const { coin } = Route.useParams()
  const { auth } = Route.useRouteContext();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'stats' | 'links'>('chart');

  const { data: favorites = [] } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
    select: (data) => data?.data?.favorites || [],
    refetchOnWindowFocus: false,
    enabled: auth.isAuthenticated,
  })

  const { data: historicalData, isLoading: chartLoading } = useQuery({
    queryKey: ['historicalData', coin],
    queryFn: () => fetchHistoricalData(coin)
  })

  const { data: coinData, isLoading: coinLoading } = useQuery({
    queryKey: [coin],
    queryFn: () => fetchCryptoDetail(coin)
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setActiveTab(prev => {
        if (prev === 'chart') return 'stats';
        if (prev === 'stats') return 'links';
        return 'chart';
      });
    } else {
      setActiveTab(prev => {
        if (prev === 'links') return 'stats';
        if (prev === 'stats') return 'chart';
        return 'links';
      });
    }
  };

  const coinSymbol = coinData?.symbol?.toLowerCase() || '';
  const isFav = favorites.some((f: string) => f.toLowerCase() === `${coinSymbol}usdt`);

  const { mutate: toggleFavorite, isPending } = useFavoriteToggle(
    `${coinSymbol}usdt`,
    isFav
  );

  const formatCoinData = (data: RawCoinDataType[] = []) => {
    const formattedData: CoinDataType[] = [];

    data.forEach((item) => {
      const formattedCoin: CoinDataType = {
        date: formatDate({ dateToFormat: item[0], shortType: 'detailed' }),
        price: +item[1].toFixed(2),
      };

      formattedData.push(formattedCoin);
    })

    return formattedData;
  }

  const formattedData = formatCoinData(historicalData?.prices);

  const minPrice = formattedData.length > 0
    ? Math.min(...formattedData.map(d => d.price))
    : 0;

  const maxPrice = formattedData.length > 0
    ? Math.max(...formattedData.map(d => d.price))
    : 0;

  const currentPrice = coinData?.current_price || 0;
  const priceChange = coinData?.price_change_percentage_7d?.toFixed(2) || '0.00';
  const isPositive = Number(priceChange) >= 0;

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe || isRightSwipe) {
      handleSwipe(isLeftSwipe ? 'left' : 'right');
    }
    setTouchStart(0);
    setTouchEnd(0);
  };



  const formatCompactNumber = (num: number) => {
    if (!num) return '—';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercentage = (num: number | undefined) => {
    if (num === undefined) return '—';
    const isPos = num >= 0;
    return (
      <span className={isPos ? 'text-accent-green' : 'text-accent-red'}>
        {isPos ? '+' : ''}{num.toFixed(2)}%
      </span>
    );
  };

  const formatSupply = (num: number | undefined) => {
    if (num === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: coinData?.name,
          text: `Check out ${coinData?.name} on CryptoLive`,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (coinLoading || chartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-bg-card/50 rounded-2xl p-4 sm:p-6 border border-slate-700/50 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <img
              src={coinData?.image}
              alt={coinData?.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain bg-bg-card p-2 shadow-xl border border-slate-700/50"
            />
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {coinData?.name}
                </h1>
                {coinData?.market_cap_rank && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                    #{coinData.market_cap_rank}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-slate-400 text-sm uppercase font-semibold tracking-wide">
                  {coinData?.symbol}
                </span>
                {coinData?.categories && coinData.categories.length > 0 && (
                  <>
                    <span className="text-slate-600">•</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {coinData.categories.slice(0, 4).map((cat, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium hover:bg-blue-500/15 transition-colors cursor-default"
                        >
                          {cat}
                        </span>
                      ))}
                      {coinData.categories.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">
                          +{coinData.categories.length - 4}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:self-start">
            <button
              onClick={() => toggleFavorite()}
              disabled={isPending}
              className={`
                flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:h-10 rounded-xl font-medium
                transition-all duration-200 border
                cursor-pointer
                ${isFav
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                }
              `}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isPending ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
              )}
              <span className="hidden sm:inline ml-2 text-sm">Favorite</span>
            </button>

            <button
              onClick={handleShare}
              className="
                flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:h-10 rounded-xl font-medium
                bg-slate-800/50 border border-slate-700/50 text-slate-400
                hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10
                transition-all duration-200
                cursor-pointer
              "
              title="Share"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline ml-2 text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Price and 7d change */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-slate-700/50">
          <div className="min-w-0">
            <span className="text-3xl sm:text-5xl font-bold text-text-primary tracking-tight">
              {formatPrice(currentPrice)}
            </span>
            <div className="mt-3 max-w-md">
              <ATHProgress current={currentPrice} ath={coinData?.ath} atl={coinData?.atl} />
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold whitespace-nowrap ${isPositive
            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
            : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
            }`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            {priceChange}% (7d)
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="24h Change"
            value={formatPercentage(coinData?.price_change_percentage_24h)}
            isPositive={coinData?.price_change_percentage_24h !== undefined && coinData.price_change_percentage_24h >= 0}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="7d Change"
            value={formatPercentage(coinData?.price_change_percentage_7d)}
            isPositive={coinData?.price_change_percentage_7d !== undefined && coinData.price_change_percentage_7d >= 0}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="30d Change"
            value={formatPercentage(coinData?.price_change_percentage_30d)}
            isPositive={coinData?.price_change_percentage_30d !== undefined && coinData.price_change_percentage_30d >= 0}
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="1y Change"
            value={formatPercentage(coinData?.price_change_percentage_1y)}
            isPositive={coinData?.price_change_percentage_1y !== undefined && coinData.price_change_percentage_1y >= 0}
          />
        </div>
      </div>

      {/* Main grid with swipe support for mobile */}
      <div 
        className="lg:hidden mb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Tab indicators */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'chart'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all mx-2 ${
              activeTab === 'stats'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'links'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            About
          </button>
        </div>
        
        {/* Swipe hint */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mb-3">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Swipe to navigate</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>

        {/* Tab content */}
        <div className="space-y-4">
          {activeTab === 'chart' && (
            <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Price Chart (7 Days)
                </h2>
                <div className="flex gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20 whitespace-nowrap">
                    L: {formatPrice(minPrice)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 whitespace-nowrap">
                    H: {formatPrice(maxPrice)}
                  </span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? '#34d399' : '#f87171'}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? '#34d399' : '#f87171'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                      minTickGap={20}
                      interval="equidistantPreserveStart"
                    />
                    <YAxis
                      dataKey="price"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                      tickFormatter={(value) => `$${formatCompactNumber(value)}`}
                      domain={[
                        minPrice > 0 ? minPrice - minPrice * 0.02 : minPrice * 0.98,
                        maxPrice > 0 ? maxPrice + maxPrice * 0.02 : maxPrice * 1.02
                      ]}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '10px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        fontSize: '11px',
                      }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '6px' }}
                      formatter={(value: number | undefined) => [formatPrice(value || 0), 'Price']}
                      labelFormatter={(label) => {
                        return new Date(label).toLocaleString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        });
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? '#34d399' : '#f87171'}
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                      dot={false}
                      activeDot={{ fill: isPositive ? '#34d399' : '#f87171', r: 4 }}
                      animationDuration={1000}
                    />
                    <Brush
                      dataKey="date"
                      height={35}
                      stroke={isPositive ? '#34d399' : '#f87171'}
                      fill="#1e293b"
                      tickFormatter={(date) => {
                        return new Date(date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        });
                      }}
                      travellerWidth={8}
                      padding={{ top: 8, bottom: 8, left: 15, right: 15 }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <AreaChart>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={isPositive ? '#34d399' : '#f87171'}
                          fill={isPositive ? '#34d399' : '#f87171'}
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </Brush>

                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Market Stats
                </h2>
                <div className="space-y-2">
                  <InfoRow
                    label="Market Cap"
                    value={formatCompactNumber(coinData?.market_cap || 0)}
                  />
                  <InfoRow
                    label="24h Volume"
                    value={formatCompactNumber(coinData?.total_volume || 0)}
                  />
                  <InfoRow
                    label="24h High"
                    value={formatPrice(coinData?.high_24h || 0)}
                  />
                  <InfoRow
                    label="24h Low"
                    value={formatPrice(coinData?.low_24h || 0)}
                  />
                  <InfoRow
                    label="Circulating Supply"
                    value={`${formatSupply(coinData?.circulating_supply)} ${coinData?.symbol.toUpperCase()}`}
                  />
                  <InfoRow
                    label="Total Supply"
                    value={`${formatSupply(coinData?.total_supply)} ${coinData?.symbol.toUpperCase()}`}
                  />
                  <InfoRow
                    label="Max Supply"
                    value={formatSupply(coinData?.max_supply)}
                  />
                </div>
              </div>

              <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  All-Time
                </h2>
                <div className="space-y-2">
                  <InfoRow
                    label="ATH"
                    value={formatPrice(coinData?.ath || 0)}
                  />
                  <InfoRow
                    label="ATL"
                    value={formatPrice(coinData?.atl || 0)}
                  />
                  {coinData?.hashing_algorithm && (
                    <InfoRow
                      label="Algorithm"
                      value={coinData.hashing_algorithm}
                    />
                  )}
                  <InfoRow
                    label="Launch Date"
                    value={coinData?.genesis_date || '—'}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              {coinData?.links && Object.keys(coinData.links).length > 0 && (
                <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Links
                  </h2>
                  <div className="space-y-1.5">
                    {coinData.links.homepage?.[0] && (
                      <a
                        href={coinData.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                          <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                            Website
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {new URL(coinData.links.homepage[0]).hostname}
                          </div>
                        </div>
                      </a>
                    )}
                    {coinData.links.twitter_screen_name && (
                      <a
                        href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                          <Twitter className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                            Twitter
                          </div>
                          <div className="text-[10px] text-slate-400">
                            @{coinData.links.twitter_screen_name}
                          </div>
                        </div>
                      </a>
                    )}
                    {coinData.links.telegram_channel_identifier && (
                      <a
                        href={`https://t.me/${coinData.links.telegram_channel_identifier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                          <Send className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                            Telegram
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {coinData.links.telegram_channel_identifier}
                          </div>
                        </div>
                      </a>
                    )}
                    {coinData.links.subreddit_url && (
                      <a
                        href={coinData.links.subreddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/40 shrink-0">
                          <MessageCircle className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-text-primary group-hover:text-orange-400 transition-colors">
                            Reddit
                          </div>
                          <div className="text-[10px] text-slate-400">
                            r/{coinData.symbol}
                          </div>
                        </div>
                      </a>
                    )}
                    {coinData.links.repos_url?.github?.[0] && (
                      <a
                        href={coinData.links.repos_url.github[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-md bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:border-slate-500 shrink-0">
                          <Github className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-text-primary group-hover:text-white transition-colors">
                            GitHub
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Source Code
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {coinData?.description && typeof coinData.description === 'string' && coinData.description.length > 0 && (
                <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-primary">
                      About {coinData?.name}
                    </h2>
                    <button
                      onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                      className="flex cursor-pointer items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isAboutExpanded ? (
                        <>
                          <span>Show less</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Show more</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className={`text-xs text-slate-300 leading-relaxed prose prose-invert max-w-none prose-p:my-1.5 prose-a:text-blue-400 hover:prose-a:text-blue-300 ${
                      isAboutExpanded ? '' : 'line-clamp-4'
                    }`}
                    dangerouslySetInnerHTML={{ __html: coinData.description }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout*/}
      <div className="hidden lg:grid grid-cols-3 gap-4 lg:gap-6">
        {/* Chart*/}
        <div className="col-span-2">
          <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50 h-full">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Price Chart (7 Days)
              </h2>
              <div className="flex gap-1.5">
                <span className="text-xs px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20 whitespace-nowrap">
                  L: {formatPrice(minPrice)}
                </span>
                <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 whitespace-nowrap">
                  H: {formatPrice(maxPrice)}
                </span>
              </div>
            </div>
            <div className="h-72 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={formattedData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? '#34d399' : '#f87171'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? '#34d399' : '#f87171'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                    minTickGap={20}
                    interval="equidistantPreserveStart"
                  />
                  <YAxis
                    dataKey="price"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                    tickFormatter={(value) => `$${formatCompactNumber(value)}`}
                    domain={[
                      minPrice > 0 ? minPrice - minPrice * 0.02 : minPrice * 0.98,
                      maxPrice > 0 ? maxPrice + maxPrice * 0.02 : maxPrice * 1.02
                    ]}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '10px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      fontSize: '11px',
                    }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '6px' }}
                    formatter={(value: number | undefined) => [formatPrice(value || 0), 'Price']}
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#34d399' : '#f87171'}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                    dot={false}
                    activeDot={{ fill: isPositive ? '#34d399' : '#f87171', r: 4 }}
                    animationDuration={1000}
                  />
                  <Brush
                    dataKey="date"
                    height={35}
                    stroke={isPositive ? '#34d399' : '#f87171'}
                    fill="#1e293b"
                    tickFormatter={(date) => {
                      return new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      });
                    }}
                    travellerWidth={8}
                    padding={{ top: 8, bottom: 8, left: 15, right: 15 }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <AreaChart>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? '#34d399' : '#f87171'}
                        fill={isPositive ? '#34d399' : '#f87171'}
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </Brush>

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Left column */}
        <div className="lg:col-span-1 order-2 space-y-4">
          <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Market Stats
            </h2>
            <div className="space-y-2">
              <InfoRow
                label="Market Cap"
                value={formatCompactNumber(coinData?.market_cap || 0)}
              />
              <InfoRow
                label="24h Volume"
                value={formatCompactNumber(coinData?.total_volume || 0)}
              />
              <InfoRow
                label="24h High"
                value={formatPrice(coinData?.high_24h || 0)}
              />
              <InfoRow
                label="24h Low"
                value={formatPrice(coinData?.low_24h || 0)}
              />
              <InfoRow
                label="Circulating Supply"
                value={`${formatSupply(coinData?.circulating_supply)} ${coinData?.symbol.toUpperCase()}`}
              />
              <InfoRow
                label="Total Supply"
                value={`${formatSupply(coinData?.total_supply)} ${coinData?.symbol.toUpperCase()}`}
              />
              <InfoRow
                label="Max Supply"
                value={formatSupply(coinData?.max_supply)}
              />
            </div>
          </div>

          <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              All-Time
            </h2>
            <div className="space-y-2">
              <InfoRow
                label="ATH"
                value={formatPrice(coinData?.ath || 0)}
              />
              <InfoRow
                label="ATL"
                value={formatPrice(coinData?.atl || 0)}
              />
              {coinData?.hashing_algorithm && (
                <InfoRow
                  label="Algorithm"
                  value={coinData.hashing_algorithm}
                />
              )}
              <InfoRow
                label="Launch Date"
                value={coinData?.genesis_date || '—'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Links and Description - Desktop */}
      <div className="hidden lg:grid grid-cols-3 gap-4 lg:gap-6 mt-4">
        {coinData?.links && (
          <div className="bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              Links
            </h2>
            <div className="space-y-1.5">
              {coinData.links.homepage?.[0] && (
                <a
                  href={coinData.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Website
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {new URL(coinData.links.homepage[0]).hostname}
                    </div>
                  </div>
                </a>
              )}
              {coinData.links.twitter_screen_name && (
                <a
                  href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Twitter className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Twitter
                    </div>
                    <div className="text-[10px] text-slate-400">
                      @{coinData.links.twitter_screen_name}
                    </div>
                  </div>
                </a>
              )}
              {coinData.links.telegram_channel_identifier && (
                <a
                  href={`https://t.me/${coinData.links.telegram_channel_identifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Send className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Telegram
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {coinData.links.telegram_channel_identifier}
                    </div>
                  </div>
                </a>
              )}
              {coinData.links.subreddit_url && (
                <a
                  href={coinData.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/40 shrink-0">
                    <MessageCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text-primary group-hover:text-orange-400 transition-colors">
                      Reddit
                    </div>
                    <div className="text-[10px] text-slate-400">
                      r/{coinData.symbol}
                    </div>
                  </div>
                </a>
              )}
              {coinData.links.repos_url?.github?.[0] && (
                <a
                  href={coinData.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:border-slate-500 shrink-0">
                    <Github className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text-primary group-hover:text-white transition-colors">
                      GitHub
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Source Code
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {coinData?.description && typeof coinData.description === 'string' && coinData.description.length > 0 && (
          <div className="lg:col-span-2 bg-bg-card rounded-xl p-4 shadow-card border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">
                About {coinData?.name}
              </h2>
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="flex cursor-pointer items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isAboutExpanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Show more</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            <div
              className={`text-xs text-slate-300 leading-relaxed prose prose-invert max-w-none prose-p:my-1.5 prose-a:text-blue-400 hover:prose-a:text-blue-300 ${
                isAboutExpanded ? '' : 'line-clamp-6'
              }`}
              dangerouslySetInnerHTML={{ __html: coinData.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  isPositive
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  isPositive?: boolean;
}) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all">
      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 mb-1.5 sm:mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`text-base sm:text-lg font-bold ${typeof isPositive === 'boolean'
        ? isPositive ? 'text-accent-green' : 'text-accent-red'
        : 'text-text-primary'
        }`}>
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-700/30 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-text-primary text-right truncate ml-2">{value}</span>
    </div>
  );
}

function ATHProgress({ current, ath, atl }: { current: number; ath?: number; atl?: number }) {
  if (!ath || !atl || !current) return null;

  const percentFromAth = ((ath - current) / ath * 100);
  const rangePercent = ath !== atl ? Math.min(100, Math.max(0, ((current - atl) / (ath - atl) * 100))) : 50;
  const isNearAth = percentFromAth < 20;
  const isNearAtl = percentFromAth > 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          <span className="text-rose-400 font-medium">ATL</span> {formatPrice(atl)}
        </span>
        <span className={`font-medium transition-colors ${isNearAth ? 'text-emerald-400' : isNearAtl ? 'text-rose-400' : 'text-slate-300'
          }`}>
          {percentFromAth >= 0 ? `${percentFromAth.toFixed(1)}% below ATH` : `${Math.abs(percentFromAth).toFixed(1)}% above ATH`}
        </span>
        <span className="text-slate-400">
          {formatPrice(ath)} <span className="text-emerald-400 font-medium">ATH</span>
        </span>
      </div>
      <div className="relative h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-rose-500/80 via-yellow-500/80 to-emerald-500/80"
          style={{ width: '100%' }}
        />
        <div
          className={`absolute h-full w-1.5 bg-white rounded-full shadow-lg transform -translate-x-1/2 transition-all ${isNearAth ? 'shadow-emerald-500/50' : isNearAtl ? 'shadow-rose-500/50' : ''
            }`}
          style={{ left: `${rangePercent}%` }}
        />
      </div>
    </div>
  );
}

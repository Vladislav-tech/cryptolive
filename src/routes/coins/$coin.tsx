import { fetchCryptoDetail, fetchHistoricalData } from '@/api/coingecko'
import type { CoinDataType, RawCoinDataType } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  LoaderCircle,
  Globe,
  Twitter,
  Send,
  MessageCircle,
  Github,
  Coins,
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
  Info
} from 'lucide-react';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { FAVORITES_QUERY_KEY } from '@/utils/queryKeys';
import { getFavorites } from '@/api/favoritesApi';

export const Route = createFileRoute('/coins/$coin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { coin } = Route.useParams()
  const { auth } = Route.useRouteContext();

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
        date: formatDate({ dateToFormat: item[0], shortType: 'very-short' }),
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={coinData?.image}
              alt={coinData?.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-contain bg-bg-card p-2 shadow-lg border border-slate-700/50"
            />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-text-primary truncate">
                {coinData?.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-slate-400 text-xs sm:text-sm uppercase font-semibold">
                  {coinData?.symbol}
                </span>
                {coinData?.categories && coinData.categories.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {coinData.categories.slice(0, 3).map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toggleFavorite()}
              disabled={isPending}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium
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
                <LoaderCircle className="w-5 h-5 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 sm:w-5 sm:h-5 ${isFav ? 'fill-rose-500' : ''}`} />
              )}
              <span className="hidden sm:inline">{isFav ? 'Favorited' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={handleShare}
              className="
                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium
                bg-slate-800/50 border border-slate-700/50 text-slate-400
                hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10
                transition-all duration-200
                cursor-pointer
              "
              title="Share"
            >
              <Share2 className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <span className="text-3xl sm:text-5xl font-bold text-text-primary tracking-tight wrap-break-word">
              {formatPrice(currentPrice)}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap ${isPositive
            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
            : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
            }`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5 sm:w-5 sm:h-5" /> : <ArrowDownRight className="w-5 h-5 sm:w-5 sm:h-5" />}
            {priceChange}% (7d)
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6">
          <StatCard
            icon={<Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
            label="24h Change"
            value={formatPercentage(coinData?.price_change_percentage_24h)}
            isPositive={coinData?.price_change_percentage_24h !== undefined && coinData.price_change_percentage_24h >= 0}
          />
          <StatCard
            icon={<TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
            label="7d Change"
            value={formatPercentage(coinData?.price_change_percentage_7d)}
            isPositive={coinData?.price_change_percentage_7d !== undefined && coinData.price_change_percentage_7d >= 0}
          />
          <StatCard
            icon={<Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
            label="30d Change"
            value={formatPercentage(coinData?.price_change_percentage_30d)}
            isPositive={coinData?.price_change_percentage_30d !== undefined && coinData.price_change_percentage_30d >= 0}
          />
          <StatCard
            icon={<BarChart3 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
            label="1y Change"
            value={formatPercentage(coinData?.price_change_percentage_1y)}
            isPositive={coinData?.price_change_percentage_1y !== undefined && coinData.price_change_percentage_1y >= 0}
          />
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl p-4 sm:p-6 mb-6 shadow-card border border-slate-700/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 sm:w-5 sm:h-5 text-blue-400" />
            Price Chart (7 Days)
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 sm:px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20 whitespace-nowrap">
              Low: {formatPrice(minPrice)}
            </span>
            <span className="text-xs px-2 sm:px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 whitespace-nowrap">
              High: {formatPrice(maxPrice)}
            </span>
          </div>
        </div>
        <div className="h-75 sm:h-100 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
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
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
                minTickGap={15}
                interval="preserveStartEnd"
              />
              <YAxis
                dataKey="price"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
                tickFormatter={(value) => `$${formatCompactNumber(value)}`}
                domain={[
                  minPrice > 0 ? minPrice - minPrice * 0.02 : minPrice * 0.98,
                  maxPrice > 0 ? maxPrice + maxPrice * 0.02 : maxPrice * 1.02
                ]}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                formatter={(value: number | undefined) => [formatPrice(value || 0), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#34d399' : '#f87171'}
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
                activeDot={{ fill: isPositive ? '#34d399' : '#f87171', r: 5 }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-2 bg-bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-slate-700/50">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-5 sm:h-5 text-emerald-400" />
            Market Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <InfoRow
              icon={<Coins className="w-5 h-5 text-yellow-500" />}
              label="Market Cap"
              value={formatCompactNumber(coinData?.market_cap || 0)}
            />
            <InfoRow
              icon={<Activity className="w-5 h-5 text-blue-400" />}
              label="24h Volume"
              value={formatCompactNumber(coinData?.total_volume || 0)}
            />
            <InfoRow
              icon={<ArrowUpRight className="w-5 h-5 text-emerald-400" />}
              label="24h High"
              value={formatPrice(coinData?.high_24h || 0)}
            />
            <InfoRow
              icon={<ArrowDownRight className="w-5 h-5 text-rose-400" />}
              label="24h Low"
              value={formatPrice(coinData?.low_24h || 0)}
            />
            <InfoRow
              icon={<Coins className="w-5 h-5 text-purple-400" />}
              label="Circulating Supply"
              value={`${formatSupply(coinData?.circulating_supply)} ${coinData?.symbol.toUpperCase()}`}
            />
            <InfoRow
              icon={<Coins className="w-5 h-5 text-indigo-400" />}
              label="Total Supply"
              value={`${formatSupply(coinData?.total_supply)} ${coinData?.symbol.toUpperCase()}`}
            />
            <InfoRow
              icon={<Bookmark className="w-5 h-5 text-orange-400" />}
              label="Max Supply"
              value={formatSupply(coinData?.max_supply)}
            />
            <InfoRow
              icon={<Calendar className="w-6 h-6 text-cyan-400" />}
              label="Launch Date"
              value={coinData?.genesis_date || '—'}
            />``
          </div>
        </div>

        <div className="bg-bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-slate-700/50">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2 mb-4 sm:mb-6">
            <Star className="w-5 h-5 sm:w-5 sm:h-5 text-yellow-500" />
            All-Time Stats
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <InfoRow
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              label="All-Time High"
              value={formatPrice(coinData?.ath || 0)}
            />
            <InfoRow
              icon={<ArrowDownRight className="w-5 h-5 text-rose-400" />}
              label="All-Time Low"
              value={formatPrice(coinData?.atl || 0)}
            />
            {coinData?.hashing_algorithm && (
              <InfoRow
                icon={<Hash className="w-5 h-5 text-purple-400" />}
                label="Algorithm"
                value={coinData.hashing_algorithm}
              />
            )}
            <InfoRow
              icon={<Info className="w-5 h-5 text-blue-400" />}
              label="Symbol"
              value={coinData?.symbol.toUpperCase() || '—'}
            />
            <InfoRow
              icon={<Info className="w-5 h-5 text-slate-400" />}
              label="ID"
              value={coinData?.id || '—'}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {coinData?.links && (
          <div className="bg-bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-slate-700/50">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2 mb-4 sm:mb-6">
              <Globe className="w-5 h-5 sm:w-5 sm:h-5 text-blue-400" />
              Links & Resources
            </h2>
            <div className="space-y-2">
              {coinData.links.homepage?.[0] && (
                <a
                  href={coinData.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Globe className="w-5 h-5 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Official Website
                    </div>
                    <div className="text-xs text-slate-400 truncate">
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
                  className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Twitter className="w-5 h-5 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Twitter
                    </div>
                    <div className="text-xs text-slate-400">
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
                  className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                    <Send className="w-5 h-5 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      Telegram
                    </div>
                    <div className="text-xs text-slate-400">
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
                  className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/40 shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-orange-400 transition-colors">
                      Reddit
                    </div>
                    <div className="text-xs text-slate-400">
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
                  className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:border-slate-500 shrink-0">
                    <Github className="w-5 h-5 sm:w-5 sm:h-5 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                      GitHub
                    </div>
                    <div className="text-xs text-slate-400">
                      Source Code
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {coinData?.description && typeof coinData.description === 'string' && coinData.description.length > 0 && (
          <div className="lg:col-span-2 bg-bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-slate-700/50">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">
              About {coinData?.name}
            </h2>
            <div
              className="text-sm sm:text-base text-slate-300 leading-relaxed prose prose-invert max-w-none prose-p:my-2 prose-a:text-blue-400 hover:prose-a:text-blue-300"
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all group">
      <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-text-primary truncate">{value}</div>
      </div>
    </div>
  );
}

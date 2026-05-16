export type CryptoPeriod = '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';

export const CRYPTO_PERIODS: CryptoPeriod[] = ['1D', '1W', '1M', '3M', '1Y', 'All'];

export const CRYPTO_PERIOD_LABELS: Record<CryptoPeriod, string> = {
  '1D': '1일',
  '1W': '1주',
  '1M': '1개월',
  '3M': '3개월',
  '1Y': '1년',
  'All': '전체',
};

export function cryptoPeriodToDays(period: CryptoPeriod): string {
  const map: Record<CryptoPeriod, string> = {
    '1D': '1',
    '1W': '7',
    '1M': '30',
    '3M': '90',
    '1Y': '365',
    'All': 'max',
  };
  return map[period];
}

export function formatCryptoPrice(value: number): string {
  if (value < 0.000001) return `$${value.toExponential(4)}`;
  if (value < 0.01) return `$${value.toFixed(6)}`;
  if (value < 1) return `$${value.toFixed(4)}`;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSupply(value: number | null): string {
  if (value === null) return '무제한';
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatCryptoLarge(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatVolumeAxis(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

// 타입 정의
export interface CryptoMarketData {
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume24h: number;
  high24h: number;
  low24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  priceChangePercent7d: number;
  priceChangePercent30d: number;
  priceChangePercent1y: number;
  ath: number;
  athChangePercent: number;
  athDate: string;
  atl: number;
  atlChangePercent: number;
  atlDate: string;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
}

export interface CryptoCommunityData {
  twitterFollowers: number | null;
  redditSubscribers: number | null;
  redditAvgPosts48h: number;
  redditAvgComments48h: number;
  redditAccountsActive48h: number | null;
  telegramUsers: number | null;
}

export interface CryptoDeveloperData {
  forks: number;
  stars: number;
  totalIssues: number;
  closedIssues: number;
  pullRequestsMerged: number;
  commitCount4Weeks: number;
  codeAdditions4Weeks: number;
  codeDeletions4Weeks: number;
}

export interface CryptoDetail {
  id: string;
  symbol: string;
  name: string;
  image: string;
  description: string;
  links: {
    homepage: string;
    subreddit: string;
    github: string;
  };
  marketData: CryptoMarketData;
  communityData: CryptoCommunityData;
  developerData: CryptoDeveloperData | null;
  fetchedAt: string;
}

export interface CryptoChartPoint {
  t: number;
  date: string;
  price: number;
  volume: number;
  marketCap: number;
}

export interface CryptoDetailResponse {
  data: CryptoDetail | null;
  error: string | null;
  fetchedAt: string;
}

export interface CryptoMarketChartResponse {
  id: string;
  days: number;
  data: CryptoChartPoint[];
  fetchedAt: string;
}

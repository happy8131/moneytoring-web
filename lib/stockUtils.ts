// 종목 상세 페이지 관련 유틸 함수

export type Period = '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '2Y' | '5Y' | '10Y' | 'All';

export interface PeriodRange {
  from: number;
  to: number;
  resolution: 'D' | 'W' | 'M' | '1' | '5' | '15' | '30' | '60';
}

export function getPeriodRange(period: Period): PeriodRange {
  const to = Math.floor(Date.now() / 1000);

  switch (period) {
    case '1W':
      return { from: to - 7 * 86400, to, resolution: 'D' };
    case '1M':
      return { from: to - 30 * 86400, to, resolution: 'D' };
    case '3M':
      return { from: to - 90 * 86400, to, resolution: 'D' };
    case '6M':
      return { from: to - 180 * 86400, to, resolution: 'W' };
    case 'YTD': {
      const jan1 = new Date(new Date().getFullYear(), 0, 1);
      return { from: Math.floor(jan1.getTime() / 1000), to, resolution: 'W' };
    }
    case '1Y':
      return { from: to - 365 * 86400, to, resolution: 'W' };
    case '2Y':
      return { from: to - 730 * 86400, to, resolution: 'W' };
    case '5Y':
      return { from: to - 1825 * 86400, to, resolution: 'M' };
    case '10Y':
      return { from: to - 3650 * 86400, to, resolution: 'M' };
    case 'All':
      return { from: to - 36500 * 86400, to, resolution: 'M' };
  }
}

// 차트 데이터 포맷
export interface CandleData {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  date: string;
}

export interface StockProfile {
  name: string;
  ticker: string;
  exchange: string;
  currency: string;
  country: string;
  logo: string;
  weburl: string;
  marketCapitalization: number;
  shareOutstanding: number;
  finnhubIndustry: string;
}

export interface StockMetric {
  peBasicExclExtraTTM?: number;
  epsBasicExclExtraTTM?: number;
  high52Week?: number;
  low52Week?: number;
  averageVolume10D?: number;
  dividendYieldIndicatedAnnual?: number;
  marketCapitalization?: number;
}

export interface IndicatorData {
  t: number[];
  values: number[];
  indicator: 'rsi' | 'sma';
  timeperiod: number;
}

export interface FinancialPeriod {
  year: number;
  quarter?: number;
  revenue?: number;
  netIncome?: number;
  operatingIncome?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  freeCashFlow?: number;
}

// 숫자 포맷팅
export function formatLargeNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatVolume(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export interface ETFHolding {
  symbol: string;
  name: string;
  share: number;
  value: number;
  pct: number;
}

export interface ETFSectorExposure {
  sector: string;
  exposure: number;
}

// Finnhub /forex/rates는 USD base 기준이므로 quote 통화 코드만 보관
export const FOREX_SYMBOLS = ['KRW', 'JPY', 'CNY', 'EUR'] as const;
export type ForexCurrency = (typeof FOREX_SYMBOLS)[number];

export const FOREX_LABELS: Record<ForexCurrency, { pair: string; name: string }> = {
  KRW: { pair: 'USD/KRW', name: '미국 달러 / 한국 원' },
  JPY: { pair: 'USD/JPY', name: '미국 달러 / 일본 엔' },
  CNY: { pair: 'USD/CNY', name: '미국 달러 / 중국 위안' },
  EUR: { pair: 'USD/EUR', name: '미국 달러 / 유로' },
};

// 원자재 ETF 프록시 (Finnhub Free tier 안정성을 위해 ETF 사용)
export const COMMODITY_SYMBOLS = ['USO', 'UNG', 'GLD', 'SLV'] as const;
export type CommoditySymbol = (typeof COMMODITY_SYMBOLS)[number];

export const COMMODITY_LABELS: Record<CommoditySymbol, { name: string; underlying: string }> = {
  USO: { name: 'USO', underlying: 'WTI 원유' },
  UNG: { name: 'UNG', underlying: '천연가스' },
  GLD: { name: 'GLD', underlying: '금' },
  SLV: { name: 'SLV', underlying: '은' },
};

export interface ForexRate {
  kind: 'forex';
  symbol: ForexCurrency;
  pair: string;
  name: string;
  rate: number;
  change: number | null;
  percentChange: number | null;
}

export interface CommodityQuote {
  kind: 'commodity';
  symbol: CommoditySymbol;
  name: string;
  underlying: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

export interface ForexCommoditiesResponse {
  forex: ForexRate[];
  commodities: CommodityQuote[];
  errors: { symbol: string; message: string }[];
  fetchedAt: string;
}

// 통화별 소수점 표시 자릿수 (KRW/JPY는 큰 수, CNY/EUR는 작은 수)
export function formatForexRate(currency: ForexCurrency, rate: number): string {
  if (currency === 'KRW' || currency === 'JPY') {
    return rate.toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return rate.toFixed(4);
}

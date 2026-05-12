/**
 * 시장 데이터 공통 타입 정의
 * CoinGecko(암호화폐) + Finnhub(주식) 통합 인터페이스
 */

// ─── 공통 자산 인터페이스 ───────────────────────────────────────────────────

/** 자산 종류 구분 */
export type AssetType = 'crypto' | 'stock';

/**
 * 공통 시세 아이템 인터페이스
 * Finnhub 주식과 CoinGecko 암호화폐 데이터를 동일 구조로 표현
 */
export interface MarketItem {
  /** 고유 식별자 (coingecko id 또는 ticker symbol) */
  id: string;
  /** 표시 이름 (예: Bitcoin, Apple Inc.) */
  name: string;
  /** 심볼 (예: BTC, AAPL) */
  symbol: string;
  /** 자산 종류 */
  type: AssetType;
  /** 현재 USD 가격 */
  currentPrice: number;
  /** 24시간 가격 변화율 (%) */
  priceChangePercent24h: number;
  /** 24시간 가격 변화 절대값 (USD) */
  priceChange24h: number;
  /** 시가총액 (USD, 주식은 marketCap 없으면 null) */
  marketCap: number | null;
  /** 24시간 거래량 (USD) */
  volume24h: number | null;
  /** 아이콘 이미지 URL (코인게코 제공, 주식은 null) */
  imageUrl: string | null;
  /** 마지막 업데이트 시각 (ISO 8601) */
  lastUpdated: string;
}

/** 검색 결과 아이템 */
export interface SearchResultItem {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  /** 코인 썸네일 URL */
  thumb?: string;
  /** 시가총액 순위 (암호화폐) */
  marketCapRank?: number;
}

// ─── CoinGecko 원본 응답 타입 ───────────────────────────────────────────────

/**
 * GET /coins/markets 응답 아이템
 * https://docs.coingecko.com/reference/coins-markets
 */
export interface CoinGeckoMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

/**
 * GET /simple/price 응답
 * 예: { bitcoin: { usd: 50000, usd_24h_change: 2.5, usd_24h_vol: 1000000000 } }
 */
export type CoinGeckoSimplePriceResponse = Record<
  string,
  {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
    last_updated_at?: number; // UNIX timestamp
  }
>;

/**
 * GET /search 응답
 */
export interface CoinGeckoSearchResponse {
  coins: CoinGeckoSearchCoin[];
  exchanges: unknown[];
  categories: unknown[];
  nfts: unknown[];
}

export interface CoinGeckoSearchCoin {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

// ─── API 라우트 응답 타입 ───────────────────────────────────────────────────

/** API 라우트 표준 성공 응답 래퍼 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  /** 캐시 만료 시각 (ISO 8601) */
  cachedUntil?: string;
}

/** API 라우트 표준 에러 응답 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── React Query 키 타입 ────────────────────────────────────────────────────

export const QUERY_KEYS = {
  cryptoPrices: (ids: string[]) => ['crypto', 'prices', ids] as const,
  cryptoMarkets: (page: number) => ['crypto', 'markets', page] as const,
  cryptoSearch: (query: string) => ['crypto', 'search', query] as const,
} as const;

import type { StockQuote, CryptoQuote, NewsItem, SearchResult } from '@/types';

// API 에러 클래스
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// 기본 fetch 래퍼
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, `API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new Error(`Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 주식 시세 조회
export async function fetchStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  const params = new URLSearchParams({ symbols: symbols.join(',') });
  return fetchAPI<StockQuote[]>(`/api/stocks?${params}`);
}

// 주식 검색
export async function searchStocks(query: string): Promise<StockQuote[]> {
  const params = new URLSearchParams({ q: query });
  return fetchAPI<StockQuote[]>(`/api/stocks/search?${params}`);
}

// 암호화폐 시세 조회
export async function fetchCryptoQuotes(ids: string[]): Promise<CryptoQuote[]> {
  const params = new URLSearchParams({ ids: ids.join(',') });
  return fetchAPI<CryptoQuote[]>(`/api/crypto?${params}`);
}

// 암호화폐 검색
export async function searchCryptos(query: string): Promise<CryptoQuote[]> {
  const params = new URLSearchParams({ q: query });
  return fetchAPI<CryptoQuote[]>(`/api/crypto/search?${params}`);
}

// 통합 검색
export async function searchAll(query: string): Promise<SearchResult> {
  try {
    const [stocks, cryptos] = await Promise.allSettled([
      searchStocks(query),
      searchCryptos(query),
    ]);

    return {
      stocks: stocks.status === 'fulfilled' ? stocks.value : [],
      cryptos: cryptos.status === 'fulfilled' ? cryptos.value : [],
    };
  } catch (error) {
    console.error('Search failed:', error);
    return { stocks: [], cryptos: [] };
  }
}

// 뉴스 조회
export async function fetchNews(category?: string): Promise<NewsItem[]> {
  const params = new URLSearchParams(category ? { category } : {});
  return fetchAPI<NewsItem[]>(`/api/news?${params}`);
}

// 회사별 뉴스
export async function fetchCompanyNews(symbol: string): Promise<NewsItem[]> {
  const params = new URLSearchParams({ symbol });
  return fetchAPI<NewsItem[]>(`/api/news/company?${params}`);
}

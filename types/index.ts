// 주식 시세 정보
export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  timestamp: number;
}

// 암호화폐 시세 정보
export interface CryptoQuote {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
}

// 포트폴리오 보유 종목
export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  buyDate: string; // ISO string
  type: 'stock' | 'crypto' | 'korean-stock';
  currentPrice?: number;
  gain?: number;
  gainPercent?: number;
  totalValue?: number;
}

// 즐겨찾기 항목
export interface Favorite {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'korean-stock';
  addedAt: string;
}

// 뉴스 항목
export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

// 거래 기록 (매수/매도)
export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string; // YYYY-MM-DD
  memo?: string;
}

// AI 투자 추천
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'diversification' | 'risk' | 'opportunity' | 'rebalancing';
  action: string;
}

// 포트폴리오 저장소 (localStorage)
export interface PortfolioStore {
  holdings: Holding[];
  favorites: Favorite[];
  readNews: string[];
  transactions: Transaction[];
  lastUpdated: string;
}

// 포트폴리오 요약
export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  totalGainPercent: number;
  holdingsCount: number;
}

// 검색 결과
export interface SearchResult {
  stocks: StockQuote[];
  cryptos: CryptoQuote[];
}

// 공유 포트폴리오
export interface PortfolioShare {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  shareLink: string;
  viewsCount: number;
  followersCount: number;
  holdingsSnapshot: Holding[];
  createdAt: string;
  updatedAt: string;
  profile?: {
    username: string;
    avatarUrl?: string;
    isExpert?: boolean;
  };
}

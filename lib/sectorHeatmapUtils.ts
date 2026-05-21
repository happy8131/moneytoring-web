// S&P 500 주요 섹터별 상위 5개 종목 (Finnhub Free tier 60 calls/min 한도 내 안정)
// 11 × 5 = 55개 (한도 내 100% 안정성 보장)
export const SP500_SECTORS: Record<string, string[]> = {
  Technology: ['AAPL', 'MSFT', 'NVDA', 'META', 'GOOGL'],
  'Healthcare': ['JNJ', 'UNH', 'LLY', 'ABBV', 'MRK'],
  'Financials': ['JPM', 'BAC', 'WFC', 'GS', 'MS'],
  'Industrials': ['BA', 'CAT', 'RTX', 'HON', 'LMT'],
  'Consumer Discretionary': ['TSLA', 'AMZN', 'HD', 'MCD', 'NKE'],
  'Consumer Staples': ['PG', 'KO', 'WMT', 'COST', 'PEP'],
  'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG'],
  'Utilities': ['NEE', 'DUK', 'SO', 'AEP', 'D'],
  'Real Estate': ['PLD', 'AMT', 'EQIX', 'WELL', 'SPG'],
  'Materials': ['LIN', 'SHW', 'APD', 'FCX', 'ECL'],
  'Communication Services': ['NFLX', 'DIS', 'CMCSA', 'VZ', 'T'],
};

export interface SectorHeatmapStock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

export interface SectorHeatmapData {
  sector: string;
  count: number;
  stocks: SectorHeatmapStock[];
}

export function getSectorOrder(): string[] {
  return [
    'Technology',
    'Healthcare',
    'Financials',
    'Industrials',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Utilities',
    'Real Estate',
    'Materials',
    'Communication Services',
  ];
}

export function getColorForPercentChange(percentChange: number): string {
  if (percentChange >= 2) return 'bg-emerald-600';      // 진한 초록
  if (percentChange >= 0) return 'bg-emerald-500';      // 중간 초록
  if (percentChange >= -1) return 'bg-red-400';         // 연한 빨강
  return 'bg-red-600';                                   // 진한 빨강
}

export function getTextColorForPercentChange(percentChange: number): string {
  if (percentChange >= 0) return 'text-white';
  return 'text-white';
}

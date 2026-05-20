// S&P 500 주요 섹터별 상위 10개 종목
export const SP500_SECTORS: Record<string, string[]> = {
  Technology: ['AAPL', 'MSFT', 'NVDA', 'META', 'GOOGL', 'AVGO', 'NFLX', 'CRM', 'NOW', 'INTU'],
  'Healthcare': ['JNJ', 'UNH', 'LLY', 'ABBV', 'MRK', 'PFE', 'AMGN', 'AZN', 'TMO', 'ISRG'],
  'Financials': ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'BLK', 'AXP', 'BK', 'PNC', 'USB'],
  'Industrials': ['BA', 'CAT', 'RTX', 'HON', 'ITW', 'DE', 'LMT', 'MMM', 'GE', 'NOC'],
  'Consumer Discretionary': ['TSLA', 'AMZN', 'HD', 'MCD', 'SBUX', 'NKE', 'APTV', 'RCL', 'MAR', 'ORLY'],
  'Consumer Staples': ['PG', 'KO', 'WMT', 'MO', 'CL', 'KMB', 'ADM', 'JXN', 'GIS', 'CPB'],
  'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'HES', 'OXY'],
  'Utilities': ['NEE', 'DUK', 'SO', 'AEP', 'EXELON', 'SRE', 'PEG', 'EXC', 'AWK', 'LNT'],
  'Real Estate': ['DLR', 'PLD', 'SPG', 'EQR', 'ARE', 'WELL', 'PSA', 'EQIX', 'KIM', 'AVB'],
  'Materials': ['LIN', 'NEM', 'MOS', 'FCX', 'SCCO', 'ALB', 'DD', 'APD', 'SHW', 'PPG'],
  'Communication Services': ['GOOG', 'META', 'NFLX', 'DIS', 'CMCSA', 'VZ', 'T', 'PARA', 'LUMN', 'TMUS'],
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

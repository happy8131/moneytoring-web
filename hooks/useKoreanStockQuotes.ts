'use client';

import { useQuery } from '@tanstack/react-query';

export interface KoreanStockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  percentChange: number;
  volume: number;
  tradingValue: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  upperLimit: number;
  lowerLimit: number;
  market: string;
  updatedAt: string;
}

interface KoreanStockQuotesResponse {
  data: KoreanStockQuote[];
}

interface UseKoreanStockQuotesProps {
  symbols: string[];
  enabled?: boolean;
}

export function useKoreanStockQuotes({
  symbols,
  enabled = true,
}: UseKoreanStockQuotesProps) {
  const sortedSymbols = [...symbols].sort();

  return useQuery<KoreanStockQuotesResponse>({
    queryKey: ['korean-stocks', 'quotes', sortedSymbols.join(',')],
    queryFn: async () => {
      const params = new URLSearchParams({
        symbols: symbols.join(','),
      });
      const response = await fetch(`/api/korean-stocks/quotes?${params}`);
      if (!response.ok) throw new Error('Failed to fetch Korean stock quotes');
      return response.json();
    },
    enabled: enabled && symbols.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchInterval: 30_000, // 30초마다 백그라운드 갱신
  });
}

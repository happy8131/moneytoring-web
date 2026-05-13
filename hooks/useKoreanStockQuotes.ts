'use client';

import { useQuery } from '@tanstack/react-query';

export interface KoreanStockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
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
    refetchInterval: 30_000,
    staleTime: 0,
    retry: 1,
  });
}

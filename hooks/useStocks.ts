'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStockQuotes } from '@/lib/api';
import type { StockQuote } from '@/types';

export function useStocks(symbols: string[]) {
  return useQuery<StockQuote[], Error>({
    queryKey: ['stocks', symbols] as const,
    queryFn: () => fetchStockQuotes(symbols),
    enabled: symbols.length > 0,
    staleTime: 30_000, // 30초
    refetchInterval: 60_000, // 1분
    retry: 2,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';

export interface StockSearchResult {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

interface UseStockSearchOptions {
  query: string;
  enabled?: boolean;
}

export function useStockSearch({ query, enabled = true }: UseStockSearchOptions) {
  return useQuery({
    queryKey: ['stock-search', query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return { data: [], total: 0 };
      }

      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('검색에 실패했습니다.');
      return response.json() as Promise<{ data: StockSearchResult[]; total: number }>;
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000,
  });
}

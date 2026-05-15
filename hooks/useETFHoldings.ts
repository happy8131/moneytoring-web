'use client';

import { useQuery } from '@tanstack/react-query';
import { ETFHolding } from '@/lib/stockUtils';

interface UseETFHoldingsParams {
  symbol: string;
  enabled?: boolean;
}

interface ETFHoldingsResponse {
  symbol: string;
  holdings: ETFHolding[];
}

export function useETFHoldings({ symbol, enabled = true }: UseETFHoldingsParams) {
  return useQuery<ETFHoldingsResponse | null, Error>({
    queryKey: ['etf-holdings', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/etf-holdings?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ETF holdings: ${response.status}`);
      }
      return response.json();
    },
    enabled: enabled && !!symbol,
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  });
}

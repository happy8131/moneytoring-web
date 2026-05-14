'use client';

import { useQuery } from '@tanstack/react-query';
import { StockProfile } from '@/lib/stockUtils';

interface UseProfileOptions {
  symbol: string;
  enabled?: boolean;
}

export function useStockProfile({ symbol, enabled = true }: UseProfileOptions) {
  return useQuery({
    queryKey: ['stock-profile', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/profile?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) throw new Error('회사 정보를 불러올 수 없습니다.');
      return response.json() as Promise<StockProfile>;
    },
    enabled: enabled && !!symbol,
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 24 * 60 * 60 * 1000,
  });
}

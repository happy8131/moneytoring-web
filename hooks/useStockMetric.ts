'use client';

import { useQuery } from '@tanstack/react-query';
import { StockMetric } from '@/lib/stockUtils';

interface UseMetricOptions {
  symbol: string;
  enabled?: boolean;
}

export function useStockMetric({ symbol, enabled = true }: UseMetricOptions) {
  return useQuery({
    queryKey: ['stock-metric', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/metric?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) throw new Error('주요 지표를 불러올 수 없습니다.');
      return response.json() as Promise<StockMetric>;
    },
    enabled: enabled && !!symbol,
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 24 * 60 * 60 * 1000,
  });
}

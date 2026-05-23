'use client';

import { useQuery } from '@tanstack/react-query';
import { CandleData, PeriodRange } from '@/lib/stockUtils';

interface UseForexCandleOptions {
  symbol: string;
  period: PeriodRange;
  enabled?: boolean;
}

export function useForexCandle({
  symbol,
  period,
  enabled = true,
}: UseForexCandleOptions) {
  return useQuery({
    queryKey: ['forex-candle', symbol, period.from, period.to, period.resolution],
    queryFn: async () => {
      const response = await fetch(
        `/api/forex/candle?symbol=${encodeURIComponent(
          symbol
        )}&resolution=${period.resolution}&from=${period.from}&to=${period.to}`
      );
      if (!response.ok) throw new Error('차트 데이터를 불러올 수 없습니다.');
      const data = await response.json();
      return data as {
        symbol: string;
        yahooSymbol: string;
        resolution: string;
        data: CandleData[];
        fetchedAt: string;
      };
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

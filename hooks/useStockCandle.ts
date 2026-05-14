'use client';

import { useQuery } from '@tanstack/react-query';
import { CandleData, PeriodRange } from '@/lib/stockUtils';

interface UseCandleOptions {
  symbol: string;
  period: PeriodRange;
  enabled?: boolean;
}

export function useStockCandle({
  symbol,
  period,
  enabled = true,
}: UseCandleOptions) {
  return useQuery({
    queryKey: ['stock-candle', symbol, period.from, period.to, period.resolution],
    queryFn: async () => {
      const response = await fetch(
        `/api/stocks/candle?symbol=${encodeURIComponent(
          symbol
        )}&resolution=${period.resolution}&from=${period.from}&to=${period.to}`
      );
      if (!response.ok) throw new Error('차트 데이터를 불러올 수 없습니다.');
      const data = await response.json();
      return data as { symbol: string; resolution: string; data: CandleData[]; fetchedAt: string };
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,
  });
}

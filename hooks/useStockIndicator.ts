'use client';

import { useQuery } from '@tanstack/react-query';
import { IndicatorData, PeriodRange } from '@/lib/stockUtils';

interface UseIndicatorOptions {
  symbol: string;
  period: PeriodRange;
  indicator: 'rsi' | 'sma';
  timeperiod?: number;
  enabled?: boolean;
}

export function useStockIndicator({
  symbol,
  period,
  indicator,
  timeperiod,
  enabled = true,
}: UseIndicatorOptions) {
  return useQuery({
    queryKey: [
      'stock-indicator',
      symbol,
      period.from,
      period.to,
      period.resolution,
      indicator,
      timeperiod,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        symbol,
        resolution: period.resolution,
        from: String(period.from),
        to: String(period.to),
        indicator,
      });
      if (timeperiod) {
        params.append('timeperiod', String(timeperiod));
      }

      const response = await fetch(`/api/stocks/indicator?${params}`);
      if (!response.ok) throw new Error(`${indicator} 데이터를 불러올 수 없습니다.`);
      return response.json() as Promise<IndicatorData>;
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,
  });
}

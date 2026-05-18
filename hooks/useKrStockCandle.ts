/**
 * 한국 주식 캔들 데이터 React Query 훅
 *
 * 사용법:
 *   const { data, isLoading, error } = useKrStockCandle({
 *     symbol: '005930',
 *     period: '1M'
 *   });
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { CandleData, Period } from '@/lib/stockUtils';
import { KrStockCandleResponse } from '@/app/api/korean-stocks/candle/route';

interface UseKrStockCandleOptions {
  symbol: string;
  period: Period;
  enabled?: boolean;
}

interface UseKrStockCandleResult {
  data: KrStockCandleResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useKrStockCandle({
  symbol,
  period,
  enabled = true,
}: UseKrStockCandleOptions): UseKrStockCandleResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['kr-stock-candle', symbol, period],
    queryFn: async () => {
      const params = new URLSearchParams({
        symbol,
        period,
      });

      const response = await fetch(`/api/korean-stocks/candle?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`캔들 데이터 로드 실패: ${response.statusText}`);
      }

      return response.json() as Promise<KrStockCandleResponse>;
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}

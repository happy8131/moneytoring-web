/**
 * 한국 증시 지수 차트 데이터 React Query 훅
 *
 * 사용법:
 *   const { data, isLoading, error } = useKrIndexChart({
 *     code: 'kospi',
 *     period: '1M'
 *   });
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { Period } from '@/lib/stockUtils';
import { KrIndexChartResponse } from '@/app/api/korean-stocks/index-chart/route';

interface UseKrIndexChartOptions {
  code: string;
  period: Period;
  enabled?: boolean;
}

interface UseKrIndexChartResult {
  data: KrIndexChartResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useKrIndexChart({
  code,
  period,
  enabled = true,
}: UseKrIndexChartOptions): UseKrIndexChartResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['kr-index-chart', code, period],
    queryFn: async () => {
      const params = new URLSearchParams({
        code,
        period,
      });

      const response = await fetch(`/api/korean-stocks/index-chart?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`지수 차트 데이터 로드 실패: ${response.statusText}`);
      }

      return response.json() as Promise<KrIndexChartResponse>;
    },
    enabled: enabled && !!code,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}

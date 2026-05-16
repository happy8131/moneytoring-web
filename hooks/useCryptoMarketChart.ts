'use client';

import { useQuery } from '@tanstack/react-query';
import { cryptoPeriodToDays, type CryptoPeriod, type CryptoMarketChartResponse } from '@/lib/cryptoUtils';

interface UseCryptoMarketChartOptions {
  id: string;
  period: CryptoPeriod;
  enabled?: boolean;
}

export function useCryptoMarketChart({ id, period, enabled = true }: UseCryptoMarketChartOptions) {
  const days = cryptoPeriodToDays(period);

  return useQuery<CryptoMarketChartResponse>({
    queryKey: ['crypto', 'market-chart', id, days],
    queryFn: async () => {
      const response = await fetch(`/api/crypto/market-chart?id=${encodeURIComponent(id)}&days=${days}`);
      if (!response.ok) {
        throw new Error(`차트 데이터를 불러올 수 없습니다. (${response.status})`);
      }
      return response.json();
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

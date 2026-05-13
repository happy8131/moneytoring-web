'use client';

import { useQuery } from '@tanstack/react-query';
import type { ExchangeRateResponse } from '@/app/api/exchange-rate/route';

export function useExchangeRate() {
  return useQuery<ExchangeRateResponse>({
    queryKey: ['exchange-rate', 'usd-krw'],
    queryFn: async () => {
      const response = await fetch('/api/exchange-rate');
      if (!response.ok) throw new Error('Failed to fetch exchange rate');
      return response.json();
    },
    staleTime: 3_600_000,
    refetchInterval: 3_600_000,
  });
}

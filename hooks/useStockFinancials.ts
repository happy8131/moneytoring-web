'use client';

import { useQuery } from '@tanstack/react-query';
import { FinancialPeriod } from '@/lib/stockUtils';

interface UseFinancialsOptions {
  symbol: string;
  freq?: 'annual' | 'quarterly';
  enabled?: boolean;
}

export function useStockFinancials({
  symbol,
  freq = 'annual',
  enabled = true,
}: UseFinancialsOptions) {
  return useQuery({
    queryKey: ['stock-financials', symbol, freq],
    queryFn: async () => {
      const response = await fetch(
        `/api/stocks/financials?symbol=${encodeURIComponent(symbol)}&freq=${freq}`
      );
      if (!response.ok) throw new Error('재무제표를 불러올 수 없습니다.');
      const data = await response.json();
      return data as { symbol: string; freq: string; data: FinancialPeriod[] };
    },
    enabled: enabled && !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 1일
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
}

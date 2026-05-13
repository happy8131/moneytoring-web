'use client';

import { useQuery } from '@tanstack/react-query';
import type { QuotesResponse, StockQuote } from '@/app/api/stocks/quotes/route';

async function fetchQuotes(symbols: string[]): Promise<QuotesResponse> {
  if (symbols.length === 0) {
    return { data: [], errors: [], fetchedAt: new Date().toISOString() };
  }

  const res = await fetch(
    `/api/stocks/quotes?symbols=${symbols.join(',')}`
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error ?? `요청 실패: ${res.status}`);
  }

  return res.json();
}

interface UseStockQuotesOptions {
  symbols: string[];
  enabled?: boolean;
  refetchInterval?: number;
}

export function useStockQuotes({
  symbols,
  enabled = true,
  refetchInterval = 30_000,
}: UseStockQuotesOptions) {
  return useQuery<QuotesResponse>({
    queryKey: ['stocks', 'quotes', [...symbols].sort()],
    queryFn: () => fetchQuotes(symbols),
    enabled: enabled && symbols.length > 0,
    refetchInterval,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    placeholderData: (previousData) => previousData,
  });
}

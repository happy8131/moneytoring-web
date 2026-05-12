'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCryptoQuotes } from '@/lib/api';
import type { CryptoQuote } from '@/types';

export function useCryptos(ids: string[]) {
  return useQuery<CryptoQuote[], Error>({
    queryKey: ['cryptos', ids] as const,
    queryFn: () => fetchCryptoQuotes(ids),
    enabled: ids.length > 0,
    staleTime: 30_000, // 30초
    refetchInterval: 60_000, // 1분
    retry: 2,
  });
}

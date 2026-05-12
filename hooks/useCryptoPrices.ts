'use client';

import { useQuery } from '@tanstack/react-query';
import type { CryptoPricesResponse } from '@/app/api/crypto/prices/route';

async function fetchPrices(ids: string[]): Promise<CryptoPricesResponse> {
  if (ids.length === 0) {
    return { data: [], errors: [], fetchedAt: new Date().toISOString() };
  }

  const res = await fetch(`/api/crypto/prices?ids=${ids.join(',')}`);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error ?? `요청 실패: ${res.status}`);
  }

  return res.json();
}

interface UseCryptoPricesOptions {
  ids: string[];
  enabled?: boolean;
  refetchInterval?: number;
}

export function useCryptoPrices({
  ids,
  enabled = true,
  refetchInterval = 60_000,
}: UseCryptoPricesOptions) {
  return useQuery({
    queryKey: ['crypto', 'prices', [...ids].sort()],
    queryFn: () => fetchPrices(ids),
    enabled: enabled && ids.length > 0,
    refetchInterval,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import type { ForexCommoditiesResponse } from '@/lib/forexCommoditiesUtils';

async function fetchForexCommodities(): Promise<ForexCommoditiesResponse> {
  const res = await fetch('/api/market-data/forex-commodities');

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `요청 실패: ${res.status}`);
  }

  return res.json();
}

interface UseForexCommoditiesOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useForexCommodities({
  enabled = true,
  refetchInterval = 60_000,
}: UseForexCommoditiesOptions = {}) {
  return useQuery<ForexCommoditiesResponse>({
    queryKey: ['market-data', 'forex-commodities'],
    queryFn: fetchForexCommodities,
    enabled,
    refetchInterval,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    placeholderData: (previousData) => previousData,
  });
}

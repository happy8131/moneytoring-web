'use client';

import { useQuery } from '@tanstack/react-query';
import type { EconomicIndicatorsResponse } from '@/lib/economicCalendarUtils';

interface UseEconomicCalendarOptions {
  countries: string;  // CSV, e.g. 'US,EU,KR'
  enabled?: boolean;
}

async function fetchEconomicCalendar(
  countries: string
): Promise<EconomicIndicatorsResponse> {
  const params = new URLSearchParams({ countries });
  const res = await fetch(`/api/economic-calendar?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `요청 실패: ${res.status}`);
  }
  return res.json();
}

export function useEconomicCalendar({
  countries,
  enabled = true,
}: UseEconomicCalendarOptions) {
  const sortedCountries = countries.split(',').map((c) => c.trim()).sort().join(',');

  return useQuery<EconomicIndicatorsResponse>({
    queryKey: ['economic-indicators', sortedCountries],
    queryFn: () => fetchEconomicCalendar(sortedCountries),
    enabled,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchInterval: 60 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

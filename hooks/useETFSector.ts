'use client';

import { useQuery } from '@tanstack/react-query';
import { ETFSectorExposure } from '@/lib/stockUtils';

interface UseETFSectorParams {
  symbol: string;
  enabled?: boolean;
}

interface ETFSectorResponse {
  symbol: string;
  sectors: ETFSectorExposure[];
}

export function useETFSector({ symbol, enabled = true }: UseETFSectorParams) {
  return useQuery<ETFSectorResponse | null, Error>({
    queryKey: ['etf-sector', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/etf-sector?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ETF sector data: ${response.status}`);
      }
      return response.json();
    },
    enabled: enabled && !!symbol,
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  });
}

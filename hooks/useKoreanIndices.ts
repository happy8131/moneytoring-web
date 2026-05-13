'use client';

import { useQuery } from '@tanstack/react-query';

export interface KoreanIndex {
  code: string;
  indexCode: string;
  name: string;
  currentValue: number;
  change: number;
  percentChange: number;
  volume: number;
  tradingValue: number;
  openValue: number;
  highValue: number;
  lowValue: number;
  updatedAt: string;
}

interface KoreanIndicesResponse {
  data: KoreanIndex[];
}

export function useKoreanIndices() {
  return useQuery<KoreanIndicesResponse>({
    queryKey: ['korean-stocks', 'indices'],
    queryFn: async () => {
      const response = await fetch('/api/korean-stocks/indices');
      if (!response.ok) throw new Error('Failed to fetch Korean indices');
      return response.json();
    },
    refetchInterval: 30_000,
    staleTime: 0,
  });
}

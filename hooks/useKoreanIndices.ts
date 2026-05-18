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
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchInterval: 30_000, // 30초마다 백그라운드 갱신
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import type { USIndicesResponse } from '@/app/api/us-indices/route';

export function useUSIndices(indices?: string[]) {
  const param = indices?.join(',');

  return useQuery<USIndicesResponse>({
    queryKey: ['us-indices', param ?? 'all'],
    queryFn: async () => {
      const url = param
        ? `/api/us-indices?indices=${param}`
        : '/api/us-indices';
      const res = await fetch(url);
      if (!res.ok) throw new Error('미국 지수 조회 실패');
      return res.json();
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

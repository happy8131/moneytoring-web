'use client';

import { useQuery } from '@tanstack/react-query';
import type { CryptoDetailResponse } from '@/lib/cryptoUtils';

interface UseCryptoDetailOptions {
  id: string;
  enabled?: boolean;
}

export function useCryptoDetail({ id, enabled = true }: UseCryptoDetailOptions) {
  return useQuery<CryptoDetailResponse>({
    queryKey: ['crypto', 'detail', id],
    queryFn: async () => {
      const response = await fetch(`/api/crypto/detail?id=${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error(`코인 상세 정보를 불러올 수 없습니다. (${response.status})`);
      }
      return response.json();
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

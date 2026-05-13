'use client';

import { useQuery } from '@tanstack/react-query';
import type { CryptoMarketResponse } from '@/app/api/crypto-market/route';

export function useCryptoMarket() {
  return useQuery<CryptoMarketResponse>({
    queryKey: ['crypto-market'],
    queryFn: async () => {
      const res = await fetch('/api/crypto-market');
      if (!res.ok) throw new Error('암호화폐 시장 데이터 조회 실패');
      return res.json();
    },
    staleTime: 3600 * 1000,
    refetchInterval: 3600 * 1000,
  });
}

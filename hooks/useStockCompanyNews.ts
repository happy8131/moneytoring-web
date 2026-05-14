'use client';

import { useQuery } from '@tanstack/react-query';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

interface UseCompanyNewsOptions {
  symbol: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  enabled?: boolean;
}

export function useStockCompanyNews({
  symbol,
  from,
  to,
  enabled = true,
}: UseCompanyNewsOptions) {
  return useQuery({
    queryKey: ['stock-company-news', symbol, from, to],
    queryFn: async () => {
      const params = new URLSearchParams({ symbol });
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const response = await fetch(`/api/stocks/company-news?${params}`);
      if (!response.ok) throw new Error('뉴스를 불러올 수 없습니다.');
      return response.json() as Promise<NewsItem[]>;
    },
    enabled: enabled && !!symbol,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 60 * 60 * 1000,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNews, fetchCompanyNews } from '@/lib/api';
import type { NewsItem } from '@/types';

export function useNews(category?: string) {
  return useQuery<NewsItem[], Error>({
    queryKey: ['news', category] as const,
    queryFn: () => fetchNews(category),
    staleTime: 5 * 60_000, // 5분
    refetchInterval: 10 * 60_000, // 10분
    retry: 2,
  });
}

export function useCompanyNews(symbol: string) {
  return useQuery<NewsItem[], Error>({
    queryKey: ['company-news', symbol] as const,
    queryFn: () => fetchCompanyNews(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60_000, // 5분
    refetchInterval: 10 * 60_000, // 10분
    retry: 2,
  });
}

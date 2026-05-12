'use client';

import { useQuery } from '@tanstack/react-query';
import type { Holding, PortfolioSummary } from '@/types';
import type { AIRecommendation } from '@/app/api/recommendations/route';

interface UseRecommendationsProps {
  holdings: Holding[];
  summary: PortfolioSummary;
  enabled?: boolean;
}

export function useRecommendations({
  holdings,
  summary,
  enabled = true,
}: UseRecommendationsProps) {
  return useQuery<{ recommendations: AIRecommendation[] }, Error>({
    queryKey: ['recommendations', holdings.map((h) => h.id).join(',')],
    queryFn: async () => {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdings, summary }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return response.json();
    },
    enabled: enabled && holdings.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

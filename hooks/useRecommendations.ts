'use client';

import { useMemo } from 'react';
import { generateRecommendations } from '@/lib/recommendations';
import type { Holding, AIRecommendation, PortfolioSummary } from '@/types';

interface UseRecommendationsProps {
  holdings: Holding[];
  summary: PortfolioSummary;
  enabled?: boolean;
}

interface UseRecommendationsResult {
  data: { recommendations: AIRecommendation[] };
  isLoading: false;
  error: null;
  refetch: () => void;
}

export function useRecommendations({
  holdings,
  summary,
  enabled = true,
}: UseRecommendationsProps): UseRecommendationsResult {
  const recommendations = useMemo(() => {
    if (!enabled || holdings.length === 0) {
      return [];
    }
    return generateRecommendations(holdings, summary);
  }, [holdings.map((h) => h.id).join(','), summary.totalValue, enabled]);

  return {
    data: { recommendations },
    isLoading: false,
    error: null,
    refetch: () => {}, // no-op
  };
}

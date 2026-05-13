'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRecommendations } from '@/hooks/useRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { RefreshCw } from 'lucide-react';
import type { Holding, PortfolioSummary } from '@/types';

interface RecommendationsWidgetProps {
  holdings?: Holding[];
  summary?: PortfolioSummary;
}

export function RecommendationsWidget({
  holdings = [],
  summary,
}: RecommendationsWidgetProps) {
  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const safeSummary = summary || {
    totalValue: 0,
    totalInvested: 0,
    totalGain: 0,
    totalGainPercent: 0,
    holdingsCount: 0,
  };

  const { data, isLoading, error, refetch } = useRecommendations({
    holdings: safeHoldings,
    summary: safeSummary,
  });

  if (safeHoldings.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI 투자 추천</h3>
        <p className="text-muted-foreground">
          포트폴리오에 종목을 추가하면 AI 추천을 받을 수 있습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI 투자 추천</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        포트폴리오를 분석하여 맞춤형 투자 추천을 제공합니다.
      </p>

      {data && data.recommendations.length > 0 && (
        <div className="space-y-3">
          {data.recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}

      {data && data.recommendations.length === 0 && (
        <p className="text-muted-foreground text-sm">
          현재 추천할 항목이 없습니다.
        </p>
      )}
    </Card>
  );
}

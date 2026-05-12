'use client';

import {
  calculatePortfolioValueHistory,
  calculateRebalancingSuggestions,
  calculatePortfolioSummary,
} from '@/lib/calculations';
import { AssetHistoryChart } from './AssetHistoryChart';
import { RebalancingWidget } from './RebalancingWidget';
import { RecommendationsWidget } from './RecommendationsWidget';
import type { Holding, Transaction } from '@/types';

interface PortfolioAnalyticsProps {
  holdingsWithPrices?: Holding[];
  transactions?: Transaction[];
}

export function PortfolioAnalytics({
  holdingsWithPrices = [],
  transactions = [],
}: PortfolioAnalyticsProps) {
  const safeHoldings = holdingsWithPrices || [];
  const safeTransactions = transactions || [];

  const priceMap = new Map(
    safeHoldings.map((h) => [h.symbol, h.currentPrice || 0])
  );

  const assetHistory = calculatePortfolioValueHistory(safeTransactions, priceMap);
  const rebalancingSuggestions =
    calculateRebalancingSuggestions(safeHoldings);
  const summary = calculatePortfolioSummary(safeHoldings);

  return (
    <div className="space-y-6">
      <AssetHistoryChart data={assetHistory} />
      <RebalancingWidget suggestions={rebalancingSuggestions} />
      <RecommendationsWidget
        holdings={safeHoldings}
        summary={summary}
      />
    </div>
  );
}

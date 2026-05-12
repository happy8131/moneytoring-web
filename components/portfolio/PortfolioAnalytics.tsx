'use client';

import {
  calculatePortfolioValueHistory,
  calculateRebalancingSuggestions,
} from '@/lib/calculations';
import { AssetHistoryChart } from './AssetHistoryChart';
import { RebalancingWidget } from './RebalancingWidget';
import type { Holding, Transaction } from '@/types';

interface PortfolioAnalyticsProps {
  holdingsWithPrices: Holding[];
  transactions: Transaction[];
}

export function PortfolioAnalytics({
  holdingsWithPrices,
  transactions,
}: PortfolioAnalyticsProps) {
  const priceMap = new Map(
    holdingsWithPrices.map((h) => [h.symbol, h.currentPrice || 0])
  );

  const assetHistory = calculatePortfolioValueHistory(transactions, priceMap);
  const rebalancingSuggestions =
    calculateRebalancingSuggestions(holdingsWithPrices);

  return (
    <div className="space-y-6">
      <AssetHistoryChart data={assetHistory} />
      <RebalancingWidget suggestions={rebalancingSuggestions} />
    </div>
  );
}

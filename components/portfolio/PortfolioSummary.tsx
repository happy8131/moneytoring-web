'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import type { PortfolioSummary } from '@/types';

interface PortfolioSummaryCardProps {
  summary: PortfolioSummary;
}

export function PortfolioSummaryCard({ summary }: PortfolioSummaryCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">총 자산</p>
        <p className="text-2xl font-bold">
          {formatCurrency(summary.totalValue)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">총 투자금</p>
        <p className="text-2xl font-bold">
          {formatCurrency(summary.totalInvested)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">총 손익</p>
        <p
          className={`text-2xl font-bold ${
            summary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {summary.totalGain >= 0 ? '+' : ''}
          {formatCurrency(summary.totalGain)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">수익률</p>
        <p
          className={`text-2xl font-bold ${
            summary.totalGainPercent >= 0
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {formatPercent(summary.totalGainPercent)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">보유 종목</p>
        <p className="text-2xl font-bold">{summary.holdingsCount}</p>
      </Card>
    </div>
  );
}

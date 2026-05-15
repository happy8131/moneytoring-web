'use client';

import { useState } from 'react';
import { useStockFinancials } from '@/hooks/useStockFinancials';
import { formatLargeNumber } from '@/lib/stockUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface StockFinancialsTableProps {
  symbol: string;
}

export function StockFinancialsTable({ symbol }: StockFinancialsTableProps) {
  const [freq, setFreq] = useState<'annual' | 'quarterly'>('annual');

  const { data: financialsData, isLoading } = useStockFinancials({
    symbol,
    freq,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const financials = financialsData?.data || [];

  if (financials.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">재무제표 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">재무제표</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFreq('annual')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              freq === 'annual'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            연간
          </button>
          <button
            onClick={() => setFreq('quarterly')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              freq === 'quarterly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            분기
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">기간</th>
              <th className="text-right py-3 px-4 font-semibold">매출액</th>
              <th className="text-right py-3 px-4 font-semibold">순이익</th>
              <th className="text-right py-3 px-4 font-semibold">영업이익</th>
              <th className="text-right py-3 px-4 font-semibold">총자산</th>
              <th className="text-right py-3 px-4 font-semibold">총부채</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((period, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4">
                  {period.quarter ? `${period.year}년 Q${period.quarter}` : `${period.year}년`}
                </td>
                <td className="text-right py-3 px-4">
                  {formatLargeNumber(period.revenue)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatLargeNumber(period.netIncome)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatLargeNumber(period.operatingIncome)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatLargeNumber(period.totalAssets)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatLargeNumber(period.totalLiabilities)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        * B = Billion(10억), M = Million(100만) 달러 단위
      </p>
    </div>
  );
}

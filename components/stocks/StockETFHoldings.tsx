'use client';

import { useETFHoldings } from '@/hooks/useETFHoldings';
import { Skeleton } from '@/components/ui/skeleton';

interface StockETFHoldingsProps {
  symbol: string;
}

export function StockETFHoldings({ symbol }: StockETFHoldingsProps) {
  const { data: etfData, isLoading, error } = useETFHoldings({ symbol });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-red-500">
          보유 종목 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const holdings = etfData?.holdings || [];

  if (holdings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">보유 종목 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">주요 보유 종목</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold w-12">순위</th>
              <th className="text-left py-3 px-4 font-semibold">심볼</th>
              <th className="text-left py-3 px-4 font-semibold">종목명</th>
              <th className="text-right py-3 px-4 font-semibold">비중</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 text-center">{idx + 1}</td>
                <td className="py-3 px-4 font-semibold text-primary">{holding.symbol}</td>
                <td className="py-3 px-4 text-muted-foreground">{holding.name}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-semibold">{holding.pct.toFixed(2)}%</span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(holding.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

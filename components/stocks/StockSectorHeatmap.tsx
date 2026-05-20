'use client';

import { useRouter } from 'next/navigation';
import { useSectorHeatmap } from '@/hooks/useSectorHeatmap';
import { getColorForPercentChange, getTextColorForPercentChange, type SectorHeatmapData, type SectorHeatmapStock } from '@/lib/sectorHeatmapUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StockSectorHeatmap() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useSectorHeatmap();

  const handleStockClick = (symbol: string) => {
    router.push(`/stocks/${symbol}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: 10 }).map((_, j) => (
                <Skeleton key={j} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground mb-4">섹터 데이터를 불러올 수 없습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.data.map((sectorData: SectorHeatmapData) => (
        <div key={sectorData.sector}>
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            {sectorData.sector} <span className="text-sm text-muted-foreground">({sectorData.count} stocks)</span>
          </h3>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {sectorData.stocks.map((stock: SectorHeatmapStock) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                className={`${getColorForPercentChange(stock.percentChange)} ${getTextColorForPercentChange(stock.percentChange)}
                  rounded-lg p-2 transition-all hover:opacity-80 cursor-pointer hover:scale-105
                  flex flex-col items-center justify-center text-center h-20`}
              >
                <div className="font-bold text-sm">{stock.symbol}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {stock.percentChange >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span className="text-xs font-semibold">{Math.abs(stock.percentChange).toFixed(2)}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { getColorForPercentChange, getTextColorForPercentChange, type SectorHeatmapData, type SectorHeatmapStock } from '@/lib/sectorHeatmapUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockSectorHeatmapProps {
  data: SectorHeatmapData[];
}

export function StockSectorHeatmap({ data }: StockSectorHeatmapProps) {
  const router = useRouter();

  const handleStockClick = (symbol: string) => {
    router.push(`/stocks/${symbol}`);
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((sectorData: SectorHeatmapData) => {
        // 섹터별 평균 수익률 계산
        const avgPercent = sectorData.stocks.length > 0
          ? sectorData.stocks.reduce((sum, s) => sum + s.percentChange, 0) / sectorData.stocks.length
          : 0;

        return (
          <div key={sectorData.sector} className="border-b border-border/50 pb-6 last:border-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">
                {sectorData.sector}{' '}
                <span className="text-sm text-muted-foreground font-normal">({sectorData.count} stocks)</span>
              </h3>
              {sectorData.stocks.length > 0 && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${avgPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {avgPercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>섹터 평균 {avgPercent >= 0 ? '+' : ''}{avgPercent.toFixed(2)}%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {sectorData.stocks.map((stock: SectorHeatmapStock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  className={`${getColorForPercentChange(stock.percentChange)} ${getTextColorForPercentChange(stock.percentChange)}
                    rounded-xl p-4 transition-all hover:opacity-90 cursor-pointer hover:scale-[1.03] hover:shadow-lg
                    flex flex-col items-center justify-center text-center min-h-[100px] shadow-md`}
                >
                  <div className="font-bold text-base">{stock.symbol}</div>
                  <div className="text-xs opacity-90 mt-1">
                    ${stock.currentPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2 bg-black/20 rounded-full px-2 py-0.5">
                    {stock.percentChange >= 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    <span className="text-sm font-semibold">
                      {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { StockSectorHeatmap } from '@/components/stocks/StockSectorHeatmap';
import { useSectorHeatmap } from '@/hooks/useSectorHeatmap';
import { RefreshCw } from 'lucide-react';

export default function SectorHeatmapPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refetch } = useSectorHeatmap();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sector Heatmap</h1>
            <p className="text-muted-foreground mt-2">S&P 500 Performance by Sector</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Not financial advice. Educational purposes only. Past performance does not guarantee future results.{' '}
              <a href="#" className="underline">
                Full Disclaimer
              </a>
            </p>
          </div>
          <button className="ml-auto text-yellow-400 hover:text-yellow-600">×</button>
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border border-border bg-card p-6">
          <StockSectorHeatmap />
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3">색상 범례</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded"></div>
              <span className="text-sm text-muted-foreground">+2% 이상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded"></div>
              <span className="text-sm text-muted-foreground">0% ~ +2%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-400 rounded"></div>
              <span className="text-sm text-muted-foreground">-1% ~ 0%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded"></div>
              <span className="text-sm text-muted-foreground">-1% 이하</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

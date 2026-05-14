'use client';

import { useState, useEffect } from 'react';
import { StockDetailHeader } from '@/components/stocks/StockDetailHeader';
import { StockPriceChart } from '@/components/stocks/StockPriceChart';
import { StockMetricsGrid } from '@/components/stocks/StockMetricsGrid';
import { StockIndicatorChart } from '@/components/stocks/StockIndicatorChart';
import { StockFinancialsTable } from '@/components/stocks/StockFinancialsTable';
import { StockNewsSection } from '@/components/stocks/StockNewsSection';
import { Period } from '@/lib/stockUtils';

type Props = {
  params: Promise<{ symbol: string }>;
};

export default function StockDetailPage({ params }: Props) {
  const [symbol, setSymbol] = useState<string>('');
  const [indicatorPeriod, setIndicatorPeriod] = useState<Period>('1M');

  useEffect(() => {
    params.then((p) => setSymbol(p.symbol));
  }, [params]);

  if (!symbol) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 space-y-6">
        <StockDetailHeader symbol={symbol} />
        <StockPriceChart symbol={symbol} onPeriodChange={setIndicatorPeriod} />
        <StockMetricsGrid symbol={symbol} />
        <StockIndicatorChart symbol={symbol} period={indicatorPeriod} />
        <StockFinancialsTable symbol={symbol} />
        <StockNewsSection symbol={symbol} />
      </div>
    </div>
  );
}

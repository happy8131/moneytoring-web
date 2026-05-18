'use client';

import { useState, useEffect } from 'react';
import { Period } from '@/lib/stockUtils';
import { KrStockDetailHeader } from '@/components/kr-stocks/KrStockDetailHeader';
import { KrStockPriceChart } from '@/components/kr-stocks/KrStockPriceChart';
import { KrStockMetricsGrid } from '@/components/kr-stocks/KrStockMetricsGrid';
import { KrStockIndicatorChart } from '@/components/kr-stocks/KrStockIndicatorChart';
import { KrStockFinancialsTable } from '@/components/kr-stocks/KrStockFinancialsTable';

type Props = {
  params: Promise<{ symbol: string }>;
};

export default function KrStockDetailPage({ params }: Props) {
  const [symbol, setSymbol] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1M');

  useEffect(() => {
    params.then((p) => setSymbol(p.symbol));
  }, [params]);

  if (!symbol) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 헤더 */}
      <KrStockDetailHeader symbol={symbol} />

      {/* 차트 */}
      <KrStockPriceChart symbol={symbol} onPeriodChange={setSelectedPeriod} />

      {/* 주요 지표 */}
      <KrStockMetricsGrid symbol={symbol} />

      {/* 기술지표 */}
      <KrStockIndicatorChart symbol={symbol} period={selectedPeriod} />

      {/* 거래 현황 */}
      <KrStockFinancialsTable symbol={symbol} />
    </div>
  );
}

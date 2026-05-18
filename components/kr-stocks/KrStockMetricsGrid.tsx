'use client';

import { useKoreanStockQuotes } from '@/hooks/useKoreanStockQuotes';
import { formatKoreanPrice, formatKoreanVolume, formatKoreanTradingValue } from '@/lib/krStockUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface KrStockMetricsGridProps {
  symbol: string;
}

interface MetricItem {
  label: string;
  value: string;
}

export function KrStockMetricsGrid({ symbol }: KrStockMetricsGridProps) {
  const { data: quotesResponse, isLoading, error } = useKoreanStockQuotes({
    symbols: [symbol],
  });

  const quote = quotesResponse?.data?.[0];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">지표 데이터를 불러올 수 없습니다.</p>
        {error && <p className="text-xs text-red-500 mt-2">{error.message}</p>}
      </div>
    );
  }

  const metricItems: MetricItem[] = [
    {
      label: '시가',
      value: formatKoreanPrice(quote.openPrice),
    },
    {
      label: '고가',
      value: formatKoreanPrice(quote.highPrice),
    },
    {
      label: '저가',
      value: formatKoreanPrice(quote.lowPrice),
    },
    {
      label: '전일종가',
      value: formatKoreanPrice(quote.previousClose),
    },
    {
      label: '거래량',
      value: formatKoreanVolume(quote.volume),
    },
    {
      label: '거래대금',
      value: formatKoreanTradingValue(quote.tradingValue),
    },
    {
      label: '상한가',
      value: formatKoreanPrice(quote.upperLimit),
    },
    {
      label: '하한가',
      value: formatKoreanPrice(quote.lowerLimit),
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">주요 지표</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {metricItems.map((item) => (
          <div key={item.label} className="border-l-2 border-primary pl-4">
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

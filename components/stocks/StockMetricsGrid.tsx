'use client';

import { useStockQuotes } from '@/hooks/useStockQuotes';
import { useStockMetric } from '@/hooks/useStockMetric';
import { formatLargeNumber, formatVolume, formatPercentage } from '@/lib/stockUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface StockMetricsGridProps {
  symbol: string;
}

interface MetricItem {
  label: string;
  value: string;
}

export function StockMetricsGrid({ symbol }: StockMetricsGridProps) {
  const { data: quotesResponse, isLoading: quotesLoading } = useStockQuotes({
    symbols: [symbol],
  });
  const { data: metrics, isLoading: metricsLoading } = useStockMetric({ symbol });

  const quote = quotesResponse?.data?.[0];

  if (quotesLoading || metricsLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  const metricItems: MetricItem[] = [
    {
      label: '개장가',
      value: quote ? `$${quote.openPrice.toFixed(2)}` : '-',
    },
    {
      label: '최고가',
      value: quote ? `$${quote.highPrice.toFixed(2)}` : '-',
    },
    {
      label: '최저가',
      value: quote ? `$${quote.lowPrice.toFixed(2)}` : '-',
    },
    {
      label: '이전종가',
      value: quote ? `$${quote.previousClose.toFixed(2)}` : '-',
    },
    {
      label: 'PER',
      value: metrics?.peBasicExclExtraTTM ? metrics.peBasicExclExtraTTM.toFixed(2) : '-',
    },
    {
      label: 'EPS',
      value: metrics?.epsBasicExclExtraTTM ? metrics.epsBasicExclExtraTTM.toFixed(2) : '-',
    },
    {
      label: '시가총액',
      value: formatLargeNumber(metrics?.marketCapitalization),
    },
    {
      label: '52주 최고',
      value: metrics?.high52Week ? `$${metrics.high52Week.toFixed(2)}` : '-',
    },
    {
      label: '52주 최저',
      value: metrics?.low52Week ? `$${metrics.low52Week.toFixed(2)}` : '-',
    },
    {
      label: '평균거래량',
      value: metrics?.averageVolume10D ? `${metrics.averageVolume10D.toFixed(2)}M` : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">주요 지표</h3>
        <p className="text-xs text-muted-foreground">* B = Billion(10억), M = Million(100만) 달러 단위</p>
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

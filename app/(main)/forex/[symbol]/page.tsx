'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ForexPriceChart } from '@/components/forex/ForexPriceChart';
import { useForexCommodities } from '@/hooks/useForexCommodities';
import {
  FOREX_LABELS,
  FOREX_SYMBOLS,
  formatForexRate,
  type ForexCurrency,
} from '@/lib/forexCommoditiesUtils';

type Props = {
  params: Promise<{ symbol: string }>;
};

export default function ForexDetailPage({ params }: Props) {
  const { symbol: rawSymbol } = use(params);
  const symbol = rawSymbol.toUpperCase() as ForexCurrency;

  const isValid = FOREX_SYMBOLS.includes(symbol);
  const { data, isLoading } = useForexCommodities({ enabled: isValid });

  const currentRate = useMemo(
    () => data?.forex.find((f) => f.symbol === symbol),
    [data, symbol]
  );

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> 대시보드
          </Link>
          <div className="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            지원하지 않는 통화: {rawSymbol}
          </div>
        </div>
      </div>
    );
  }

  const label = FOREX_LABELS[symbol];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
        {/* 뒤로가기 */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> 대시보드
        </Link>

        {/* 헤더 */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{label.pair}</h1>
              <p className="text-sm text-muted-foreground mt-1">{label.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                1 USD($1)당 {symbol} 환율
              </p>
            </div>
            <div className="text-right">
              {isLoading || !currentRate ? (
                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <p className="font-mono text-3xl font-bold">
                    {formatForexRate(symbol, currentRate.rate)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    실시간 환율 (1분 갱신)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 차트 */}
        <ForexPriceChart symbol={symbol} />
      </div>
    </div>
  );
}

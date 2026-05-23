'use client';

import Link from 'next/link';
import { useForexCommodities } from '@/hooks/useForexCommodities';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import { formatForexRate } from '@/lib/forexCommoditiesUtils';

export function ForexCommoditiesTable() {
  const { data, isLoading, isError, error, dataUpdatedAt } = useForexCommodities();

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="rounded-lg border border-border bg-card p-4">
            <div className="h-5 w-24 bg-muted rounded animate-pulse mb-3" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-muted animate-pulse mb-2 last:mb-0" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        외환/원자재 데이터 로드 실패: {error?.message}
      </div>
    );
  }

  const forex = data?.forex ?? [];
  const commodities = data?.commodities ?? [];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        마지막 업데이트: {new Date(dataUpdatedAt || 0).toLocaleTimeString('ko-KR')}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 외환 (Forex) */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">외환</h3>
              <p className="text-[11px] text-muted-foreground">1 USD($1) 기준 환율</p>
            </div>
            <span className="text-xs text-muted-foreground">{forex.length}종</span>
          </div>

          {forex.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              환율 데이터를 불러올 수 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {forex.map((rate) => (
                <Link
                  key={rate.symbol}
                  href={`/forex/${rate.symbol}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{rate.pair}</p>
                    <p className="text-xs text-muted-foreground">{rate.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">
                      {formatForexRate(rate.symbol, rate.rate)}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {rate.percentChange === null ? '-' : formatPercent(rate.percentChange)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 원자재 (Commodities) */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">원자재 (ETF)</h3>
            <span className="text-xs text-muted-foreground">{commodities.length}종</span>
          </div>

          {commodities.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              원자재 데이터를 불러올 수 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {commodities.map((quote) => (
                <Link
                  key={quote.symbol}
                  href={`/stocks/${quote.symbol}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{quote.name}</p>
                    <p className="text-xs text-muted-foreground">{quote.underlying}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">
                      {formatCurrency(quote.currentPrice)}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        quote.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatPercent(quote.percentChange)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {(data?.errors.length ?? 0) > 0 && (
        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          {data?.errors.map((err) => (
            <p key={err.symbol} className="text-yellow-600">
              {err.symbol}: {err.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

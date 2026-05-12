'use client';

import { useStockQuotes } from '@/hooks/useStockQuotes';
import { formatCurrency, formatPercent } from '@/lib/calculations';

const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

export function StockWatchlist() {
  const { data, isLoading, isError, error, dataUpdatedAt } = useStockQuotes({
    symbols: DEFAULT_SYMBOLS,
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        주식 데이터 로드 실패: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-2">
        마지막 업데이트: {new Date(dataUpdatedAt || 0).toLocaleTimeString('ko-KR')}
      </p>

      {data?.data.map((quote) => (
        <div
          key={quote.symbol}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-sm">{quote.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold">
              {formatCurrency(quote.currentPrice)}
            </p>
            <p
              className={`text-xs font-medium ${
                quote.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercent(quote.percentChange)}
            </p>
          </div>
        </div>
      ))}

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

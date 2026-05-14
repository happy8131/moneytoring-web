'use client';

import { useStockProfile } from '@/hooks/useStockProfile';
import { useStockQuotes } from '@/hooks/useStockQuotes';
import { formatPercentage } from '@/lib/stockUtils';
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StockDetailHeaderProps {
  symbol: string;
}

export function StockDetailHeader({ symbol }: StockDetailHeaderProps) {
  const { data: profile, isLoading: profileLoading } = useStockProfile({
    symbol,
  });

  const { data: quotesResponse, isLoading: quotesLoading } = useStockQuotes({
    symbols: [symbol],
    refetchInterval: 30000,
  });

  const quote = quotesResponse?.data?.[0];
  const isPositive = quote && quote.change >= 0;

  if (profileLoading || quotesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-muted-foreground">회사 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {symbol.toUpperCase()} · {profile.exchange}
            </p>
          </div>

          {quote && (
            <div className="text-right">
              <p className="text-4xl font-bold">${quote.currentPrice.toFixed(2)}</p>
              <div
                className={`flex items-center justify-end gap-1 mt-2 text-lg font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                <span>
                  {isPositive ? '+' : ''}
                  {quote.change.toFixed(2)}
                </span>
                <span>{formatPercentage(quote.percentChange)}</span>
              </div>
            </div>
          )}
        </div>

        {profile.weburl && (
          <div className="pt-4 border-t border-border">
            <a
              href={profile.weburl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <TrendingUp size={16} />
              회사 웹사이트 방문
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

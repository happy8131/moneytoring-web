'use client';

import { useKoreanStockQuotes } from '@/hooks/useKoreanStockQuotes';
import { formatKoreanPrice, formatKoreanVolume, formatKoreanTradingValue } from '@/lib/krStockUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface KrStockFinancialsTableProps {
  symbol: string;
}

export function KrStockFinancialsTable({ symbol }: KrStockFinancialsTableProps) {
  const { data: quotesResponse, isLoading, error } = useKoreanStockQuotes({
    symbols: [symbol],
  });

  const quote = quotesResponse?.data?.[0];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">주요 거래 현황</h3>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
        {error && <p className="text-xs text-red-500 mt-2">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-6">주요 거래 현황</h3>

      <div className="grid grid-cols-3 gap-6">
        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">거래량</p>
          <p className="text-lg font-semibold">{formatKoreanVolume(quote.volume)}</p>
        </div>

        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">거래대금</p>
          <p className="text-lg font-semibold">{formatKoreanTradingValue(quote.tradingValue)}</p>
        </div>

        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">시장구분</p>
          <p className="text-lg font-semibold">{quote.market}</p>
        </div>

        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">상한가</p>
          <p className="text-lg font-semibold">{formatKoreanPrice(quote.upperLimit)}</p>
        </div>

        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">하한가</p>
          <p className="text-lg font-semibold">{formatKoreanPrice(quote.lowerLimit)}</p>
        </div>

        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm text-muted-foreground mb-1">전일 종가</p>
          <p className="text-lg font-semibold">{formatKoreanPrice(quote.previousClose)}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6">* 데이터는 현재가 기준입니다.</p>
    </div>
  );
}

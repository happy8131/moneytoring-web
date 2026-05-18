'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useKoreanStockQuotes } from '@/hooks/useKoreanStockQuotes';
import { TrendingUp, TrendingDown } from 'lucide-react';

const POPULAR_STOCKS = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '005380', name: '현대차' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '035720', name: '카카오' },
];

export function KoreanStockWatchlist() {
  const router = useRouter();
  const { data, isLoading, error } = useKoreanStockQuotes({
    symbols: POPULAR_STOCKS.map((s) => s.symbol),
  });

  const stockMap = new Map((data?.data || []).map((q) => [q.symbol, q]));
  const stocks = POPULAR_STOCKS.map((s) => stockMap.get(s.symbol)).filter(
    (s) => s !== undefined
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <p className="text-sm text-red-700 dark:text-red-200">
          인기 종목을 불러올 수 없습니다. (Kiwoom API 오류)
        </p>
        <p className="text-xs text-red-600 dark:text-red-300 mt-1">
          .env.local의 KIWOOM_APP_KEY, KIWOOM_SECRET_KEY를 확인하세요.
        </p>
      </Card>
    );
  }

  if (stocks.length === 0) {
    return (
      <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-200">
          한국 주식 데이터가 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <Card
          key={stock.symbol}
          className="p-4 cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => router.push(`/kr-stocks/${stock.symbol}`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{stock.name}</p>
              <p className="text-xs text-muted-foreground">{stock.symbol}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ₩{stock.currentPrice.toLocaleString('ko-KR', {
                  maximumFractionDigits: 0,
                })}
              </p>
              <div className="flex items-center justify-end gap-1">
                {stock.percentChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stock.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stock.percentChange >= 0 ? '+' : ''}
                  {stock.percentChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

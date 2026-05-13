'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCryptoMarket } from '@/hooks/useCryptoMarket';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function CryptoMarketStatus() {
  const { data, isLoading, error } = useCryptoMarket();

  const market = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (error || !market) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <p className="text-sm text-red-700 dark:text-red-200">
          암호화폐 시장 데이터를 불러올 수 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 시가총액 */}
      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          전체 시가총액
        </p>
        <p className="text-2xl font-bold text-foreground mb-2">
          ${(market.totalMarketCapUSD / 1e12).toFixed(2)}T
        </p>
        <div className="flex items-center gap-2">
          {market.marketCapChangePercent24h >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              market.marketCapChangePercent24h >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {market.marketCapChangePercent24h >= 0 ? '+' : ''}
            {market.marketCapChangePercent24h.toFixed(2)}%
          </span>
          <span className="text-xs text-muted-foreground">24h</span>
        </div>
      </Card>

      {/* BTC 도미넌스 */}
      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          BTC 도미넌스
        </p>
        <p className="text-2xl font-bold text-foreground mb-2">
          {market.btcDominance.toFixed(2)}%
        </p>
        <p className="text-xs text-muted-foreground">
          비트코인 시장 점유율
        </p>
      </Card>

      {/* ETH 도미넌스 */}
      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          ETH 도미넌스
        </p>
        <p className="text-2xl font-bold text-foreground mb-2">
          {market.ethDominance.toFixed(2)}%
        </p>
        <p className="text-xs text-muted-foreground">
          이더리움 시장 점유율
        </p>
      </Card>

      {/* Fear & Greed Index */}
      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          공포/탐욕 지수
        </p>
        <p className="text-2xl font-bold text-foreground mb-2">
          {market.fearGreedIndex}/100
        </p>
        <p
          className={`text-xs font-semibold ${
            market.fearGreedIndex < 25
              ? 'text-red-600'
              : market.fearGreedIndex < 45
                ? 'text-orange-600'
                : market.fearGreedIndex < 55
                  ? 'text-yellow-600'
                  : market.fearGreedIndex < 75
                    ? 'text-blue-600'
                    : 'text-green-600'
          }`}
        >
          {market.fearGreedClassification}
        </p>
      </Card>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useKoreanIndices } from '@/hooks/useKoreanIndices';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MarketIndices() {
  const { data, isLoading } = useKoreanIndices();

  const indices = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-5 w-28" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {indices.map((index) => (
        <Card key={index.symbol} className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {index.name}
          </p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {index.currentValue.toLocaleString('ko-KR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-2">
            {index.percentChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                index.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {index.percentChange >= 0 ? '+' : ''}
              {index.percentChange.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground">
              {index.change >= 0 ? '+' : ''}
              {index.change.toFixed(2)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

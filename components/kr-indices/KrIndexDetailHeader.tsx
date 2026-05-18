'use client';

import { useKoreanIndices } from '@/hooks/useKoreanIndices';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface KrIndexDetailHeaderProps {
  code: string;
}

export function KrIndexDetailHeader({ code }: KrIndexDetailHeaderProps) {
  const { data: indicesResponse, isLoading, error } = useKoreanIndices();

  const normalizedCode = code.toLowerCase();
  const index = indicesResponse?.data?.find((idx) => idx.code.toLowerCase() === normalizedCode);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>
    );
  }

  if (error || !index) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
        {error && <p className="text-xs text-red-500 mt-2">{error.message}</p>}
      </div>
    );
  }

  const isPositive = index.percentChange >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3">
      {/* 지수명 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{index.name}</h1>
        <p className="text-xs text-muted-foreground">{index.code.toUpperCase()}</p>
      </div>

      {/* 현재값 */}
      <div>
        <p className="text-4xl font-bold text-foreground">
          {index.currentValue.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* 등락폭 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPositive ? '+' : ''}
            {index.change.toFixed(2)}
          </span>
        </div>
        <span
          className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
        >
          {isPositive ? '+' : ''}
          {index.percentChange.toFixed(2)}%
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(index.updatedAt).toLocaleTimeString('ko-KR')}
        </span>
      </div>
    </div>
  );
}

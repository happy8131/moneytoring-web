'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StockPriceChart } from '@/components/stocks/StockPriceChart';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

// ID → Symbol 매핑 (from /api/us-indices)
const INDEX_MAP: Record<string, { symbol: string; name: string; fullName: string }> = {
  sp500: {
    symbol: 'SPY',
    name: 'S&P 500',
    fullName: 'SPDR S&P 500 ETF Trust',
  },
  nasdaq: {
    symbol: 'QQQ',
    name: 'NASDAQ 100',
    fullName: 'Invesco QQQ Trust',
  },
  dow: {
    symbol: 'DIA',
    name: 'Dow Jones',
    fullName: 'SPDR Dow Jones Industrial Average ETF',
  },
};

export default function IndicesDetailPage({ params }: Props) {
  const [id, setId] = useState<string>('');
  const [indexData, setIndexData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchIndexData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/us-indices?indices=${id}`);
        if (!response.ok) throw new Error('지수 데이터를 불러올 수 없습니다.');
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setIndexData(result.data[0]);
        } else {
          setError('데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndexData();
  }, [id]);

  if (!id) {
    return null;
  }

  const indexInfo = INDEX_MAP[id];
  if (!indexInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <div className="text-center text-muted-foreground">알 수 없는 지수입니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Link>

        {/* Index Header */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{indexInfo.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{indexInfo.fullName}</p>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-10 bg-muted rounded animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : indexData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    ${indexData.currentPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {indexData.percentChange >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <span
                      className={`text-lg font-semibold ${
                        indexData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {indexData.percentChange >= 0 ? '+' : ''}
                      {indexData.percentChange.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-lg font-semibold">
                    <span
                      className={indexData.change >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {indexData.change >= 0 ? '+' : ''}
                      ${indexData.change.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(indexData.updatedAt).toLocaleString('ko-KR')}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Chart & Volume */}
        <StockPriceChart symbol={indexInfo.symbol} />
      </div>
    </div>
  );
}

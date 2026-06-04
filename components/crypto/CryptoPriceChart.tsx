'use client';

import { useState, useEffect } from 'react';
import { useCryptoMarketChart } from '@/hooks/useCryptoMarketChart';
import { CRYPTO_PERIODS, CRYPTO_PERIOD_LABELS, formatCryptoPrice, formatVolumeAxis, type CryptoPeriod } from '@/lib/cryptoUtils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// X축 라벨 간격 계산 함수 (반응형)
function getXAxisInterval(dataLength: number, period: CryptoPeriod, isMobile: boolean): number {
  if (isMobile) {
    // 모바일: 레이블 수 줄임 (최대 4-5개)
    switch (period) {
      case '1D':
        return Math.ceil(dataLength / 6); // 1일: 약 4개 레이블
      case '1W':
        return Math.ceil(dataLength / 5); // 1주: 약 3-4개 레이블
      case '1M':
        return Math.ceil(dataLength / 6); // 1개월: 약 4-5개 레이블
      case '3M':
        // 3개월: 데이터 ~90개 → 약 4-5개 레이블 (90/18 = 5)
        return Math.ceil(dataLength / 18);
      case '1Y':
        // 1년: 데이터 ~365개 → 약 5개 레이블 (365/73 = 5)
        return Math.ceil(dataLength / 73);
      default:
        return Math.ceil(dataLength / 6);
    }
  } else {
    // 데스크톱: 원래대로
    switch (period) {
      case '1D':
        return Math.ceil(dataLength / 8);
      case '1W':
        return Math.ceil(dataLength / 10);
      case '1M':
        return Math.ceil(dataLength / 12);
      case '3M':
        return Math.ceil(dataLength / 15);
      case '1Y':
        return Math.ceil(dataLength / 15);
      default:
        return Math.ceil(dataLength / 12);
    }
  }
}

interface CryptoPriceChartProps {
  id: string;
  onPeriodChange?: (period: CryptoPeriod) => void;
}

export function CryptoPriceChart({ id, onPeriodChange }: CryptoPriceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<CryptoPeriod>('1M');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePeriodChange = (period: CryptoPeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const { data: chartResponse, isLoading } = useCryptoMarketChart({ id, period: selectedPeriod });
  const chartData = chartResponse?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">차트 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CRYPTO_PERIODS.map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPeriod === period
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {CRYPTO_PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Price Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={getXAxisInterval(chartData.length, selectedPeriod, isMobile)}
              minTickGap={isMobile ? 30 : 0}
              tickFormatter={(value) => {
                if (!value) return '';

                const parts = value.split(/[\s/:-]/);

                if (selectedPeriod === '1D') {
                  // 1일: HH:mm 형식 표시
                  if (parts.length >= 3) {
                    return `${parts[1]}:${parts[2]}`;
                  }
                }

                // 다른 기간 (1주, 1개월, 3개월 등): MM/DD 또는 M/D 형식
                if (parts.length >= 2) {
                  const month = parseInt(parts[0], 10);
                  const day = parseInt(parts[1], 10);
                  return `${month}/${day}`;
                }

                return value;
              }}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCryptoPrice(value)}
              tickCount={['1W', '1M', '3M'].includes(selectedPeriod) ? 5 : undefined}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [formatCryptoPrice(value), '가격'];
                }
                return ['-', '가격'];
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis dataKey="date" hide />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatVolumeAxis} tickCount={['1W', '1M', '3M'].includes(selectedPeriod) ? 3 : undefined} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [formatVolumeAxis(value), '거래량'];
                }
                return ['-', '거래량'];
              }}
            />
            <Bar dataKey="volume" fill="#60a5fa" opacity={0.7} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

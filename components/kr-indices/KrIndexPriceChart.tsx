'use client';

import { useState, useEffect } from 'react';
import { useKrIndexChart } from '@/hooks/useKrIndexChart';
import { Period } from '@/lib/stockUtils';
import { buildCandleChartData } from '@/lib/krStockUtils';
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

const PERIODS: Period[] = ['1W', '1M', '3M', '6M', 'YTD', '1Y', '2Y', '5Y', '10Y', 'All'];
const PERIOD_LABELS: Record<Period, string> = {
  '1W': '1주',
  '1M': '1개월',
  '3M': '3개월',
  '6M': '6개월',
  YTD: 'YTD',
  '1Y': '1년',
  '2Y': '2년',
  '5Y': '5년',
  '10Y': '10년',
  'All': '모두',
};

// X축 라벨 간격 계산 함수 (반응형)
function getXAxisInterval(dataLength: number, period: Period, isMobile: boolean): number {
  if (['1W'].includes(period)) {
    return 0; // 1주: 모두 표시
  }

  if (isMobile) {
    // 모바일: 레이블 수 줄임
    if (period === '1M') {
      return Math.ceil(dataLength / 6); // 1개월: 약 4-5개 레이블
    }
    if (period === '3M') {
      return 15; // 3개월: 간격 15 = 약 4개 레이블
    }
    if (period === '6M') {
      return Math.ceil(dataLength / 8);
    }
    if (period === 'YTD' || period === '1Y') {
      return Math.ceil(dataLength / 8);
    }
    if (period === '2Y') {
      return Math.ceil(dataLength / 6);
    }
    return Math.ceil(dataLength / 5); // 5Y, 10Y, All
  } else {
    // 데스크톱: 원래대로
    if (period === '1M') {
      return 0; // 1개월: 모두 표시 (원본)
    }
    if (['3M', '6M'].includes(period)) {
      return Math.ceil(dataLength / 15);
    }
    if (period === 'YTD' || period === '1Y') {
      return Math.ceil(dataLength / 15);
    }
    if (period === '2Y') {
      return Math.ceil(dataLength / 12);
    }
    return Math.ceil(dataLength / 12); // 5Y, 10Y, All
  }
}

interface KrIndexPriceChartProps {
  code: string;
  onPeriodChange?: (period: Period) => void;
}

export function KrIndexPriceChart({ code, onPeriodChange }: KrIndexPriceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1M');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const { data: chartResponse, isLoading, error } = useKrIndexChart({
    code,
    period: selectedPeriod,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !chartResponse || chartResponse.data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">차트 데이터를 불러올 수 없습니다.</div>
        {error && <p className="text-xs text-red-500 mt-2 text-center">{error.message}</p>}
      </div>
    );
  }

  const chartData = buildCandleChartData(chartResponse.data);

  const minPrice = Math.min(...chartData.map((d) => d.low));
  const maxPrice = Math.max(...chartData.map((d) => d.high));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PERIODS.map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPeriod === period
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Price Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={getXAxisInterval(chartData.length, selectedPeriod, isMobile)}
              minTickGap={isMobile ? 30 : 0}
              tickFormatter={(value) => {
                const parts = value.split('-');
                const isLongPeriod = ['5Y', '10Y', 'All'].includes(selectedPeriod);
                if (isLongPeriod) {
                  return parts[0];
                }
                return `${parts[1]}/${parts[2]}`;
              }}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [
                    `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`,
                    '지수',
                  ];
                }
                return ['-', '지수'];
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" hide />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 100_000_000) {
                  return `${(value / 100_000_000).toFixed(0)}억`;
                }
                if (value >= 10_000) {
                  return `${(value / 10_000).toFixed(0)}만`;
                }
                return `${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  if (value >= 100_000_000) {
                    return [`${(value / 100_000_000).toFixed(1)}억`, '거래량'];
                  }
                  if (value >= 10_000) {
                    return [`${(value / 10_000).toFixed(1)}만`, '거래량'];
                  }
                  return [`${value}`, '거래량'];
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

'use client';

import { useState } from 'react';
import { useForexCandle } from '@/hooks/useForexCandle';
import { getPeriodRange, Period } from '@/lib/stockUtils';
import { formatForexRate, type ForexCurrency } from '@/lib/forexCommoditiesUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// 외환은 거래량 데이터가 없으므로 stock 차트보다 짧은 기간만 제공
const PERIODS: Period[] = ['1M', '3M', '6M', '1Y', '2Y', '5Y'];
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

function getXAxisInterval(dataLength: number, period: Period): number {
  if (['1W', '1M'].includes(period)) return 0;
  if (['3M', '6M'].includes(period)) return Math.ceil(dataLength / 15);
  if (period === 'YTD' || period === '1Y') return Math.ceil(dataLength / 15);
  if (period === '2Y') return Math.ceil(dataLength / 12);
  return Math.ceil(dataLength / 12);
}

interface ForexPriceChartProps {
  symbol: ForexCurrency;
}

export function ForexPriceChart({ symbol }: ForexPriceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('3M');
  const periodRange = getPeriodRange(selectedPeriod);

  const { data: candleData, isLoading } = useForexCandle({
    symbol,
    period: periodRange,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!candleData || candleData.data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">차트 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const chartData = candleData.data.map((candle) => ({
    date: candle.date,
    rate: candle.c,
    high: candle.h,
    low: candle.l,
  }));

  const minRate = Math.min(...chartData.map((d) => d.low));
  const maxRate = Math.max(...chartData.map((d) => d.high));
  const range = maxRate - minRate;
  const padding = range * 0.1;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PERIODS.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
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

      {/* Price Chart (외환은 거래량 데이터가 없어 가격 차트만 표시) */}
      <div className="h-80 w-full min-w-0 flex">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={getXAxisInterval(chartData.length, selectedPeriod)}
              tickFormatter={(value: string) => {
                const parts = value.split('-');
                if (['5Y', '10Y', 'All'].includes(selectedPeriod)) return parts[0];
                return `${parts[1]}/${parts[2]}`;
              }}
            />
            <YAxis
              domain={[minRate - padding, maxRate + padding]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => formatForexRate(symbol, value)}
              width={80}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [formatForexRate(symbol, value), '환율'];
                }
                return ['-', '환율'];
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        외환은 거래소 거래량이 집계되지 않아 거래량 차트는 제공되지 않습니다.
      </p>
    </div>
  );
}

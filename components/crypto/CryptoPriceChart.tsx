'use client';

import { useState } from 'react';
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

interface CryptoPriceChartProps {
  id: string;
  onPeriodChange?: (period: CryptoPeriod) => void;
}

export function CryptoPriceChart({ id, onPeriodChange }: CryptoPriceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<CryptoPeriod>('1M');

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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const parts = value.split(/[/:]/);
                return parts[parts.length - 1]; // 마지막 부분만 표시
              }}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCryptoPrice(value)}
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" hide />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatVolumeAxis} />
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

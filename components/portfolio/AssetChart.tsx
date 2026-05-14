'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Holding } from '@/types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

interface AssetChartProps {
  holdings: Holding[];
  isHydrated?: boolean;
  stockPriceMap?: Map<string, number>;
  cryptoPriceMap?: Map<string, number>;
  koreanStockPriceMap?: Map<string, number>;
  krwToUsd?: number;
  isLoading?: boolean;
}

export function AssetChart({
  holdings,
  isHydrated = true,
  stockPriceMap = new Map(),
  cryptoPriceMap = new Map(),
  koreanStockPriceMap = new Map(),
  krwToUsd = 0,
  isLoading = false,
}: AssetChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = holdings
    .map((holding) => {
      let value = 0;

      if (holding.type === 'korean-stock') {
        const krwPrice = koreanStockPriceMap.get(holding.symbol) || 0;
        value = krwPrice * (krwToUsd || 0) * holding.quantity;
      } else {
        const priceMap = holding.type === 'stock' ? stockPriceMap : cryptoPriceMap;
        const currentPrice = priceMap.get(holding.symbol) || 0;
        value = currentPrice * holding.quantity;
      }

      return {
        symbol: holding.symbol,
        value,
      };
    })
    .filter((item) => item.value > 0);

  if (!isHydrated || !isMounted || isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 h-80 flex items-center justify-center">
        <div className="h-40 bg-muted animate-pulse rounded-lg w-full" />
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          자산 분배를 표시할 종목이 없습니다.
        </p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">가격 데이터를 로드 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">자산 분배</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              if (!value || typeof value === 'object') return '';
              const num = typeof value === 'string' ? parseFloat(value) : value;
              return `$${num.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

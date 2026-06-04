'use client';

import { useState, useEffect } from 'react';
import { useKrStockCandle } from '@/hooks/useKrStockCandle';
import { Period } from '@/lib/stockUtils';
import { calcIndicatorsFromCandles, buildIndicatorChartData } from '@/lib/krStockUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// X축 라벨 간격 계산 함수 (기간별, 반응형)
function getIndicatorInterval(dataLength: number, period: Period, isMobile: boolean): number {
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
    if (['YTD', '1Y'].includes(period)) {
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
    if (['YTD', '1Y'].includes(period)) {
      return Math.ceil(dataLength / 15);
    }
    if (period === '2Y') {
      return Math.ceil(dataLength / 12);
    }
    return Math.ceil(dataLength / 12); // 5Y, 10Y, All
  }
}

interface KrStockIndicatorChartProps {
  symbol: string;
  period: Period;
}

export function KrStockIndicatorChart({ symbol, period }: KrStockIndicatorChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: candleResponse, isLoading, error } = useKrStockCandle({
    symbol,
    period,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !candleResponse || candleResponse.data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">기술지표 데이터를 불러올 수 없습니다.</div>
        {error && <p className="text-xs text-red-500 mt-2 text-center">{error.message}</p>}
      </div>
    );
  }

  // 기술지표 계산
  const indicators = calcIndicatorsFromCandles(candleResponse.data);
  const isMediumPeriod = ['6M', 'YTD', '1Y', '2Y'].includes(period);

  // SMA 라인 정의
  const smaLines = [
    { dataKey: 'sma5', stroke: '#3b82f6', name: '5일' },
    { dataKey: 'sma20', stroke: '#ef4444', name: '20일' },
    ...(isMediumPeriod
      ? [
          { dataKey: 'sma60', stroke: '#10b981', name: '60일' },
          { dataKey: 'sma120', stroke: '#f59e0b', name: '120일' },
        ]
      : []),
  ];

  const chartData = buildIndicatorChartData(candleResponse.data, indicators, period);

  return (
    <div className="space-y-6">
      {/* RSI 차트 */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">RSI (14)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={getIndicatorInterval(chartData.length, period, isMobile)} minTickGap={isMobile ? 30 : 0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                }}
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return [value.toFixed(2), 'RSI'];
                  }
                  return ['-', 'RSI'];
                }}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" label="과매수 (70)" />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="5 5" label="과매도 (30)" />
              <Line
                type="monotone"
                dataKey="rsi14"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SMA 차트 */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">이동평균선</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={getIndicatorInterval(chartData.length, period, isMobile)} minTickGap={isMobile ? 30 : 0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                }}
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return [`₩${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`, 'SMA'];
                  }
                  return ['-', 'SMA'];
                }}
              />
              <Legend />
              {smaLines.map((line) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

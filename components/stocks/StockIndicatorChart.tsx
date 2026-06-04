'use client';

import { useState, useEffect } from 'react';
import { useStockIndicator } from '@/hooks/useStockIndicator';
import { getPeriodRange, Period } from '@/lib/stockUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
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

interface StockIndicatorChartProps {
  symbol: string;
  period: Period;
}

export function StockIndicatorChart({ symbol, period }: StockIndicatorChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const periodRange = getPeriodRange(period);

  // RSI (Relative Strength Index) - 14일
  const { data: rsiData, isLoading: rsiLoading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'rsi',
    timeperiod: 14,
  });

  // SMA (Simple Moving Average) - 5일, 20일, 60일, 120일, 210일
  const { data: sma5Data, isLoading: sma5Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 5,
  });

  const { data: sma20Data, isLoading: sma20Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 20,
  });

  const { data: sma60Data, isLoading: sma60Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 60,
  });

  const { data: sma120Data, isLoading: sma120Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 120,
  });

  const { data: sma210Data, isLoading: sma210Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 210,
  });

  if (rsiLoading || sma5Loading || sma20Loading || sma60Loading || sma120Loading || sma210Loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const isShortPeriod = ['1W', '1M', '3M'].includes(period);
  const isMediumPeriod = ['6M', 'YTD', '1Y', '2Y'].includes(period);
  const isLongPeriod = ['5Y', '10Y', 'All'].includes(period);

  const allSmaLines = [
    { dataKey: 'sma5', stroke: '#3b82f6', name: '5일' },
    { dataKey: 'sma20', stroke: '#ef4444', name: '20일' },
    { dataKey: 'sma60', stroke: '#10b981', name: '60일' },
    { dataKey: 'sma120', stroke: '#f59e0b', name: '120일' },
    { dataKey: 'sma210', stroke: '#8b5cf6', name: '210일' },
  ];

  let smaLines = allSmaLines;
  if (isShortPeriod) {
    smaLines = allSmaLines.slice(0, 2);
  } else if (isMediumPeriod) {
    smaLines = allSmaLines.slice(0, 3);
  }

  // RSI 차트 데이터 (null 값 필터링)
  const rsiChartData = (rsiData?.t || [])
    .map((timestamp, index) => {
      const date = new Date(timestamp * 1000);
      const dateLabel = isLongPeriod
        ? date.toLocaleDateString('en-US', { year: 'numeric' })
        : date
            .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
            .replace(/\//g, '/');
      return {
        date: dateLabel,
        rsi: rsiData?.values[index],
      };
    })
    .filter((d) => d.rsi !== null && d.rsi !== undefined);

  // SMA 차트 데이터 (null 값 필터링)
  const smaChartData = (sma5Data?.t || [])
    .map((timestamp, index) => {
      const date = new Date(timestamp * 1000);
      const dateLabel = isLongPeriod
        ? date.toLocaleDateString('en-US', { year: 'numeric' })
        : date
            .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
            .replace(/\//g, '/');
      const sma5Val = sma5Data?.values[index];
      const sma20Val = sma20Data?.values[index];
      const sma60Val = sma60Data?.values[index];
      const sma120Val = sma120Data?.values[index];
      const sma210Val = sma210Data?.values[index];
      return {
        date: dateLabel,
        sma5: sma5Val,
        sma20: sma20Val,
        sma60: sma60Val,
        sma120: sma120Val,
        sma210: sma210Val,
      };
    })
    .filter(
      (d) =>
        (d.sma5 !== null && d.sma5 !== undefined) ||
        (d.sma20 !== null && d.sma20 !== undefined) ||
        (d.sma60 !== null && d.sma60 !== undefined) ||
        (d.sma120 !== null && d.sma120 !== undefined) ||
        (d.sma210 !== null && d.sma210 !== undefined)
    );

  return (
    <div className="space-y-6">
      {/* RSI Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">RSI (14)</h3>
        {rsiChartData.length > 0 ? (
          <div className="h-80 w-full min-w-0 flex">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={rsiChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={getIndicatorInterval(rsiChartData.length, period, isMobile)}
                  minTickGap={isMobile ? 30 : 0}
                />
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
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="과매수" />
                <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="3 3" label="과매도" />
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            데이터 없음
          </div>
        )}
      </div>

      {/* SMA Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">이동평균선 (5일 / 20일 / 60일 / 120일 / 210일)</h3>
        {smaChartData.length > 0 ? (
          <div className="space-y-4">
            <div className="h-80 w-full min-w-0 flex">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={smaChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={getIndicatorInterval(smaChartData.length, period, isMobile)}
                  minTickGap={isMobile ? 30 : 0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return [value.toFixed(2), 'SMA'];
                    }
                    return ['-', 'SMA'];
                  }}
                />
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

            <div className="flex flex-wrap gap-4 justify-center text-sm">
              {smaLines.map((line) => (
                <div key={line.dataKey} className="flex items-center gap-2">
                  <div className="w-4 h-1" style={{ backgroundColor: line.stroke }}></div>
                  <span>{line.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            데이터 없음
          </div>
        )}
      </div>
    </div>
  );
}

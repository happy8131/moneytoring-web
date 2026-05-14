'use client';

import { useStockIndicator } from '@/hooks/useStockIndicator';
import { getPeriodRange, Period } from '@/lib/stockUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface StockIndicatorChartProps {
  symbol: string;
  period: Period;
}

export function StockIndicatorChart({ symbol, period }: StockIndicatorChartProps) {
  const periodRange = getPeriodRange(period);

  // RSI (Relative Strength Index) - 14일
  const { data: rsiData, isLoading: rsiLoading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'rsi',
    timeperiod: 14,
  });

  // SMA (Simple Moving Average) - 20일, 50일
  const { data: sma20Data, isLoading: sma20Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 20,
  });

  const { data: sma50Data, isLoading: sma50Loading } = useStockIndicator({
    symbol,
    period: periodRange,
    indicator: 'sma',
    timeperiod: 50,
  });

  if (rsiLoading || sma20Loading || sma50Loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // RSI 차트 데이터
  const rsiChartData = (rsiData?.t || []).map((timestamp, index) => ({
    date: new Date(timestamp * 1000)
      .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      .replace(/\//g, '/'),
    rsi: rsiData?.values[index] ?? null,
  }));

  // SMA 차트 데이터
  const smaChartData = (sma20Data?.t || []).map((timestamp, index) => ({
    date: new Date(timestamp * 1000)
      .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      .replace(/\//g, '/'),
    sma20: sma20Data?.values[index] ?? null,
    sma50: sma50Data?.values[index] ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* RSI Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">RSI (14)</h3>
        {rsiChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rsiChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(rsiChartData.length / 10)}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return [value.toFixed(2), 'RSI'];
                    }
                    return ['-', 'RSI'];
                  }}
                />
                <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="과매수" />
                <ReferenceLine y={30} stroke="hsl(var(--primary))" strokeDasharray="3 3" label="과매도" />
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="hsl(var(--primary))"
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
        <h3 className="text-lg font-semibold mb-4">이동평균선 (20일 / 50일)</h3>
        {smaChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={smaChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(smaChartData.length / 10)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return [value.toFixed(2), 'SMA'];
                    }
                    return ['-', 'SMA'];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="hsl(var(--primary))"
                  dot={false}
                  isAnimationActive={false}
                  name="20일"
                />
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="hsl(var(--destructive))"
                  dot={false}
                  isAnimationActive={false}
                  name="50일"
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
    </div>
  );
}

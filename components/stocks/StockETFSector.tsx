'use client';

import { useETFSector } from '@/hooks/useETFSector';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockETFSectorProps {
  symbol: string;
}

export function StockETFSector({ symbol }: StockETFSectorProps) {
  const { data: sectorData, isLoading, error } = useETFSector({ symbol });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-red-500">
          섹터 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const sectors = sectorData?.sectors || [];

  if (sectors.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">섹터 데이터가 없습니다.</div>
      </div>
    );
  }

  // 상위 10개 섹터만 표시
  const displaySectors = sectors.slice(0, 10).sort((a, b) => b.exposure - a.exposure);

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">섹터별 자산 구성</h3>

      <div className="w-full min-w-0 flex">
        <ResponsiveContainer width="100%" height={400} minWidth={0}>
          <BarChart
            data={displaySectors}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis type="number" stroke="var(--color-muted-foreground)" />
          <YAxis
            dataKey="sector"
            type="category"
            stroke="var(--color-muted-foreground)"
            width={190}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '0.375rem',
            }}
            formatter={(value) => `${(value as number).toFixed(2)}%`}
          />
          <Bar dataKey="exposure" fill="var(--color-primary)" />
        </BarChart>
      </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        * 상위 10개 섹터 기준, 비중 단위는 %입니다.
      </p>
    </div>
  );
}

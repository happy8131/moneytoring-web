import { Suspense } from 'react';
import { EconomicCalendarClient } from '@/components/economic/EconomicCalendarClient';

export const metadata = {
  title: '경제지표 달력 - Moneytoring',
  description: '미국·유로존·한국의 주요 경제지표 일정과 발표값',
};

export default function EconomicCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">경제지표</h1>
        <p className="text-muted-foreground">
          미국·유로존·한국의 주요 매크로 지표 최근 발표값
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        }
      >
        <EconomicCalendarClient />
      </Suspense>
    </div>
  );
}

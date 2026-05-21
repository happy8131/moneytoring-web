import { headers } from 'next/headers';
import { StockSectorHeatmap } from '@/components/stocks/StockSectorHeatmap';
import { RefreshHeatmapButton } from '@/components/stocks/RefreshHeatmapButton';
import { SectorHeatmapData } from '@/lib/sectorHeatmapUtils';

// 페이지는 동적 렌더링, 캐싱은 fetch 레벨(API의 next: { revalidate: 30 })에서 처리
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sector Heatmap - Moneytoring',
  description: 'S&P 500 Performance by Sector',
};

async function fetchSectorHeatmap(): Promise<{ data: SectorHeatmapData[] } | null> {
  try {
    const headersList = await headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/stocks/sector-heatmap`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch sector heatmap:', error);
    return null;
  }
}

export default async function SectorHeatmapPage() {
  const heatmapData = await fetchSectorHeatmap();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sector Heatmap</h1>
            <p className="text-muted-foreground mt-2">S&P 500 Performance by Sector</p>
          </div>

          <RefreshHeatmapButton />
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Not financial advice. Educational purposes only. Past performance does not guarantee future results.{' '}
              <a href="#" className="underline">
                Full Disclaimer
              </a>
            </p>
          </div>
          <button className="ml-auto text-yellow-400 hover:text-yellow-600">×</button>
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border border-border bg-card p-6">
          {heatmapData?.data ? (
            <StockSectorHeatmap data={heatmapData.data} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-2">잠시 후 다시 시도해주세요.</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3">색상 범례</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded"></div>
              <span className="text-sm text-muted-foreground">+2% 이상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded"></div>
              <span className="text-sm text-muted-foreground">0% ~ +2%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-400 rounded"></div>
              <span className="text-sm text-muted-foreground">-1% ~ 0%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded"></div>
              <span className="text-sm text-muted-foreground">-1% 이하</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

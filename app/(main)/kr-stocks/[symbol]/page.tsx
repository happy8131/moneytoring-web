import { KrStockDetailHeader } from '@/components/kr-stocks/KrStockDetailHeader';
import { KrStockPriceChart } from '@/components/kr-stocks/KrStockPriceChart';
import { KrStockMetricsGrid } from '@/components/kr-stocks/KrStockMetricsGrid';
import { KrStockIndicatorChart } from '@/components/kr-stocks/KrStockIndicatorChart';
import { KrStockFinancialsTable } from '@/components/kr-stocks/KrStockFinancialsTable';

interface KrStockDetailPageProps {
  params: {
    symbol: string;
  };
}

export async function generateMetadata({ params }: KrStockDetailPageProps) {
  const { symbol } = await params;
  return {
    title: `${symbol} - 한국 주식 상세`,
    description: `${symbol}의 실시간 가격, 차트, 기술지표 정보`,
  };
}

export default async function KrStockDetailPage({ params }: KrStockDetailPageProps) {
  const { symbol } = await params;

  return (
    <div className="space-y-6 pb-12">
      {/* 헤더 */}
      <KrStockDetailHeader symbol={symbol} />

      {/* 차트 */}
      <KrStockPriceChart symbol={symbol} />

      {/* 주요 지표 */}
      <KrStockMetricsGrid symbol={symbol} />

      {/* 기술지표 */}
      <KrStockIndicatorChart symbol={symbol} period="1M" />

      {/* 거래 현황 */}
      <KrStockFinancialsTable symbol={symbol} />
    </div>
  );
}

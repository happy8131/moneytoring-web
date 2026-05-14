import { Metadata } from 'next';
import { StockDetailHeader } from '@/components/stocks/StockDetailHeader';
import { StockPriceChart } from '@/components/stocks/StockPriceChart';
import { StockMetricsGrid } from '@/components/stocks/StockMetricsGrid';
import { StockIndicatorChart } from '@/components/stocks/StockIndicatorChart';
import { StockFinancialsTable } from '@/components/stocks/StockFinancialsTable';
import { StockNewsSection } from '@/components/stocks/StockNewsSection';

type Props = {
  params: Promise<{ symbol: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol} - 주식 상세정보 | Moneytoring`,
    description: `${symbol} 종목의 실시간 가격, 차트, 지표, 재무정보를 한눈에 확인하세요.`,
  };
}

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 space-y-6">
        <StockDetailHeader symbol={symbol} />
        <StockPriceChart symbol={symbol} />
        <StockMetricsGrid symbol={symbol} />
        <StockIndicatorChart symbol={symbol} period="1Y" />
        <StockFinancialsTable symbol={symbol} />
        <StockNewsSection symbol={symbol} />
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';
import { UnifiedSearchBar } from '@/components/dashboard/UnifiedSearchBar';

export const metadata = {
  title: '대시보드 - Moneytoring',
  description: '실시간 주식 및 암호화폐 가격 조회',
};

const StockWatchlist = dynamic(
  () => import('@/components/dashboard/StockWatchlist').then((m) => m.StockWatchlist),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

const CryptoWatchlist = dynamic(
  () => import('@/components/dashboard/CryptoWatchlist').then((m) => m.CryptoWatchlist),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

const MarketIndices = dynamic(
  () => import('@/components/dashboard/MarketIndices').then((m) => m.MarketIndices),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

const KoreanStockWatchlist = dynamic(
  () => import('@/components/dashboard/KoreanStockWatchlist').then((m) => m.KoreanStockWatchlist),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

const USMarketIndices = dynamic(
  () => import('@/components/dashboard/USMarketIndices').then((m) => m.USMarketIndices),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

const CryptoMarketStatus = dynamic(
  () => import('@/components/dashboard/CryptoMarketStatus').then((m) => m.CryptoMarketStatus),
  { loading: () => <div className="animate-pulse p-4">로딩 중...</div> }
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          실시간 주식 및 암호화폐 가격을 확인하세요.
        </p>
      </div>

      {/* 종목 검색 */}
      <div className="max-w-xl">
        <UnifiedSearchBar />
      </div>

      {/* 미국 증시 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">미국 증시</h2>
        <USMarketIndices />
      </section>

      {/* 암호화폐 시장 현황 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">암호화폐 시장</h2>
        <CryptoMarketStatus />
      </section>

      {/* 한국 증시 지수만 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">한국 증시</h2>
        <MarketIndices />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">미국 주식</h2>
          <StockWatchlist />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">암호화폐</h2>
          <CryptoWatchlist />
        </div>
      </div>

      {/* 한국 개별 주식 종목 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">한국 주식</h2>
        <KoreanStockWatchlist />
      </section>
    </div>
  );
}

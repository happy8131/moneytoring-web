import dynamic from 'next/dynamic';

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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          실시간 주식 및 암호화폐 가격을 확인하세요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">주식</h2>
          <StockWatchlist />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">암호화폐</h2>
          <CryptoWatchlist />
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">한국 증시</h2>
        <MarketIndices />
        <KoreanStockWatchlist />
      </section>
    </div>
  );
}

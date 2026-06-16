'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Plus, LogIn, Share2, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStockQuotes } from '@/hooks/useStockQuotes';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useKoreanStockQuotes } from '@/hooks/useKoreanStockQuotes';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { symbolsToCoinGeckoIds } from '@/lib/crypto-symbols';
import {
  calculatePortfolioSummary,
  mergeHoldingsWithPrices,
} from '@/lib/calculations';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummary';
import { PortfolioTable } from '@/components/portfolio/PortfolioTable';
import { AssetChart } from '@/components/portfolio/AssetChart';
import { AddHoldingModal } from '@/components/portfolio/AddHoldingModal';
import { DeleteConfirmDialog } from '@/components/portfolio/DeleteConfirmDialog';
import { TransactionTable } from '@/components/portfolio/TransactionTable';
import { TransactionModal } from '@/components/portfolio/TransactionModal';
import { PortfolioAnalytics } from '@/components/portfolio/PortfolioAnalytics';
import { ShareSettings } from '@/components/portfolio/ShareSettings';
import Link from 'next/link';
import type { Holding } from '@/types';
import type { QuotesResponse } from '@/app/api/stocks/quotes/route';
import type { CryptoPricesResponse } from '@/app/api/crypto/prices/route';

export default function PortfolioPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const { holdings, isHydrated, removeHolding, addHolding, transactions, addTransaction, removeTransaction } =
    usePortfolio();

  const [addHoldingModalOpen, setAddHoldingModalOpen] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [shareSettingsOpen, setShareSettingsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetSymbol, setDeleteTargetSymbol] = useState<string>('');
  const [deleteType, setDeleteType] = useState<'holding' | 'transaction'>('holding');

  const stockSymbols = holdings
    .filter((h) => h.type === 'stock')
    .map((h) => h.symbol);
  const cryptoSymbols = holdings
    .filter((h) => h.type === 'crypto')
    .map((h) => h.symbol);
  const koreanStockSymbols = holdings
    .filter((h) => h.type === 'korean-stock')
    .map((h) => h.symbol);
  const cryptoIds = symbolsToCoinGeckoIds(cryptoSymbols);

  const stockQueryResult = useStockQuotes({
    symbols: stockSymbols,
    enabled: stockSymbols.length > 0,
  });
  const cryptoQueryResult = useCryptoPrices({
    ids: cryptoIds,
    enabled: cryptoIds.length > 0,
  });
  const koreanStockQueryResult = useKoreanStockQuotes({
    symbols: koreanStockSymbols,
    enabled: koreanStockSymbols.length > 0,
  });
  const exchangeRateResult = useExchangeRate();

  const stockData = stockQueryResult.data as QuotesResponse | undefined;
  const cryptoData = cryptoQueryResult.data as CryptoPricesResponse | undefined;

  const stockPriceMap = new Map(
    (stockData?.data || []).map((quote) => [quote.symbol, quote.currentPrice])
  );
  const cryptoPriceMap = new Map(
    (cryptoData?.data || []).map((crypto) => [crypto.symbol, crypto.currentPrice])
  );
  const koreanStockPriceMap = new Map(
    (koreanStockQueryResult.data?.data || []).map((q) => [q.symbol, q.currentPrice])
  );
  const krwToUsd = exchangeRateResult.data?.krwToUsd ?? 0;

  const holdingsWithPrices = mergeHoldingsWithPrices(
    holdings,
    stockPriceMap,
    cryptoPriceMap,
    koreanStockPriceMap,
    krwToUsd
  );

  const summary = calculatePortfolioSummary(holdingsWithPrices);

  const handleHoldingDelete = (holdingId: string) => {
    const holding = holdingsWithPrices.find((h) => h.id === holdingId);
    if (holding) {
      setDeleteTargetId(holding.id);
      setDeleteTargetSymbol(holding.symbol);
      setDeleteType('holding');
      setDeleteConfirmOpen(true);
    }
  };

  const handleTransactionDelete = (transactionId: string) => {
    setDeleteTargetId(transactionId);
    setDeleteType('transaction');
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      if (deleteType === 'holding') {
        removeHolding(deleteTargetId);
      } else {
        removeTransaction(deleteTargetId);
      }
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetSymbol('');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
            <p className="text-muted-foreground mt-1">
              보유 중인 자산을 관리하고 수익률을 분석하세요.
            </p>
          </div>
        </div>
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
            <p className="text-muted-foreground mt-1">
              보유 중인 자산을 관리하고 수익률을 분석하세요.
            </p>
          </div>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">로그인이 필요합니다</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                포트폴리오 기능을 사용하려면 로그인해주세요.
              </p>
            </div>
            <Button asChild className="mt-4">
              <a href="/login">로그인하기</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
            <p className="text-muted-foreground mt-1">
              보유 중인 자산을 관리하고 수익률을 분석하세요.
            </p>
          </div>
        </div>
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
          <p className="text-muted-foreground mt-1">
            보유 중인 자산을 관리하고 수익률을 분석하세요.
          </p>
        </div>
        <Link href="/portfolios">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            공개 포트폴리오
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList>
          <TabsTrigger value="holdings">보유종목</TabsTrigger>
          <TabsTrigger value="transactions">거래기록</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShareSettingsOpen(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              공유 설정
            </Button>
            <Button onClick={() => setAddHoldingModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              종목 추가
            </Button>
          </div>

          <PortfolioSummaryCard summary={summary} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PortfolioTable
                holdings={holdingsWithPrices}
                onDelete={handleHoldingDelete}
              />
            </div>

            <div>
              <AssetChart
                holdings={holdings}
                isHydrated={isHydrated}
                stockPriceMap={stockPriceMap}
                cryptoPriceMap={cryptoPriceMap}
                koreanStockPriceMap={koreanStockPriceMap}
                krwToUsd={krwToUsd}
                isLoading={stockQueryResult.isLoading || cryptoQueryResult.isLoading || koreanStockQueryResult.isLoading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setAddTransactionModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              거래 추가
            </Button>
          </div>

          <TransactionTable
            transactions={transactions}
            onDelete={handleTransactionDelete}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PortfolioAnalytics
            holdingsWithPrices={holdingsWithPrices}
            transactions={transactions}
          />
        </TabsContent>
      </Tabs>

      <ShareSettings
        open={shareSettingsOpen}
        onOpenChange={setShareSettingsOpen}
        currentHoldings={holdingsWithPrices}
      />

      <AddHoldingModal
        open={addHoldingModalOpen}
        onOpenChange={setAddHoldingModalOpen}
        onAddHolding={addHolding}
      />

      <TransactionModal
        open={addTransactionModalOpen}
        onOpenChange={setAddTransactionModalOpen}
        onAddTransaction={addTransaction}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        holdingSymbol={deleteType === 'holding' ? deleteTargetSymbol : '거래 기록'}
      />
    </div>
  );
}

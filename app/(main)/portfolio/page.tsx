'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStockQuotes } from '@/hooks/useStockQuotes';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { calculatePortfolioSummary, mergeHoldingsWithPrices } from '@/lib/calculations';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummary';
import { PortfolioTable } from '@/components/portfolio/PortfolioTable';
import { AssetChart } from '@/components/portfolio/AssetChart';
import { AddHoldingModal } from '@/components/portfolio/AddHoldingModal';
import { DeleteConfirmDialog } from '@/components/portfolio/DeleteConfirmDialog';
import type { Holding } from '@/types';

export default function PortfolioPage() {
  const { holdings, removeHolding } = usePortfolio();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetSymbol, setDeleteTargetSymbol] = useState<string>('');

  const stockSymbols = holdings
    .filter((h) => h.type === 'stock')
    .map((h) => h.symbol);
  const cryptoIds = holdings
    .filter((h) => h.type === 'crypto')
    .map((h) => h.symbol.toLowerCase());

  const { data: stockData } = useStockQuotes({
    symbols: stockSymbols,
    enabled: stockSymbols.length > 0,
  });
  const { data: cryptoData } = useCryptoPrices({
    ids: cryptoIds,
    enabled: cryptoIds.length > 0,
  });

  const stockPriceMap = new Map(
    (stockData?.data || []).map((quote) => [quote.symbol, quote.currentPrice])
  );
  const cryptoPriceMap = new Map(
    (cryptoData?.data || []).map((crypto) => [crypto.symbol, crypto.currentPrice])
  );

  const holdingsWithPrices = mergeHoldingsWithPrices(
    holdings,
    stockPriceMap,
    cryptoPriceMap
  );

  const summary = calculatePortfolioSummary(holdingsWithPrices);

  const handleDeleteClick = (holdingId: string) => {
    const holding = holdingsWithPrices.find((h) => h.id === holdingId);
    if (holding) {
      setDeleteTargetId(holding.id);
      setDeleteTargetSymbol(holding.symbol);
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      removeHolding(deleteTargetId);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetSymbol('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
          <p className="text-muted-foreground mt-1">
            보유 중인 자산을 관리하고 수익률을 분석하세요.
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          종목 추가
        </Button>
      </div>

      <PortfolioSummaryCard summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioTable
            holdings={holdingsWithPrices}
            onDelete={handleDeleteClick}
          />
        </div>

        <div>
          <AssetChart />
        </div>
      </div>

      <AddHoldingModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        holdingSymbol={deleteTargetSymbol}
      />
    </div>
  );
}

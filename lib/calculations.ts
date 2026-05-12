import type { Holding, PortfolioSummary, Transaction } from '@/types';

// 보유 종목의 현재 가치 계산
export function calculateHoldingValue(holding: Holding): number {
  return (holding.currentPrice || 0) * holding.quantity;
}

// 보유 종목의 손익 계산
export function calculateGain(holding: Holding): number {
  const totalValue = calculateHoldingValue(holding);
  const totalInvested = holding.buyPrice * holding.quantity;
  return totalValue - totalInvested;
}

// 보유 종목의 수익률 계산 (%)
export function calculateGainPercent(holding: Holding): number {
  const totalInvested = holding.buyPrice * holding.quantity;
  if (totalInvested === 0) return 0;
  return ((calculateGain(holding) / totalInvested) * 100);
}

// 포트폴리오에 현재 가격 및 손익 병합
export function mergeHoldingsWithPrices(
  holdings: Holding[],
  stockPrices: Map<string, number>,
  cryptoPrices: Map<string, number>
): Holding[] {
  return holdings.map((holding) => {
    const priceMap = holding.type === 'stock' ? stockPrices : cryptoPrices;
    const currentPrice = priceMap.get(holding.symbol) || 0;

    return {
      ...holding,
      currentPrice,
      totalValue: currentPrice * holding.quantity,
      gain: (currentPrice * holding.quantity) - (holding.buyPrice * holding.quantity),
      gainPercent: calculateGainPercent({ ...holding, currentPrice }),
    };
  });
}

// 포트폴리오 요약 계산
export function calculatePortfolioSummary(holdings: Holding[]): PortfolioSummary {
  const totalValue = holdings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
  const totalInvested = holdings.reduce((sum, h) => sum + (h.buyPrice * h.quantity), 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested === 0 ? 0 : (totalGain / totalInvested) * 100;

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalGainPercent,
    holdingsCount: holdings.length,
  };
}

// 자산 분배 데이터 생성 (PieChart용)
export function generateAssetDistribution(holdings: Holding[]) {
  return holdings.map((holding) => ({
    symbol: holding.symbol,
    name: holding.name,
    value: holding.totalValue || 0,
    percentage: 0, // 나중에 계산됨
  })).filter((item) => item.value > 0)
    .map((item, _, arr) => ({
      ...item,
      percentage: (item.value / arr.reduce((sum, i) => sum + i.value, 0)) * 100,
    }));
}

// 형식화된 통화 표시
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// 형식화된 백분율 표시
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

// 거래 기록 기반 평균 매수 단가 계산
export function calculateAverageCost(
  transactions: Transaction[],
  symbol: string
): number {
  const buyTxs = transactions.filter(
    (tx) => tx.symbol === symbol && tx.type === 'buy'
  );

  if (buyTxs.length === 0) return 0;

  const totalCost = buyTxs.reduce((sum, tx) => sum + tx.price * tx.quantity, 0);
  const totalQuantity = buyTxs.reduce((sum, tx) => sum + tx.quantity, 0);

  return totalQuantity === 0 ? 0 : totalCost / totalQuantity;
}

// 거래 기록 기반 순 보유 수량 계산
export function calculateNetQuantity(
  transactions: Transaction[],
  symbol: string
): number {
  return transactions
    .filter((tx) => tx.symbol === symbol)
    .reduce((sum, tx) => sum + (tx.type === 'buy' ? tx.quantity : -tx.quantity), 0);
}

// 거래 기록 기반 자산 추이 계산 (시계열 데이터)
export function calculatePortfolioValueHistory(
  transactions: Transaction[],
  currentPriceMap: Map<string, number>
): { date: string; value: number }[] {
  if (transactions.length === 0) return [];

  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const symbolQuantityByDate = new Map<string, Map<string, number>>();
  const uniqueDates = new Set<string>();

  sortedTxs.forEach((tx) => {
    uniqueDates.add(tx.date);

    if (!symbolQuantityByDate.has(tx.date)) {
      symbolQuantityByDate.set(tx.date, new Map());
    }

    const dateMap = symbolQuantityByDate.get(tx.date)!;
    const currentQty = dateMap.get(tx.symbol) || 0;
    const delta = tx.type === 'buy' ? tx.quantity : -tx.quantity;
    dateMap.set(tx.symbol, currentQty + delta);
  });

  const cumulativeQuantity = new Map<string, number>();
  const result: { date: string; value: number }[] = [];

  [...uniqueDates].sort().forEach((date) => {
    const txForDate = sortedTxs.filter((tx) => tx.date === date);

    txForDate.forEach((tx) => {
      const currentQty = cumulativeQuantity.get(tx.symbol) || 0;
      const delta = tx.type === 'buy' ? tx.quantity : -tx.quantity;
      cumulativeQuantity.set(tx.symbol, currentQty + delta);
    });

    const portfolioValue = Array.from(cumulativeQuantity.entries()).reduce(
      (sum, [symbol, quantity]) => {
        const price = currentPriceMap.get(symbol) || 0;
        return sum + price * quantity;
      },
      0
    );

    result.push({ date, value: portfolioValue });
  });

  return result;
}

// 리밸런싱 제안 (균등 분배)
export function calculateRebalancingSuggestions(
  holdingsWithPrices: Holding[]
): {
  symbol: string;
  currentPercent: number;
  targetPercent: number;
  diff: number;
}[] {
  const totalValue = holdingsWithPrices.reduce(
    (sum, h) => sum + (h.totalValue || 0),
    0
  );

  if (totalValue === 0) return [];

  const targetPercent = 100 / holdingsWithPrices.length;

  return holdingsWithPrices.map((holding) => {
    const currentPercent =
      ((holding.totalValue || 0) / totalValue) * 100;
    const diff = currentPercent - targetPercent;

    return {
      symbol: holding.symbol,
      currentPercent,
      targetPercent,
      diff,
    };
  });
}

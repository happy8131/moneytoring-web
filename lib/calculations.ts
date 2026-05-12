import type { Holding, PortfolioSummary } from '@/types';

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

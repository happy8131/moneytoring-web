import type { AIRecommendation, Holding, PortfolioSummary } from '@/types';

export function generateRecommendations(
  holdingsWithPrices: Holding[],
  summary: PortfolioSummary
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (holdingsWithPrices.length === 0) {
    return [];
  }

  // 규칙 1: 단일 종목 과집중 (비중 > 50%)
  for (const holding of holdingsWithPrices) {
    const weight = summary.totalValue > 0 ? (holding.totalValue || 0) / summary.totalValue : 0;
    if (weight > 0.5) {
      recommendations.push({
        id: `diversification-overconcentration-${holding.symbol}`,
        title: `${holding.symbol} 과집중 위험`,
        description: `${holding.symbol}의 비중이 ${(weight * 100).toFixed(1)}%로 포트폴리오의 50% 이상을 차지하고 있습니다. 분산 투자를 권장합니다.`,
        priority: 'high',
        category: 'diversification',
        action: `${holding.symbol} 비중을 50% 이하로 감소시키고 다른 종목에 투자하세요.`,
      });
    }
  }

  // 규칙 2: 종목 수 부족 (≤ 2개)
  if (holdingsWithPrices.length <= 2) {
    recommendations.push({
      id: 'diversification-insufficient-holdings',
      title: '포트폴리오 다각화 필요',
      description: `현재 ${holdingsWithPrices.length}개의 종목만 보유하고 있습니다. 최소 3개 이상의 종목 분산을 권장합니다.`,
      priority: 'medium',
      category: 'diversification',
      action: '추가 종목을 매수하여 포트폴리오를 다각화하세요.',
    });
  }

  // 규칙 3: 암호화폐 비중 과다 (> 60%)
  const cryptoHoldings = holdingsWithPrices.filter((h) => h.type === 'crypto');
  const cryptoTotalValue = cryptoHoldings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
  const cryptoWeight = summary.totalValue > 0 ? cryptoTotalValue / summary.totalValue : 0;
  if (cryptoWeight > 0.6) {
    recommendations.push({
      id: 'risk-high-crypto',
      title: '암호화폐 비중 과다',
      description: `암호화폐 비중이 ${(cryptoWeight * 100).toFixed(1)}%로 높습니다. 시장 변동성 위험이 크므로 주식 등 안정적 자산 비중을 높이세요.`,
      priority: 'high',
      category: 'risk',
      action: '암호화폐 비중을 60% 이하로 감소시키고 주식 비중을 증가시키세요.',
    });
  }

  // 규칙 4: 큰 손실 종목 (수익률 < -20%)
  for (const holding of holdingsWithPrices) {
    const gainPercent = holding.gainPercent || 0;
    if (gainPercent < -20) {
      recommendations.push({
        id: `risk-large-loss-${holding.symbol}`,
        title: `${holding.symbol} 손실 경고`,
        description: `${holding.symbol}의 수익률이 ${gainPercent.toFixed(1)}%로 큰 손실을 기록 중입니다. 손실 한정 또는 재평가가 필요합니다.`,
        priority: 'medium',
        category: 'risk',
        action: `${holding.symbol}의 투자 근거를 재검토하고 손절 또는 추가 매수 여부를 판단하세요.`,
      });
    }
  }

  // 규칙 5: 고수익 수익 실현 (수익률 > +50%)
  for (const holding of holdingsWithPrices) {
    const gainPercent = holding.gainPercent || 0;
    if (gainPercent > 50) {
      recommendations.push({
        id: `opportunity-high-gain-${holding.symbol}`,
        title: `${holding.symbol} 수익 실현 기회`,
        description: `${holding.symbol}의 수익률이 ${gainPercent.toFixed(1)}%로 높은 수익을 기록 중입니다. 일부 수익 실현을 고려하세요.`,
        priority: 'low',
        category: 'opportunity',
        action: `${holding.symbol}의 일부를 매도하여 수익을 실현하고, 실현 이익을 다른 종목에 재투자하세요.`,
      });
    }
  }

  // 규칙 6: 리밸런싱 필요 (비중 괴리 > 30%p)
  const targetWeight = 1 / holdingsWithPrices.length;
  const rebalancingNeeded = holdingsWithPrices.some((holding) => {
    const currentWeight = summary.totalValue > 0 ? (holding.totalValue || 0) / summary.totalValue : 0;
    const diff = Math.abs(currentWeight - targetWeight);
    return diff > 0.3;
  });

  if (rebalancingNeeded) {
    recommendations.push({
      id: 'rebalancing-portfolio',
      title: '포트폴리오 리밸런싱 필요',
      description: `일부 종목의 비중이 목표 비중(${(targetWeight * 100).toFixed(1)}%)에서 30% 이상 벗어났습니다. 리밸런싱을 권장합니다.`,
      priority: 'medium',
      category: 'rebalancing',
      action: '포트폴리오를 균등 분배로 재조정하여 리스크를 최소화하세요.',
    });
  }

  // 최대 5개 반환 (우선순위 순: high → medium → low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 5);
}

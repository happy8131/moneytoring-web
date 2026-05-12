'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStockQuotes } from '@/hooks/useStockQuotes';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export function AssetChart() {
  const { holdings } = usePortfolio();

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

  const chartData = holdings
    .map((holding) => {
      const priceMap = holding.type === 'stock' ? stockPriceMap : cryptoPriceMap;
      const currentPrice = priceMap.get(holding.symbol) || 0;

      return {
        symbol: holding.symbol,
        value: currentPrice * holding.quantity,
      };
    })
    .filter((item) => item.value > 0);

  if (holdings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          자산 분배를 표시할 종목이 없습니다.
        </p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">가격 데이터를 로드 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">자산 분배</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              if (!value || typeof value === 'object') return '';
              const num = typeof value === 'string' ? parseFloat(value) : value;
              return `$${num.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

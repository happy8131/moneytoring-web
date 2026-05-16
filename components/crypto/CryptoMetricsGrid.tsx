'use client';

import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { formatCryptoPrice, formatCryptoLarge, formatSupply } from '@/lib/cryptoUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CryptoMetricsGridProps {
  id: string;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  change?: number;
  format?: 'price' | 'large' | 'percent' | 'none';
}

function MetricItem({ label, value, change, format = 'none' }: MetricItemProps) {
  let displayValue = value;

  if (format === 'price' && typeof value === 'number') {
    displayValue = formatCryptoPrice(value);
  } else if (format === 'large' && typeof value === 'number') {
    displayValue = formatCryptoLarge(value);
  } else if (format === 'percent' && typeof value === 'number') {
    displayValue = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  const isPositive = typeof change === 'number' ? change >= 0 : null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-semibold text-foreground">{displayValue}</p>
        {isPositive !== null && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {typeof change === 'number' && `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CryptoMetricsGrid({ id }: CryptoMetricsGridProps) {
  const { data: response, isLoading } = useCryptoDetail({ id });
  const detail = response?.data;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">지표 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { marketData } = detail;
  const athDate = new Date(marketData.athDate).toLocaleDateString('ko-KR');
  const atlDate = new Date(marketData.atlDate).toLocaleDateString('ko-KR');

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">주요 지표</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricItem label="현재 가격" value={marketData.currentPrice} format="price" />
        <MetricItem label="24h 변동률" value={marketData.priceChangePercent24h} format="percent" />

        <MetricItem label="7d 변동률" value={marketData.priceChangePercent7d} format="percent" />
        <MetricItem label="30d 변동률" value={marketData.priceChangePercent30d} format="percent" />

        <MetricItem label="시가총액" value={marketData.marketCap} format="large" />
        <MetricItem
          label="시가총액 순위"
          value={marketData.marketCapRank || '-'}
          format="none"
        />

        <MetricItem label="24h 거래량" value={marketData.totalVolume24h} format="large" />
        <MetricItem label="24h 고가" value={marketData.high24h} format="price" />

        <MetricItem label="24h 저가" value={marketData.low24h} format="price" />
        <MetricItem label="순환 공급량" value={formatSupply(marketData.circulatingSupply)} />

        <MetricItem label="총 공급량" value={formatSupply(marketData.totalSupply)} />
        <MetricItem label="최대 공급량" value={formatSupply(marketData.maxSupply)} />

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">역대 최고가 (ATH)</p>
          <p className="text-lg font-semibold text-foreground mb-1">{formatCryptoPrice(marketData.ath)}</p>
          <p className="text-xs text-muted-foreground">{athDate}</p>
          <p className="text-xs font-medium mt-2">
            <span className={marketData.athChangePercent >= 0 ? 'text-red-600' : 'text-red-600'}>
              {marketData.athChangePercent >= 0 ? '+' : ''}
              {marketData.athChangePercent.toFixed(2)}%
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">역대 최저가 (ATL)</p>
          <p className="text-lg font-semibold text-foreground mb-1">{formatCryptoPrice(marketData.atl)}</p>
          <p className="text-xs text-muted-foreground">{atlDate}</p>
          <p className="text-xs font-medium mt-2">
            <span className={marketData.atlChangePercent >= 0 ? 'text-green-600' : 'text-green-600'}>
              {marketData.atlChangePercent >= 0 ? '+' : ''}
              {marketData.atlChangePercent.toFixed(2)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

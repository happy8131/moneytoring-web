'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import type { CryptoPricesResponse } from '@/app/api/crypto/prices/route';

const DEFAULT_IDS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];

export function CryptoWatchlist() {
  const router = useRouter();
  const queryResult = useCryptoPrices({
    ids: DEFAULT_IDS,
    refetchInterval: 60_000,
  });

  const data = queryResult.data as CryptoPricesResponse | undefined;
  const { isLoading, isError, error, dataUpdatedAt } = queryResult;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        암호화폐 데이터 로드 실패: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-2">
        마지막 업데이트: {new Date(dataUpdatedAt || 0).toLocaleTimeString('ko-KR')}
      </p>

      {data?.data.map((crypto) => (
        <div
          key={crypto.id}
          onClick={() => router.push(`/crypto/${crypto.id}`)}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {crypto.image ? (
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0" />
            )}
            <p className="font-semibold text-sm">{crypto.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold">
              {formatCurrency(crypto.currentPrice)}
            </p>
            <p
              className={`text-xs font-medium ${
                crypto.priceChange24h >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {formatPercent(crypto.priceChangePercent24h)}
            </p>
          </div>
        </div>
      ))}

      {(data?.errors.length ?? 0) > 0 && (
        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          {data?.errors.map((err) => (
            <p key={err.id} className="text-yellow-600">
              {err.id}: {err.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { formatCryptoPrice } from '@/lib/cryptoUtils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Globe, MessageSquare, Code } from 'lucide-react';

interface CryptoDetailHeaderProps {
  id: string;
}

export function CryptoDetailHeader({ id }: CryptoDetailHeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data: response, isLoading } = useCryptoDetail({ id });
  const detail = response?.data;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">코인 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { marketData, communityData } = detail;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{detail.name}</h1>
            <span className="text-sm text-muted-foreground">
              {detail.symbol} · Rank #{marketData.marketCapRank || '-'}
            </span>
          </div>
          {isMobile && detail.description && detail.description.length > 30 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground mb-4 cursor-help">
                    {detail.description.slice(0, 30)}...
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{detail.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">{detail.description}</p>
          )}
          <div className="flex gap-3">
            {detail.links.homepage && (
              <a
                href={detail.links.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                웹사이트
              </a>
            )}
            {detail.links.subreddit && (
              <a
                href={detail.links.subreddit}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Reddit
              </a>
            )}
            {detail.links.github && (
              <a
                href={detail.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Code className="w-4 h-4" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-foreground">{formatCryptoPrice(marketData.currentPrice)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {marketData.priceChange24h >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`text-lg font-semibold ${
                marketData.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {marketData.priceChange24h >= 0 ? '+' : ''}
              {marketData.priceChange24h.toFixed(2)}
            </span>
            <span
              className={`text-lg font-semibold ${
                marketData.priceChangePercent24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ({marketData.priceChangePercent24h >= 0 ? '+' : ''}
              {marketData.priceChangePercent24h.toFixed(2)}%)
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{new Date(detail.fetchedAt).toLocaleString('ko-KR')}</p>
      </div>
    </div>
  );
}

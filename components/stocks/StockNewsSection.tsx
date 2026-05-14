'use client';

import { useStockCompanyNews } from '@/hooks/useStockCompanyNews';
import { NewsCard } from '@/components/news/NewsCard';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Skeleton } from '@/components/ui/skeleton';

interface StockNewsSectionProps {
  symbol: string;
}

export function StockNewsSection({ symbol }: StockNewsSectionProps) {
  const { data: newsItems, isLoading } = useStockCompanyNews({
    symbol,
  });

  const { readNews, markNewsAsRead } = usePortfolio();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">관련 뉴스가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">관련 뉴스</h3>
      <div className="space-y-4">
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isRead={readNews.includes(item.id)}
            onRead={markNewsAsRead}
          />
        ))}
      </div>
    </div>
  );
}

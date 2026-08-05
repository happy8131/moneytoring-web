'use client';

import { useState } from 'react';
import { useStockCompanyNews } from '@/hooks/useStockCompanyNews';
import { NewsCard } from '@/components/news/NewsCard';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StockNewsSectionProps {
  symbol: string;
}

const ITEMS_PER_PAGE = 5;

export function StockNewsSection({ symbol }: StockNewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = newsItems.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">관련 뉴스</h3>
      <div className="space-y-4">
        {paginatedItems.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isRead={readNews.includes(item.id)}
            onRead={markNewsAsRead}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft size={16} />
          이전
        </Button>

        <span className="text-sm text-muted-foreground">
          페이지 {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 cursor-pointer"
        >
          다음
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

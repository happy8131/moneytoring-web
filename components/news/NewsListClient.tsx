'use client';

import { useState, useEffect } from 'react';
import { useNews } from '@/hooks/useNews';
import { usePortfolio } from '@/hooks/usePortfolio';
import { NewsFilter } from './NewsFilter';
import { NewsCard } from './NewsCard';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsListClient() {
  const [category, setCategory] = useState('general');
  const { data, isLoading, isError, error } = useNews(category);

  const { readNews, markNewsAsRead } = usePortfolio();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        뉴스 데이터 로드 실패: {error?.message}
      </div>
    );
  }

  const newsItems = data || [];

  return (
    <div className="space-y-6">
      <NewsFilter
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      {newsItems.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            현재 "{category}" 카테고리의 뉴스가 없습니다.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { DiscussionFeed } from '@/components/discussions/DiscussionFeed';
import { DiscussionFeedSkeleton } from '@/components/discussions/DiscussionFeedSkeleton';
import { HotTopicsBanner } from '@/components/discussions/HotTopicsBanner';
import { Input } from '@/components/ui/input';

interface PageProps {
  searchParams: Promise<{ symbol?: string; filter?: string }>;
}

export default function DiscussionsPage({ searchParams }: PageProps) {
  const [refreshHotTopics, setRefreshHotTopics] = useState(0);
  const [refreshDiscussions, setRefreshDiscussions] = useState(0);
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const params = await searchParams;
      setSymbol(params.symbol?.toString());
      setFilter((params.filter as 'latest' | 'hot') || 'latest');
      setIsInitialized(true);
    })();
  }, [searchParams]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshDiscussions((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleDiscussionDeleted = () => {
    setRefreshHotTopics((prev) => prev + 1);
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">토론 게시판</h1>
          <p className="text-muted-foreground">
            투자 종목에 대해 다른 사용자와 의견을 나누세요
          </p>
        </div>
        <DiscussionFeedSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">토론 게시판</h1>
        <p className="text-muted-foreground">
          투자 종목에 대해 다른 사용자와 의견을 나누세요
        </p>
      </div>

      {/* 핫 토픽 배너 */}
      <HotTopicsBanner refreshTrigger={refreshHotTopics} />

      {/* 필터 탭 */}
      <div className="flex items-center gap-2 border-b border-border">
        <a
          href="/discussions?filter=latest"
          className={`px-4 py-3 border-b-2 transition-colors ${
            filter === 'latest'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          최신순
        </a>
        <a
          href="/discussions?filter=hot"
          className={`px-4 py-3 border-b-2 transition-colors ${
            filter === 'hot'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          🔥 핫 토픽
        </a>
      </div>

      {/* 심볼 검색 */}
      <form className="flex gap-2">
        <Input
          type="text"
          name="symbol"
          placeholder="종목 코드로 검색 (예: AAPL, GOOGL)"
          defaultValue={symbol || ''}
          className="flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          검색
        </button>
      </form>

      {/* 토론 피드 */}
      <DiscussionFeed
        filter={filter}
        symbol={symbol}
        onDiscussionDeleted={handleDiscussionDeleted}
        refreshTrigger={refreshDiscussions}
      />
    </div>
  );
}

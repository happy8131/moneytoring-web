import { Suspense } from 'react';
import { Metadata } from 'next';
import { DiscussionFeed } from '@/components/discussions/DiscussionFeed';
import { DiscussionFeedSkeleton } from '@/components/discussions/DiscussionFeedSkeleton';
import { HotTopicsBanner } from '@/components/discussions/HotTopicsBanner';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: '토론 게시판 - Moneytoring',
  description: '투자 종목별 토론과 의견을 나누세요',
};

interface PageProps {
  searchParams: Promise<{ symbol?: string; filter?: string }>;
}

export default async function DiscussionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const symbol = params.symbol?.toString();
  const filter = (params.filter as 'latest' | 'hot') || 'latest';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">토론 게시판</h1>
        <p className="text-muted-foreground">
          투자 종목에 대해 다른 사용자와 의견을 나누세요
        </p>
      </div>

      {/* 핫 토픽 배너 */}
      <HotTopicsBanner />

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
      <Suspense fallback={<DiscussionFeedSkeleton />}>
        <DiscussionFeed filter={filter} symbol={symbol} />
      </Suspense>
    </div>
  );
}

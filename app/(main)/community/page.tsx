import { Suspense } from 'react';
import { PostFeed } from '@/components/community/PostFeed';
import { PostFeedSkeleton } from '@/components/community/PostFeedSkeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티 - Moneytoring',
  description: '투자 커뮤니티에 참여하고 의견을 나누세요',
};

interface CommunityPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function CommunityPage({
  searchParams,
}: CommunityPageProps) {
  const params = await searchParams;
  const filter = (params.filter || 'latest') as 'latest' | 'popular';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        <p className="text-muted-foreground mt-2">
          투자 아이디어를 공유하고 다른 사람들의 의견을 들어보세요
        </p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <a
          href="/community?filter=latest"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            filter === 'latest'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          최신순
        </a>
        <a
          href="/community?filter=popular"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            filter === 'popular'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          인기순
        </a>
      </div>

      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed filter={filter} />
      </Suspense>
    </div>
  );
}

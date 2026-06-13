'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DiscussionCard } from './DiscussionCard';
import { DiscussionForm } from './DiscussionForm';
import { getDiscussions } from '@/app/actions/discussions';
import type { Tables } from '@/types/database';

type Discussion = Tables<'discussions'> & { profiles: Tables<'profiles'> | null };

interface DiscussionFeedProps {
  filter?: 'latest' | 'hot';
  symbol?: string;
  onDiscussionDeleted?: () => void;
  refreshTrigger?: number;
}

export function DiscussionFeed({ filter = 'latest', symbol, onDiscussionDeleted, refreshTrigger = 0 }: DiscussionFeedProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [cursor, setCursor] = useState(0);
  const [nextCursor, setNextCursor] = useState(20);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDiscussions = async () => {
      setIsLoading(true);
      setCursor(0);
      try {
        const { discussions: data, nextCursor: next } = await getDiscussions(
          filter,
          symbol,
          0
        );
        setDiscussions(data);
        setNextCursor(next);
      } catch (error) {
        console.error('토론 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [filter, symbol, refreshTrigger]);

  const handleLoadMore = async () => {
    try {
      const { discussions: newData, nextCursor: next } = await getDiscussions(
        filter,
        symbol,
        nextCursor
      );
      setDiscussions([...discussions, ...newData]);
      setNextCursor(next);
      setCursor(nextCursor);
    } catch (error) {
      console.error('더보기 실패:', error);
    }
  };

  const handleDiscussionCreated = (newDiscussion: Discussion) => {
    if (filter === 'latest') {
      setDiscussions([newDiscussion, ...discussions]);
    }
  };

  const handleDiscussionDeleted = (id: string) => {
    setDiscussions(discussions.filter((d) => d.id !== id));
    if (onDiscussionDeleted) {
      onDiscussionDeleted();
    }
  };

  return (
    <div className="space-y-4">
      <DiscussionForm onDiscussionCreated={handleDiscussionCreated} />

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          토론을 로드하는 중입니다...
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {symbol ? `${symbol} 관련 토론이 없습니다.` : '토론이 없습니다.'}
        </div>
      ) : (
        <>
          {discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onDiscussionDeleted={handleDiscussionDeleted}
            />
          ))}

          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="w-full"
          >
            더보기
          </Button>
        </>
      )}
    </div>
  );
}

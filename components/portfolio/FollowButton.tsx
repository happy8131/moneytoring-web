'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/app/actions/portfolioShares';
import { Heart, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  portfolioOwnerUserId: string;
  isFollowing: boolean;
}

export function FollowButton({ portfolioOwnerUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleFollow = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollow(portfolioOwnerUserId);
        setIsFollowing(result.following);
        // 페이지 데이터 갱신 (팔로워 수 표시 업데이트)
        router.refresh();
      } catch (error) {
        console.error('Failed to toggle follow:', error);
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? 'default' : 'outline'}
      onClick={handleToggleFollow}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
      )}
      {isFollowing ? '팔로우 중' : '팔로우'}
    </Button>
  );
}

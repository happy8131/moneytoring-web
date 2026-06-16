'use client';

import { useState, useTransition } from 'react';
import { toggleFollow } from '@/app/actions/portfolioShares';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';

interface FollowSectionProps {
  portfolioOwnerUserId: string;
  isFollowing: boolean;
  initialFollowersCount: number;
}

export function FollowSection({
  portfolioOwnerUserId,
  isFollowing: initialIsFollowing,
  initialFollowersCount,
}: FollowSectionProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isPending, startTransition] = useTransition();

  const handleToggleFollow = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollow(portfolioOwnerUserId);
        setIsFollowing(result.following);
        // 팔로워 수 업데이트 (페이지 새로고침 없이)
        setFollowersCount((prev) => (result.following ? prev + 1 : Math.max(0, prev - 1)));
      } catch (error) {
        console.error('Failed to toggle follow:', error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <Heart className="h-4 w-4" />
        <span className="text-sm">팔로워 {followersCount}</span>
      </div>
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
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLike } from '@/app/actions/community';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({
  postId,
  initialLikes,
  initialLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async () => {
    setIsLoading(true);
    try {
      const result = await toggleLike(postId);
      setLiked(result.liked);
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className="h-4 w-4"
        fill={liked ? 'currentColor' : 'none'}
        color={liked ? '#ef4444' : 'currentColor'}
      />
      <span className="text-xs">{likes}</span>
    </Button>
  );
}

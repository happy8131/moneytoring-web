'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PostCard } from './PostCard';
import { PostForm } from './PostForm';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/app/actions/community';
import type { Tables } from '@/types/database';

type Post = Tables<'posts'> & { profiles: Tables<'profiles'> | null };

interface PostFeedProps {
  filter: 'latest' | 'popular';
}

export function PostFeed({ filter }: PostFeedProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchUser();
  }, []);

  const loadPosts = async (currentCursor: number = 0) => {
    try {
      const { posts: newPosts } = await getPosts(filter, currentCursor);
      if (currentCursor === 0) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(newPosts.length >= 20);
      setCursor(currentCursor + 20);
    } catch (error) {
      console.error('포스트 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPosts([]);
    setCursor(0);
    loadPosts(0);
  }, [filter]);

  const handlePostCreated = (newPost: Post) => {
    if (filter === 'latest') {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const isPostLiked = (postId: string) => likedPostIds.has(postId);

  if (isLoading && posts.length === 0) {
    return <div className="text-center text-muted-foreground">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <PostForm onPostCreated={handlePostCreated} />

      <div className="flex gap-2 text-sm">
        <span className="text-muted-foreground">정렬:</span>
        <span className="font-semibold">
          {filter === 'latest' ? '최신순' : '인기순'}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          포스트가 없습니다. 첫 번째 포스트를 작성해주세요!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={isPostLiked(post.id)}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => loadPosts(cursor)}
            disabled={isLoading}
          >
            {isLoading ? '로딩 중...' : '더보기'}
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { deletePost } from '@/app/actions/community';
import type { Tables } from '@/types/database';

type Post = Tables<'posts'> & { profiles: Tables<'profiles'> | null };

interface PostCardProps {
  post: Post;
  liked: boolean;
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, liked, onPostDeleted }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error('포스트 삭제 실패:', error);
      alert('포스트 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const authorName = post.profiles?.username || '알 수 없는 사용자';
  const isExpert = post.profiles?.is_expert;
  const createdAt = new Date(post.created_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isAuthor = currentUserId === post.user_id;

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
          {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{authorName}</p>
                {isExpert && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    전문가
                  </span>
                )}
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200 font-semibold">
                  👍 {post.likes_count || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>

            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <p className="text-sm mt-3 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="포스트 이미지"
              className="mt-3 max-h-96 rounded-lg object-cover"
            />
          )}

          <div className="flex gap-2 mt-4 text-xs text-muted-foreground border-t border-border pt-3">
            <LikeButton
              postId={post.id}
              initialLikes={post.likes_count || 0}
              initialLiked={liked}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments_count || 0}</span>
            </Button>
          </div>

          {showComments && <CommentSection postId={post.id} />}
        </div>
      </div>
    </Card>
  );
}

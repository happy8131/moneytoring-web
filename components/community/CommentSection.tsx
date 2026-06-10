'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { createComment, deleteComment, getPostById } from '@/app/actions/community';
import type { Tables } from '@/types/database';

type Comment = Tables<'comments'> & { profiles: Tables<'profiles'> | null };

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [user, setUser] = useState<{ id: string; username?: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', authUser.id)
            .single();

          setUser({
            id: authUser.id,
            username: profile?.username,
          });
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { comments: fetchedComments } = await getPostById(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('댓글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await createComment(postId, newComment);
      setNewComment('');
      const { comments: fetchedComments } = await getPostById(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="text-xs text-muted-foreground mt-3">댓글 로딩 중...</div>;
  }

  return (
    <div className="mt-4 border-t border-border pt-3 space-y-3">
      {user && (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            className="h-8"
          >
            {isSubmitting ? '작성 중...' : '작성'}
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground">댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 text-xs">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-xs">
                    {comment.profiles?.username || '알 수 없는 사용자'}
                  </p>
                  <span className="text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 break-words">
                  {comment.content}
                </p>
              </div>
              {user?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="h-6 w-6"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

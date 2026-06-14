'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { deleteDiscussion } from '@/app/actions/discussions';
import type { Tables } from '@/types/database';

type Discussion = Tables<'discussions'> & { profiles: Tables<'profiles'> | null };

interface DiscussionCardProps {
  discussion: Discussion;
  onDiscussionDeleted?: (id: string) => void;
}

export function DiscussionCard({ discussion, onDiscussionDeleted }: DiscussionCardProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsCount, setCommentsCount] = useState(discussion.comments_count || 0);
  const [viewsCount, setViewsCount] = useState(discussion.views_count || 0);

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
        // 에러는 무시
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setViewsCount(discussion.views_count || 0);
  }, [discussion.views_count]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deleteDiscussion(discussion.id);
      if (onDiscussionDeleted) {
        onDiscussionDeleted(discussion.id);
      }
    } catch (error) {
      alert('토론 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const authorName = discussion.profiles?.username || '알 수 없는 사용자';
  const isExpert = discussion.profiles?.is_expert;
  const createdAt = new Date(discussion.created_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const isAuthor = currentUserId === discussion.user_id;

  return (
    <Link href={`/discussions/${discussion.id}`}>
      <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
        <div className="flex gap-3">
        {/* 작성자 아바타 */}
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
          {discussion.profiles?.username?.[0]?.toUpperCase() || 'U'}
        </div>

        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* 심볼 배지 */}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200 font-semibold">
                  {discussion.symbol}
                </span>

                {/* 핫 토픽 배지 */}
                {discussion.is_hot && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                    🔥 핫
                  </span>
                )}

                {/* 고정 배지 */}
                {discussion.is_pinned && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">
                    📌 고정
                  </span>
                )}

                {/* 전문가 배지 */}
                {isExpert && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    전문가
                  </span>
                )}
              </div>

              {/* 작성자 정보 */}
              <p className="text-xs text-muted-foreground mt-1">
                {authorName} · {createdAt}
              </p>
            </div>

            {/* 삭제 버튼 */}
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-6 w-6"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* 제목 */}
          <h3 className="text-sm font-semibold text-foreground mt-2 hover:text-primary transition-colors line-clamp-2">
            {discussion.title}
          </h3>

          {/* 내용 미리보기 */}
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {discussion.content}
          </p>

          {/* 하단 정보 */}
          <div className="flex items-center gap-4 border-t border-border mt-3 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{viewsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{commentsCount}</span>
            </div>
          </div>
        </div>
        </div>
      </Card>
    </Link>
  );
}

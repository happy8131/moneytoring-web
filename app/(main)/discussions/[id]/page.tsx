import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, MessageCircle, Trash2 } from 'lucide-react';
import { getDiscussionById, deleteDiscussion } from '@/app/actions/discussions';
import { DiscussionCommentSection } from '@/components/discussions/DiscussionCommentSection';
import { DiscussionViewCounter } from '@/components/discussions/DiscussionViewCounter';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

type Discussion = Tables<'discussions'> & { profiles: Tables<'profiles'> | null };
type DiscussionComment = Tables<'discussion_comments'> & { profiles: Tables<'profiles'> | null };

async function fetchDiscussion(id: string): Promise<{
  discussion: Discussion;
  comments: DiscussionComment[];
}> {
  try {
    return await getDiscussionById(id);
  } catch {
    notFound();
  }
}

export default async function DiscussionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { discussion, comments } = await fetchDiscussion(id);

  // 현재 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor = user?.id === discussion.user_id;

  const authorName = discussion.profiles?.username || '알 수 없는 사용자';
  const isExpert = discussion.profiles?.is_expert;
  const createdAt = new Date(discussion.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link href="/discussions">
        <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          토론 목록으로
        </Button>
      </Link>

      {/* 토론 상세 */}
      <Card className="p-6">
        <div className="space-y-4">
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
              <div className="mt-2 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {discussion.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{authorName}</p>
                  <p className="text-xs text-muted-foreground">{createdAt}</p>
                </div>
              </div>
            </div>

            {/* 삭제 버튼 */}
            {isAuthor && (
              <form
                action={async () => {
                  'use server';
                  await deleteDiscussion(discussion.id);
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-foreground">{discussion.title}</h1>

          {/* 내용 */}
          <p className="text-base text-foreground whitespace-pre-wrap break-words">
            {discussion.content}
          </p>

          {/* 하단 정보 */}
          <div className="flex items-center gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{discussion.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 댓글 섹션 */}
      <DiscussionCommentSection discussionId={id} />

      {/* 조회수 증가 */}
      <DiscussionViewCounter discussionId={id} />
    </div>
  );
}

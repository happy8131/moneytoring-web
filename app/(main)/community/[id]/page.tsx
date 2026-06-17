import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { getPostById, deletePost } from '@/app/actions/community';
import { CommentSection } from '@/components/community/CommentSection';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPost(id: string) {
  try {
    return await getPostById(id);
  } catch {
    notFound();
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { post, comments } = await fetchPost(id);

  // 현재 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor = user?.id === post.user_id;

  const authorName = post.profiles?.username || '알 수 없는 사용자';
  const isExpert = post.profiles?.is_expert;
  const createdAt = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link href="/community">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          커뮤니티로
        </Button>
      </Link>

      {/* 포스트 상세 */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{authorName}</p>
                    {isExpert && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        전문가
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{createdAt}</p>
                </div>
              </div>
            </div>

            {/* 삭제 버튼 */}
            {isAuthor && (
              <form
                action={async () => {
                  'use server';
                  await deletePost(post.id);
                  // 페이지 리다이렉트는 Server Action에서 처리
                }}
              >
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </form>
            )}
          </div>

          {/* 콘텐츠 */}
          <div className="space-y-4">
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.image_url && (
              <img
                src={post.image_url}
                alt="포스트 이미지"
                className="w-full max-h-96 object-cover rounded-lg"
              />
            )}
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {post.likes_count || 0}명이 좋아합니다
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {comments?.length || 0}개 댓글
            </div>
          </div>
        </div>
      </Card>

      {/* 댓글 섹션 */}
      <CommentSection postId={post.id} />
    </div>
  );
}

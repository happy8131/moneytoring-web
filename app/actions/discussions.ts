'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type Discussion = Tables<'discussions'> & { profiles: Tables<'profiles'> | null };
type DiscussionComment = Tables<'discussion_comments'> & { profiles: Tables<'profiles'> | null };

// 토론 목록 조회 (필터: latest | hot, 심볼 필터 선택)
export async function getDiscussions(
  filter: 'latest' | 'hot' = 'latest',
  symbol?: string,
  cursor: number = 0
) {
  const supabase = await createClient();
  const limit = 20;

  // 모든 토론 조회
  const query = supabase
    .from('discussions')
    .select('*, profiles(id, username, avatar_url, is_expert)');

  // 심볼 필터 적용
  if (symbol && symbol.trim()) {
    query.eq('symbol', symbol.toUpperCase());
  }

  const { data: allDiscussions, error } = await query;

  if (error) throw new Error(error.message);

  // 각 토론의 댓글 수 실시간 집계
  const enrichedData = await Promise.all(
    (allDiscussions || []).map(async (discussion) => {
      const { count: commentsCount } = await supabase
        .from('discussion_comments')
        .select('*', { count: 'exact', head: true })
        .eq('discussion_id', discussion.id);

      return {
        ...discussion,
        comments_count: commentsCount || 0,
      };
    })
  );

  // 필터에 따라 정렬
  let sortedData = enrichedData;
  if (filter === 'hot') {
    // 핫 토픽: 최근 24시간 내 댓글 수가 많은 순
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    sortedData = enrichedData
      .filter((d) => new Date(d.created_at) > twentyFourHoursAgo || d.comments_count > 0)
      .sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
  } else {
    // 최신순
    sortedData = enrichedData.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // 페이지네이션
  const paginatedData = sortedData.slice(cursor, cursor + limit);

  return { discussions: paginatedData as Discussion[], nextCursor: cursor + limit };
}

// 토론 상세 조회 (댓글 포함)
export async function getDiscussionById(id: string): Promise<{
  discussion: Discussion;
  comments: DiscussionComment[];
}> {
  const supabase = await createClient();

  const { data: discussion, error: discussionError } = await supabase
    .from('discussions')
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .eq('id', id)
    .maybeSingle();

  if (discussionError) throw new Error(discussionError.message);
  if (!discussion) throw new Error('토론을 찾을 수 없습니다');

  const { data: comments, error: commentsError } = await supabase
    .from('discussion_comments')
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .eq('discussion_id', id)
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(commentsError.message);

  return {
    discussion: discussion as Discussion,
    comments: comments as DiscussionComment[],
  };
}

// 토론 생성
export async function createDiscussion(symbol: string, title: string, content: string) {
  if (!symbol.trim() || !title.trim() || !content.trim()) {
    throw new Error('심볼, 제목, 내용을 모두 입력해주세요');
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 프로필 확인 및 없으면 생성
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const username = user.email?.split('@')[0] || 'user';
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
      });

    if (profileError) {
      console.error('프로필 생성 오류:', profileError);
      throw new Error('프로필 생성 중 오류가 발생했습니다');
    }
  }

  const { data, error } = await supabase
    .from('discussions')
    .insert({
      user_id: user.id,
      symbol: symbol.toUpperCase(),
      title,
      content,
    })
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/discussions');
  return data;
}

// 토론 삭제
export async function deleteDiscussion(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증이 필요합니다');
  }

  const { data: discussion, error: fetchError } = await supabase
    .from('discussions')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !discussion) {
    throw new Error('토론을 찾을 수 없습니다');
  }

  if (discussion.user_id !== user.id) {
    throw new Error('본인의 토론만 삭제할 수 있습니다');
  }

  const { error } = await supabase
    .from('discussions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/discussions');
}

// 토론 조회수 증가
export async function incrementViews(id: string) {
  const supabase = await createClient();

  const { data: discussion, error: fetchError } = await supabase
    .from('discussions')
    .select('views_count')
    .eq('id', id)
    .single();

  if (fetchError || !discussion) {
    throw new Error('토론을 찾을 수 없습니다');
  }

  const { error } = await supabase
    .from('discussions')
    .update({ views_count: (discussion.views_count || 0) + 1 })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath(`/discussions/${id}`);
}

// 댓글 작성
export async function createDiscussionComment(
  discussionId: string,
  content: string,
  parentCommentId?: string
) {
  if (!content.trim()) {
    throw new Error('댓글 내용을 입력해주세요');
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 프로필 확인 및 없으면 생성
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const username = user.email?.split('@')[0] || 'user';
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
      });

    if (profileError) throw new Error('프로필 생성 중 오류가 발생했습니다');
  }

  const { data, error } = await supabase
    .from('discussion_comments')
    .insert({
      discussion_id: discussionId,
      user_id: user.id,
      content,
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/discussions/${discussionId}`);
  return data;
}

// 댓글 삭제
export async function deleteDiscussionComment(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증이 필요합니다');
  }

  const { data: comment, error: fetchError } = await supabase
    .from('discussion_comments')
    .select('user_id, discussion_id')
    .eq('id', id)
    .single();

  if (fetchError || !comment) {
    throw new Error('댓글을 찾을 수 없습니다');
  }

  if (comment.user_id !== user.id) {
    throw new Error('본인의 댓글만 삭제할 수 있습니다');
  }

  const { error } = await supabase
    .from('discussion_comments')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath(`/discussions/${comment.discussion_id}`);
}

// 핫 토픽 조회 (상위 3개)
export async function getHotTopics() {
  const supabase = await createClient();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const { data: discussions, error } = await supabase
    .from('discussions')
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .gte('created_at', twentyFourHoursAgo.toISOString())
    .limit(100);

  if (error) throw new Error(error.message);

  // 댓글 수 집계
  const enrichedData = await Promise.all(
    (discussions || []).map(async (discussion) => {
      const { count: commentsCount } = await supabase
        .from('discussion_comments')
        .select('*', { count: 'exact', head: true })
        .eq('discussion_id', discussion.id);

      return {
        ...discussion,
        comments_count: commentsCount || 0,
      };
    })
  );

  // 댓글 수가 많은 순으로 정렬 후 상위 3개
  return enrichedData
    .sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0))
    .slice(0, 3) as Discussion[];
}

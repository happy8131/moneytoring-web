'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type Post = Tables<'posts'> & { profiles: Tables<'profiles'> | null };
type Comment = Tables<'comments'> & { profiles: Tables<'profiles'> | null };

// 포스트 목록 조회
export async function getPosts(
  filter: 'latest' | 'popular' = 'latest',
  cursor: number = 0
) {
  const supabase = await createClient();
  const limit = 20;

  // 먼저 모든 포스트 조회 (정렬은 나중에)
  const { data: allPosts, error } = await supabase
    .from('posts')
    .select('*, profiles(id, username, avatar_url, is_expert)');

  if (error) throw new Error(error.message);

  // 각 포스트의 좋아요 수 계산
  const enrichedData = await Promise.all(
    (allPosts || []).map(async (post) => {
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      return {
        ...post,
        likes_count: count || 0,
      };
    })
  );

  // 필터에 따라 정렬
  let sortedData = enrichedData;
  if (filter === 'popular') {
    // 좋아요 많은 순서로 정렬
    sortedData = enrichedData.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
  } else {
    // 최신순으로 정렬
    sortedData = enrichedData.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // 페이지네이션 적용
  const paginatedData = sortedData.slice(cursor, cursor + limit);

  return { posts: paginatedData as Post[], nextCursor: cursor + limit };
}

// 포스트 단일 조회 (댓글 포함)
export async function getPostById(postId: string) {
  const supabase = await createClient();

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .eq('id', postId)
    .maybeSingle();

  if (postError) throw new Error(postError.message);
  if (!post) throw new Error('포스트를 찾을 수 없습니다');

  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(commentsError.message);

  return { post: post as Post, comments: comments as Comment[] };
}

// 포스트 작성
export async function createPost(content: string, imageUrl?: string) {
  if (!content.trim()) {
    throw new Error('포스트 내용을 입력해주세요');
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
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      image_url: imageUrl || null,
    })
    .select('*, profiles(id, username, avatar_url, is_expert)')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/community');
  return data;
}

// 포스트 삭제
export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증이 필요합니다');
  }

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new Error('포스트를 찾을 수 없습니다');
  }

  if (post.user_id !== user.id) {
    throw new Error('본인의 포스트만 삭제할 수 있습니다');
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw new Error(error.message);

  revalidatePath('/community');
}

// 좋아요 토글
export async function toggleLike(postId: string) {
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

  const { data: existing, error: checkError } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (checkError) throw new Error(checkError.message);

  if (existing) {
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('id', existing.id);

    if (deleteError) throw new Error(deleteError.message);
  } else {
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: user.id });

    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath('/community');
  return { liked: !existing };
}

// 댓글 작성
export async function createComment(
  postId: string,
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
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/community');
  return data;
}

// 댓글 삭제
export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증이 필요합니다');
  }

  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id, post_id')
    .eq('id', commentId)
    .single();

  if (fetchError || !comment) {
    throw new Error('댓글을 찾을 수 없습니다');
  }

  if (comment.user_id !== user.id) {
    throw new Error('본인의 댓글만 삭제할 수 있습니다');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(error.message);

  revalidatePath('/community');
}

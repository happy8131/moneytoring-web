'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { PortfolioShare, Holding } from '@/types';
import type { Tables } from '@/types/database';

type DBPortfolioShare = Tables<'portfolio_shares'>;
type DBPost = Tables<'posts'>;
type DBDiscussion = Tables<'discussions'>;

interface FollowUser {
  userId: string;
  username: string;
  avatarUrl?: string;
  portfolioShareLink?: string;
  portfolioTitle?: string;
}

interface Profile {
  userId: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  isExpert?: boolean;
  followersCount: number;
}

const convertPortfolioShareFromDB = (row: any): PortfolioShare => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description || undefined,
  isPublic: row.is_public ?? false,
  shareLink: row.share_link,
  viewsCount: row.views_count ?? 0,
  followersCount: row.followers_count ?? 0,
  holdingsSnapshot: (Array.isArray(row.holdings_snapshot) ? row.holdings_snapshot : []) as unknown as Holding[],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  profile: row.profiles ? {
    username: row.profiles.username,
    avatarUrl: row.profiles.avatar_url || undefined,
    isExpert: row.profiles.is_expert || undefined,
  } : undefined,
});

// 내 프로필 조회
export async function getMyProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // 팔로워 수 조회
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', user.id);

  return {
    userId: profile.id,
    username: profile.username,
    avatarUrl: profile.avatar_url || undefined,
    bio: profile.bio || undefined,
    isExpert: profile.is_expert || undefined,
    followersCount: followersCount || 0,
  };
}

// 내가 팔로우하는 사람들
export async function getMyFollowing(): Promise<FollowUser[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // 팔로우 목록 조회
  const { data: follows } = await supabase
    .from('follows')
    .select(`
      following_id,
      profiles:following_id (id, username, avatar_url)
    `)
    .eq('follower_id', user.id);

  if (!follows || follows.length === 0) {
    return [];
  }

  // 각 팔로우 대상자의 포트폴리오 조회
  const followingIds = (follows || []).map((f: any) => f.following_id);
  const { data: portfolios } = await supabase
    .from('portfolio_shares')
    .select('user_id, share_link, title')
    .in('user_id', followingIds)
    .eq('is_public', true);

  const portfolioMap = new Map<string, { share_link: string; title: string }>();
  (portfolios || []).forEach((p: any) => {
    if (!portfolioMap.has(p.user_id)) {
      portfolioMap.set(p.user_id, { share_link: p.share_link, title: p.title });
    }
  });

  return (follows || []).map((row: any) => {
    const portfolio = portfolioMap.get(row.following_id);
    return {
      userId: row.following_id,
      username: row.profiles?.username || '알 수 없는 사용자',
      avatarUrl: row.profiles?.avatar_url || undefined,
      portfolioShareLink: portfolio?.share_link || undefined,
      portfolioTitle: portfolio?.title || undefined,
    };
  });
}

// 나를 팔로우하는 사람들
export async function getMyFollowers(): Promise<FollowUser[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // 팔로워 목록 조회
  const { data: follows } = await supabase
    .from('follows')
    .select(`
      follower_id,
      profiles:follower_id (id, username, avatar_url)
    `)
    .eq('following_id', user.id);

  if (!follows || follows.length === 0) {
    return [];
  }

  // 각 팔로워의 포트폴리오 조회
  const followerIds = (follows || []).map((f: any) => f.follower_id);
  const { data: portfolios } = await supabase
    .from('portfolio_shares')
    .select('user_id, share_link, title')
    .in('user_id', followerIds)
    .eq('is_public', true);

  const portfolioMap = new Map<string, { share_link: string; title: string }>();
  (portfolios || []).forEach((p: any) => {
    if (!portfolioMap.has(p.user_id)) {
      portfolioMap.set(p.user_id, { share_link: p.share_link, title: p.title });
    }
  });

  return (follows || []).map((row: any) => {
    const portfolio = portfolioMap.get(row.follower_id);
    return {
      userId: row.follower_id,
      username: row.profiles?.username || '알 수 없는 사용자',
      avatarUrl: row.profiles?.avatar_url || undefined,
      portfolioShareLink: portfolio?.share_link || undefined,
      portfolioTitle: portfolio?.title || undefined,
    };
  });
}

// 내가 팔로우한 포트폴리오 목록
export async function getMyFollowingPortfolios(): Promise<PortfolioShare[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // 팔로우 관계 조회
  const { data: follows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  if (!follows || follows.length === 0) {
    return [];
  }

  // 팔로우하는 사람들의 공개 포트폴리오 조회
  const followingIds = (follows || []).map((f: any) => f.following_id);
  const { data: portfolios } = await supabase
    .from('portfolio_shares')
    .select(`
      id,
      user_id,
      title,
      description,
      is_public,
      share_link,
      views_count,
      followers_count,
      holdings_snapshot,
      created_at,
      updated_at,
      profiles:user_id (username, avatar_url, is_expert)
    `)
    .in('user_id', followingIds)
    .eq('is_public', true);

  return (portfolios || []).map((p: any) => convertPortfolioShareFromDB(p));
}

// 내가 쓴 커뮤니티 포스트
export async function getMyPosts(): Promise<any[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (id, username, avatar_url, is_expert)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // 각 포스트별 좋아요/댓글 수 조회
  const postsWithCounts = await Promise.all(
    (data || []).map(async (post: any) => {
      const { count: likesCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      return {
        ...post,
        likesCount: likesCount || 0,
        commentsCount: commentsCount || 0,
      };
    })
  );

  return postsWithCounts;
}

// 내가 쓴 토론
export async function getMyDiscussions(): Promise<any[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from('discussions')
    .select(`
      *,
      profiles:user_id (id, username, avatar_url, is_expert)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // 각 토론별 댓글 수 조회
  const discussionsWithCounts = await Promise.all(
    (data || []).map(async (discussion: any) => {
      const { count: commentsCount } = await supabase
        .from('discussion_comments')
        .select('*', { count: 'exact', head: true })
        .eq('discussion_id', discussion.id);

      return {
        ...discussion,
        commentsCount: commentsCount || 0,
      };
    })
  );

  return discussionsWithCounts;
}

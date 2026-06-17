'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { PortfolioShare, Holding } from '@/types';
import type { Tables } from '@/types/database';

type DBPortfolioShare = Tables<'portfolio_shares'>;

const convertPortfolioShareFromDB = (row: DBPortfolioShare): PortfolioShare => ({
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
});

// 공개 포트폴리오 목록 (탐색 페이지용)
export async function getPublicPortfolioShares(sort: 'latest' | 'popular' = 'latest', limit = 20): Promise<PortfolioShare[]> {
  const supabase = await createClient();

  const query = supabase
    .from('portfolio_shares')
    .select(`
      *,
      profiles:user_id (username, avatar_url, is_expert)
    `)
    .eq('is_public', true)
    .limit(limit);

  if (sort === 'popular') {
    query.order('views_count', { ascending: false });
  } else {
    query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // 각 포트폴리오의 팔로워 수를 동적으로 조회
  const portfoliosWithFollowers = await Promise.all(
    (data || []).map(async (row: any) => {
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', row.user_id);

      const share = convertPortfolioShareFromDB(row);
      // DB 값 대신 동적으로 조회한 팔로워 수 사용
      share.followersCount = followersCount || 0;

      if (row.profiles) {
        share.profile = {
          username: row.profiles.username,
          avatarUrl: row.profiles.avatar_url || undefined,
          isExpert: row.profiles.is_expert || undefined,
        };
      }
      return share;
    })
  );

  return portfoliosWithFollowers;
}

// 내 포트폴리오 공유 설정 조회
export async function getMyPortfolioShare(): Promise<PortfolioShare | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  const { data, error } = await supabase
    .from('portfolio_shares')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  if (!data) return null;

  const share = convertPortfolioShareFromDB(data);

  // 팔로워 수를 동적으로 조회
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', user.id);

  share.followersCount = followersCount || 0;

  return share;
}

// share_link로 상세 조회
export async function getPortfolioShareByLink(shareLink: string): Promise<PortfolioShare | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('portfolio_shares')
    .select(`
      *,
      profiles:user_id (username, avatar_url, is_expert)
    `)
    .eq('share_link', shareLink)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  if (!data) return null;

  // 공개이거나, 비공개인데 본인이면 조회 가능
  if (!data.is_public) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== data.user_id) {
      return null;
    }
  }

  const share = convertPortfolioShareFromDB(data);
  if (data.profiles) {
    share.profile = {
      username: data.profiles.username,
      avatarUrl: data.profiles.avatar_url || undefined,
      isExpert: data.profiles.is_expert || undefined,
    };
  }
  return share;
}

// 생성 (share_link = crypto.randomUUID(), holdingsSnapshot = 현재 holdings)
export async function createPortfolioShare(data: {
  title: string;
  description?: string;
  isPublic: boolean;
  holdingsSnapshot: Omit<Holding, 'id'>[];
}): Promise<PortfolioShare> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 프로필 자동 생성
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
    });
  }

  const shareLink = crypto.randomUUID();

  const { data: inserted, error } = await supabase
    .from('portfolio_shares')
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description || null,
      is_public: data.isPublic,
      share_link: shareLink,
      holdings_snapshot: data.holdingsSnapshot,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
  revalidatePath('/portfolios');

  return convertPortfolioShareFromDB(inserted);
}

// 업데이트 (snapshot 갱신 가능)
export async function updatePortfolioShare(
  id: string,
  updateData: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    holdingsSnapshot?: Omit<Holding, 'id'>[];
  }
): Promise<PortfolioShare> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 본인 소유 검증
  const { data: share, error: fetchError } = await supabase
    .from('portfolio_shares')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !share || share.user_id !== user.id) {
    throw new Error('권한이 없습니다');
  }

  const { data: updated, error } = await supabase
    .from('portfolio_shares')
    .update({
      ...(updateData.title !== undefined && { title: updateData.title }),
      ...(updateData.description !== undefined && { description: updateData.description || null }),
      ...(updateData.isPublic !== undefined && { is_public: updateData.isPublic }),
      ...(updateData.holdingsSnapshot !== undefined && { holdings_snapshot: updateData.holdingsSnapshot }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
  revalidatePath('/portfolios');

  return convertPortfolioShareFromDB(updated);
}

// 삭제
export async function deletePortfolioShare(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 본인 소유 검증
  const { data: share, error: fetchError } = await supabase
    .from('portfolio_shares')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !share || share.user_id !== user.id) {
    throw new Error('권한이 없습니다');
  }

  const { error } = await supabase
    .from('portfolio_shares')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
  revalidatePath('/portfolios');
}

// 팔로우 토글
export async function toggleFollow(portfolioOwnerUserId: string): Promise<{ following: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (user.id === portfolioOwnerUserId) {
    throw new Error('자신을 팔로우할 수 없습니다');
  }

  // 팔로우 여부 확인
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', portfolioOwnerUserId)
    .single();

  if (existing) {
    // 언팔로우
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', portfolioOwnerUserId);

    return { following: false };
  } else {
    // 팔로우
    await supabase.from('follows').insert({
      follower_id: user.id,
      following_id: portfolioOwnerUserId,
    });

    return { following: true };
  }
}

// 팔로우 여부 확인
export async function checkIsFollowing(portfolioOwnerUserId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', portfolioOwnerUserId)
    .single();

  return !!data;
}

// 팔로워 수 조회
export async function getFollowersCount(portfolioOwnerUserId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', portfolioOwnerUserId);

  if (error) {
    console.error('Failed to get followers count:', error);
    return 0;
  }

  return count || 0;
}

// 조회수 증가
export async function incrementPortfolioShareViews(shareLink: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_portfolio_share_views', {
    share_link_param: shareLink,
  });

  if (error) {
    console.error('Failed to increment views:', error);
  }
}

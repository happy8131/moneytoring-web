import { redirect } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { FollowButton } from '@/components/profile/FollowButton';
import { createClient } from '@/lib/supabase/server';
import {
  getMyProfile,
  getMyFollowingPortfolios,
  getMyPosts,
  getMyDiscussions,
} from '@/app/actions/profile';
import { getMyPortfolioShare } from '@/app/actions/portfolioShares';

export const metadata = {
  title: '마이페이지 - Moneytoring',
  description: '나의 포트폴리오와 활동 현황을 확인하세요',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profile, portfolioShare, followingPortfolios, myPosts, myDiscussions] =
    await Promise.all([
      getMyProfile(),
      getMyPortfolioShare(),
      getMyFollowingPortfolios(),
      getMyPosts(),
      getMyDiscussions(),
    ]);

  return (
    <div className="space-y-6">
      {/* 프로필 섹션 */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.bio && <p className="text-muted-foreground mt-1">{profile.bio}</p>}
              {profile.isExpert && (
                <p className="text-xs text-primary font-semibold mt-2">전문가</p>
              )}
            </div>
          </div>
        </div>

        {/* 팔로워/팔로잉 정보 */}
        <div className="flex gap-8 mt-6 pt-6 border-t">
          <FollowButton
            count={profile.followersCount}
            label="팔로워"
            defaultTab="followers"
          />
          <FollowButton
            count={0}
            label="팔로잉"
            defaultTab="following"
          />
        </div>
      </Card>

      {/* 탭 섹션 */}
      <ProfileTabs
        portfolioShare={portfolioShare}
        followingPortfolios={followingPortfolios}
        myPosts={myPosts}
        myDiscussions={myDiscussions}
      />
    </div>
  );
}

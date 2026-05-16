'use client';

import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageSquare, MessageCircle } from 'lucide-react';

interface CryptoCommunityDataProps {
  id: string;
}

function CommunityMetric({ icon: Icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{Icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {value === null || value === undefined ? '-' : typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

export function CryptoCommunityData({ id }: CryptoCommunityDataProps) {
  const { data: response, isLoading } = useCryptoDetail({ id });
  const detail = response?.data;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">커뮤니티 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { communityData } = detail;
  const hasData = communityData.twitterFollowers || communityData.redditSubscribers || communityData.redditAvgPosts48h || communityData.telegramUsers;

  if (!hasData) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">커뮤니티 데이터</h3>
        <div className="text-center text-muted-foreground">커뮤니티 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">커뮤니티 데이터</h3>
      <div className="space-y-4">
        {communityData.twitterFollowers !== null && (
          <CommunityMetric
            icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
            label="트위터 팔로워"
            value={communityData.twitterFollowers}
          />
        )}
        {communityData.redditSubscribers !== null && (
          <CommunityMetric
            icon={<Users className="w-5 h-5 text-orange-500" />}
            label="레딧 구독자"
            value={communityData.redditSubscribers}
          />
        )}
        {communityData.redditAvgPosts48h > 0 && (
          <CommunityMetric
            icon={<MessageSquare className="w-5 h-5 text-blue-400" />}
            label="레딧 48h 평균 포스트"
            value={communityData.redditAvgPosts48h.toFixed(1)}
          />
        )}
        {communityData.redditAccountsActive48h !== null && (
          <CommunityMetric
            icon={<Users className="w-5 h-5 text-orange-600" />}
            label="레딧 활성 계정(48h)"
            value={communityData.redditAccountsActive48h}
          />
        )}
        {communityData.telegramUsers !== null && (
          <CommunityMetric
            icon={<MessageCircle className="w-5 h-5 text-blue-600" />}
            label="텔레그램 사용자"
            value={communityData.telegramUsers}
          />
        )}
      </div>
    </div>
  );
}

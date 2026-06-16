import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShareLink } from '@/components/portfolio/ShareLink';
import { ViewCounter } from '@/components/portfolio/ViewCounter';
import { FollowSection } from '@/components/portfolio/FollowSection';
import {
  getPortfolioShareByLink,
  checkIsFollowing,
  getFollowersCount,
} from '@/app/actions/portfolioShares';
import { Eye, Heart, User } from 'lucide-react';
import Link from 'next/link';
import type { Holding } from '@/types';

function PieChartComponent({ holdings }: { holdings: Holding[] }) {
  'use client';

  const chartData = holdings.map((holding) => ({
    symbol: holding.symbol,
    value: holding.buyPrice * holding.quantity,
  }));

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">자산 분배를 표시할 종목이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {chartData.map((item) => {
          const percentage = ((item.value / totalValue) * 100).toFixed(1);
          const color = [
            '#3b82f6',
            '#8b5cf6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
          ][chartData.indexOf(item) % 5];
          return (
            <div key={item.symbol} className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.symbol}</p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
              </div>
              <p className="text-sm font-semibold">${item.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PortfolioDetailPageProps {
  params: Promise<{ shareLink: string }>;
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { shareLink } = await params;

  const portfolio = await getPortfolioShareByLink(shareLink);

  if (!portfolio) {
    notFound();
  }

  // 팔로우 여부 확인
  const isFollowing = await checkIsFollowing(portfolio.userId);

  // 팔로워 수 조회 (follows 테이블에서 직접 카운트)
  const followersCount = await getFollowersCount(portfolio.userId);

  return (
    <div className="space-y-6">
      <ViewCounter shareLink={portfolio.shareLink} />

      {/* 헤더 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{portfolio.title}</h1>
          {portfolio.description && (
            <p className="text-muted-foreground">{portfolio.description}</p>
          )}
        </div>

        {/* 포트폴리오 정보 */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {portfolio.profile && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1">
                <p className="font-medium flex items-center gap-2">
                  {portfolio.profile.username}
                  {portfolio.profile.isExpert && (
                    <Badge variant="secondary" className="text-xs">
                      전문가
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {portfolio.createdAt
                    ? new Date(portfolio.createdAt).toLocaleDateString('ko-KR')
                    : ''}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 ml-auto items-center">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Eye className="h-4 w-4" />
              <span className="text-sm">조회수 {portfolio.viewsCount}</span>
            </div>
            <FollowSection
              portfolioOwnerUserId={portfolio.userId}
              isFollowing={isFollowing}
              initialFollowersCount={followersCount}
            />
          </div>
        </div>
      </div>

      {/* 공유 링크 */}
      <Card className="p-4">
        <ShareLink shareLink={portfolio.shareLink} />
      </Card>

      {/* 보유종목 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">보유종목</h2>

        {portfolio.holdingsSnapshot.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">보유종목이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 자산 차트 */}
            <div className="lg:col-span-2">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">자산 분배</h3>
                <div className="rounded-lg border border-border bg-card p-6">
                  <PieChartComponent
                    holdings={portfolio.holdingsSnapshot}
                  />
                </div>
              </Card>
            </div>

            {/* 통계 */}
            <div className="space-y-3">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">보유종목</p>
                <p className="text-2xl font-bold">
                  {portfolio.holdingsSnapshot.length}
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">총 수량</p>
                <p className="text-2xl font-bold">
                  {portfolio.holdingsSnapshot
                    .reduce((sum, h) => sum + h.quantity, 0)
                    .toLocaleString()}
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">총 매입금액</p>
                <p className="text-2xl font-bold">
                  ${(
                    portfolio.holdingsSnapshot.reduce(
                      (sum, h) => sum + h.buyPrice * h.quantity,
                      0
                    )
                  ).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* 종목 테이블 */}
        {portfolio.holdingsSnapshot.length > 0 && (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-3">종목</th>
                  <th className="text-right p-3">수량</th>
                  <th className="text-right p-3">매입가</th>
                  <th className="text-right p-3">총 매입금액</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdingsSnapshot.map((holding) => (
                  <tr key={holding.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{holding.symbol}</td>
                    <td className="text-right p-3">
                      {holding.quantity.toLocaleString()}
                    </td>
                    <td className="text-right p-3">
                      ${holding.buyPrice.toFixed(2)}
                    </td>
                    <td className="text-right p-3 font-medium">
                      ${(holding.buyPrice * holding.quantity).toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* 뒤로가기 */}
      <div className="pt-4">
        <Link href="/portfolios">
          <Button variant="outline">뒤로가기</Button>
        </Link>
      </div>
    </div>
  );
}

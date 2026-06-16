'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PublicPortfolioCard } from '@/components/portfolio/PublicPortfolioCard';
import { getPublicPortfolioShares } from '@/app/actions/portfolioShares';
import type { PortfolioShare } from '@/types';
import { Loader2 } from 'lucide-react';

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    setIsLoading(true);
    getPublicPortfolioShares(sort)
      .then((data) => {
        setPortfolios(data);
      })
      .catch((error) => {
        console.error('Failed to load portfolios:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sort]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">공개 포트폴리오</h1>
        <p className="text-muted-foreground">
          다른 사용자들의 포트폴리오를 탐색하고 팔로우하세요.
        </p>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <Button
          variant={sort === 'latest' ? 'default' : 'outline'}
          onClick={() => setSort('latest')}
        >
          최신순
        </Button>
        <Button
          variant={sort === 'popular' ? 'default' : 'outline'}
          onClick={() => setSort('popular')}
        >
          인기순
        </Button>
      </div>

      {/* 포트폴리오 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : portfolios.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            아직 공개된 포트폴리오가 없습니다.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <PublicPortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}

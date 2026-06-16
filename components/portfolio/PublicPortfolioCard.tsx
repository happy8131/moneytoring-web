import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, User } from 'lucide-react';
import type { PortfolioShare } from '@/types';

interface PublicPortfolioCardProps {
  portfolio: PortfolioShare;
}

export function PublicPortfolioCard({ portfolio }: PublicPortfolioCardProps) {
  return (
    <Link href={`/portfolios/${portfolio.shareLink}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{portfolio.title}</h3>
            {portfolio.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {portfolio.description}
              </p>
            )}
          </div>

          {portfolio.profile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">
                {portfolio.profile.username}
                {portfolio.profile.isExpert && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    전문가
                  </Badge>
                )}
              </span>
            </div>
          )}

          <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{portfolio.viewsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{portfolio.followersCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>종목 {portfolio.holdingsSnapshot.length}개</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

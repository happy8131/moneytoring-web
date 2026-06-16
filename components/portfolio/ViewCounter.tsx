'use client';

import { useEffect } from 'react';
import { incrementPortfolioShareViews } from '@/app/actions/portfolioShares';

interface ViewCounterProps {
  shareLink: string;
}

export function ViewCounter({ shareLink }: ViewCounterProps) {
  useEffect(() => {
    incrementPortfolioShareViews(shareLink).catch(() => {
      // 에러 무시
    });
  }, [shareLink]);

  return null;
}
